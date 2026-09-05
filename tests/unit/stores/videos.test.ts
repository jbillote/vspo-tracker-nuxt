import { useVideoStore } from '@/stores/videos'
import { DateTime } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubGlobal('$fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('useVideoStore', () => {
  it('starts empty', () => {
    const store = useVideoStore()
    expect(store.live).toEqual([])
    expect(store.upcoming).toEqual([])
  })

  it('populates live and upcoming from the API response', async () => {
    const soon = DateTime.now().plus({ hours: 1 }).toISO()
    fetchMock.mockResolvedValueOnce({
      live: [{ url: 'live-1' }],
      upcoming: [{ url: 'upcoming-1', scheduledStart: soon }],
    })

    const store = useVideoStore()
    await store.fetch()

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/videos/live')
    expect(store.live).toEqual([{ url: 'live-1' }])
    expect(store.upcoming).toEqual([{ url: 'upcoming-1', scheduledStart: soon }])
  })

  it('drops upcoming videos scheduled more than 2 days out', async () => {
    const soon = DateTime.now().plus({ hours: 1 }).toISO()
    const far = DateTime.now().plus({ days: 5 }).toISO()
    fetchMock.mockResolvedValueOnce({
      live: [],
      upcoming: [
        { url: 'soon', scheduledStart: soon },
        { url: 'far', scheduledStart: far },
      ],
    })

    const store = useVideoStore()
    await store.fetch()

    expect(store.upcoming).toEqual([{ url: 'soon', scheduledStart: soon }])
  })

  it('drops upcoming videos with no scheduledStart', async () => {
    fetchMock.mockResolvedValueOnce({
      live: [],
      upcoming: [{ url: 'no-schedule' }],
    })

    const store = useVideoStore()
    await store.fetch()

    expect(store.upcoming).toEqual([])
  })

  it('defaults upcoming to an empty array when the API omits it', async () => {
    fetchMock.mockResolvedValueOnce({ live: [{ url: 'live-1' }] })

    const store = useVideoStore()
    await store.fetch()

    expect(store.upcoming).toEqual([])
  })

  it('clears live and upcoming videos', async () => {
    fetchMock.mockResolvedValueOnce({
      live: [{ url: 'live-1' }],
      upcoming: [],
    })

    const store = useVideoStore()
    await store.fetch()
    store.clear()

    expect(store.live).toEqual([])
    expect(store.upcoming).toEqual([])
  })
})
