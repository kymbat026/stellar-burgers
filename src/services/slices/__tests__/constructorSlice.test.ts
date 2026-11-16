import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';

describe('constructorSlice', () => {
  test('Возвращает начальное состояние', () => {
    const initialState = {
      bun: null,
      ingredients: [],
    };

    const result = constructorReducer(undefined, {
      type: 'UNKNOWN_ACTION',
    });

    expect(result).toEqual(initialState);
  });
  test('Добавляет булку в конструктор', () => {
    const bun = {
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
    };

    const initialState = {
      bun: null,
      ingredients: [],
    };

    const action = addIngredient(bun);

    const result = constructorReducer(initialState, action);

    expect(result.bun).toEqual(action.payload);
    expect(result.ingredients).toEqual([]);
  });
  test('Добавляет начинку в конструктор', () => {
    const filling = {
      _id: '2',
      name: 'Тестовая котлета',
      type: 'main',
      proteins: 20,
      fat: 10,
      carbohydrates: 5,
      calories: 200,
      price: 150,
      image: 'image.png',
      image_mobile: 'image-mobile.png',
      image_large: 'image-large.png',
    };

    const initialState = {
      bun: null,
      ingredients: [],
    };

    const action = addIngredient(filling);

    const result = constructorReducer(initialState, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(action.payload);
    expect(result.bun).toBeNull();
  });

  test('Удаляет начинку из конструктора', () => {
    const firstIngredient = {
      _id: '2',
      name: 'Тестовая котлета',
      type: 'main',
      proteins: 20,
      fat: 10,
      carbohydrates: 5,
      calories: 200,
      price: 150,
      image: 'image.png',
      image_mobile: 'image-mobile.png',
      image_large: 'image-large.png',
      id: 'first-id',
    };

    const secondIngredient = {
      ...firstIngredient,
      _id: '3',
      name: 'Тестовый сыр',
      id: 'second-id',
    };

    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const result = constructorReducer(
      initialState,
      removeIngredient(firstIngredient.id)
    );

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients).toEqual([secondIngredient]);
    expect(result.bun).toBeNull();
  });

  test('Изменяет порядок ингредиентов', () => {
    const firstIngredient = {
      _id: '1',
      name: 'Первая начинка',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'image.png',
      image_mobile: 'image-mobile.png',
      image_large: 'image-large.png',
      id: 'first-id',
    };

    const secondIngredient = {
      ...firstIngredient,
      _id: '2',
      name: 'Вторая начинка',
      id: 'second-id',
    };

    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const result = constructorReducer(
      initialState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(result.ingredients[0].id).toBe('second-id');
    expect(result.ingredients[1].id).toBe('first-id');
  });
  test('Очищает конструктор бургера', () => {
    const ingredient = {
      _id: '1',
      name: 'Тестовый ингредиент',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'image.png',
      image_mobile: 'image-mobile.png',
      image_large: 'image-large.png',
      id: 'test-id',
    };

    const initialState = {
      bun: { ...ingredient, type: 'bun' },
      ingredients: [ingredient],
    };

    const result = constructorReducer(initialState, clearConstructor());

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });
});
