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
import { ListFilter } from 'lucide-vue-next'

const open = ref(false)
const streamers = ref<string[]>([])

watch(open, async (isOpen) => {
  if (isOpen && !streamers.value.length) {
    const data = await $fetch('/api/v1/streamers')
    streamers.value = data
  }
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    <span class="flex-auto">VSPO! Tracker</span>
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
        <div v-if="!streamers.length" class="flex items-center justify-center">
          <Spinner />
        </div>
        <div v-else class="flex items-center justify-center">
          <div v-for="streamer in streamers" :key="streamer">{{ streamer }}</div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </header>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <NuxtPage />
  </div>
</template>
