
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

  // Проверяем, что до добавления булки нет
  await expect(
    page.getByText(`${bunName} (верх)`)
  ).not.toBeVisible();

  await expect(
    page.getByText(`${bunName} (низ)`)
  ).not.toBeVisible();

  // Добавляем булку
  await ingredient.getByRole('button', { name: 'Добавить' }).click();

  // Проверяем, что булка появилась
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

        const burgerConstructor = page.getByTestId('burger-constructor');

        await expect(
            burgerConstructor.getByText(ingredientName, { exact: true })
        ).toHaveCount(0);

        await ingredient.getByRole('button', { name: 'Добавить' }).click();

        await expect(
            burgerConstructor.getByText(ingredientName, { exact: true })
        ).toHaveCount(1);
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
    const modals = page.locator('#modals');
    await expect(modals).toBeEmpty();
    await page.getByText(ingredientName, { exact: true }).click();
    await expect(modals.getByText('Детали ингредиента')).toBeVisible();
    await expect(
        modals.getByText(ingredientName, { exact: true })
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

    const burgerConstructor = page.getByTestId('burger-constructor');
    const modals = page.locator('#modals');

    // Проверяем начальное состояние
    await expect(modals).toBeEmpty();

    await expect(
        burgerConstructor.getByText(`${bunName} (верх)`)
    ).toHaveCount(0);

    await expect(
        burgerConstructor.getByText(fillingName, { exact: true })
    ).toHaveCount(0);

    // Добавляем булку
    await page
        .locator('li')
        .filter({ hasText: bunName })
        .getByRole('button', { name: 'Добавить' })
        .click();

    // Добавляем начинку
    await page
        .locator('li')
        .filter({ hasText: fillingName })
        .getByRole('button', { name: 'Добавить' })
        .click();

    // Проверяем собранный конструктор
    await expect(
        burgerConstructor.getByText(`${bunName} (верх)`)
    ).toBeVisible();

    await expect(
        burgerConstructor.getByText(`${bunName} (низ)`)
    ).toBeVisible();

    await expect(
        burgerConstructor.getByText(fillingName, { exact: true })
    ).toBeVisible();

    // Перед оформлением модального окна нет
    await expect(modals).toBeEmpty();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Номер заказа появился именно в модальном окне
    await expect(modals.getByText('12345')).toBeVisible();

    // После оформления конструктор очистился
    await expect(
        burgerConstructor.getByText('Выберите булки')
    ).toHaveCount(2);

    await expect(
        burgerConstructor.getByText('Выберите начинку')
    ).toBeVisible();

    // Закрываем модальное окно
    await modals.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modals).toBeEmpty();
});

});