<script setup lang="ts">
import VideoCard from '@/components/VideoCard.vue'
import { DateTime } from 'luxon'

const { data } = await useFetch('/api/v1/videos/live')

const upcoming = computed(() => {
  return (
    data.value.upcoming?.filter((video) => {
      return video.scheduledStart && DateTime.fromISO(video.scheduledStart).diffNow('days').days < 2
    }) ?? []
  )
})
</script>

<template>
  <div>
    <h1 class="mt-2 text-center text-4xl font-bold">Live</h1>
    <div class="flex flex-wrap justify-center p-2">
      <div class="flex flex-wrap justify-center p-2">
        <VideoCard v-for="video in data?.live" :key="video.url" v-bind="video" />
      </div>
    </div>
    <h1 class="mt-2 text-center text-4xl font-bold">Upcoming</h1>
    <div class="flex flex-wrap justify-center p-2">
      <div class="flex flex-wrap justify-center p-2">
        <VideoCard v-for="video in upcoming" :key="video.url" v-bind="video" />
      </div>
    </div>
  </div>
</template>
