import { test, expect } from '@playwright/test';

test('Pill component has tactile classes and hover/active states', async ({ page }) => {
  // Use the built dist/client directory via a local server
  await page.goto('http://localhost:4321/work/ai-coding-copilots/');

  const pill = page.locator('.pill').first();
  await expect(pill).toBeVisible();

  // Verify class
  await expect(pill).toHaveClass(/is-tactile/);

  // Take initial screenshot
  await pill.screenshot({ path: 'pill_initial.png' });

  // Hover and take screenshot
  await pill.hover();
  await page.waitForTimeout(200); // Wait for transition
  await pill.screenshot({ path: 'pill_hover.png' });

  // Press down (active) and take screenshot
  await page.mouse.down();
  await page.waitForTimeout(200);
  await pill.screenshot({ path: 'pill_active.png' });
  await page.mouse.up();
});
