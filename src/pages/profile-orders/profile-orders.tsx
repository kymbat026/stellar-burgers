import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { Preloader } from '../../components/ui/preloader';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError,
} from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка загрузки заказов: {error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
