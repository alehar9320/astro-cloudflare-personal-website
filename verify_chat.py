import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Start the dev server in the background
        import subprocess
        import time
        import os

        # Kill existing
        os.system("kill $(lsof -t -i :4321) 2>/dev/null || true")

        process = subprocess.Popen(["npm", "run", "dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # Wait for server
        for _ in range(30):
            try:
                await page.goto("http://localhost:4321")
                break
            except:
                await asyncio.sleep(1)

        # Open Chat
        await page.click("#chat-toggle")
        await asyncio.sleep(1)

        # Type message
        await page.fill("#chat-input", "Hello! How are you?")
        await page.screenshot(path="chat_open.png")

        # Send message
        await page.press("#chat-input", "Enter")
        await asyncio.sleep(2)
        await page.screenshot(path="chat_sent.png")

        # Close Chat
        await page.click("#chat-close")
        await asyncio.sleep(1)
        await page.screenshot(path="chat_closed.png")

        process.terminate()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
