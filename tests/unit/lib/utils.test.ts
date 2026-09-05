import { cn } from '@/lib/utils'
import { describe, expect, it } from 'vitest'

describe('cn', () => {
  it('joins plain class strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b')
  })

  it('resolves conflicting tailwind classes to the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('supports conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('merges arrays of classes', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})
