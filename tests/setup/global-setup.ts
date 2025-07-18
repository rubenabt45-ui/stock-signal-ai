import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global setup for TradeIQ Pro responsive testing
 * Prepares test environment and creates necessary directories
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up TradeIQ Pro responsive design tests...');
  
  // Create test output directories
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/screenshots/mobile',
    'test-results/screenshots/tablet', 
    'test-results/screenshots/desktop',
    'test-results/accessibility',
    'test-results/performance'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  // Verify the application is running
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const baseURL = config.webServer?.url || 'http://localhost:8080';
    console.log(`🔍 Checking if application is available at ${baseURL}...`);
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`✅ Application loaded successfully. Title: ${title}`);
    
    // Basic health check - verify key elements exist
    const nav = await page.locator('nav').count();
    const buttons = await page.locator('button').count();
    
    console.log(`📊 Page health check: ${nav} nav elements, ${buttons} buttons found`);
    
  } catch (error) {
    console.error('❌ Application health check failed:', error);
    throw new Error(`Application not available: ${error}`);
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully!');
}

export default globalSetup;