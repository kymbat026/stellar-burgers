import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  const locationState = location.state as {
    from?: { pathname: string };
  } | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={locationState?.from?.pathname ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
