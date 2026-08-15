export function shouldShowVisitCount(count: unknown): count is number {
  return typeof count === 'number' && Number.isFinite(count) && count > 0;
}

export function formatPageviewCount(count: number): string {
  return `${count} pageview${count === 1 ? '' : 's'}`;
}
