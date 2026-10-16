const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function isValidVideoId(id: string): boolean {
  return VIDEO_ID_PATTERN.test(id)
}

// Parses a comma-separated list of YouTube video IDs from a route query value,
// dropping blanks, invalid IDs, and duplicates while preserving order.
export function parseVideoIds(query: unknown): string[] {
  const values = (Array.isArray(query) ? query : [query]).filter(
    (value): value is string => typeof value === 'string',
  )

  const ids = values
    .flatMap((value) => value.split(','))
    .map((id) => id.trim())
    .filter(isValidVideoId)

  return [...new Set(ids)]
}

export function embedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1`
}
