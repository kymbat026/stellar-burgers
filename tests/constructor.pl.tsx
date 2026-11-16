
import { test, expect } from '@playwright/test';
test.describe('Добавление ингредиентов в конструктор', () => {
    test.beforeEach(async ({ page }) => {
        await page.routeFromHAR('tests/hars/ingredients.har', {
            url: '**/api/ingredients',
            update: false
        });

        await page.goto('/');
    });
    test('Булка добавляется в конструктор', async ({ page }) => {
        const bunName = 'Краторная булка N-200i';

        const ingredient = page
            .locator('li')
            .filter({ hasText: bunName });

        await ingredient.getByRole('button', { name: 'Добавить' }).click();

        await expect(
            page.getByText(`${bunName} (верх)`)
        ).toBeVisible();

        await expect(
            page.getByText(`${bunName} (низ)`)
        ).toBeVisible();
    });
    test('Начинка добавляется в конструктор', async ({ page }) => {
        const ingredientName = 'Биокотлета из марсианской Магнолии';

        const ingredient = page
            .locator('li')
            .filter({ hasText: ingredientName });

        await ingredient.getByRole('button', { name: 'Добавить' }).click();

        await expect(
            page.getByText(ingredientName, { exact: true })
        ).toHaveCount(2);
    });
});
test.describe('Модальное окно ингредиента', () => {
    test.beforeEach(async ({ page }) => {
        await page.routeFromHAR('tests/hars/ingredients.har', {
            url: '**/api/ingredients',
            update: false
        });

        await page.goto('/');
    });

    test('Открывается модальное окно ингредиента', async ({ page }) => {
        const ingredientName = 'Краторная булка N-200i';

        await page.getByText(ingredientName, { exact: true }).click();

        await expect(
            page.getByText(ingredientName, { exact: true })
        ).toHaveCount(2);

        await expect(
            page.getByText('Детали ингредиента')
        ).toBeVisible();
    });
    test('Модальное окно закрывается по нажатию на крестик', async ({ page }) => {
        const ingredientName = 'Краторная булка N-200i';

        await page.getByText(ingredientName, { exact: true }).click();

        await expect(
            page.getByText('Детали ингредиента')
        ).toBeVisible();

        await page.getByRole('button', { name: 'Закрыть' }).click();

        await expect(
            page.getByText('Детали ингредиента')
        ).not.toBeVisible();
    });
    test('Модальное окно закрывается по нажатию на фон', async ({ page }) => {
        const ingredientName = 'Краторная булка N-200i';

        await page.getByText(ingredientName, { exact: true }).click();

        await expect(
            page.getByText('Детали ингредиента')
        ).toBeVisible();

        await page.locator('[class*="overlay"]').click({ position: { x: 5, y: 5 } });

        await expect(
            page.getByText('Детали ингредиента')
        ).not.toBeVisible();
    });
});
test.describe('Оформление заказа', () => {
    test.beforeEach(async ({ page }) => {
        await page.routeFromHAR('tests/hars/ingredients.har', {
            url: '**/api/ingredients',
            update: false
        });
        await page.routeFromHAR('tests/hars/order.har', {
            url: '**/api/{auth/user,orders}',
            update: false,
            notFound: 'abort'
        });

        await page.addInitScript(() => {
            localStorage.setItem('refreshToken', 'test-refresh-token');
            document.cookie = 'accessToken=Bearer test-access-token; path=/';
        });

        await page.goto('/');
    });
    test('Пользователь может оформить заказ', async ({ page }) => {
        const bunName = 'Краторная булка N-200i';
        const fillingName = 'Биокотлета из марсианской Магнолии';

        await page
            .locator('li')
            .filter({ hasText: bunName })
            .getByRole('button', { name: 'Добавить' })
            .click();

        await page
            .locator('li')
            .filter({ hasText: fillingName })
            .getByRole('button', { name: 'Добавить' })
            .click();

        await page.getByRole('button', { name: 'Оформить заказ' }).click();

        await expect(page.getByText('12345')).toBeVisible();

        await expect(
            page.getByText('Выберите булки')
        ).toHaveCount(2);

        await expect(
            page.getByText('Выберите начинку')
        ).toBeVisible();
        await page.getByRole('button', { name: 'Закрыть' }).click();

        await expect(
            page.getByText('12345')
        ).not.toBeVisible();
    });
});