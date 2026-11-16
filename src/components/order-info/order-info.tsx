import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumber,
  selectSelectedOrder,
  selectSelectedOrderLoading,
  selectOrderError,
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';
export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const selectedOrder = useSelector(selectSelectedOrder);
  const isLoading = useSelector(selectSelectedOrderLoading);
  const error = useSelector(selectOrderError);

  useEffect(() => {
    if (number) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = selectedOrder;

  const ingredients = useSelector(selectIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка загрузки заказа: {error}</p>;
  }

  if (!orderInfo) {
    return <p>Информация о заказе не найдена</p>;
  }
  return <OrderInfoUI orderInfo={orderInfo} />;
};
