import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Debug Tests', () => {
  const testViewports = [
    { name: 'Small Mobile', width: 320, height: 568 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Large Mobile', width: 414, height: 896 },
    { name: 'Tablet Portrait', width: 768, height: 1024 }
  ];

  testViewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Add console logging
        page.on('console', msg => {
          if (msg.text().includes('🍔') || msg.text().includes('Menu')) {
            console.log(`CONSOLE [${viewport.name}]:`, msg.text());
          }
        });
      });

      test('should display hamburger button and debug state', async ({ page }) => {
        // Check if hamburger button exists
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        await expect(menuButton).toBeVisible();
        
        // Check if debug state is visible (shows current state)
        const debugState = page.locator('text=Menu: CLOSED');
        await expect(debugState).toBeVisible();
        
        // Take screenshot of initial state
        await page.screenshot({ 
          path: `test-results/mobile-menu-initial-${viewport.name.replace(' ', '')}.png`,
          fullPage: true 
        });
      });

      test('should open menu when clicking hamburger', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const debugState = page.locator('[class*="bg-red-500"]');
        
        // Verify initial state
        await expect(debugState).toContainText('CLOSED');
        
        // Click hamburger button
        await menuButton.click();
        
        // Wait for state change
        await page.waitForTimeout(500);
        
        // Check debug state changed to OPEN
        await expect(debugState).toContainText('OPEN');
        
        // Check if menu content is visible
        const menuContent = page.locator('#mobile-nav-menu');
        await expect(menuContent).toBeVisible();
        
        // Verify navigation items are visible
        const homeLink = page.locator('text="Home"').first();
        const learnLink = page.locator('text*="Learn"').first();
        const pricingLink = page.locator('text="Pricing"').first();
        
        await expect(homeLink).toBeVisible();
        await expect(learnLink).toBeVisible();
        await expect(pricingLink).toBeVisible();
        
        // Take screenshot of open menu
        await page.screenshot({ 
          path: `test-results/mobile-menu-open-${viewport.name.replace(' ', '')}.png`,
          fullPage: true 
        });
      });

      test('should close menu when clicking outside', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const debugState = page.locator('[class*="bg-red-500"]');
        const overlay = page.locator('.fixed.inset-0.bg-black\\/30');
        
        // Open menu
        await menuButton.click();
        await page.waitForTimeout(300);
        await expect(debugState).toContainText('OPEN');
        
        // Click on overlay
        await overlay.click();
        await page.waitForTimeout(300);
        
        // Verify menu closed
        await expect(debugState).toContainText('CLOSED');
        
        const menuContent = page.locator('#mobile-nav-menu');
        await expect(menuContent).not.toBeVisible();
      });

      test('should close menu when selecting navigation item', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const debugState = page.locator('[class*="bg-red-500"]');
        
        // Open menu
        await menuButton.click();
        await page.waitForTimeout(300);
        await expect(debugState).toContainText('OPEN');
        
        // Click on a navigation item
        const homeLink = page.locator('text="Home"').first();
        await homeLink.click();
        await page.waitForTimeout(300);
        
        // Verify menu closed
        await expect(debugState).toContainText('CLOSED');
      });

      test('should handle multiple rapid clicks', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const debugState = page.locator('[class*="bg-red-500"]');
        
        // Rapidly click multiple times
        for (let i = 0; i < 5; i++) {
          await menuButton.click();
          await page.waitForTimeout(100);
        }
        
        // Wait for animations to settle
        await page.waitForTimeout(1000);
        
        // Check final state is consistent
        const finalState = await debugState.textContent();
        const menuVisible = await page.locator('#mobile-nav-menu').isVisible();
        
        if (finalState?.includes('OPEN')) {
          expect(menuVisible).toBe(true);
        } else {
          expect(menuVisible).toBe(false);
        }
      });

      test('should have correct z-index layering', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        
        // Open menu
        await menuButton.click();
        await page.waitForTimeout(300);
        
        // Check z-index values
        const zIndexes = await page.evaluate(() => {
          const button = document.querySelector('[aria-label*="navigation menu"]') as HTMLElement;
          const menu = document.querySelector('#mobile-nav-menu') as HTMLElement;
          const overlay = document.querySelector('.fixed.inset-0.bg-black\\/30') as HTMLElement;
          
          const getZIndex = (element: HTMLElement | null) => {
            if (!element) return '0';
            return window.getComputedStyle(element).zIndex;
          };
          
          return {
            button: getZIndex(button),
            menu: getZIndex(menu),
            overlay: getZIndex(overlay)
          };
        });
        
        console.log('Z-index values:', zIndexes);
        
        // Verify proper layering
        expect(parseInt(zIndexes.button)).toBeGreaterThan(parseInt(zIndexes.menu));
        expect(parseInt(zIndexes.menu)).toBeGreaterThan(parseInt(zIndexes.overlay));
      });

      test('should work with touch events', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        const debugState = page.locator('[class*="bg-red-500"]');
        
        // Simulate touch events
        await menuButton.dispatchEvent('touchstart');
        await menuButton.dispatchEvent('touchend');
        await page.waitForTimeout(300);
        
        // Verify menu opened
        await expect(debugState).toContainText('OPEN');
        
        // Touch outside to close
        const overlay = page.locator('.fixed.inset-0');
        await overlay.dispatchEvent('touchstart');
        await page.waitForTimeout(300);
        
        // Verify menu closed
        await expect(debugState).toContainText('CLOSED');
      });

      test('should maintain functionality with CSS transitions', async ({ page }) => {
        const menuButton = page.locator('[aria-label*="navigation menu"]');
        
        // Test multiple open/close cycles to ensure CSS transitions don't break functionality
        for (let cycle = 0; cycle < 3; cycle++) {
          // Open
          await menuButton.click();
          await page.waitForTimeout(400); // Wait for full animation
          
          const menuContent = page.locator('#mobile-nav-menu');
          await expect(menuContent).toBeVisible();
          
          // Close
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400); // Wait for full animation
          
          await expect(menuContent).not.toBeVisible();
        }
      });

    });
  });

  test('should generate comprehensive test report', async ({ page }) => {
    const results = [];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      const testResult = {
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        hamburgerVisible: await page.locator('[aria-label*="navigation menu"]').isVisible(),
        menuOpensCorrectly: false,
        menuClosesCorrectly: false,
        navigationItemsVisible: false,
        timestamp: new Date().toISOString()
      };
      
      try {
        // Test open
        await page.locator('[aria-label*="navigation menu"]').click();
        await page.waitForTimeout(300);
        testResult.menuOpensCorrectly = await page.locator('#mobile-nav-menu').isVisible();
        
        // Test navigation items
        const homeVisible = await page.locator('text="Home"').first().isVisible();
        const learnVisible = await page.locator('text*="Learn"').first().isVisible();
        testResult.navigationItemsVisible = homeVisible && learnVisible;
        
        // Test close
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        testResult.menuClosesCorrectly = !(await page.locator('#mobile-nav-menu').isVisible());
        
      } catch (error) {
        console.error(`Test failed for ${viewport.name}:`, error);
      }
      
      results.push(testResult);
    }
    
    // Log comprehensive results
    console.log('📊 Mobile Menu Test Results:', JSON.stringify(results, null, 2));
    
    // Verify all viewports passed basic functionality
    const allPassed = results.every(r => 
      r.hamburgerVisible && 
      r.menuOpensCorrectly && 
      r.menuClosesCorrectly && 
      r.navigationItemsVisible
    );
    
    expect(allPassed).toBe(true);
  });

});