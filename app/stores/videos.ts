import { DateTime } from 'luxon'

export const useVideoStore = defineStore('videos', () => {
  const live = ref([])
  const upcoming = ref([])

  function clear() {
    live.value = []
    upcoming.value = []
  }

  async function fetch() {
    const res = await $fetch('/api/v1/videos/live')
    live.value = res.live
    upcoming.value =
      res.upcoming?.filter(
        (video) =>
          video.scheduledStart && DateTime.fromISO(video.scheduledStart).diffNow('days').days < 2,
      ) ?? []
  }

  return { live, upcoming, clear, fetch }
})
