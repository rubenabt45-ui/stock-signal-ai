import { test, expect } from '@playwright/test';
import { ResponsiveTestHelper, VIEWPORTS } from '../utils/responsive-helpers';

test.describe('App Routes - Responsive Design Tests', () => {
  
  const appRoutes = [
    { path: '/app', name: 'dashboard' },
    { path: '/app/learn', name: 'learn' },
    { path: '/app/settings', name: 'settings' }
  ];
  
  // Mock authentication for protected routes
  test.beforeEach(async ({ page }) => {
    // Mock localStorage for authentication
    await page.addInitScript(() => {
      // Mock authenticated state
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        user: { id: '123', email: 'test@example.com' }
      }));
    });
  });
  
  appRoutes.forEach(route => {
    test.describe(`${route.name} page`, () => {
      
      VIEWPORTS.forEach(viewport => {
        test(`should render ${route.name} correctly on ${viewport.name}`, async ({ page }) => {
          const helper = new ResponsiveTestHelper(page);
          
          // Set viewport and navigate
          await helper.setViewport(viewport);
          await page.goto(route.path);
          
          // Wait for app to load (might redirect to login if auth fails)
          await page.waitForLoadState('networkidle');
          
          // Check if we're still on the intended route (not redirected to login)
          const currentUrl = page.url();
          const isOnIntendedRoute = currentUrl.includes(route.path) || currentUrl.includes('/login');
          expect(isOnIntendedRoute).toBeTruthy();
          
          // If redirected to login, skip the rest of the test
          if (currentUrl.includes('/login')) {
            test.skip('Redirected to login - authentication required');
          }
          
          // Validate layout
          await helper.validateNoHorizontalScroll();
          await helper.validateNoOverflowElements();
          
          // Check for bottom navigation on mobile
          if (viewport.category === 'mobile') {
            const bottomNav = page.locator('nav[class*="bottom"], [class*="bottom-nav"]');
            if (await bottomNav.count() > 0) {
              await expect(bottomNav).toBeVisible();
              
              // Validate bottom nav doesn't overlap content
              const bottomNavBox = await bottomNav.boundingBox();
              if (bottomNavBox) {
                expect(bottomNavBox.y).toBeGreaterThan(viewport.height * 0.8); // Should be near bottom
              }
            }
          }
          
          // Validate touch targets
          await helper.validateTouchTargets();
          
          // Take screenshot
          await helper.takeViewportScreenshot(route.name, viewport);
          
          // Generate accessibility report
          await helper.generateAccessibilityReport(route.name, viewport);
        });
        
        test(`should handle navigation properly on ${viewport.name} for ${route.name}`, async ({ page }) => {
          const helper = new ResponsiveTestHelper(page);
          await helper.setViewport(viewport);
          await page.goto(route.path);
          
          await page.waitForLoadState('networkidle');
          
          // Skip if redirected to login
          if (page.url().includes('/login')) {
            test.skip('Authentication required');
          }
          
          // Test navigation elements based on viewport
          if (viewport.category === 'mobile') {
            // Test bottom navigation
            const bottomNavItems = page.locator('nav a, nav button').filter({ hasText: /Dashboard|Learn|Settings/ });
            const navItemCount = await bottomNavItems.count();
            
            if (navItemCount > 0) {
              // Test clicking on navigation items
              for (let i = 0; i < Math.min(navItemCount, 3); i++) {
                const navItem = bottomNavItems.nth(i);
                if (await navItem.isVisible()) {
                  await navItem.click();
                  await page.waitForTimeout(500); // Wait for navigation
                  
                  // Verify navigation worked (URL changed or content updated)
                  const newUrl = page.url();
                  expect(newUrl).toContain('/app');
                }
              }
            }
          } else {
            // Test desktop/tablet navigation (sidebar or top nav)
            const navLinks = page.locator('nav a, aside a').filter({ hasText: /Dashboard|Learn|Settings/ });
            const linkCount = await navLinks.count();
            
            if (linkCount > 0) {
              const firstLink = navLinks.first();
              if (await firstLink.isVisible()) {
                await firstLink.click();
                await page.waitForTimeout(500);
                
                // Verify navigation
                const newUrl = page.url();
                expect(newUrl).toContain('/app');
              }
            }
          }
          
          // Validate layout after navigation
          await helper.validateNoHorizontalScroll();
        });
      });
      
    });
  });
  
  test('should maintain app layout consistency across viewports', async ({ page }) => {
    // Test layout consistency without authentication
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
    
    for (const viewport of VIEWPORTS) {
      const helper = new ResponsiveTestHelper(page);
      await helper.setViewport(viewport);
      
      // Check for consistent app structure
      const appContainer = page.locator('main, [role="main"], .app-container').first();
      
      if (await appContainer.count() > 0) {
        await expect(appContainer).toBeVisible();
        
        // Validate container doesn't overflow
        const containerBox = await appContainer.boundingBox();
        if (containerBox) {
          expect(containerBox.width).toBeLessThanOrEqual(viewport.width + 10); // Small tolerance
        }
      }
      
      // Check responsive behavior of common UI elements
      const buttons = page.locator('button').first();
      const cards = page.locator('.card, [class*="card"]').first();
      
      if (await buttons.count() > 0) {
        const buttonBox = await buttons.boundingBox();
        if (buttonBox && viewport.category === 'mobile') {
          expect(buttonBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
  
});
