import React, { createContext, useState, useCallback, ReactChild } from 'react';

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

  const handleAuthAction: HandleAuthAction = useCallback((action) => {
    setAuthAction(action);
  }, []);

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
