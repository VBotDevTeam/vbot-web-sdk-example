import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture all console logs
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] [${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', exception => {
    console.error(`[BROWSER EXCEPTION] ${exception.message}`);
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/');

  // Set localStorage token to simulate saved credentials and reload
  await page.evaluate(() => {
    localStorage.setItem('vbot_access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJWYWx1ZSI6IjU0ODctNzg4NS03MjQtODIyIn0.jbj0qqUSBghT67hunCR4Sq3bwwb8GVhhB8ggRRxFSec');
    localStorage.setItem('vbot_auto_connect', 'true');
  });
  await page.reload();

  // Wait for initial connection attempt
  console.log('Waiting 5 seconds for initial connection...');
  await page.waitForTimeout(5000);
  
  // Close onboarding tour if present
  try {
    const skipBtn = page.locator('button:has-text("Bỏ qua")');
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {}

  // Open settings
  console.log('Opening settings modal...');
  const settingsBtn = page.locator('#guide-settings-btn');
  await settingsBtn.click();
  await page.waitForTimeout(1000);

  const statusContainer = page.locator('.flex.items-center.justify-between.bg-slate-50');
  const initialText = await statusContainer.textContent();
  console.log(`Initial Status: "${initialText.trim()}"`);

  // Change integration mode dropdown to show Reconnect button
  console.log('Changing integration mode to "headless"...');
  const modeSelect = page.locator('select');
  await modeSelect.selectOption('headless');
  await page.waitForTimeout(1000);

  // Click "Kết nối lại" button
  console.log('Clicking "Kết nối lại" button...');
  const reconnectBtn = page.locator('button:has-text("Kết nối lại")');
  if (await reconnectBtn.isVisible()) {
    await reconnectBtn.click();
    console.log('Clicked "Kết nối lại"!');
  } else {
    console.error('Reconnect button is not visible!');
  }

  // Poll connection status every 500ms for 10 seconds to observe connection re-establishment
  console.log('Polling connection status for 10 seconds...');
  for (let i = 0; i < 20; i++) {
    const currentText = await statusContainer.textContent();
    console.log(`Poll ${i+1}: "${currentText.trim()}"`);
    await page.waitForTimeout(500);
  }

  console.log('Closing browser.');
  await browser.close();
})();
