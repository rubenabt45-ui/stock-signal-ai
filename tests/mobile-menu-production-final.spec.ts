import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - Final Production Fix', () => {
  const testViewports = [
    { width: 320, height: 568, name: 'iPhone SE (320px)' },
    { width: 375, height: 667, name: 'iPhone 8 (375px)' },
    { width: 414, height: 896, name: 'iPhone XR (414px)' }
  ];

  testViewports.forEach(({ width, height, name }) => {
    test.describe(`${name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should render all navigation links when menu opens', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Initially menu should be hidden
        await expect(menuContent).not.toBeVisible();

        // Open menu
        await hamburger.click();
        await page.waitForTimeout(350);

        // Verify menu is visible
        await expect(menuContent).toBeVisible();

        // Verify header
        await expect(page.locator('text=Navigation')).toBeVisible();
        await expect(page.locator('[data-testid="menu-close-button"]')).toBeVisible();

        // Verify ALL navigation links are present and visible
        await expect(page.locator('[data-testid="menu-home-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-learn-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-pricing-link"]')).toBeVisible();

        // Verify language selector
        await expect(page.locator('text=Language')).toBeVisible();

        // Verify action buttons
        await expect(page.locator('[data-testid="menu-login-button"]')).toBeVisible();
        await expect(page.locator('[data-testid="menu-signup-button"]')).toBeVisible();

        // Verify link text content
        await expect(page.locator('[data-testid="menu-home-link"] span')).toContainText(/home/i);
        await expect(page.locator('[data-testid="menu-learn-link"] span')).toContainText(/learn/i);
        await expect(page.locator('[data-testid="menu-pricing-link"] span')).toContainText(/pricing/i);
        await expect(page.locator('[data-testid="menu-login-button"]')).toContainText(/login/i);
        await expect(page.locator('[data-testid="menu-signup-button"]')).toContainText(/sign up/i);
      });

      test('should have proper layout and styling', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        await hamburger.click();
        await expect(menuContent).toBeVisible();

        // Check full-screen overlay
        const menuBox = await menuContent.boundingBox();
        expect(menuBox?.width).toBe(width);
        expect(menuBox?.height).toBe(height);
        expect(menuBox?.x).toBe(0);
        expect(menuBox?.y).toBe(0);

        // Check background color
        const bgColor = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        expect(bgColor).toBe('rgb(17, 24, 39)'); // gray-900

        // Check z-index
        const zIndex = await menuContent.evaluate(el => {
          return parseInt(window.getComputedStyle(el).zIndex);
        });
        expect(zIndex).toBe(70);
      });

      test('should have compliant touch targets (min 48px)', async ({ page }) => {
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
          
          // Navigation links should span most of the width
          if (selector.includes('menu-') && !selector.includes('toggle') && !selector.includes('close')) {
            expect(box?.width, `${selector} should be wide`).toBeGreaterThan(width * 0.7);
          }
        }
      });

      test('should close menu with all methods', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        const closeButton = page.locator('[data-testid="menu-close-button"]');

        // Test Escape key
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menuContent).not.toBeVisible();

        // Test close button
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await closeButton.click();
        await expect(menuContent).not.toBeVisible();

        // Test menu item selection
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="menu-home-link"]').click();
        await expect(menuContent).not.toBeVisible();

        // Test outside click (on overlay area)
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await page.locator('[data-testid="mobile-menu-overlay"]').click();
        await expect(menuContent).not.toBeVisible();
      });

      test('should have working navigation links', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        await hamburger.click();

        // Test home link navigation
        const homeLink = page.locator('[data-testid="menu-home-link"]');
        await expect(homeLink).toBeVisible();
        await expect(homeLink).toHaveAttribute('href', '/');

        // Verify icons are present
        await expect(page.locator('[data-testid="menu-home-link"] svg')).toBeVisible();
        await expect(page.locator('[data-testid="menu-learn-link"] svg')).toBeVisible();
        await expect(page.locator('[data-testid="menu-pricing-link"] svg')).toBeVisible();
        await expect(page.locator('[data-testid="menu-login-button"] svg')).toBeVisible();
        await expect(page.locator('[data-testid="menu-signup-button"] svg')).toBeVisible();
      });

      test('should have proper animations', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Check transition duration
        const transitionDuration = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).transitionDuration;
        });
        expect(transitionDuration).toContain('0.3s');

        // Check transition property
        const transitionProperty = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).transitionProperty;
        });
        expect(transitionProperty).toContain('all');

        // Test animation states
        await hamburger.click();
        await page.waitForTimeout(100); // Mid-animation
        await expect(menuContent).toBeVisible();
        
        await page.waitForTimeout(350); // Animation complete
        const opacity = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).opacity;
        });
        expect(parseFloat(opacity)).toBe(1);
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

      test('should handle rapid open/close without errors', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');

        // Rapid toggle test
        for (let i = 0; i < 3; i++) {
          await hamburger.click();
          await page.waitForTimeout(50);
          await hamburger.click();
          await page.waitForTimeout(50);
        }

        // Should end in closed state
        await expect(menuContent).not.toBeVisible();

        // Should still work normally
        await hamburger.click();
        await expect(menuContent).toBeVisible();
        await expect(page.locator('[data-testid="menu-home-link"]')).toBeVisible();
      });
    });
  });

  test('Visual regression - all content renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
    
    // Screenshot closed state
    const closedScreenshot = await page.screenshot({ 
      fullPage: true,
      clip: { x: 0, y: 0, width: 375, height: 667 }
    });
    expect(closedScreenshot).toBeTruthy();

    // Screenshot open state
    await hamburger.click();
    await page.waitForTimeout(350);
    
    const openScreenshot = await page.screenshot({ 
      fullPage: true,
      clip: { x: 0, y: 0, width: 375, height: 667 }
    });
    expect(openScreenshot).toBeTruthy();

    // Verify all elements are actually rendered
    const elementCounts = await page.evaluate(() => {
      const menu = document.querySelector('[data-testid="mobile-menu-content"]');
      if (!menu) return { total: 0 };
      
      return {
        total: menu.querySelectorAll('*').length,
        links: menu.querySelectorAll('[data-testid^="menu-"]').length,
        buttons: menu.querySelectorAll('button').length,
        text: menu.textContent?.trim().length || 0
      };
    });

    expect(elementCounts.total).toBeGreaterThan(20);
    expect(elementCounts.links).toBeGreaterThanOrEqual(5);
    expect(elementCounts.buttons).toBeGreaterThanOrEqual(3);
    expect(elementCounts.text).toBeGreaterThan(50);
  });
});