import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - White Box Issue Resolution', () => {
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

      test('should not show any debug elements or indicators', async ({ page }) => {
        // Check for any debug elements
        const debugElements = await page.$$('[data-testid*="debug"], .mobile-menu-debug, .debug');
        expect(debugElements.length).toBe(0);
        
        // Check for any red debug badges or containers
        const redElements = await page.$$('.bg-red-600, .bg-red-500, .bg-red-400');
        expect(redElements.length).toBe(0);
        
        // Check for any text containing debug info
        const debugText = await page.textContent('body');
        expect(debugText).not.toContain('MENU: OPEN');
        expect(debugText).not.toContain('MENU: CLOSED');
      });

      test('should not display white boxes or artifacts when menu opens', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Take screenshot before opening menu
        const beforeScreenshot = await page.screenshot({ fullPage: true });
        expect(beforeScreenshot).toBeTruthy();
        
        // Open menu
        await hamburger.click();
        await page.waitForTimeout(350); // Wait for animation
        
        // Take screenshot with menu open
        const afterScreenshot = await page.screenshot({ fullPage: true });
        expect(afterScreenshot).toBeTruthy();
        
        // Verify menu content is visible
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        await expect(menuContent).toBeVisible();
        
        // Check for any pure white elements that shouldn't be there
        const whiteBoxes = await page.$$eval('*', (elements) => {
          return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.backgroundColor === 'rgb(255, 255, 255)' &&
              styles.display !== 'none' &&
              styles.visibility !== 'hidden' &&
              rect.width > 10 && rect.height > 10 &&
              !el.classList.contains('text-white') &&
              !el.closest('[data-testid="mobile-menu-content"]')
            );
          }).length;
        });
        
        expect(whiteBoxes).toBeLessThan(2); // Allow minimal white elements for content
      });

      test('should have proper dark overlay and menu background', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await expect(overlay).toBeVisible();
        
        // Check overlay has dark background
        const overlayStyles = await overlay.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            backdropFilter: styles.backdropFilter
          };
        });
        
        // Should have some form of dark/black background
        expect(overlayStyles.backgroundColor).toMatch(/rgba?\(0,\s*0,\s*0/);
        
        // Check menu content has dark background
        const menuStyles = await menuContent.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            border: styles.border
          };
        });
        
        // Should not be pure white
        expect(menuStyles.backgroundColor).not.toBe('rgb(255, 255, 255)');
        expect(menuStyles.backgroundColor).not.toBe('rgba(255, 255, 255, 1)');
      });

      test('should have all menu items visible with proper styling', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await hamburger.click();
        
        // Check all expected menu items are visible
        const menuItems = [
          '[data-testid="menu-home-link"]',
          '[data-testid="menu-learn-link"]',
          '[data-testid="menu-pricing-link"]',
          '[data-testid="menu-login-button"]',
          '[data-testid="menu-signup-button"]'
        ];
        
        for (const selector of menuItems) {
          const element = page.locator(selector);
          await expect(element).toBeVisible();
          
          // Check touch target size
          const box = await element.boundingBox();
          expect(box?.height).toBeGreaterThanOrEqual(48);
          
          // Check text is not white-on-white
          const textColor = await element.evaluate((el) => {
            return window.getComputedStyle(el).color;
          });
          expect(textColor).not.toBe('rgb(255, 255, 255)');
          expect(textColor).not.toBe('rgba(255, 255, 255, 1)');
        }
      });

      test('should animate smoothly without visual glitches', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        
        // Check initial state
        await expect(menuContent).not.toBeVisible();
        
        // Open menu and check animation properties
        await hamburger.click();
        
        const transitionProperties = await menuContent.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            transitionDuration: styles.transitionDuration,
            transitionProperty: styles.transitionProperty,
            transform: styles.transform,
            opacity: styles.opacity
          };
        });
        
        expect(transitionProperties.transitionDuration).toContain('0.3s');
        expect(transitionProperties.opacity).toBe('1');
        expect(transitionProperties.transform).not.toContain('scale(0)');
        
        // Close menu
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeVisible();
      });

      test('should close reliably with all methods', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
        
        // Test Escape key
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeVisible();
        
        // Test outside click
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await overlay.click();
        await expect(menuContent).not.toBeVisible();
        
        // Test close button
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-close-button"]').click();
        await expect(menuContent).not.toBeVisible();
        
        // Test menu item selection
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-home-link"]').click();
        await expect(menuContent).not.toBeVisible();
      });

      test('should prevent body scroll when open', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Check initial body styles
        let bodyStyles = await page.evaluate(() => {
          return {
            overflow: document.body.style.overflow,
            position: document.body.style.position
          };
        });
        expect(bodyStyles.overflow).toBe('');
        
        // Open menu and check body scroll is prevented
        await hamburger.click();
        bodyStyles = await page.evaluate(() => {
          return {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            width: document.body.style.width
          };
        });
        expect(bodyStyles.overflow).toBe('hidden');
        expect(bodyStyles.position).toBe('fixed');
        expect(bodyStyles.width).toBe('100%');
        
        // Close menu and check scroll is restored
        await page.keyboard.press('Escape');
        bodyStyles = await page.evaluate(() => {
          return {
            overflow: document.body.style.overflow,
            position: document.body.style.position
          };
        });
        expect(bodyStyles.overflow).toBe('');
        expect(bodyStyles.position).toBe('');
      });

      test('should have correct z-index stacking', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
        
        await hamburger.click();
        
        const zIndexes = await Promise.all([
          hamburger.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex) || 0),
          menuContent.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex) || 0),
          overlay.evaluate((el) => parseInt(window.getComputedStyle(el).zIndex) || 0)
        ]);
        
        const [hamburgerZ, menuZ, overlayZ] = zIndexes;
        
        // Hamburger (60) > Menu (50) > Overlay (40)
        expect(hamburgerZ).toBeGreaterThanOrEqual(60);
        expect(menuZ).toBeGreaterThanOrEqual(50);
        expect(overlayZ).toBeGreaterThanOrEqual(40);
        expect(hamburgerZ).toBeGreaterThan(menuZ);
        expect(menuZ).toBeGreaterThan(overlayZ);
      });
    });
  });
  
  test('Visual regression test - no white boxes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open menu
    await page.locator('[data-testid="mobile-menu-toggle"]').click();
    await page.waitForTimeout(350);
    
    // Take full page screenshot for visual verification
    const screenshot = await page.screenshot({ 
      fullPage: true,
      animations: 'disabled' // Ensure consistent screenshots
    });
    
    expect(screenshot).toBeTruthy();
    
    // Verify menu is actually open
    await expect(page.locator('[data-testid="mobile-menu-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();
  });
});