import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Cross-Browser Tests', () => {
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Android Medium', width: 360, height: 740 },
    { name: 'iPad Mini', width: 768, height: 1024 }
  ];

  viewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('should display hamburger menu button', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        await expect(menuButton).toBeVisible();
        
        // Verify hamburger icon animation structure
        const hamburgerLines = page.locator('[aria-label*="navigation menu"] span');
        await expect(hamburgerLines).toHaveCount(3);
      });

      test('should open menu with proper animations', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const dropdown = page.locator('#mobile-dropdown-menu');
        
        // Menu should be hidden initially
        await expect(dropdown).not.toBeVisible();
        
        // Click to open menu
        await menuButton.click();
        
        // Wait for animation to complete
        await page.waitForTimeout(400);
        
        // Menu should be visible with proper attributes
        await expect(dropdown).toBeVisible();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        await expect(dropdown).toHaveAttribute('aria-hidden', 'false');
      });

      test('should close menu when clicking outside', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const dropdown = page.locator('#mobile-dropdown-menu');
        const overlay = page.locator('.fixed.inset-0.bg-black\\/20');
        
        // Open menu
        await menuButton.click();
        await expect(dropdown).toBeVisible();
        
        // Click on overlay to close
        await overlay.click();
        
        // Wait for close animation
        await page.waitForTimeout(400);
        
        // Menu should be closed
        await expect(dropdown).not.toBeVisible();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      });

      test('should close menu when selecting navigation item', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const dropdown = page.locator('#mobile-dropdown-menu');
        
        // Open menu
        await menuButton.click();
        await expect(dropdown).toBeVisible();
        
        // Click on a navigation item
        const homeLink = page.locator('[role="menuitem"]:has-text("Home")');
        await homeLink.click();
        
        // Menu should close automatically
        await page.waitForTimeout(400);
        await expect(dropdown).not.toBeVisible();
      });

      test('should close menu with escape key', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const dropdown = page.locator('#mobile-dropdown-menu');
        
        // Open menu
        await menuButton.click();
        await expect(dropdown).toBeVisible();
        
        // Press escape key
        await page.keyboard.press('Escape');
        
        // Menu should close and focus should return to button
        await page.waitForTimeout(400);
        await expect(dropdown).not.toBeVisible();
        await expect(menuButton).toBeFocused();
      });

      test('should prevent body scroll when menu is open', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        
        // Check initial body styles
        const initialOverflow = await page.evaluate(() => document.body.style.overflow);
        
        // Open menu
        await menuButton.click();
        await page.waitForTimeout(200);
        
        // Body should have scroll prevention
        const bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width
        }));
        
        expect(bodyStyles.overflow).toBe('hidden');
        expect(bodyStyles.position).toBe('fixed');
        expect(bodyStyles.width).toBe('100%');
        
        // Close menu
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        
        // Body styles should be restored
        const restoredStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width
        }));
        
        expect(restoredStyles.overflow).toBe('');
        expect(restoredStyles.position).toBe('');
        expect(restoredStyles.width).toBe('');
      });

      test('should have proper touch targets', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        
        // Menu button should meet touch target requirements
        const buttonBox = await menuButton.boundingBox();
        expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
        expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
        
        // Open menu and check menu items
        await menuButton.click();
        await page.waitForTimeout(200);
        
        const menuItems = page.locator('[role="menuitem"]');
        const itemCount = await menuItems.count();
        
        for (let i = 0; i < itemCount; i++) {
          const itemBox = await menuItems.nth(i).boundingBox();
          expect(itemBox?.height).toBeGreaterThanOrEqual(44);
        }
      });

      test('should have proper keyboard navigation', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        
        // Focus menu button with tab
        await page.keyboard.press('Tab');
        await expect(menuButton).toBeFocused();
        
        // Open menu with enter
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);
        
        const dropdown = page.locator('#mobile-dropdown-menu');
        await expect(dropdown).toBeVisible();
        
        // Navigate through menu items with tab
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toHaveAttribute('role', 'menuitem');
      });

      test('should maintain proper z-index layering', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        
        // Open menu
        await menuButton.click();
        await page.waitForTimeout(200);
        
        // Check z-index values
        const zIndexes = await page.evaluate(() => {
          const button = document.querySelector('[aria-label*="navigation menu"]') as HTMLElement;
          const dropdown = document.querySelector('#mobile-dropdown-menu') as HTMLElement;
          const overlay = document.querySelector('.fixed.inset-0.bg-black\\/20') as HTMLElement;
          
          return {
            button: window.getComputedStyle(button).zIndex,
            dropdown: window.getComputedStyle(dropdown).zIndex,
            overlay: window.getComputedStyle(overlay).zIndex
          };
        });
        
        // Verify proper layering
        expect(parseInt(zIndexes.button)).toBeGreaterThan(parseInt(zIndexes.dropdown));
        expect(parseInt(zIndexes.dropdown)).toBeGreaterThan(parseInt(zIndexes.overlay));
      });

      test('should handle rapid open/close interactions', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const dropdown = page.locator('#mobile-dropdown-menu');
        
        // Rapidly toggle menu multiple times
        for (let i = 0; i < 3; i++) {
          await menuButton.click();
          await page.waitForTimeout(100);
          await menuButton.click();
          await page.waitForTimeout(100);
        }
        
        // Final state should be consistent
        await page.waitForTimeout(500);
        const isVisible = await dropdown.isVisible();
        const ariaExpanded = await menuButton.getAttribute('aria-expanded');
        
        if (isVisible) {
          expect(ariaExpanded).toBe('true');
        } else {
          expect(ariaExpanded).toBe('false');
        }
      });

    });
  });

  test('should work consistently across different browsers', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuButton = page.locator('[aria-label*="navigation menu"]');
    const dropdown = page.locator('#mobile-dropdown-menu');
    
    // Test basic functionality across browsers
    await menuButton.click();
    await page.waitForTimeout(300);
    
    await expect(dropdown).toBeVisible();
    
    // Test browser-specific behavior
    if (browserName === 'webkit') {
      // iOS Safari specific tests
      const touchEvent = await page.evaluate(() => 'ontouchstart' in window);
      expect(touchEvent).toBeTruthy();
    }
    
    // Close menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(dropdown).not.toBeVisible();
  });

});