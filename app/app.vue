<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    <span>VSPO! Tracker</span>
  </header>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <NuxtPage />
  </div>
</template>
