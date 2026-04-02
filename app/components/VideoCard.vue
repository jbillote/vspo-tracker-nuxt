<script setup lang="ts">
import { DateTime } from 'luxon'
import { TwitchIcon } from 'vue3-simple-icons'

defineProps<{
  url: string
  title: string
  type: string
  videoSource: string
  membersOnly: boolean
  scheduledStart: string | undefined
  duration: number
  status: string
  thumbnail: string
  streamer:
    | {
        id: string
        name: string
      }
    | undefined
}>()
</script>

<template>
  <div class="bg-accent relative m-1 inline-block rounded-md hover:bg-neutral-700">
    <div
      :style="{ backgroundImage: `url(${thumbnail})` }"
      class="h-36 w-68 rounded-md bg-cover bg-center bg-no-repeat"
    >
      <div
        v-if="status === 'live' && videoSource === 'youtube'"
        class="w-fit bg-red-500 p-1 text-xs font-bold"
      >
        LIVE
      </div>
      <div
        v-else-if="status === 'live' && videoSource === 'twitch'"
        class="w-fit bg-purple-500 p-1 text-xs font-bold"
      >
        <TwitchIcon />
      </div>
      <div v-if="membersOnly" class="w-fit bg-black p-1 text-xs">Members Only</div>
    </div>
    <div class="mx-2 my-2">
      <span
        class="cursor-pointed relative z-10 line-clamp-2 inline-block max-w-64 truncate text-sm font-bold select-none"
        :title="title"
      >
        {{ title }}
      </span>
      <div v-if="streamer" class="w-fit text-sm hover:text-sky-300">
        <a :href="`https://youtube.com/channel/${streamer.id}`" class="relative z-10 w-fit">
          {{ streamer.name }}
        </a>
      </div>
      <div class="max-w-64 text-sm">
        {{ (status === 'live' ? 'Started ' : '') + DateTime.fromISO(scheduledStart)?.toRelative() }}
      </div>
    </div>
    <a :href="`https://youtube.com/channel/${streamer.id}`" class="relative z-10 w-fit" />
  </div>
</template>
