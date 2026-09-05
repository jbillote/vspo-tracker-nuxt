import { beforeAll, describe, expect, it, vi } from 'vitest'
import channels from '../../../server/data/channels.json'

let handler: () => Promise<string[]>

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (fn: unknown) => fn)
  handler = (await import('../../../server/api/v1/streamers/orgs.ts')).default as typeof handler
})

describe('GET /api/v1/streamers/orgs', () => {
  it('returns the name of every org in channels.json, in order', async () => {
    const result = await handler()
    expect(result).toEqual(channels.map((org) => org.name))
  })

  it('returns an array of strings only', async () => {
    const result = await handler()
    expect(Array.isArray(result)).toBe(true)
    for (const name of result) {
      expect(typeof name).toBe('string')
    }
  })
})
