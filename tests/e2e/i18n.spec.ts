import { test, expect } from '@playwright/test';

/**
 * i18n / language switching tests.
 * Verifies that locale switching (en <-> bn) works correctly.
 */
test.describe('Internationalization (i18n)', () => {
    test('English locale (default) loads at /en/', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/en\//);
    });

    test('Bengali locale loads at /bn/', async ({ page }) => {
        await page.goto('http://localhost:3000/bn');
        await expect(page).toHaveURL(/\/bn/);
        await expect(page.getByText(/Something went wrong/i)).not.toBeVisible();
    });

    test('language switcher is visible in header', async ({ page }) => {
        await page.goto('/');
        // Language switcher button
        await expect(page.locator('[data-testid="language-switcher"]')).toBeVisible();
    });

    test('switching to Bengali updates the URL to /bn/', async ({ page }) => {
        await page.goto('/');
        const switcher = page.locator('[data-testid="language-switcher"]');
        await switcher.click();
        // Click the Bengali option
        await page.getByRole('menuitem', { name: /বাংলা|Bengali|BN/i }).click();
        await expect(page).toHaveURL(/\/bn\//);
    });

    test('Bengali products page loads', async ({ page }) => {
        await page.goto('http://localhost:3000/bn/products');
        await expect(page).toHaveURL(/\/bn\/products/);
        await expect(page.getByText(/Something went wrong/i)).not.toBeVisible();
    });
});
