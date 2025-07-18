import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - White Box Elimination Test', () => {
  const testViewports = [
    { width: 320, height: 568, name: 'iPhone SE' },
    { width: 375, height: 667, name: 'iPhone 8' },
    { width: 414, height: 896, name: 'iPhone XR' }
  ];

  testViewports.forEach(({ width, height, name }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should have no menu artifacts when closed', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const menuOverlay = page.locator('[data-testid="mobile-menu-overlay"]');

        // Verify hamburger button is visible
        await expect(hamburger).toBeVisible();

        // Menu content should not exist in DOM when closed
        await expect(menuContent).not.toBeAttached();
        await expect(menuOverlay).not.toBeAttached();

        // Check for any white boxes in the viewport
        const whiteBoxes = await page.$$eval('*', (elements) => {
          return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.backgroundColor === 'rgb(255, 255, 255)' &&
              styles.display !== 'none' &&
              styles.visibility !== 'hidden' &&
              rect.width > 20 && rect.height > 20 &&
              rect.top >= 0 && rect.left >= 0
            );
          }).length;
        });
        expect(whiteBoxes).toBe(0);
      });

      test('should render complete menu when opened', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Open menu
        await hamburger.click();
        await page.waitForTimeout(350);

        // Menu should be visible and cover full viewport
        await expect(menuContent).toBeVisible();
        
        const menuBox = await menuContent.boundingBox();
        expect(menuBox?.width).toBe(width);
        expect(menuBox?.height).toBe(height);
        expect(menuBox?.x).toBe(0);
        expect(menuBox?.y).toBe(0);

        // Verify all navigation elements are present
        await expect(page.locator('text=Navigation')).toBeVisible();
        await expect(page.locator('[data-testid="menu-close-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-home-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-learn-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-pricing-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-login-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-signup-button"]')).toBeVisible();
        await expect(page.locator('text=Language')).toBeVisible();
      });

      test('should have proper dark background when open', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        await hamburger.click();
        await expect(menuContent).toBeVisible();

        // Check background color is exact dark theme color
        const backgroundColor = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Should be #09090b which is rgb(9, 9, 11)
        expect(backgroundColor).toBe('rgb(9, 9, 11)');
        
        // Check z-index
        const zIndex = await menuContent.evaluate(el => {
          return parseInt(window.getComputedStyle(el).zIndex);
        });
        expect(zIndex).toBe(70);
      });

      test('should close completely with all methods', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Test 1: Close with Escape key
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeAttached();

        // Test 2: Close with close button
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-close-button"]').click();
        await expect(menuContent).not.toBeAttached();

        // Test 3: Close with background click
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await menuContent.click({ position: { x: 10, y: 100 } });
        await expect(menuContent).not.toBeAttached();

        // Test 4: Close with menu item selection
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-home-link"]').click();
        await expect(menuContent).not.toBeAttached();
      });

      test('should have compliant touch targets', async ({ page }) => {
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
          await expect(element).toBeVisible();
          
          const box = await element.boundingBox();
          expect(box?.height, `${selector} height`).toBeGreaterThanOrEqual(48);
          expect(box?.width, `${selector} width`).toBeGreaterThanOrEqual(48);
        }
      });

      test('should prevent body scroll when open', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');

        // Check initial state
        let bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position
        }));
        expect(bodyStyles.overflow).toBe('');

        // Open menu and check scroll prevention
        await hamburger.click();
        bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width
        }));
        expect(bodyStyles.overflow).toBe('hidden');
        expect(bodyStyles.position).toBe('fixed');
        expect(bodyStyles.width).toBe('100%');

        // Close and check restoration
        await page.keyboard.press('Escape');
        bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position
        }));
        expect(bodyStyles.overflow).toBe('');
        expect(bodyStyles.position).toBe('');
      });

      test('should not leave any empty containers after close', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');

        // Open and close menu multiple times
        for (let i = 0; i < 3; i++) {
          await hamburger.click();
          await page.waitForTimeout(100);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(100);
        }

        // Check for any orphaned menu elements
        const orphanedElements = await page.$$eval('[id*="menu"], [data-testid*="menu"]', (elements) => {
          return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              el.id !== 'mobile-menu-toggle' &&
              !el.dataset.testId?.includes('toggle') &&
              (
                styles.display !== 'none' ||
                styles.visibility !== 'hidden' ||
                rect.width > 0 || rect.height > 0
              )
            );
          }).length;
        });
        expect(orphanedElements).toBe(0);
      });

      test('should have smooth open/close animations', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');

        await hamburger.click();
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        
        // Check transition properties
        const transitionDuration = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).transitionDuration;
        });
        expect(transitionDuration).toContain('0.3s');

        // Verify opacity during animation
        const opacity = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).opacity;
        });
        expect(parseFloat(opacity)).toBe(1);
      });
    });
  });

  test('Visual regression test - no white artifacts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Screenshot closed state
    const closedScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled'
    });
    expect(closedScreenshot).toBeTruthy();

    // Screenshot open state
    const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
    await hamburger.click();
    await page.waitForTimeout(350);
    
    const openScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled'
    });
    expect(openScreenshot).toBeTruthy();

    // Verify no white boxes in open state
    const whiteBoxCount = await page.$$eval('*', (elements) => {
      return elements.filter(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          styles.backgroundColor === 'rgb(255, 255, 255)' &&
          styles.display !== 'none' &&
          rect.width > 30 && rect.height > 30 &&
          !el.textContent?.trim() &&
          rect.top >= 0 && rect.left >= 0
        );
      }).length;
    });
    expect(whiteBoxCount).toBe(0);

    // Close and verify clean state
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    
    const finalScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled'
    });
    expect(finalScreenshot).toBeTruthy();
  });
});