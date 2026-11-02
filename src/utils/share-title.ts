export const BRAND_NAME = 'Alexander Härenstam';
export const ROLE = 'Product Manager, Developer Experience at IFS';

/** Every share and browser title names Alexander Härenstam (LinkedIn share spec). */
export function withBrandName(title: string): string {
  if (title.includes(BRAND_NAME)) return title;
  if (title === ROLE) return `${BRAND_NAME} | ${ROLE}`;
  const roleSuffix = ` | ${ROLE}`;
  if (title.endsWith(roleSuffix)) return `${title.slice(0, -roleSuffix.length)} | ${BRAND_NAME}`;
  return `${title} | ${BRAND_NAME}`;
}
