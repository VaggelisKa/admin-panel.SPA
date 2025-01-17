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
import { useRouter } from 'next/router';

interface Props {
  children: ReactChild | ReactChild[];
}

type Actions = 'signup' | 'signin' | 'request' | 'reset' | 'close'
type HandleAuthAction = (action: Actions) => void
type SetAuthUser = (user: User | null) => void

interface AuthContextValues {
  authAction: Actions
  handleAuthAction: HandleAuthAction
  setAuthUser: SetAuthUser
  user: User | null
}

const initialState: AuthContextValues = {
  authAction: 'close',
  handleAuthAction: () => {},
  setAuthUser: () => {},
  user: null,
};

export const AuthContext = createContext<AuthContextValues>(initialState);

const AuthContextProvider: React.FC<Props> = ({ children }: Props) => {
  const [authAction, setAuthAction] = useState<Actions>('close');
  const [user, setUser] = useState<User | null>(null);
  const { data } = useQuery<{user: User}>(QUERY_USER);
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  useEffect(() => {
    const syncSignout = (event: StorageEvent) => {
      if (event.key === 'signout') {
        setUser(null);

        window.localStorage.removeItem('signout');

        router.push('/');
      }
    };
    window.addEventListener('storage', syncSignout);

    return () => window.removeEventListener('storage', syncSignout);
  }, []);

  const handleAuthAction: HandleAuthAction = useCallback((action) => {
    setAuthAction(action);
  }, []);

  const setAuthUser = (user: User | null) => setUser(user);

  return (
    <AuthContext.Provider
      value={{
        authAction,
        handleAuthAction,
        user,
        setAuthUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
