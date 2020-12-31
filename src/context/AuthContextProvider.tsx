import React, { createContext, useState, useCallback, ReactChild } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../apollo/queries';
import { User } from '../types';

interface Props {
  children: ReactChild | ReactChild[];
}

type Actions = 'signup' | 'signin' | 'request' | 'reset' | 'close'

type HandleAuthAction = (action: Actions) => void

interface AuthContextValues {
  authAction: Actions
  handleAuthAction: HandleAuthAction
}

const initialState: AuthContextValues = {
  authAction: 'close',
  handleAuthAction: () => {},
};

export const AuthContext = createContext<AuthContextValues>(initialState);

const AuthContextProvider: React.FC<Props> = ({ children }: Props) => {
  const [authAction, setAuthAction] = useState<Actions>('close');
  const { data } = useQuery<{user: User}>(QUERY_USER);

  const handleAuthAction: HandleAuthAction = useCallback((action) => {
    setAuthAction(action);
  }, []);

  console.log('GQL data => ', data);
  return (
    <AuthContext.Provider
      value={{
        authAction,
        handleAuthAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
