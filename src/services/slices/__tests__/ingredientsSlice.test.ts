import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  test('Возвращает начальное состояние', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      error: null,
    };

    const result = ingredientsReducer(undefined, {
      type: 'UNKNOWN_ACTION',
    });

    expect(result).toEqual(initialState);
  });
  test('Устанавливает состояние загрузки при pending', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      error: null,
    };

    const action = fetchIngredients.pending('test-request-id', undefined);

    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });
  test('Сохраняет ингредиенты при fulfilled', () => {
    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const ingredients = [
      {
        _id: '1',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 100,
        image: 'image.png',
        image_mobile: 'image-mobile.png',
        image_large: 'image-large.png',
      },
    ];

    const action = fetchIngredients.fulfilled(ingredients, 'test-request-id', undefined);

    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ingredients,
      isLoading: false,
      error: null,
    });
  });
  test('Обрабатывает ошибку загрузки при rejected', () => {
    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.rejected(
      new Error('Ошибка сервера'),
      'test-request-id',
      undefined
    );

    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера',
    });
  });
});
