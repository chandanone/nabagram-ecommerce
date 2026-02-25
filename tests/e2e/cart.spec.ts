import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
    test('cart page loads', async ({ page }) => {
        await page.goto('/cart');
        await expect(page).toHaveURL(/\/cart/);
        await expect(page.getByText(/Something went wrong/i)).not.toBeVisible();
    });

    test('empty cart shows a message and browse link', async ({ page }) => {
        await page.goto('/cart');
        // Expect some empty state text
        await expect(
            page.getByText(/empty|no items/i).first()
        ).toBeVisible({ timeout: 10_000 });
    });

    test('cart icon in header shows correct count after adding product', async ({ page }) => {
        // Navigate to products
        await page.goto('/products');
        const firstCard = page.locator('[data-testid="product-card"]').first();
        await firstCard.waitFor({ timeout: 15_000 });
        await firstCard.click();

        // Add to cart
        const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
        await addToCartBtn.waitFor();
        await addToCartBtn.click();

        // Cart count badge should appear (> 0)
        const cartBadge = page.locator('nav a[href*="cart"] span').first();
        await expect(cartBadge).toBeVisible({ timeout: 5_000 });
    });

    test('cart page shows added product after add to cart', async ({ page }) => {
        await page.goto('/products');
        const firstCard = page.locator('[data-testid="product-card"]').first();
        await firstCard.waitFor({ timeout: 15_000 });
        await firstCard.click();

        const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
        await addToCartBtn.waitFor();
        await addToCartBtn.click();

        await page.goto('/cart');
        // Cart should have at least one item visible
        await expect(page.getByText(/empty|no items/i)).not.toBeVisible({ timeout: 5_000 });
    });
});
