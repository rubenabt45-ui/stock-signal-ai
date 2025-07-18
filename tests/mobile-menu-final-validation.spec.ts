import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - Final Validation', () => {
  const mobileViewports = [
    { width: 320, height: 568, name: 'iPhone SE' },
    { width: 375, height: 667, name: 'iPhone 8' },
    { width: 414, height: 896, name: 'iPhone XR' },
    { width: 768, height: 1024, name: 'iPad' }
  ];

  mobileViewports.forEach(({ width, height, name }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should have no debug indicators visible', async ({ page }) => {
        // Check for any debug elements
        const debugElements = page.locator('[data-testid="menu-debug-state"]');
        await expect(debugElements).toHaveCount(0);
        
        // Check for any elements with debug-related text
        const debugText = page.locator('text=/MENU: (OPEN|CLOSED)/');
        await expect(debugText).toHaveCount(0);
        
        // Check for any red debug badges
        const redBadges = page.locator('.bg-red-600, .bg-red-500');
        await expect(redBadges).toHaveCount(0);
      });

      test('should open menu with full content visible', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        // Open menu
        await hamburger.click();
        
        // Wait for animation to complete
        await page.waitForTimeout(350);
        
        // Verify menu is fully visible
        await expect(menuContent).toBeVisible();
        await expect(overlay).toBeVisible();
        
        // Verify all navigation elements are visible
        await expect(page.locator('[data-testid="menu-home-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-learn-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-pricing-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-login-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-signup-button"]')).toBeVisible();
        
        // Verify language selector is visible
        await expect(page.locator('text=Language')).toBeVisible();
      });

      test('should close menu with all methods', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
        const closeButton = page.locator('[data-testid="menu-close-button"]');

        // Test 1: Close with hamburger toggle
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await hamburger.click();
        await expect(menuContent).not.toBeVisible();

        // Test 2: Close with X button
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await closeButton.click();
        await expect(menuContent).not.toBeVisible();

        // Test 3: Close with Escape key
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeVisible();

        // Test 4: Close with outside click
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await overlay.click();
        await expect(menuContent).not.toBeVisible();

        // Test 5: Close with menu item selection
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-home-link"]').click();
        await expect(menuContent).not.toBeVisible();
      });

      test('should have proper touch targets (48px minimum)', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await hamburger.click();

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
          expect(box?.height, `${selector} height`).toBeGreaterThanOrEqual(48);
          expect(box?.width, `${selector} width`).toBeGreaterThanOrEqual(48);
        }
      });

      test('should prevent body scroll when open', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Check body scroll is enabled initially
        let bodyOverflow = await page.evaluate(() => document.body.style.overflow);
        expect(bodyOverflow).toBe('');

        // Open menu and check body scroll is disabled
        await hamburger.click();
        bodyOverflow = await page.evaluate(() => document.body.style.overflow);
        expect(bodyOverflow).toBe('hidden');

        // Close menu and check body scroll is restored
        await page.keyboard.press('Escape');
        bodyOverflow = await page.evaluate(() => document.body.style.overflow);
        expect(bodyOverflow).toBe('');
      });

      test('should have proper dark theme styling', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        await hamburger.click();

        // Check overlay has dark background
        const overlayColor = await overlay.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.backgroundColor;
        });
        expect(overlayColor).toContain('0, 0, 0'); // Should contain black

        // Check menu has dark background
        const menuColor = await menuContent.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.backgroundColor;
        });
        expect(menuColor).not.toBe('rgb(255, 255, 255)'); // Should not be white
        
        // Check text is light colored
        const homeLink = page.locator('[data-testid="menu-home-link"]');
        const textColor = await homeLink.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.color;
        });
        expect(textColor).toContain('255'); // Should contain white components
      });

      test('should have smooth animations', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Check transition properties
        const transitionDuration = await menuContent.evaluate((el) => {
          return window.getComputedStyle(el).transitionDuration;
        });
        expect(transitionDuration).toContain('0.3s');

        const transitionProperty = await menuContent.evaluate((el) => {
          return window.getComputedStyle(el).transitionProperty;
        });
        expect(transitionProperty).toContain('all');
      });

      test('should have correct z-index layering', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        await hamburger.click();

        const hamburgerZ = await hamburger.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex));
        const menuZ = await menuContent.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex));
        const overlayZ = await overlay.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex));

        // Hamburger (60) > Menu (50) > Overlay (40)
        expect(hamburgerZ).toBeGreaterThan(menuZ);
        expect(menuZ).toBeGreaterThan(overlayZ);
      });

      test('should not have white box artifacts', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await hamburger.click();

        // Take screenshot to visually verify no white boxes
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toBeTruthy();

        // Check for any unexpected white backgrounds
        const whiteElements = await page.$$eval('*', (elements) => {
          return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            return styles.backgroundColor === 'rgb(255, 255, 255)' && 
                   styles.display !== 'none' && 
                   styles.visibility !== 'hidden';
          }).length;
        });
        
        // Should have minimal or no pure white elements in dark theme
        expect(whiteElements).toBeLessThan(3);
      });

      test('should handle focus management correctly', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Focus hamburger button
        await hamburger.focus();
        await expect(hamburger).toBeFocused();

        // Open menu with Enter key
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-testid="mobile-menu-content"]')).toBeVisible();

        // Close with Escape and check focus returns to hamburger
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-testid="mobile-menu-content"]')).not.toBeVisible();
        await expect(hamburger).toBeFocused();
      });
    });
  });

  test('Cross-browser validation', async ({ page, browserName }) => {
    console.log(`Testing mobile menu on ${browserName}`);
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
    const menuContent = page.locator('[data-testid="mobile-menu-content"]');

    // Basic functionality test
    await hamburger.click();
    await expect(menuContent).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(menuContent).not.toBeVisible();
    
    console.log(`✅ Mobile menu validated successfully on ${browserName}`);
  });
});