import { Elysia } from 'elysia'
import channels from '../../../data/channels.json'

const getYouTubeIDs = (): string[] => {
  const ids: string[] = []

  for (const org of channels) {
    for (const branch of org.branches) {
      for (const member of branch.members) {
        ids.push(member.youtube)
      }
    }
  }

  return ids
}

const VideosRoutes = new Elysia({ prefix: '/v1/videos' }).get('/live', async () => {
  const ids = getYouTubeIDs()
  return ids
})

export { VideosRoutes }
