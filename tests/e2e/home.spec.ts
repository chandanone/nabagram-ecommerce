import { test, expect } from '@playwright/test';

/**
 * Homepage tests
 * baseURL = http://localhost:3000/en (set in playwright.config.ts)
 */
test.describe('Homepage', () => {
    test('loads with correct title and header', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Nabagram Seva Sangha/);
        await expect(page.getByRole('banner')).toBeVisible(); // <header>
    });

    test('navbar brand logo is visible', async ({ page }) => {
        await page.goto('/');
        // The logo circle with "N"
        await expect(page.locator('nav').getByText('N').first()).toBeVisible();
    });

    test('nav links render correctly', async ({ page }) => {
        await page.goto('/');
        const nav = page.getByRole('navigation');
        await expect(nav.getByRole('link', { name: /collections/i }).first()).toBeVisible();
        await expect(nav.getByRole('link', { name: /heritage|our heritage/i }).first()).toBeVisible();
        await expect(nav.getByRole('link', { name: /contact/i }).first()).toBeVisible();
    });

    test('clicking Collections nav link goes to /products', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('navigation').getByRole('link', { name: /collections/i }).first().click();
        await expect(page).toHaveURL(/\/products/);
    });

    test('cart icon is visible in header', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('navigation').locator('a[href*="cart"]')).toBeVisible();
    });

    test('Sign In button opens login modal', async ({ page }) => {
        await page.goto('/');
        const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
        await expect(signInBtn).toBeVisible();
        await signInBtn.click();
        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('footer is visible', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('contentinfo')).toBeVisible(); // <footer>
    });
});
