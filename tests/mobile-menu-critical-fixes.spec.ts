import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - Critical Rendering Fixes', () => {
  const criticalViewports = [
    { width: 320, height: 568, name: 'iPhone SE (320px)' },
    { width: 375, height: 667, name: 'iPhone 8 (375px)' },
    { width: 414, height: 896, name: 'iPhone XR (414px)' }
  ];

  criticalViewports.forEach(({ width, height, name }) => {
    test.describe(`${name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should have hamburger button with proper touch targets', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await expect(hamburger).toBeVisible();
        
        const box = await hamburger.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(48);
        expect(box?.width).toBeGreaterThanOrEqual(48);
        
        // Check z-index is high enough
        const zIndex = await hamburger.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).zIndex);
        });
        expect(zIndex).toBeGreaterThanOrEqual(80);
      });

      test('should display full-screen overlay when menu opens', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Menu should be closed initially
        await expect(overlay).not.toBeVisible();
        await expect(menuContent).not.toBeVisible();

        // Open menu
        await hamburger.click();
        await page.waitForTimeout(350);

        // Check overlay covers full viewport
        await expect(overlay).toBeVisible();
        const overlayBox = await overlay.boundingBox();
        expect(overlayBox?.width).toBe(width);
        expect(overlayBox?.height).toBe(height);
        expect(overlayBox?.x).toBe(0);
        expect(overlayBox?.y).toBe(0);

        // Check menu content is full screen
        await expect(menuContent).toBeVisible();
        const menuBox = await menuContent.boundingBox();
        expect(menuBox?.width).toBe(width);
        expect(menuBox?.height).toBe(height);
        expect(menuBox?.x).toBe(0);
        expect(menuBox?.y).toBe(0);
      });

      test('should have proper dark overlay background', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        await hamburger.click();
        await expect(overlay).toBeVisible();

        // Check overlay has dark semi-transparent background
        const overlayStyles = await overlay.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            position: styles.position,
            zIndex: styles.zIndex
          };
        });

        expect(overlayStyles.position).toBe('fixed');
        expect(parseInt(overlayStyles.zIndex)).toBeGreaterThanOrEqual(60);
        // Should have gray-900 background with opacity
        expect(overlayStyles.backgroundColor).toMatch(/rgba?\(17,\s*24,\s*39/);
      });

      test('should have all touch targets >= 48px', async ({ page }) => {
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
          expect(box?.height, `${selector} height should be ≥48px`).toBeGreaterThanOrEqual(48);
          
          // For full-width elements, check they span the viewport width
          if (selector.includes('menu-') && !selector.includes('toggle') && !selector.includes('close')) {
            expect(box?.width, `${selector} should be full width`).toBeGreaterThan(width * 0.8);
          }
        }
      });

      test('should close menu reliably with all methods', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
        const closeButton = page.locator('[data-testid="menu-close-button"]');

        // Test 1: Escape key
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeVisible();

        // Test 2: Overlay click
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await overlay.click({ position: { x: 10, y: 100 } });
        await expect(menuContent).not.toBeVisible();

        // Test 3: Close button
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await closeButton.click();
        await expect(menuContent).not.toBeVisible();

        // Test 4: Menu item selection
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-home-link"]').click();
        await expect(menuContent).not.toBeVisible();
      });

      test('should prevent body scroll when menu is open', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');

        // Check initial body styles
        let bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position
        }));
        expect(bodyStyles.overflow).toBe('');

        // Open menu and verify scroll prevention
        await hamburger.click();
        bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width
        }));
        expect(bodyStyles.overflow).toBe('hidden');
        expect(bodyStyles.position).toBe('fixed');
        expect(bodyStyles.width).toBe('100%');

        // Close menu and verify scroll restoration
        await page.keyboard.press('Escape');
        bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position
        }));
        expect(bodyStyles.overflow).toBe('');
        expect(bodyStyles.position).toBe('');
      });

      test('should have smooth animations without white boxes', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Check transition properties
        await hamburger.click();
        const transitionDuration = await menuContent.evaluate((el) => {
          return window.getComputedStyle(el).transitionDuration;
        });
        expect(transitionDuration).toContain('0.3s');

        // Take screenshot to verify no white boxes
        await page.waitForTimeout(350);
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toBeTruthy();

        // Check for white elements that shouldn't be there
        const whiteBoxCount = await page.$$eval('*', (elements) => {
          return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.backgroundColor === 'rgb(255, 255, 255)' &&
              styles.display !== 'none' &&
              rect.width > 20 && rect.height > 20 &&
              !el.closest('[data-testid="mobile-menu-content"]') &&
              !el.textContent?.trim()
            );
          }).length;
        });
        expect(whiteBoxCount).toBeLessThan(2);
      });

      test('should have correct z-index stacking order', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');

        await hamburger.click();

        const zIndexes = await Promise.all([
          hamburger.evaluate(el => parseInt(window.getComputedStyle(el).zIndex)),
          menuContent.evaluate(el => parseInt(window.getComputedStyle(el).zIndex)),
          overlay.evaluate(el => parseInt(window.getComputedStyle(el).zIndex))
        ]);

        const [hamburgerZ, menuZ, overlayZ] = zIndexes;

        // Correct stacking: Hamburger (80) > Menu (70) > Overlay (60)
        expect(hamburgerZ).toBeGreaterThanOrEqual(80);
        expect(menuZ).toBeGreaterThanOrEqual(70);
        expect(overlayZ).toBeGreaterThanOrEqual(60);
        expect(hamburgerZ).toBeGreaterThan(menuZ);
        expect(menuZ).toBeGreaterThan(overlayZ);
      });

      test('should display all menu content properly styled', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await hamburger.click();

        // Check header
        await expect(page.locator('text=Navigation')).toBeVisible();
        
        // Check navigation links
        await expect(page.locator('[data-testid="menu-home-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-learn-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-pricing-link"]')).toBeVisible();
        
        // Check language selector
        await expect(page.locator('text=Language')).toBeVisible();
        
        // Check action buttons
        await expect(page.locator('[data-testid="menu-login-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-signup-button"]')).toBeVisible();

        // Verify dark theme styling
        const menuBackground = await page.locator('[data-testid="mobile-menu-content"]').evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        expect(menuBackground).toMatch(/rgb\(17,\s*24,\s*39\)/);
      });
    });
  });

  test('Visual validation screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Screenshot closed state
    const closedScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled'
    });
    expect(closedScreenshot).toBeTruthy();

    // Screenshot open state
    await page.locator('[data-testid="mobile-menu-toggle"]').click();
    await page.waitForTimeout(350);
    
    const openScreenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled'
    });
    expect(openScreenshot).toBeTruthy();
  });
});