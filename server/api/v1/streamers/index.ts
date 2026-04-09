import { Elysia, t } from 'elysia'
import channels from '../../../data/channels.json'

export default function createStreamersRoutes() {
  return new Elysia({ prefix: '/v1/streamers' })
    .get(
      '/',
      () => {
        const streamers = []
        channels.forEach((org) => {
          org.branches.forEach((branch) => {
            branch.members.forEach((member) => {
              streamers.push(member.name)
            })
          })
        })

        return streamers
      },
      {
        response: t.Array(t.String()),
      },
    )
    .get('/orgs', () => {
      const orgs = []
      channels.forEach((org) => {
        orgs.push(org.name)
      })

      return orgs
    })
}
