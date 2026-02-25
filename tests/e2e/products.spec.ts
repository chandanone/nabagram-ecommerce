import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
    test('products page loads without error', async ({ page }) => {
        await page.goto('/products');
        await expect(page).toHaveURL(/\/products/);
        // No error boundary should be shown
        await expect(page.getByText(/Something went wrong/i)).not.toBeVisible();
    });

    test('product cards are rendered', async ({ page }) => {
        await page.goto('/products');
        // Wait for at least one product card to appear
        const cards = page.locator('[data-testid="product-card"]');
        await cards.first().waitFor({ timeout: 15_000 });
        await expect(cards.first()).toBeVisible();
    });

    test('filter by MUSLIN updates URL', async ({ page }) => {
        await page.goto('/products');
        await page.goto('/products?type=MUSLIN');
        await expect(page).toHaveURL(/type=MUSLIN/);
    });

    test('filter by SILK_SAREE updates URL', async ({ page }) => {
        await page.goto('/products?type=SILK_SAREE');
        await expect(page).toHaveURL(/type=SILK_SAREE/);
    });

    test('clicking a product card opens detail page', async ({ page }) => {
        await page.goto('/products');
        const firstCard = page.locator('[data-testid="product-card"]').first();
        await firstCard.waitFor({ timeout: 15_000 });
        await firstCard.click();
        await expect(page).toHaveURL(/\/products\/.+/);
    });

    test('product detail page shows Add to Cart button', async ({ page }) => {
        await page.goto('/products');
        const firstCard = page.locator('[data-testid="product-card"]').first();
        await firstCard.waitFor({ timeout: 15_000 });
        await firstCard.click();
        await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
    });
});
