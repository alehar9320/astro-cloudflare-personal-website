export const FLATTEN_BULLET = 'Flatter first view. Boxes only for affordance or grouping.';

export const UPCOMING: readonly string[] = [
  'Clearer next steps from the first view, so a visit becomes a second look.',
  'A LinkedIn hire path visitors can take without hunting.',
];

export function stillPromisesFlatten(items: readonly string[]): boolean {
  return items.includes(FLATTEN_BULLET);
}
