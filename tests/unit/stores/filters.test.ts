import { useFiltersStore } from '@/stores/filters'
import { describe, expect, it } from 'vitest'

describe('useFiltersStore', () => {
  it('starts with no channels selected', () => {
    const store = useFiltersStore()
    expect(store.channels).toEqual([])
  })

  it('adds a channel', () => {
    const store = useFiltersStore()
    store.addChannel('Yakumo Beni')
    expect(store.channels).toEqual(['Yakumo Beni'])
  })

  it('does not add the same channel twice', () => {
    const store = useFiltersStore()
    store.addChannel('Yakumo Beni')
    store.addChannel('Yakumo Beni')
    expect(store.channels).toEqual(['Yakumo Beni'])
  })

  it('removes a channel', () => {
    const store = useFiltersStore()
    store.addChannel('Yakumo Beni')
    store.addChannel('Kaga Sumire')
    store.removeChannel('Yakumo Beni')
    expect(store.channels).toEqual(['Kaga Sumire'])
  })

  it('removing a channel that was never added is a no-op', () => {
    const store = useFiltersStore()
    store.addChannel('Yakumo Beni')
    store.removeChannel('Kaga Sumire')
    expect(store.channels).toEqual(['Yakumo Beni'])
  })

  it('clears all channels', () => {
    const store = useFiltersStore()
    store.addChannel('Yakumo Beni')
    store.addChannel('Kaga Sumire')
    store.clearChannels()
    expect(store.channels).toEqual([])
  })
})
