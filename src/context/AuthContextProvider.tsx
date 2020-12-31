import React,
{
  createContext,
  useState,
  useCallback,
  ReactChild,
  useEffect
} from 'react';
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
  user: User | null
}

const initialState: AuthContextValues = {
  authAction: 'close',
  handleAuthAction: () => {},
  user: null,
};

export const AuthContext = createContext<AuthContextValues>(initialState);

const AuthContextProvider: React.FC<Props> = ({ children }: Props) => {
  const [authAction, setAuthAction] = useState<Actions>('close');
  const [user, setUser] = useState<User | null>(null);
  const { data } = useQuery<{user: User}>(QUERY_USER);

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  const handleAuthAction: HandleAuthAction = useCallback((action) => {
    setAuthAction(action);
  }, []);

  console.log('GQL data => ', user);
  return (
    <AuthContext.Provider
      value={{
        authAction,
        handleAuthAction,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
