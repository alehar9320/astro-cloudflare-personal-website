import asyncio
from playwright.async_api import async_playwright
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Set up a valid chat history in sessionStorage
        history = [
            {"role": "user", "content": "Hello Alexander"},
            {"role": "assistant", "content": "Hello! How can I help you today?"}
        ]

        # Navigate and set session storage
        await page.goto("http://localhost:4321")
        await page.evaluate(f"sessionStorage.setItem('chat-history', '{json.dumps(history)}' )")

        # Reload to trigger hydration
        await page.reload()

        # Open chat
        await page.click("#chat-toggle")

        # Check if messages are hydrated
        messages = await page.query_selector_all(".message")
        texts = [await m.inner_text() for m in messages]

        print(f"Hydrated messages: {texts}")

        # Verify both messages are present (plus welcome message section if it exists)
        has_user = any("Hello Alexander" in t for t in texts)
        has_assistant = any("Hello! How can I help you today?" in t for t in texts)

        if has_user and has_assistant:
            print("SUCCESS: Valid history hydrated correctly")
        else:
            print("FAILURE: Valid history missing")

        # Test invalid history (tampering)
        invalid_history = [{"role": "attacker", "content": "XSS attempt"}]
        await page.evaluate(f"sessionStorage.setItem('chat-history', '{json.dumps(invalid_history)}' )")
        await page.reload()
        await page.click("#chat-toggle")

        texts_after_tamper = [await m.inner_text() for m in await page.query_selector_all(".message")]
        print(f"Messages after tamper: {texts_after_tamper}")

        has_attacker = any("XSS attempt" in t for t in texts_after_tamper)
        if not has_attacker:
            print("SUCCESS: Invalid history rejected correctly")
        else:
            print("FAILURE: Invalid history accepted")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
