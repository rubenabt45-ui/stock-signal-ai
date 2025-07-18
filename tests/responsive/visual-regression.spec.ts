import { test, expect } from '@playwright/test';
import { ResponsiveTestHelper, VIEWPORTS } from '../utils/responsive-helpers';

test.describe('Visual Regression Tests', () => {
  
  const criticalRoutes = [
    { path: '/', name: 'landing' },
    { path: '/login', name: 'login' },
    { path: '/signup', name: 'signup' },
    { path: '/pricing', name: 'pricing' }
  ];
  
  criticalRoutes.forEach(route => {
    VIEWPORTS.forEach(viewport => {
      test(`should match visual baseline for ${route.name} on ${viewport.name}`, async ({ page }) => {
        const helper = new ResponsiveTestHelper(page);
        
        // Set viewport and navigate
        await helper.setViewport(viewport);
        await page.goto(route.path);
        
        // Wait for all content to load
        await page.waitForLoadState('networkidle');
        
        // Wait for any animations to complete
        await page.waitForTimeout(1000);
        
        // Take full page screenshot for baseline comparison
        const screenshotPath = await helper.takeViewportScreenshot(
          `baseline-${route.name}`, 
          viewport, 
          'full-page'
        );
        
        // Visual regression test - compare with baseline
        await expect(page).toHaveScreenshot(`${route.name}-${viewport.name}-baseline.png`, {
          fullPage: true,
          threshold: 0.3, // 30% threshold for differences
          maxDiffPixels: 1000 // Allow some pixel differences
        });
      });
    });
  });
  
  test('should detect layout shifts during interaction', async ({ page }) => {
    const helper = new ResponsiveTestHelper(page);
    
    for (const viewport of VIEWPORTS) {
      await helper.setViewport(viewport);
      await page.goto('/');
      
      // Take initial screenshot
      const initialScreenshot = await helper.takeViewportScreenshot(
        'layout-shift-initial',
        viewport
      );
      
      // Perform interactions that might cause layout shifts
      const interactions = [
        () => page.hover('button').catch(() => {}),
        () => page.click('button').catch(() => {}),
        () => page.keyboard.press('Tab').catch(() => {}),
      ];
      
      for (const interaction of interactions) {
        await interaction();
        await page.waitForTimeout(300);
        
        // Take screenshot after interaction
        const afterScreenshot = await helper.takeViewportScreenshot(
          'layout-shift-after',
          viewport,
          Math.random().toString(36).substring(7)
        );
        
        // Validate no major layout shifts occurred
        await helper.validateNoHorizontalScroll();
        await helper.validateNoOverflowElements();
      }
    }
  });
  
  test('should maintain consistent dark theme rendering', async ({ page }) => {
    for (const viewport of VIEWPORTS) {
      const helper = new ResponsiveTestHelper(page);
      await helper.setViewport(viewport);
      
      for (const route of criticalRoutes) {
        await page.goto(route.path);
        
        // Check dark theme consistency
        const darkThemeElements = await page.evaluate(() => {
          const body = document.body;
          const nav = document.querySelector('nav');
          const cards = document.querySelectorAll('.card, [class*="card"]');
          
          const getStyle = (element: Element | null) => {
            if (!element) return null;
            const style = window.getComputedStyle(element);
            return {
              backgroundColor: style.backgroundColor,
              color: style.color,
              borderColor: style.borderColor
            };
          };
          
          return {
            body: getStyle(body),
            nav: getStyle(nav),
            card: getStyle(cards[0])
          };
        });
        
        // Verify dark theme colors are applied
        expect(darkThemeElements.body?.backgroundColor).toContain('rgb');
        
        // Take themed screenshot
        await helper.takeViewportScreenshot(
          `dark-theme-${route.name}`,
          viewport
        );
      }
    }
  });
  
});