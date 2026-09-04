<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import VideoCard from '@/components/VideoCard.vue'
import { useVideoStore } from '@/stores/videos'

const videoStore = useVideoStore()

videoStore.fetch()
</script>

<template>
  <div>
    <h1 class="mt-2 text-center text-4xl font-bold">Live</h1>
    <div class="flex flex-wrap justify-center p-2">
      <div v-if="videoStore.live.length < 1" class="flex items-center justify-center p-2">
        <Spinner />
      </div>
      <div v-else class="flex flex-wrap justify-center p-2">
        <VideoCard v-for="video in videoStore.live" :key="video.url" v-bind="video" />
      </div>
    </div>
    <h1 class="mt-2 text-center text-4xl font-bold">Upcoming</h1>
    <div class="flex flex-wrap justify-center p-2">
      <div v-if="videoStore.upcoming.length < 1" class="flex items-center justify-center p-2">
        <Spinner />
      </div>
      <div v-else class="flex flex-wrap justify-center p-2">
        <VideoCard v-for="video in videoStore.upcoming" :key="video.url" v-bind="video" />
      </div>
    </div>
  </div>
</template>
