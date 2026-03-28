import { Elysia } from 'elysia'
import channels from './data/channels.json'

export default () =>
  new Elysia().get('/v1/streamers', () => {
    const orgs = []
    channels.forEach((org) => {
      const branches = []
      org.branches.forEach((branch) => {
        const members = []
        branch.members.forEach((member) => {
          members.push({
            name: member.name
          })
        })

        branches.push({
          name: branch.name,
          members: members
        })
      })

      orgs.push({
        name: org.name,
        branches: branches
      })
    })

    return orgs
  })
