export const useFiltersStore = defineStore('filterStore', () => {
  const channels = ref<string[]>([])

  function addChannel(channel: string) {
    if (!channels.value.includes(channel)) {
      channels.value.push(channel)
    }
  }

  function removeChannel(channel: string) {
    channels.value = channels.value.filter((c) => c !== channel)
  }

  function clearChannels() {
    channels.value = []
  }

  return { channels, addChannel, removeChannel, clearChannels }
})
