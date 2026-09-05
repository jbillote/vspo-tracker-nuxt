import { beforeAll, describe, expect, it, vi } from 'vitest'
import channels from '../../../server/data/channels.json'

let handler: () => Promise<Record<string, string[]>>

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (fn: unknown) => fn)
  handler = (await import('../../../server/api/v1/streamers/index.get.ts'))
    .default as typeof handler
})

describe('GET /api/v1/streamers', () => {
  it('keys the result by org name when the org has a single branch', async () => {
    const result = await handler()
    const singleBranchOrg = channels.find((org) => org.branches.length === 1)!
    expect(result[singleBranchOrg.name]).toEqual(
      singleBranchOrg.branches[0].members.map((m) => m.name),
    )
  })

  it('keys the result by "org branch" when the org has multiple branches', async () => {
    const result = await handler()
    const multiBranchOrg = channels.find((org) => org.branches.length > 1)

    if (!multiBranchOrg) {
      // channels.json currently has no multi-branch org to exercise this path
      return
    }

    for (const branch of multiBranchOrg.branches) {
      expect(result[`${multiBranchOrg.name} ${branch.name}`]).toEqual(
        branch.members.map((m) => m.name),
      )
    }
  })

  it('lists every member name for every branch', async () => {
    const result = await handler()
    const allExpectedNames = channels
      .flatMap((org) => org.branches)
      .flatMap((branch) => branch.members.map((m) => m.name))
    const allActualNames = Object.values(result).flat()

    expect(allActualNames.sort()).toEqual(allExpectedNames.sort())
  })
})
