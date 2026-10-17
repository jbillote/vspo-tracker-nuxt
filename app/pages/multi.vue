<script setup lang="ts">
import { embedUrl, parseVideoIds } from '@/lib/youtube'
import { X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const videoIds = computed(() => parseVideoIds(route.query.ids))

function removeStream(id: string) {
  const remaining = videoIds.value.filter((videoId) => videoId !== id)
  router.push({
    path: '/multi',
    query: remaining.length > 0 ? { ids: remaining.join(',') } : {},
  })
}

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
      <div
        v-for="id in videoIds"
        :key="id"
        class="group relative aspect-video w-full overflow-hidden rounded-md"
      >
        <iframe
          :src="embedUrl(id)"
          :title="`YouTube stream ${id}`"
          class="h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
        />
        <button
          type="button"
          :aria-label="`Close stream ${id}`"
          class="absolute top-2 right-2 cursor-pointer rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black focus-visible:opacity-100"
          @click="removeStream(id)"
        >
          <X class="size-5" />
        </button>
      </div>
    </div>
  </div>
</template>
