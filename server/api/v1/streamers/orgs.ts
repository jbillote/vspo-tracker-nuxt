import channels from '../../../data/channels.json'

export default defineEventHandler(async () => {
  const orgs: string[] = []
  for (const org of channels) {
    orgs.push(org.name)
  }

  return orgs
})
