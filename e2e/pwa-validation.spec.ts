import { test, expect } from "@playwright/test";

test.describe("PWA Validation", () => {
  test("manifest.json is accessible and valid", async ({ page }) => {
    const response = await page.goto("/manifest.json");
    expect(response?.status()).toBe(200);

    const manifest = await response?.json();
    expect(manifest.name).toBe("Clean Gains");
    expect(manifest.short_name).toBe("Clean Gains");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);

    // Check for required icon sizes
    const iconSizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(iconSizes).toContain("192x192");
    expect(iconSizes).toContain("512x512");
  });

  test("app icons are accessible", async ({ page }) => {
    const icon192 = await page.goto("/icons/icon-192.png");
    expect(icon192?.status()).toBe(200);

    const icon512 = await page.goto("/icons/icon-512.png");
    expect(icon512?.status()).toBe(200);

    const appleTouchIcon = await page.goto("/icons/apple-touch-icon.png");
    expect(appleTouchIcon?.status()).toBe(200);
  });

  test("offline page exists", async ({ page }) => {
    await page.goto("/~offline");
    await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("timer sound file is accessible", async ({ page }) => {
    const response = await page.goto("/sounds/timer-complete.mp3");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("audio");
  });

  test("PWA meta tags are present", async ({ page }) => {
    await page.goto("/");

    // Check for apple-mobile-web-app-capable
    const appleCapable = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(appleCapable).toHaveAttribute("content", "yes");

    // Check for theme-color
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toBeAttached();

    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", "/manifest.json");

    // Check for apple-touch-icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toBeAttached();
  });
});

test.describe("Touch Target Validation", () => {
  test("bottom navigation has proper touch targets", async ({ page }) => {
    await page.goto("/");

    const navLinks = page.locator("nav a");
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("workout page buttons have proper touch targets", async ({ page }) => {
    await page.goto("/workout");

    // Check primary action buttons
    const buttons = page.locator("button");
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});

test.describe("Core Navigation", () => {
  test("can navigate to all main pages", async ({ page }) => {
    // Home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Workout
    await page.click('a[href="/workout"]');
    await expect(page).toHaveURL("/workout");

    // Progress
    await page.click('a[href="/progress"]');
    await expect(page).toHaveURL("/progress");

    // Settings
    await page.click('a[href="/settings"]');
    await expect(page).toHaveURL("/settings");
  });
});
