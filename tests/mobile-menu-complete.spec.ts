import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Complete Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should open menu and display all navigation links', async ({ page }) => {
    // Find and click the hamburger button
    const hamburgerButton = page.getByTestId('mobile-menu-toggle');
    await expect(hamburgerButton).toBeVisible();
    
    // Click to open menu
    await hamburgerButton.click();
    
    // Wait for menu content to be visible
    const menuContent = page.getByTestId('mobile-menu-content');
    await expect(menuContent).toBeVisible();
    
    // Verify all navigation links are present and visible
    await expect(page.getByTestId('menu-home-link')).toBeVisible();
    await expect(page.getByTestId('menu-learn-link')).toBeVisible();
    await expect(page.getByTestId('menu-pricing-link')).toBeVisible();
    await expect(page.getByTestId('menu-login-button')).toBeVisible();
    await expect(page.getByTestId('menu-signup-button')).toBeVisible();
    
    // Verify menu header
    await expect(page.locator('text=Navigation')).toBeVisible();
    
    // Verify debug state shows OPEN
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: OPEN');
  });

  test('should close menu with Escape key', async ({ page }) => {
    // Open menu first
    await page.getByTestId('mobile-menu-toggle').click();
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: OPEN');
    
    // Press Escape key
    await page.keyboard.press('Escape');
    
    // Verify menu is closed
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: CLOSED');
    
    // Menu content should not be visible
    const menuContent = page.getByTestId('mobile-menu-content');
    await expect(menuContent).not.toBeVisible();
  });

  test('should close menu when clicking outside', async ({ page }) => {
    // Open menu
    await page.getByTestId('mobile-menu-toggle').click();
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: OPEN');
    
    // Click on overlay
    await page.getByTestId('mobile-menu-overlay').click();
    
    // Verify menu is closed
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: CLOSED');
  });

  test('should have proper touch targets (44px minimum)', async ({ page }) => {
    // Open menu
    await page.getByTestId('mobile-menu-toggle').click();
    
    // Check hamburger button size
    const hamburgerButton = page.getByTestId('mobile-menu-toggle');
    const hamburgerBox = await hamburgerButton.boundingBox();
    expect(hamburgerBox?.height).toBeGreaterThanOrEqual(44);
    expect(hamburgerBox?.width).toBeGreaterThanOrEqual(44);
    
    // Check menu links
    const homeLink = page.getByTestId('menu-home-link');
    const homeBox = await homeLink.boundingBox();
    expect(homeBox?.height).toBeGreaterThanOrEqual(44);
    
    const learnLink = page.getByTestId('menu-learn-link');
    const learnBox = await learnLink.boundingBox();
    expect(learnBox?.height).toBeGreaterThanOrEqual(44);
    
    const pricingLink = page.getByTestId('menu-pricing-link');
    const pricingBox = await pricingLink.boundingBox();
    expect(pricingBox?.height).toBeGreaterThanOrEqual(44);
    
    // Check action buttons
    const loginButton = page.getByTestId('menu-login-button');
    const loginBox = await loginButton.boundingBox();
    expect(loginBox?.height).toBeGreaterThanOrEqual(44);
    
    const signupButton = page.getByTestId('menu-signup-button');
    const signupBox = await signupButton.boundingBox();
    expect(signupBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('should close menu when selecting navigation item', async ({ page }) => {
    // Open menu
    await page.getByTestId('mobile-menu-toggle').click();
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: OPEN');
    
    // Click on a navigation item
    await page.getByTestId('menu-home-link').click();
    
    // Menu should close
    await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: CLOSED');
  });

  test('should work across different mobile viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 } // iPad
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Should be visible on mobile/tablet
      if (viewport.width < 768) {
        await expect(page.getByTestId('mobile-menu-toggle')).toBeVisible();
        
        // Test open/close
        await page.getByTestId('mobile-menu-toggle').click();
        await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: OPEN');
        
        await page.keyboard.press('Escape');
        await expect(page.getByTestId('menu-debug-state')).toContainText('MENU: CLOSED');
      }
    }
  });

  test('should have smooth animations', async ({ page }) => {
    // Open menu and check for transition classes
    await page.getByTestId('mobile-menu-toggle').click();
    
    const menuContent = page.getByTestId('mobile-menu-content');
    await expect(menuContent).toBeVisible();
    
    // Verify transition classes are present
    const className = await menuContent.getAttribute('class');
    expect(className).toContain('transition-all');
    expect(className).toContain('duration-300');
    expect(className).toContain('ease-in-out');
  });
});