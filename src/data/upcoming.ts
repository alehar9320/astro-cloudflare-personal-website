export const FLATTEN_BULLET = 'Flatter first view. Boxes only for affordance or grouping.';

export const UPCOMING: readonly string[] = [];

export function stillPromisesFlatten(items: readonly string[]): boolean {
  return items.includes(FLATTEN_BULLET);
}
