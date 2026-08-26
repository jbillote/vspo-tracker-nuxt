import channels from '../../../data/channels.json'

export default defineEventHandler(async () => {
  const streamers: string[] = []
  for (const org of channels) {
    for (const branch of org.branches) {
      for (const member of branch.members) {
        streamers.push(member.name)
      }
    }
  }

  return streamers
})
