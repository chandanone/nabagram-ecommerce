import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
    test('signin page is accessible', async ({ page }) => {
        await page.goto('/auth/signin');
        await expect(page).toHaveURL(/\/auth\/signin/);
        await expect(page.getByText(/Something went wrong/i)).not.toBeVisible();
    });

    test('signin page has email and password fields', async ({ page }) => {
        await page.goto('/auth/signin');
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('signin form shows error for invalid credentials', async ({ page }) => {
        await page.goto('/auth/signin');
        await page.getByLabel(/email/i).fill('invalid@test.com');
        await page.getByLabel(/password/i).fill('wrongpassword');
        await page.getByRole('button', { name: /sign in/i }).click();
        // Should show an error toast or message
        await expect(
            page.getByText(/invalid|error|incorrect/i).first()
        ).toBeVisible({ timeout: 8_000 });
    });

    test('login modal opens from header Sign In button', async ({ page }) => {
        await page.goto('/');
        const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
        await signInBtn.click();
        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('login modal can be closed', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /sign in/i }).first().click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        // Close via Escape key
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible({ timeout: 3_000 });
    });

    test('Google sign in button is visible in modal', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /sign in/i }).first().click();
        await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    });
});
