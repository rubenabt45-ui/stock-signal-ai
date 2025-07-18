import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - Production Ready', () => {
  const viewports = [
    { width: 320, height: 568, name: 'iPhone SE' },
    { width: 375, height: 667, name: 'iPhone 8' },
    { width: 414, height:896, name: 'iPhone XR' },
    { width: 768, height: 1024, name: 'iPad' }
  ];

  viewports.forEach(({ width, height, name }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should not show debug label in production', async ({ page }) => {
        // Ensure debug state indicator is not present
        const debugLabel = page.locator('[data-testid="menu-debug-state"]');
        await expect(debugLabel).not.toBeVisible();
      });

      test('should open and close menu with proper visibility', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        // Initial state - menu should be closed
        await expect(menuContent).not.toBeVisible();
        await expect(overlay).not.toBeVisible();

        // Open menu
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await expect(overlay).toBeVisible();

        // Verify all navigation links are visible
        await expect(page.locator('[data-testid="menu-home-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-learn-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-pricing-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-login-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-signup-button"]')).toBeVisible();

        // Close menu by clicking hamburger again
        await hamburger.click();
        await expect(menuContent).not.toBeVisible();
        await expect(overlay).not.toBeVisible();
      });

      test('should close menu with Escape key', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Open menu
        await hamburger.click();
        await expect(menuContent).toBeVisible();

        // Close with Escape key
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeVisible();
      });

      test('should close menu when clicking outside', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        // Open menu
        await hamburger.click();
        await expect(menuContent).toBeVisible();

        // Click on overlay to close
        await overlay.click();
        await expect(menuContent).not.toBeVisible();
      });

      test('should have proper touch targets (48px minimum)', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await hamburger.click();

        // Check all interactive elements have adequate touch targets
        const touchTargets = [
          '[data-testid="mobile-menu-toggle"]',
          '[data-testid="menu-close-button"]',
          '[data-testid="menu-home-link"]',
          '[data-testid="menu-learn-link"]',
          '[data-testid="menu-pricing-link"]',
          '[data-testid="menu-login-button"]',
          '[data-testid="menu-signup-button"]'
        ];

        for (const selector of touchTargets) {
          const element = page.locator(selector);
          const box = await element.boundingBox();
          expect(box?.height).toBeGreaterThanOrEqual(48);
        }
      });

      test('should have proper dark mode styling', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        await hamburger.click();
        await expect(menuContent).toBeVisible();

        // Check dark background colors are applied
        const menuBackground = await menuContent.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Should have dark background (not white)
        expect(menuBackground).not.toBe('rgb(255, 255, 255)');
      });

      test('should animate smoothly without visual artifacts', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Check transition properties are set
        await hamburger.click();
        
        const transitionDuration = await menuContent.evaluate((el) => {
          return window.getComputedStyle(el).transitionDuration;
        });
        
        // Should have transition duration set (300ms = 0.3s)
        expect(transitionDuration).toContain('0.3s');
      });

      test('should have proper z-index layering', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        await hamburger.click();

        // Check z-index values
        const hamburgerZIndex = await hamburger.evaluate((el) => {
          return window.getComputedStyle(el).zIndex;
        });
        
        const menuZIndex = await menuContent.evaluate((el) => {
          return window.getComputedStyle(el).zIndex;
        });
        
        const overlayZIndex = await overlay.evaluate((el) => {
          return window.getComputedStyle(el).zIndex;
        });

        // Hamburger should be highest, then menu, then overlay
        expect(parseInt(hamburgerZIndex)).toBeGreaterThan(parseInt(menuZIndex));
        expect(parseInt(menuZIndex)).toBeGreaterThan(parseInt(overlayZIndex));
      });

      test('should handle menu item clicks correctly', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const homeLink = page.locator('[data-testid="menu-home-link"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        await hamburger.click();
        await expect(menuContent).toBeVisible();

        // Click home link should close menu
        await homeLink.click();
        await expect(menuContent).not.toBeVisible();
      });
    });
  });

  test('Cross-browser compatibility', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
    const menuContent = page.locator('[data-testid="mobile-menu-content"]');

    // Test basic functionality across browsers
    await hamburger.click();
    await expect(menuContent).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(menuContent).not.toBeVisible();
    
    console.log(`✅ Mobile menu working correctly on ${browserName}`);
  });
});