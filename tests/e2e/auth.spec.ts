import { test, expect } from '@playwright/test';

test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByPlaceholder('Enter username')).toBeVisible();
});

test('login as admin redirects to dashboard', async ({ page }) => {
    page.on('console', msg => console.log(msg.text()));
    await page.goto('/login');
    await page.getByPlaceholder('Enter username').fill('admin');
    await page.getByPlaceholder('Enter password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for navigation with increased timeout
    await expect(page).toHaveURL(/\/dashboard\/admin/, { timeout: 10000 });
    await expect(page.getByText('Admin Insights')).toBeVisible();
});
