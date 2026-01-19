import { test, expect } from '@playwright/test';

test('homepage loads and has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Intellexa/);
});

test('navbar is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    // Check for navigation links
    const links = ['Home', 'Events', 'News', 'Hackathons', 'Team', 'Roadmaps'];
    for (const link of links) {
        await expect(page.getByRole('link', { name: link })).toBeVisible();
    }
});

test('core team section is present', async ({ page }) => {
    await page.goto('/');
    // Use a softer locator that matches case-insensitive or partial
    await expect(page.getByText('Core Team', { exact: false })).toBeVisible();
});
