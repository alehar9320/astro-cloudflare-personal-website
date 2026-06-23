from playwright.sync_api import Page, expect, sync_playwright
import time

def test_visuals(page: Page):
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:4321")

    # Wait for the page to load completely
    page.wait_for_load_state("networkidle")

    # 2. Screenshot the whole page to see mention cards and pills
    page.screenshot(path="verification/homepage.png", full_page=True)

    # 3. Hover over a mention card to see the effect
    mention_card = page.locator(".mention-card").first
    mention_card.hover()
    time.sleep(1) # wait for animation
    page.screenshot(path="verification/mention_card_hover.png")

    # 4. Check Pills
    pills = page.locator(".pill")
    if pills.count() > 0:
        pills.first.screenshot(path="verification/pill.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_visuals(page)
        finally:
            browser.close()
