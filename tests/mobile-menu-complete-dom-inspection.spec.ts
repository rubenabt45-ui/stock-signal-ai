import { test, expect } from '@playwright/test';

test.describe('Mobile Menu - Complete DOM Inspection & Visual Regression', () => {
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

      test('should have clean DOM state when menu is closed', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Verify hamburger is visible
        await expect(hamburger).toBeVisible();
        
        // Verify menu content does NOT exist in DOM when closed
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        await expect(menuContent).not.toBeAttached();
        
        // Verify overlay does NOT exist in DOM when closed
        const menuOverlay = page.locator('[data-testid="mobile-menu-overlay"]');
        await expect(menuOverlay).not.toBeAttached();
        
        // Comprehensive white box detection
        const whiteBoxAnalysis = await page.evaluate(() => {
          const allElements = Array.from(document.querySelectorAll('*'));
          const whiteBoxes = allElements.filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.backgroundColor === 'rgb(255, 255, 255)' &&
              styles.display !== 'none' &&
              styles.visibility !== 'hidden' &&
              styles.opacity !== '0' &&
              rect.width > 20 && 
              rect.height > 20 &&
              rect.top >= 0 && 
              rect.left >= 0
            );
          });
          
          return {
            totalElements: allElements.length,
            whiteBoxCount: whiteBoxes.length,
            whiteBoxDetails: whiteBoxes.map(el => ({
              tag: el.tagName,
              className: el.className,
              id: el.id,
              text: el.textContent?.substring(0, 50) || '',
              size: `${rect.width}x${rect.height}`,
              position: `${rect.top},${rect.left}`
            }))
          };
        });
        
        expect(whiteBoxAnalysis.whiteBoxCount, 'No white boxes should exist when menu is closed').toBe(0);
        
        // Verify no menu-related elements exist
        const menuElements = await page.$$('[id*="menu"], [data-testid*="menu"], [class*="menu"]');
        const visibleMenuElements = [];
        
        for (const el of menuElements) {
          const isVisible = await el.isVisible();
          const testId = await el.getAttribute('data-testid');
          if (isVisible && testId !== 'mobile-menu-toggle') {
            visibleMenuElements.push(testId || 'unknown');
          }
        }
        
        expect(visibleMenuElements, 'Only hamburger button should be visible').toHaveLength(0);
      });

      test('should render complete menu when opened with proper background', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        
        // Open menu
        await hamburger.click();
        await page.waitForTimeout(100);
        
        // Verify menu exists and is visible
        await expect(menuContent).toBeAttached();
        await expect(menuContent).toBeVisible();
        
        // Verify full viewport coverage
        const menuBox = await menuContent.boundingBox();
        expect(menuBox?.width, 'Menu should cover full width').toBe(width);
        expect(menuBox?.height, 'Menu should cover full height').toBe(height);
        expect(menuBox?.x, 'Menu should start at x=0').toBe(0);
        expect(menuBox?.y, 'Menu should start at y=0').toBe(0);
        
        // Verify exact background color
        const backgroundColor = await menuContent.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        expect(backgroundColor, 'Background should be exact dark theme color').toBe('rgb(9, 9, 11)');
        
        // Verify z-index
        const zIndex = await menuContent.evaluate(el => {
          return parseInt(window.getComputedStyle(el).zIndex);
        });
        expect(zIndex, 'Menu should have correct z-index').toBe(70);
        
        // Verify all navigation elements are present and visible
        const expectedElements = [
          { selector: 'text=Navigation', description: 'Header title' },
          { selector: '[data-testid="menu-close-button"]', description: 'Close button' },
          { selector: '[data-testid="menu-home-link"]', description: 'Home link' },
          { selector: '[data-testid="menu-learn-link"]', description: 'Learn link' },
          { selector: '[data-testid="menu-pricing-link"]', description: 'Pricing link' },
          { selector: '[data-testid="menu-login-button"]', description: 'Login button' },
          { selector: '[data-testid="menu-signup-button"]', description: 'Sign up button' },
          { selector: 'text=Language', description: 'Language selector' }
        ];
        
        for (const { selector, description } of expectedElements) {
          await expect(page.locator(selector), `${description} should be visible`).toBeVisible();
        }
      });

      test('should completely remove menu from DOM when closed via all methods', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        
        const closeMethods = [
          {
            name: 'Escape key',
            action: async () => page.keyboard.press('Escape')
          },
          {
            name: 'Close button',
            action: async () => page.locator('[data-testid="menu-close-button"]').click()
          },
          {
            name: 'Background click',
            action: async () => menuContent.click({ position: { x: 10, y: 100 } })
          },
          {
            name: 'Menu item selection',
            action: async () => page.locator('[data-testid="menu-home-link"]').click()
          }
        ];
        
        for (const { name, action } of closeMethods) {
          // Open menu
          await hamburger.click();
          await expect(menuContent).toBeAttached();
          await expect(menuContent).toBeVisible();
          
          // Close with specific method
          await action();
          
          // Verify complete removal from DOM
          await expect(menuContent, `Menu should be removed from DOM after ${name}`).not.toBeAttached();
          
          // Verify no orphaned elements
          const orphanedElements = await page.$$eval('[id*="menu"], [data-testid*="menu"]', (elements) => {
            return elements.filter(el => {
              const styles = window.getComputedStyle(el);
              const testId = el.getAttribute('data-testid');
              return (
                testId !== 'mobile-menu-toggle' &&
                (
                  styles.display !== 'none' ||
                  styles.visibility !== 'hidden' ||
                  styles.opacity !== '0'
                )
              );
            }).length;
          });
          
          expect(orphanedElements, `No orphaned elements after ${name}`).toBe(0);
          
          // Wait before next iteration
          await page.waitForTimeout(100);
        }
      });

      test('should have compliant touch targets and proper styling', async ({ page }) => {
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
          await expect(element, `${selector} should be visible`).toBeVisible();
          
          const box = await element.boundingBox();
          expect(box?.height, `${selector} height should be ≥ 48px`).toBeGreaterThanOrEqual(48);
          expect(box?.width, `${selector} width should be ≥ 48px`).toBeGreaterThanOrEqual(48);
          
          // For navigation links, verify they span most of the width
          if (selector.includes('menu-') && !selector.includes('toggle') && !selector.includes('close')) {
            expect(box?.width, `${selector} should be nearly full width`).toBeGreaterThan(width * 0.8);
          }
        }
      });

      test('should prevent body scroll and restore correctly', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Check initial body styles
        let bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width,
          top: document.body.style.top
        }));
        
        expect(bodyStyles.overflow, 'Initial overflow should be empty').toBe('');
        expect(bodyStyles.position, 'Initial position should be empty').toBe('');
        
        // Open menu and verify scroll prevention
        await hamburger.click();
        bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width,
          top: document.body.style.top
        }));
        
        expect(bodyStyles.overflow, 'Overflow should be hidden when menu open').toBe('hidden');
        expect(bodyStyles.position, 'Position should be fixed when menu open').toBe('fixed');
        expect(bodyStyles.width, 'Width should be 100% when menu open').toBe('100%');
        
        // Close menu and verify restoration
        await page.keyboard.press('Escape');
        await page.waitForTimeout(150); // Allow cleanup time
        
        bodyStyles = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          width: document.body.style.width,
          top: document.body.style.top
        }));
        
        expect(bodyStyles.overflow, 'Overflow should be restored').toBe('');
        expect(bodyStyles.position, 'Position should be restored').toBe('');
        expect(bodyStyles.width, 'Width should be restored').toBe('');
        expect(bodyStyles.top, 'Top should be restored').toBe('');
      });

      test('should handle rapid open/close without DOM artifacts', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        const menuContent = page.locator('[data-testid="mobile-menu-content"]');
        
        // Rapid toggle test
        for (let i = 0; i < 5; i++) {
          await hamburger.click();
          await page.waitForTimeout(50);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(50);
        }
        
        // Final state should be clean
        await expect(menuContent, 'Menu should not exist after rapid toggles').not.toBeAttached();
        
        // Check for any leaked menu elements
        const leakedElements = await page.$$eval('*', (elements) => {
          return elements.filter(el => {
            const id = el.id;
            const testId = el.getAttribute('data-testid');
            const className = el.className;
            return (
              (id && id.includes('menu') && id !== 'mobile-menu-toggle') ||
              (testId && testId.includes('menu') && testId !== 'mobile-menu-toggle') ||
              (typeof className === 'string' && className.includes('menu'))
            );
          }).filter(el => {
            const styles = window.getComputedStyle(el);
            return styles.display !== 'none' && styles.visibility !== 'hidden';
          }).length;
        });
        
        expect(leakedElements, 'No leaked menu elements should remain').toBe(0);
      });

      test('visual regression - screenshots with white box validation', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Screenshot 1: Initial closed state
        const closedScreenshot = await page.screenshot({ 
          fullPage: true,
          animations: 'disabled',
          clip: { x: 0, y: 0, width, height }
        });
        expect(closedScreenshot, 'Closed screenshot should be generated').toBeTruthy();
        
        // Screenshot 2: Menu open state
        await hamburger.click();
        await page.waitForTimeout(200);
        
        const openScreenshot = await page.screenshot({ 
          fullPage: true,
          animations: 'disabled',
          clip: { x: 0, y: 0, width, height }
        });
        expect(openScreenshot, 'Open screenshot should be generated').toBeTruthy();
        
        // Verify no white boxes in open state
        const openStateAnalysis = await page.evaluate(() => {
          const whiteBoxes = Array.from(document.querySelectorAll('*')).filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.backgroundColor === 'rgb(255, 255, 255)' &&
              styles.display !== 'none' &&
              styles.visibility !== 'hidden' &&
              rect.width > 30 && rect.height > 30 &&
              !el.textContent?.trim()
            );
          });
          return whiteBoxes.length;
        });
        expect(openStateAnalysis, 'No white boxes in open state').toBe(0);
        
        // Screenshot 3: After closing
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        
        const finalScreenshot = await page.screenshot({ 
          fullPage: true,
          animations: 'disabled',
          clip: { x: 0, y: 0, width, height }
        });
        expect(finalScreenshot, 'Final screenshot should be generated').toBeTruthy();
        
        // Verify complete cleanup
        const finalStateAnalysis = await page.evaluate(() => {
          const menuElements = document.querySelectorAll('[id*="menu"], [data-testid*="menu"]');
          const visibleMenuElements = Array.from(menuElements).filter(el => {
            const testId = el.getAttribute('data-testid');
            const styles = window.getComputedStyle(el);
            return (
              testId !== 'mobile-menu-toggle' &&
              styles.display !== 'none' &&
              styles.visibility !== 'hidden'
            );
          });
          
          const whiteBoxes = Array.from(document.querySelectorAll('*')).filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.backgroundColor === 'rgb(255, 255, 255)' &&
              styles.display !== 'none' &&
              rect.width > 20 && rect.height > 20
            );
          });
          
          return {
            visibleMenuElements: visibleMenuElements.length,
            whiteBoxes: whiteBoxes.length
          };
        });
        
        expect(finalStateAnalysis.visibleMenuElements, 'No visible menu elements after close').toBe(0);
        expect(finalStateAnalysis.whiteBoxes, 'No white boxes after close').toBe(0);
      });

      test('should assert only intended landing page content is visible when closed', async ({ page }) => {
        const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
        
        // Open and close menu to ensure proper cleanup
        await hamburger.click();
        await page.waitForTimeout(100);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(150);
        
        // Verify only intended landing page content is visible
        const visibleContent = await page.evaluate(() => {
          const allElements = Array.from(document.querySelectorAll('*'));
          const visibleElements = allElements.filter(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              styles.display !== 'none' &&
              styles.visibility !== 'hidden' &&
              styles.opacity !== '0' &&
              rect.width > 0 && rect.height > 0
            );
          });
          
          // Count elements by type
          const elementCounts = {
            total: visibleElements.length,
            menuElements: visibleElements.filter(el => {
              const id = el.id;
              const testId = el.getAttribute('data-testid');
              const className = el.className;
              return (
                (id && id.includes('menu')) ||
                (testId && testId.includes('menu')) ||
                (typeof className === 'string' && className.includes('menu'))
              );
            }).length,
            hamburgerOnly: visibleElements.filter(el => 
              el.getAttribute('data-testid') === 'mobile-menu-toggle'
            ).length
          };
          
          return elementCounts;
        });
        
        expect(visibleContent.hamburgerOnly, 'Only hamburger button should be visible menu element').toBe(1);
        expect(visibleContent.menuElements, 'Total menu elements should only be hamburger').toBe(1);
        expect(visibleContent.total, 'Should have reasonable number of visible elements').toBeGreaterThan(10);
      });
    });
  });

  test('Cross-viewport consistency check', async ({ page }) => {
    for (const { width, height, name } of testViewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
      
      // Test open/close cycle
      await hamburger.click();
      await page.waitForTimeout(100);
      
      const menuContent = page.locator('[data-testid="mobile-menu-content"]');
      await expect(menuContent, `Menu should open on ${name}`).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(menuContent, `Menu should close on ${name}`).not.toBeAttached();
      
      // Verify no artifacts
      const artifacts = await page.$$eval('[id*="menu"], [data-testid*="menu"]', (elements) => {
        return elements.filter(el => {
          const testId = el.getAttribute('data-testid');
          const styles = window.getComputedStyle(el);
          return (
            testId !== 'mobile-menu-toggle' &&
            styles.display !== 'none' &&
            styles.visibility !== 'hidden'
          );
        }).length;
      });
      
      expect(artifacts, `No artifacts should remain on ${name}`).toBe(0);
    }
  });
});