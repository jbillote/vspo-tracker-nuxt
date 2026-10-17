<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import VideoCard from '@/components/VideoCard.vue'
import { videoIdFromUrl } from '@/lib/youtube'
import { useVideoStore } from '@/stores/videos'
import { ListFilter, Plus, RefreshCw } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isMultiStream = computed(() => route.path === '/multi')

const open = ref(false)
const multiStreamOpen = ref(false)
const liveYouTube = ref([])
const liveYouTubeLoading = ref(false)
const selectedVideoIds = ref<string[]>([])
const streamers = ref({})
const loading = ref(false)
const videoStore = useVideoStore()

async function refresh() {
  loading.value = true
  try {
    videoStore.clear()
    await videoStore.fetch()
  } finally {
    loading.value = false
  }
}

watch(open, async (isOpen) => {
  if (isOpen && !(Object.keys(streamers.value) > 0)) {
    const data = await $fetch('/api/v1/streamers')
    streamers.value = data
  }
})

function isSelected(url: string) {
  const id = videoIdFromUrl(url)
  return id !== undefined && selectedVideoIds.value.includes(id)
}

function toggleSelected(url: string) {
  const id = videoIdFromUrl(url)
  if (id === undefined) return

  selectedVideoIds.value = selectedVideoIds.value.includes(id)
    ? selectedVideoIds.value.filter((selected) => selected !== id)
    : [...selectedVideoIds.value, id]
}

async function confirmSelection() {
  if (selectedVideoIds.value.length > 0) {
    await router.push({ path: '/multi', query: { ids: selectedVideoIds.value.join(',') } })
  }
  multiStreamOpen.value = false
}

watch(multiStreamOpen, async (isOpen) => {
  if (!isOpen) {
    selectedVideoIds.value = []
    return
  }

  liveYouTubeLoading.value = true
  try {
    const data = await $fetch('/api/v1/videos/live', {
      query: { twitch: false, upcoming: false },
    })
    liveYouTube.value = data.live
  } finally {
    liveYouTubeLoading.value = false
  }
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    <span class="flex-auto">VSPO! Tracker</span>
    <Dialog v-if="isMultiStream" v-model:open="multiStreamOpen">
      <DialogTrigger as-child>
        <Button class="hover:bg-accent bg-transparent">
          <Plus class="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent class="flex max-h-[90vh] max-w-[80vw] flex-col sm:max-w-[80vw]">
        <DialogHeader class="shrink-0">
          <DialogTitle>Streams</DialogTitle>
          <DialogDescription class="sr-only"
            >Change the streams shown on this page.</DialogDescription
          >
        </DialogHeader>
        <div class="min-h-0 flex-1 overflow-y-auto">
          <div v-if="liveYouTubeLoading" class="flex items-center justify-center p-2">
            <Spinner />
          </div>
          <div v-else-if="liveYouTube.length < 1" class="flex items-center justify-center p-2">
            No one live :c
          </div>
          <div v-else class="flex flex-wrap justify-center">
            <VideoCard
              v-for="video in liveYouTube"
              :key="video.url"
              v-bind="video"
              selectable
              :selected="isSelected(video.url)"
              @select="toggleSelected(video.url)"
            />
          </div>
        </div>
        <DialogFooter class="shrink-0 border-t pt-4">
          <Button variant="outline" @click="confirmSelection">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <template v-else>
      <Button class="hover:bg-accent bg-transparent" :disabled="loading" @click="refresh">
        <Spinner v-if="loading" />
        <RefreshCw v-else class="text-white" />
      </Button>
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button class="hover:bg-accent bg-transparent">
            <ListFilter class="text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
            <DialogDescription class="sr-only"
              >Filter streams by org or specific streamers.</DialogDescription
            >
          </DialogHeader>
          <div v-if="Object.keys(streamers).length < 1" class="flex items-center justify-center">
            <Spinner />
          </div>
          <div v-else class="flex items-center justify-center">
            <Select multiple>
              <SelectTrigger>
                <SelectValue placeholder="Filter by streamer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-for="(members, org) in streamers" :key="org">
                  <SelectLabel>{{ org }}</SelectLabel>
                  <SelectItem v-for="member in members" :key="member" :value="member">
                    {{ member }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose as-child>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </template>
  </header>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <NuxtPage />
  </div>
</template>
