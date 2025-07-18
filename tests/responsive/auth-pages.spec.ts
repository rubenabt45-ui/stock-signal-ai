import { test, expect } from '@playwright/test';
import { ResponsiveTestHelper, VIEWPORTS } from '../utils/responsive-helpers';

test.describe('Authentication Pages - Responsive Design Tests', () => {
  
  const authRoutes = [
    { path: '/login', name: 'login' },
    { path: '/signup', name: 'signup' },
    { path: '/forgot-password', name: 'forgot-password' }
  ];
  
  authRoutes.forEach(route => {
    test.describe(`${route.name} page`, () => {
      
      VIEWPORTS.forEach(viewport => {
        test(`should render ${route.name} page correctly on ${viewport.name}`, async ({ page }) => {
          const helper = new ResponsiveTestHelper(page);
          
          // Set viewport and navigate
          await helper.setViewport(viewport);
          await page.goto(route.path);
          
          // Wait for page load
          await page.waitForLoadState('networkidle');
          
          // Basic page validation
          await expect(page).toHaveTitle(/TradeIQ/);
          
          // Validate layout
          await helper.validateNoHorizontalScroll();
          await helper.validateNoOverflowElements();
          await helper.validateTouchTargets();
          
          // Check form elements are visible
          const formInputs = page.locator('input[type="email"], input[type="password"], input[type="text"]');
          const submitButton = page.locator('button[type="submit"], button:has-text("Sign"), button:has-text("Log")');
          
          await expect(formInputs.first()).toBeVisible();
          await expect(submitButton.first()).toBeVisible();
          
          // Validate form inputs are properly sized for mobile
          if (viewport.category === 'mobile') {
            const inputBox = await formInputs.first().boundingBox();
            if (inputBox) {
              expect(inputBox.height).toBeGreaterThanOrEqual(44); // iOS minimum touch target
            }
          }
          
          // Take screenshot
          await helper.takeViewportScreenshot(route.name, viewport);
          
          // Generate accessibility report
          await helper.generateAccessibilityReport(route.name, viewport);
        });
        
        test(`should handle form interaction on ${viewport.name} for ${route.name}`, async ({ page }) => {
          const helper = new ResponsiveTestHelper(page);
          await helper.setViewport(viewport);
          await page.goto(route.path);
          
          // Test form field focus and input
          const emailInput = page.locator('input[type="email"]').first();
          const passwordInput = page.locator('input[type="password"]').first();
          
          if (await emailInput.count() > 0) {
            await emailInput.click();
            await emailInput.fill('test@example.com');
            
            // Verify input is visible and not obscured
            await expect(emailInput).toBeVisible();
            await expect(emailInput).toHaveValue('test@example.com');
          }
          
          if (await passwordInput.count() > 0) {
            await passwordInput.click();
            await passwordInput.fill('testpassword');
            
            // Verify password input works
            await expect(passwordInput).toBeVisible();
            await expect(passwordInput).toHaveValue('testpassword');
          }
          
          // Validate form doesn't break layout
          await helper.validateNoHorizontalScroll();
          
          // Take screenshot of filled form
          await helper.takeViewportScreenshot(route.name, viewport, 'form-filled');
        });
      });
      
    });
  });
  
  test('should maintain consistent auth flow across viewports', async ({ page }) => {
    for (const viewport of VIEWPORTS) {
      const helper = new ResponsiveTestHelper(page);
      await helper.setViewport(viewport);
      
      for (const route of authRoutes) {
        await page.goto(route.path);
        
        // Check for consistent navigation options
        const backToHome = page.locator('a[href="/"], button:has-text("Home")');
        const alternateAuth = page.locator('a:has-text("Sign"), a:has-text("Log"), a:has-text("Forgot")');
        
        // At least one navigation option should be available
        const hasNavigation = (await backToHome.count() > 0) || (await alternateAuth.count() > 0);
        expect(hasNavigation).toBeTruthy();
        
        // Verify consistent styling
        const formContainer = page.locator('form, [class*="form"], .card').first();
        if (await formContainer.count() > 0) {
          await expect(formContainer).toBeVisible();
        }
      }
    }
  });
  
});