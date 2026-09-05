import { createPinia, defineStore, setActivePinia } from 'pinia'
import { beforeEach, vi } from 'vitest'
import { ref } from 'vue'

// The app/stores/* files rely on Nuxt's auto-imported `ref` and `defineStore`
// globals instead of explicit imports. Stub them with the real implementations
// so the store modules can be imported directly in a plain Vitest environment.
vi.stubGlobal('ref', ref)
vi.stubGlobal('defineStore', defineStore)

beforeEach(() => {
  setActivePinia(createPinia())
})
