import { test, expect } from '@playwright/test';

test('verify skip link and focus states', async ({ page }) => {
  await page.goto('http://localhost:4321');

  // Check skip link
  await page.keyboard.press('Tab');
  const skipLink = page.locator('.skip-to-content');
  await expect(skipLink).toBeVisible();
  await page.screenshot({ path: 'skip_link.png' });

  // Check portfolio card focus
  await page.keyboard.press('Tab'); // Next tab might be a menu item or the logo
  // Press tab until we reach a card
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    const isFocused = await page.evaluate(() => {
      const el = document.activeElement;
      return el && el.classList.contains('card');
    });
    if (isFocused) break;
  }
  await page.screenshot({ path: 'portfolio_focus.png' });
});
