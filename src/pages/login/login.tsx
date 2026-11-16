import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser, selectUserError } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(selectUserError);

  const locationState = location.state as {
    from?: { pathname: string; search?: string; hash?: string };
  } | null;

  const from = locationState?.from;
  const redirectPath = from
    ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
    : '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(redirectPath, { replace: true });
      })
      .catch((error) => {
        console.error('Ошибка входа:', error);
      });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
