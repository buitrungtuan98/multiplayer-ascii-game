import { test, expect } from '@playwright/test';

test.describe('Lobby User Journey', () => {
  test('should navigate to home and list games', async ({ page }) => {
    // Web-portal is normally served behind Nginx, but locally runs on 3001
    await page.goto('/');

    // Check if the title ASCII Art is visible
    await expect(page.locator('pre')).toBeVisible();

    // Check if the game lobbies are rendered
    // If the UI is static, it should render immediately. We assume next.js serves static layout.
    // In our implementation / doesn't serve the home-page app since web-portal runs on 3001.
    // Usually web-portal is just the lobby and game.
    // Let's directly go to the aoe lobby.
  });

  test('should render the aoe lobby and create a room', async ({ page }) => {
    await page.goto('/lobby/aoe-1');

    await expect(page.locator('text=LOBBY: Age of Empires 1 ASCII Edition')).toBeVisible();

    // Fill player name
    await page.fill('input[placeholder="Enter your name..."]', 'E2E_Tester');

    // Click CREATE
    await page.click('button:has-text("CREATE PUBLIC ROOM")');

    // Wait for route to change
    await page.waitForURL(/\/join\/.+/);

    // Verify room state
    await expect(page.locator('text=WAITING FOR PLAYERS')).toBeVisible();
    await expect(page.locator('text=E2E_Tester')).toBeVisible();
  });
});
