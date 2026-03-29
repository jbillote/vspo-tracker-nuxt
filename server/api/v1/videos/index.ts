import { Elysia } from 'elysia'
import { DateTime } from 'luxon'
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

export default function createVideosRoutes() {
  const config = useRuntimeConfig()

  return new Elysia({ prefix: '/v1/videos' }).decorate('config', config).get('/live', async () => {
    const ids = getYouTubeIDs()

    const url = `https://holodex.net/api/v2/users/live?channels=${ids.join(',')}&includePlaceholder=true`
    const resp = await fetch(url, {
      headers: {
        'x-apikey': config.holodexApiKey,
      },
    })
    const respJson = await resp.json()

    const live: Record<string, any> = []
    const upcoming: Record<string, any> = []

    for (const video of respJson) {
      if (video.type === 'placeholder') {
        if (video.placeholderType === 'external-stream' && ids.includes(video.channel.id)) {
          const v = {
            url: video.link,
            title: video.title,
            type: video.type,
            videoSource: 'twitch',
            membersOnly: false,
            publishedAt: video.start_actual,
            availableAt: video.start_actual,
            scheduledStart: video.start_actual,
            duration: video.duration,
            status: video.status,
            thumbnail: video.thumbnail,
            streamer: {
              id: video.channel.id,
              name: video.channel.english_name,
            },
          }

          if (v.publishedAt && v.availableAt) {
            live.push(v)
          }
        }
      } else if (video.topic_id !== 'FreeChat' && ids.includes(video.channel.id)) {
        const v = {
          url: `https://youtube.com/watch?v=${video.id}`,
          title: video.title,
          type: video.type,
          videoSource: 'youtube',
          membersOnly: video.topicId === 'membersonly',
          publishedAt: video.published_at,
          availableAt: video.available_at,
          scheduledStart: video.start_scheduled,
          duration: video.duration,
          status: video.status,
          thumbnail: `https://i.ytimg.com/v1/${video.id}/maxresdefault.jpg`,
          streamer: {
            id: video.channel.id,
            name: video.channel.english_name,
          },
        }

        if (video.status === 'live') {
          live.push(v)
        } else {
          upcoming.push(v)
        }
      }
    }

    return {
      live: live.sort((a: Record<string, any>, b: Record<string, any>) => {
        return (
          DateTime.fromISO(a.availableAt).toMillis() - DateTime.fromISO(b.availableAt).toMillis()
        )
      }),
      upcoming: upcoming.sort((a: Record<string, any>, b: Record<string, any>) => {
        return (
          DateTime.fromISO(a.availableAt).toMillis() - DateTime.fromISO(b.availableAt).toMillis()
        )
      }),
    }
  })
}
