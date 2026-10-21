<script setup lang="ts">
import { DateTime } from 'luxon'
import { TwitchIcon } from 'vue3-simple-icons'

defineOptions({ inheritAttrs: false })

defineProps<{
  selected?: boolean
  title: string
  videoSource: string
  membersOnly: boolean
  scheduledStart: string | undefined
  thumbnail: string
  streamer:
    | {
        id: string
        name: string
      }
    | undefined
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    class="bg-accent relative m-1 inline-block rounded-md hover:bg-neutral-700"
    :class="{ 'bg-neutral-700 ring-2 ring-sky-400': selected }"
  >
    <div
      :style="{ backgroundImage: `url(${thumbnail})` }"
      class="h-36 w-68 rounded-md bg-cover bg-center bg-no-repeat"
    >
      <div v-if="videoSource === 'twitch'" class="w-fit bg-purple-500 p-1 text-xs font-bold">
        <TwitchIcon />
      </div>
      <div v-else class="w-fit bg-red-500 p-1 text-xs font-bold">LIVE</div>
      <div v-if="membersOnly" class="w-fit bg-black p-1 text-xs">Members Only</div>
    </div>
    <div class="mx-2 my-2">
      <span
        class="relative z-10 line-clamp-2 inline-block max-w-64 cursor-pointer truncate text-sm font-bold select-none"
        :title="title"
      >
        {{ title }}
      </span>
      <div v-if="streamer" class="w-fit text-sm hover:text-sky-300">
        <a
          :href="`https://youtube.com/channel/${streamer.id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="relative z-10 w-fit"
        >
          {{ streamer.name }}
        </a>
      </div>
      <div class="max-w-64 text-sm">
        <ClientOnly>
          <span>Started {{ DateTime.fromISO(scheduledStart)?.toRelative() }}</span>
        </ClientOnly>
      </div>
    </div>
    <button
      type="button"
      :aria-pressed="selected"
      :aria-label="title"
      class="absolute inset-0 z-20 cursor-pointer rounded-md"
      @click="$emit('select')"
    />
  </div>
</template>
