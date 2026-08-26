import channels from '../../../data/channels.json'

export default defineEventHandler(async () => {
  const streamers = {}
  for (const org of channels) {
    for (const branch of org.branches) {
      const key = org.branches.length > 1 ? `${org.name} ${branch.name}` : org.name
      const orgStreamers = []
      for (const member of branch.members) {
        orgStreamers.push(member.name)
      }
      streamers[key] = orgStreamers
    }
  }

  return streamers
})
