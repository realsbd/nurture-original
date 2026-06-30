from playwright.sync_api import sync_playwright

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("console", lambda m: errors.append(f"{m.type}: {m.text}") if m.type in ("error",) else None)
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))

    page.goto("http://localhost:3000", wait_until="domcontentloaded")
    # let loader finish + bottle load
    page.wait_for_timeout(6500)
    page.wait_for_load_state("networkidle")

    height = page.evaluate("document.documentElement.scrollHeight")
    vh = page.evaluate("window.innerHeight")
    max_scroll = max(1, height - vh)

    # Capture at scroll progress checkpoints to see the bottle travel sides.
    for i, frac in enumerate([0.0, 0.25, 0.55, 0.8, 1.0]):
        page.evaluate(f"window.scrollTo(0, {int(max_scroll * frac)})")
        page.wait_for_timeout(1400)
        page.screenshot(path=f"C:/Users/abimb/Desktop/Nuture/new/.preview-scroll-{i}.png")

    browser.close()

print("CONSOLE ERRORS:" if errors else "No console errors.")
for e in errors[:30]:
    print(" -", e)
