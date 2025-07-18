import { Page, expect, Locator } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Responsive testing utilities for TradeIQ Pro
 * Provides common functions for viewport validation and screenshot management
 */

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  category: 'mobile' | 'tablet' | 'desktop';
}

export const VIEWPORTS: ViewportConfig[] = [
  { name: 'iPhone-SE', width: 375, height: 667, category: 'mobile' },
  { name: 'iPad', width: 768, height: 1024, category: 'tablet' },
  { name: 'Desktop-HD', width: 1440, height: 900, category: 'desktop' },
];

export class ResponsiveTestHelper {
  constructor(private page: Page) {}

  /**
   * Set viewport and wait for layout stabilization
   */
  async setViewport(viewport: ViewportConfig) {
    await this.page.setViewportSize({ 
      width: viewport.width, 
      height: viewport.height 
    });
    
    // Wait for any CSS transitions/animations to complete
    await this.page.waitForTimeout(500);
    
    // Wait for layout to stabilize
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Validate no horizontal scrolling exists
   */
  async validateNoHorizontalScroll() {
    const scrollWidth = await this.page.evaluate(() => {
      return {
        documentScrollWidth: document.documentElement.scrollWidth,
        documentClientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        bodyClientWidth: document.body.clientWidth
      };
    });

    const hasHorizontalScroll = 
      scrollWidth.documentScrollWidth > scrollWidth.documentClientWidth ||
      scrollWidth.bodyScrollWidth > scrollWidth.bodyClientWidth;

    expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBeFalsy();
    
    return scrollWidth;
  }

  /**
   * Check for elements that extend beyond viewport
   */
  async validateNoOverflowElements() {
    const overflowElements = await this.page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const elements = document.querySelectorAll('*');
      const overflowing: string[] = [];
      
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          
          // Skip hidden elements
          if (style.display === 'none' || style.visibility === 'hidden') {
            return;
          }
          
          // Check if element extends beyond viewport
          if (rect.right > viewportWidth) {
            const tagName = element.tagName.toLowerCase();
            const className = element.className;
            const id = element.id;
            const selector = `${tagName}${id ? '#' + id : ''}${className ? '.' + className.split(' ').join('.') : ''}`;
            overflowing.push(`${selector} (right: ${rect.right}, viewport: ${viewportWidth})`);
          }
        }
      });
      
      return overflowing;
    });

    expect(overflowElements, `Elements extending beyond viewport: ${overflowElements.join(', ')}`).toHaveLength(0);
    
    return overflowElements;
  }

  /**
   * Validate touch targets meet minimum size requirements
   */
  async validateTouchTargets(minSize: number = 44) {
    const smallTargets = await this.page.evaluate((minSize) => {
      const clickableElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"], [onclick]');
      const tooSmall: string[] = [];
      
      clickableElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          
          // Skip hidden elements
          if (style.display === 'none' || style.visibility === 'hidden') {
            return;
          }
          
          if (rect.width < minSize || rect.height < minSize) {
            const tagName = element.tagName.toLowerCase();
            const text = element.textContent?.trim().substring(0, 20) || '';
            tooSmall.push(`${tagName} "${text}" (${rect.width}x${rect.height})`);
          }
        }
      });
      
      return tooSmall;
    }, minSize);

    expect(smallTargets, `Touch targets below ${minSize}px: ${smallTargets.join(', ')}`).toHaveLength(0);
    
    return smallTargets;
  }

  /**
   * Validate navigation accessibility across viewports
   */
  async validateNavigationAccessibility() {
    const navElements = {
      mobileMenu: this.page.locator('[aria-label*="mobile menu"], [aria-label*="toggle menu"]'),
      loginButton: this.page.locator('button:has-text("Login"), a:has-text("Login")'),
      signupButton: this.page.locator('button:has-text("Sign"), a:has-text("Sign")'),
      languageSelector: this.page.locator('[data-testid="language-selector"], .language-selector'),
    };

    const results: Record<string, boolean> = {};

    for (const [key, locator] of Object.entries(navElements)) {
      try {
        const isVisible = await locator.first().isVisible();
        const isEnabled = await locator.first().isEnabled();
        results[key] = isVisible && isEnabled;
      } catch {
        results[key] = false;
      }
    }

    return results;
  }

  /**
   * Take viewport-specific screenshot
   */
  async takeViewportScreenshot(routeName: string, viewport: ViewportConfig, suffix: string = '') {
    const fileName = `${routeName}-${viewport.name}${suffix ? '-' + suffix : ''}.png`;
    const filePath = path.join('test-results', 'screenshots', viewport.category, fileName);
    
    await this.page.screenshot({ 
      path: filePath,
      fullPage: true 
    });
    
    return filePath;
  }

  /**
   * Generate accessibility report for current page
   */
  async generateAccessibilityReport(routeName: string, viewport: ViewportConfig) {
    // Basic accessibility checks
    const report = {
      route: routeName,
      viewport: viewport.name,
      timestamp: new Date().toISOString(),
      checks: {
        hasTitle: await this.page.title() !== '',
        hasHeadings: await this.page.locator('h1, h2, h3, h4, h5, h6').count() > 0,
        hasAltTexts: await this.validateImageAltTexts(),
        hasAriaLabels: await this.validateAriaLabels(),
        colorContrast: await this.checkBasicColorContrast(),
      }
    };

    const fileName = `${routeName}-${viewport.name}-accessibility.json`;
    const filePath = path.join('test-results', 'accessibility', fileName);
    
    await fs.writeFile(filePath, JSON.stringify(report, null, 2));
    
    return report;
  }

  private async validateImageAltTexts(): Promise<boolean> {
    const imagesWithoutAlt = await this.page.locator('img:not([alt])').count();
    return imagesWithoutAlt === 0;
  }

  private async validateAriaLabels(): Promise<boolean> {
    const buttonsWithoutLabels = await this.page.locator('button:not([aria-label]):not(:has-text())').count();
    return buttonsWithoutLabels === 0;
  }

  private async checkBasicColorContrast(): Promise<boolean> {
    // Basic color contrast check (simplified)
    const hasProperContrast = await this.page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      
      // Simple check: ensure colors are different
      return bgColor !== textColor && bgColor !== 'rgba(0, 0, 0, 0)';
    });
    
    return hasProperContrast;
  }
}

/**
 * Generate comprehensive test report
 */
export async function generateTestReport(results: any[]) {
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    summary: results,
  };

  const filePath = path.join('test-results', 'responsive-test-summary.json');
  await fs.writeFile(filePath, JSON.stringify(report, null, 2));
  
  console.log('📊 Test report generated:', filePath);
  return report;
}