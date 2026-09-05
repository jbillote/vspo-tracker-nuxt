import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import channels from '../../../server/data/channels.json'

const CHANNEL_A = { name: 'Yakumo Beni', id: 'UCjXBuHmWkieBApgBhDuJMMQ' }
const CHANNEL_B = { name: 'Kaga Sumire', id: 'UCyLGcqYs7RsBb3L0SJfzGYA' }
const ALL_IDS = channels.flatMap((org) =>
  org.branches.flatMap((branch) => branch.members.map((m) => m.youtube)),
)

const fetchMock = vi.fn()
const getQueryMock = vi.fn()

let handler: (event: unknown) => Promise<{ live: unknown[]; upcoming: unknown[] }>

beforeAll(async () => {
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('getQuery', getQueryMock)
  vi.stubGlobal('useRuntimeConfig', () => ({ holodexApiKey: 'test-api-key' }))
  handler = (await import('../../../server/api/v1/videos/live.ts'))
    .default as unknown as typeof handler
})

beforeEach(() => {
  fetchMock.mockReset()
  getQueryMock.mockReset()
  getQueryMock.mockReturnValue({})
})

function mockHolodexResponse(videos: unknown[]) {
  fetchMock.mockResolvedValueOnce({ json: async () => videos })
}

describe('GET /api/v1/videos/live', () => {
  it('requests every known channel when no channels filter is given', async () => {
    mockHolodexResponse([])
    await handler({})

    const url = fetchMock.mock.calls[0][0] as string
    for (const id of ALL_IDS) {
      expect(url).toContain(id)
    }
  })

  it('sends the configured API key as a header', async () => {
    mockHolodexResponse([])
    await handler({})

    const options = fetchMock.mock.calls[0][1] as { headers: Record<string, string> }
    expect(options.headers['x-apikey']).toBe('test-api-key')
  })

  it('filters channels by name (case-insensitive) when a channels query is given', async () => {
    getQueryMock.mockReturnValue({ channels: CHANNEL_A.name.toUpperCase() })
    mockHolodexResponse([])
    await handler({})

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain(CHANNEL_A.id)
    expect(url).not.toContain(CHANNEL_B.id)
  })

  it('supports a comma-separated channels query string', async () => {
    getQueryMock.mockReturnValue({ channels: `${CHANNEL_A.name},${CHANNEL_B.name}` })
    mockHolodexResponse([])
    await handler({})

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain(CHANNEL_A.id)
    expect(url).toContain(CHANNEL_B.id)
  })

  it('falls back to all channels when the channels filter matches nobody', async () => {
    getQueryMock.mockReturnValue({ channels: 'Someone Who Does Not Exist' })
    mockHolodexResponse([])
    await handler({})

    const url = fetchMock.mock.calls[0][0] as string
    for (const id of ALL_IDS) {
      expect(url).toContain(id)
    }
  })

  it('puts a live youtube video into `live`', async () => {
    mockHolodexResponse([
      {
        id: 'video-1',
        type: 'stream',
        topic_id: 'singing',
        status: 'live',
        published_at: '2026-01-01T00:00:00Z',
        available_at: '2026-01-01T00:00:00Z',
        start_scheduled: '2026-01-01T00:00:00Z',
        duration: 0,
        title: 'Live stream',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(1)
    expect(result.upcoming).toHaveLength(0)
    expect(result.live[0]).toMatchObject({
      url: 'https://youtube.com/watch?v=video-1',
      videoSource: 'youtube',
      membersOnly: false,
      streamer: { id: CHANNEL_A.id, name: CHANNEL_A.name },
    })
  })

  it('puts a non-live youtube video into `upcoming`', async () => {
    mockHolodexResponse([
      {
        id: 'video-2',
        type: 'stream',
        topic_id: 'singing',
        status: 'upcoming',
        published_at: '2026-01-01T00:00:00Z',
        available_at: '2026-01-02T00:00:00Z',
        start_scheduled: '2026-01-02T00:00:00Z',
        duration: 0,
        title: 'Upcoming stream',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(0)
    expect(result.upcoming).toHaveLength(1)
  })

  it('marks members-only videos', async () => {
    mockHolodexResponse([
      {
        id: 'video-3',
        type: 'stream',
        topic_id: 'membersonly',
        status: 'live',
        published_at: '2026-01-01T00:00:00Z',
        available_at: '2026-01-01T00:00:00Z',
        duration: 0,
        title: 'Members stream',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live[0]).toMatchObject({ membersOnly: true })
  })

  it('excludes FreeChat videos', async () => {
    mockHolodexResponse([
      {
        id: 'video-4',
        type: 'stream',
        topic_id: 'FreeChat',
        status: 'live',
        published_at: '2026-01-01T00:00:00Z',
        available_at: '2026-01-01T00:00:00Z',
        duration: 0,
        title: 'Free chat',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(0)
    expect(result.upcoming).toHaveLength(0)
  })

  it('excludes videos from channels outside the requested filter', async () => {
    getQueryMock.mockReturnValue({ channels: CHANNEL_A.name })
    mockHolodexResponse([
      {
        id: 'video-5',
        type: 'stream',
        topic_id: 'singing',
        status: 'live',
        published_at: '2026-01-01T00:00:00Z',
        available_at: '2026-01-01T00:00:00Z',
        duration: 0,
        title: 'Other channel stream',
        channel: { id: CHANNEL_B.id, english_name: CHANNEL_B.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(0)
  })

  it('turns an external-stream placeholder into a twitch live entry', async () => {
    mockHolodexResponse([
      {
        type: 'placeholder',
        placeholderType: 'external-stream',
        link: 'https://twitch.tv/example',
        title: 'Twitch stream',
        start_actual: '2026-01-01T00:00:00Z',
        duration: 0,
        status: 'live',
        thumbnail: 'https://example.com/thumb.jpg',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(1)
    expect(result.live[0]).toMatchObject({
      url: 'https://twitch.tv/example',
      videoSource: 'twitch',
      membersOnly: false,
    })
  })

  it('drops a placeholder video with no start_actual', async () => {
    mockHolodexResponse([
      {
        type: 'placeholder',
        placeholderType: 'external-stream',
        link: 'https://twitch.tv/example',
        title: 'Twitch stream',
        duration: 0,
        status: 'live',
        thumbnail: 'https://example.com/thumb.jpg',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(0)
  })

  it('ignores placeholder videos that are not external-stream', async () => {
    mockHolodexResponse([
      {
        type: 'placeholder',
        placeholderType: 'something-else',
        link: 'https://twitch.tv/example',
        title: 'Ignored placeholder',
        start_actual: '2026-01-01T00:00:00Z',
        duration: 0,
        status: 'live',
        thumbnail: 'https://example.com/thumb.jpg',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live).toHaveLength(0)
  })

  it('sorts both live and upcoming ascending by availableAt', async () => {
    mockHolodexResponse([
      {
        id: 'later',
        type: 'stream',
        topic_id: 'singing',
        status: 'live',
        published_at: '2026-01-02T00:00:00Z',
        available_at: '2026-01-02T00:00:00Z',
        duration: 0,
        title: 'Later',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
      {
        id: 'earlier',
        type: 'stream',
        topic_id: 'singing',
        status: 'live',
        published_at: '2026-01-01T00:00:00Z',
        available_at: '2026-01-01T00:00:00Z',
        duration: 0,
        title: 'Earlier',
        channel: { id: CHANNEL_A.id, english_name: CHANNEL_A.name },
      },
    ])

    const result = await handler({})

    expect(result.live.map((v: { url: string }) => v.url)).toEqual([
      'https://youtube.com/watch?v=earlier',
      'https://youtube.com/watch?v=later',
    ])
  })
})
