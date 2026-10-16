import { embedUrl, isValidVideoId, parseVideoIds } from '@/lib/youtube'
import { describe, expect, it } from 'vitest'

describe('isValidVideoId', () => {
  it('accepts 11-character IDs with letters, digits, dashes, and underscores', () => {
    expect(isValidVideoId('dQw4w9WgXcQ')).toBe(true)
    expect(isValidVideoId('a-b_c-d_e-f')).toBe(true)
  })

  it('rejects IDs with the wrong length or invalid characters', () => {
    expect(isValidVideoId('')).toBe(false)
    expect(isValidVideoId('dQw4w9WgXc')).toBe(false)
    expect(isValidVideoId('dQw4w9WgXcQQ')).toBe(false)
    expect(isValidVideoId('dQw4w9WgX!Q')).toBe(false)
  })
})

describe('parseVideoIds', () => {
  it('splits a comma-separated list', () => {
    expect(parseVideoIds('dQw4w9WgXcQ,jNQXAC9IVRw')).toEqual(['dQw4w9WgXcQ', 'jNQXAC9IVRw'])
  })

  it('trims whitespace and drops blank entries', () => {
    expect(parseVideoIds(' dQw4w9WgXcQ , ,jNQXAC9IVRw,')).toEqual(['dQw4w9WgXcQ', 'jNQXAC9IVRw'])
  })

  it('drops invalid IDs', () => {
    expect(parseVideoIds('dQw4w9WgXcQ,nope,<script>,jNQXAC9IVRw')).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('removes duplicates while preserving order', () => {
    expect(parseVideoIds('jNQXAC9IVRw,dQw4w9WgXcQ,jNQXAC9IVRw')).toEqual([
      'jNQXAC9IVRw',
      'dQw4w9WgXcQ',
    ])
  })

  it('collects IDs from an array query value', () => {
    expect(parseVideoIds(['dQw4w9WgXcQ', 'jNQXAC9IVRw'])).toEqual(['dQw4w9WgXcQ', 'jNQXAC9IVRw'])
  })

  it('ignores null at the start of an array query value', () => {
    expect(parseVideoIds([null, 'dQw4w9WgXcQ', 'jNQXAC9IVRw'])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('ignores null in the middle of an array query value', () => {
    expect(parseVideoIds(['dQw4w9WgXcQ', null, 'jNQXAC9IVRw'])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('ignores null at the end of an array query value', () => {
    expect(parseVideoIds(['dQw4w9WgXcQ', 'jNQXAC9IVRw', null])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('ignores undefined at the start of an array query value', () => {
    expect(parseVideoIds([undefined, 'dQw4w9WgXcQ', 'jNQXAC9IVRw'])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('ignores undefined in the middle of an array query value', () => {
    expect(parseVideoIds(['dQw4w9WgXcQ', undefined, 'jNQXAC9IVRw'])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('ignores undefined at the end of an array query value', () => {
    expect(parseVideoIds(['dQw4w9WgXcQ', 'jNQXAC9IVRw', undefined])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('ignores both null and undefined in the same array query value', () => {
    expect(parseVideoIds([null, 'dQw4w9WgXcQ', undefined, 'jNQXAC9IVRw', null])).toEqual([
      'dQw4w9WgXcQ',
      'jNQXAC9IVRw',
    ])
  })

  it('returns an empty list for a missing query', () => {
    expect(parseVideoIds(undefined)).toEqual([])
    expect(parseVideoIds(null)).toEqual([])
  })
})

describe('embedUrl', () => {
  it('builds an embed URL for the video', () => {
    expect(embedUrl('dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1',
    )
  })
})
