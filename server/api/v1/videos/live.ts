import { defineEventHandler } from 'h3'
import { DateTime } from 'luxon'
import channels from '../../../data/channels.json'
import type { Video } from '../../schemas/video.ts'

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

const getYouTubeIDsForChannels = (names: string[]): string[] => {
  const wanted = new Set(names.map((name) => name.toLowerCase()))
  const ids: string[] = []

  for (const org of channels) {
    for (const branch of org.branches) {
      for (const member of branch.members) {
        if (wanted.has(member.name.toLowerCase())) {
          ids.push(member.youtube)
        }
      }
    }
  }

  return ids
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const query = getQuery(event)
  const channelsParam = query.channels

  const requestedNames = (
    Array.isArray(channelsParam)
      ? channelsParam
      : typeof channelsParam === 'string'
        ? channelsParam.split(',')
        : []
  )
    .map((name) => name.trim())
    .filter(Boolean)

  const filteredIds = requestedNames.length > 0 ? getYouTubeIDsForChannels(requestedNames) : []

  const ids = filteredIds.length > 0 ? filteredIds : getYouTubeIDs()
  const url = `https://holodex.net/api/v2/users/live?channels=${ids.join(',')}&includePlaceholder=true`

  const resp = await fetch(url, {
    headers: { 'x-apikey': config.holodexApiKey },
  })

  const respJson = await resp.json()

  const live: Video[] = []
  const upcoming: Video[] = []

  for (const video of respJson) {
    if (video.type === 'placeholder') {
      if (video.placeholderType === 'external-stream' && ids.includes(video.channel.id)) {
        const v: Video = {
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
      const v: Video = {
        url: `https://youtube.com/watch?v=${video.id}`,
        title: video.title,
        type: video.type,
        videoSource: 'youtube',
        membersOnly: video.topic_id === 'membersonly',
        publishedAt: video.published_at,
        availableAt: video.available_at,
        scheduledStart: video.start_scheduled,
        duration: video.duration,
        status: video.status,
        thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
        streamer: {
          id: video.channel.id,
          name: video.channel.english_name,
        },
      }

      if (v.status === 'live') {
        live.push(v)
      } else {
        upcoming.push(v)
      }
    }
  }

  return {
    live: live.sort(
      (a, b) =>
        DateTime.fromISO(a.availableAt!).toMillis() - DateTime.fromISO(b.availableAt!).toMillis(),
    ),
    upcoming: upcoming.sort(
      (a, b) =>
        DateTime.fromISO(a.availableAt!).toMillis() - DateTime.fromISO(b.availableAt!).toMillis(),
    ),
  }
})
