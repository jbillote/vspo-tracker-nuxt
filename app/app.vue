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
import { ListFilter } from 'lucide-vue-next'
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    <span class="flex-auto">VSPO! Tracker</span>
    <Dialog>
      <DialogTrigger as-child>
        <Button class="hover:bg-accent bg-transparent">
          <ListFilter class="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
          <DialogDescription>Filter</DialogDescription>
        </DialogHeader>
        <div>
          <h1 class="text-center text-3xl font-bold">Filter</h1>
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
