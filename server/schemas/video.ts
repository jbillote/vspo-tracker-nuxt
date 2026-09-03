export interface Video {
  url: string
  title: string
  type: string
  videoSource: 'youtube' | 'twitch'
  membersOnly: boolean
  publishedAt: string
  availableAt: string
  scheduledStart?: string
  duration: number
  status: string
  thumbnail: string
  streamer?: {
    id: string
    name: string
  }
}
