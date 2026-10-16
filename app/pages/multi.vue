<script setup lang="ts">
import { embedUrl, parseVideoIds } from '@/lib/youtube'

const route = useRoute()

const videoIds = computed(() => parseVideoIds(route.query.ids))

const gridColumns = computed(() => {
  const count = videoIds.value.length
  if (count <= 1) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-1 md:grid-cols-2'
  return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
})
</script>

<template>
  <div>
    <div v-if="videoIds.length < 1" class="flex items-center justify-center p-2">
      No valid streams to show :c
    </div>
    <div v-else class="grid gap-2" :class="gridColumns">
      <div v-for="id in videoIds" :key="id" class="aspect-video w-full overflow-hidden rounded-md">
        <iframe
          :src="embedUrl(id)"
          :title="`YouTube stream ${id}`"
          class="h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>
