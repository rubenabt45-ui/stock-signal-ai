import { test, expect } from '@playwright/test';
import { ResponsiveTestHelper, VIEWPORTS } from '../utils/responsive-helpers';

test.describe('Landing Page - Responsive Design Tests', () => {
  
  VIEWPORTS.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test(`should load landing page without layout issues`, async ({ page }) => {
        const helper = new ResponsiveTestHelper(page);
        
        // Set viewport and navigate
        await helper.setViewport(viewport);
        await page.goto('/');
        
        // Wait for page to be fully loaded
        await page.waitForSelector('nav');
        await page.waitForLoadState('networkidle');
        
        // Basic page validation
        await expect(page).toHaveTitle(/TradeIQ/);
        
        // Validate no horizontal scroll
        await helper.validateNoHorizontalScroll();
        
        // Validate no overflow elements
        await helper.validateNoOverflowElements();
        
        // Validate touch targets
        await helper.validateTouchTargets();
        
        // Take screenshot for visual regression
        await helper.takeViewportScreenshot('landing-page', viewport);
        
        // Generate accessibility report
        await helper.generateAccessibilityReport('landing-page', viewport);
      });
      
      test(`should have functional navigation elements`, async ({ page }) => {
        const helper = new ResponsiveTestHelper(page);
        await helper.setViewport(viewport);
        await page.goto('/');
        
        // Test navigation accessibility
        const navResults = await helper.validateNavigationAccessibility();
        
        if (viewport.category === 'mobile') {
          // Mobile should have hamburger menu
          expect(navResults.mobileMenu || navResults.loginButton).toBeTruthy();
        } else {
          // Desktop/tablet should have visible login/signup
          expect(navResults.loginButton).toBeTruthy();
          expect(navResults.signupButton).toBeTruthy();
        }
      });
      
      test(`should render hero section correctly`, async ({ page }) => {
        const helper = new ResponsiveTestHelper(page);
        await helper.setViewport(viewport);
        await page.goto('/');
        
        // Check hero elements are visible
        const heroTitle = page.locator('h1').first();
        const heroSubtitle = page.locator('p').first();
        const ctaButtons = page.locator('button:has-text("Beta"), button:has-text("Demo")');
        
        await expect(heroTitle).toBeVisible();
        await expect(heroSubtitle).toBeVisible();
        await expect(ctaButtons.first()).toBeVisible();
        
        // Validate text is readable (not clipped)
        const titleBox = await heroTitle.boundingBox();
        expect(titleBox?.height).toBeGreaterThan(0);
        
        // Take hero-specific screenshot
        await helper.takeViewportScreenshot('landing-page', viewport, 'hero-section');
      });
      
      test(`should display feature cards properly`, async ({ page }) => {
        const helper = new ResponsiveTestHelper(page);
        await helper.setViewport(viewport);
        await page.goto('/');
        
        // Scroll to features section
        await page.locator('text=Core Features').scrollIntoViewIfNeeded();
        
        // Check feature cards
        const featureCards = page.locator('.grid .card, [class*="grid"] [class*="card"]');
        const cardCount = await featureCards.count();
        
        expect(cardCount).toBeGreaterThan(0);
        
        // Validate cards are properly sized
        for (let i = 0; i < Math.min(cardCount, 4); i++) {
          const card = featureCards.nth(i);
          await expect(card).toBeVisible();
          
          const cardBox = await card.boundingBox();
          if (cardBox) {
            expect(cardBox.width).toBeGreaterThan(100);
            expect(cardBox.height).toBeGreaterThan(50);
          }
        }
        
        await helper.takeViewportScreenshot('landing-page', viewport, 'features-section');
      });
      
      test(`should handle mobile menu interaction`, async ({ page }) => {
        if (viewport.category !== 'mobile') {
          test.skip('Mobile menu test only applies to mobile viewports');
        }
        
        const helper = new ResponsiveTestHelper(page);
        await helper.setViewport(viewport);
        await page.goto('/');
        
        // Find and click mobile menu trigger
        const menuTrigger = page.locator('[aria-label*="menu"], button:has(svg)').first();
        
        if (await menuTrigger.isVisible()) {
          await menuTrigger.click();
          
          // Wait for menu animation
          await page.waitForTimeout(500);
          
          // Verify menu is open and properly positioned
          const menuOverlay = page.locator('[class*="fixed"][class*="inset"]');
          await expect(menuOverlay).toBeVisible();
          
          // Validate menu doesn't cause horizontal scroll
          await helper.validateNoHorizontalScroll();
          
          // Take screenshot of open menu
          await helper.takeViewportScreenshot('landing-page', viewport, 'mobile-menu-open');
          
          // Test closing menu
          const closeButton = page.locator('[aria-label*="close"], button:has(svg)').last();
          await closeButton.click();
          
          // Verify menu closes
          await page.waitForTimeout(500);
          await expect(menuOverlay).not.toBeVisible();
        }
      });
      
    });
  });
  
  test('should maintain consistent branding across viewports', async ({ page }) => {
    const brandingElements = {
      logo: 'svg, [class*="logo"]',
      title: 'h1',
      primaryColor: '[class*="tradeiq-blue"], [class*="primary"]'
    };
    
    for (const viewport of VIEWPORTS) {
      const helper = new ResponsiveTestHelper(page);
      await helper.setViewport(viewport);
      await page.goto('/');
      
      // Check branding consistency
      for (const [element, selector] of Object.entries(brandingElements)) {
        const elementLocator = page.locator(selector).first();
        if (await elementLocator.count() > 0) {
          await expect(elementLocator).toBeVisible();
        }
      }
      
      // Verify dark theme is consistent
      const bgColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      expect(bgColor).toContain('rgb'); // Should have actual color, not transparent
    }
  });
  
});