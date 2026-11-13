import { AppHeader } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
} from '../../services/slices/ingredientsSlice';
import { checkUserAuth, authCheckComplete } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';
const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());

    if (localStorage.getItem('refreshToken')) {
      void dispatch(checkUserAuth());
    } else {
      dispatch(authCheckComplete());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({ isLoading, error }: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {`: ${error}`}
      </p>
    );
  }

  return <RouteComponent />;
};

type RouteModalProps = {
  title: string;
  children: React.ReactNode;
  fallbackPath: string;
};

const RouteModal = ({
  title,
  children,
  fallbackPath,
}: RouteModalProps): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Modal title={title} onClose={() => navigate(fallbackPath)}>
      {children}
    </Modal>
  );
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();

  const locationState = location.state as {
    background?: Location;
  } | null;

  const backgroundLocation = locationState?.background;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/feed/:number" element={<OrderInfo />} />

        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <RouteModal title="Информация о заказе" fallbackPath="/feed">
                <OrderInfo />
              </RouteModal>
            }
          />

          <Route
            path="/ingredients/:id"
            element={
              <RouteModal title="Детали ингредиента" fallbackPath="/">
                <IngredientDetails />
              </RouteModal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <RouteModal title="Информация о заказе" fallbackPath="/profile/orders">
                  <OrderInfo />
                </RouteModal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
