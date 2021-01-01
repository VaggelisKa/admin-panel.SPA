import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Admin from 'components/Admin';

import { AuthContext } from 'context/AuthContextProvider';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user]);

  return user ? <Admin /> : <p>Loading...</p>;
};

export default AdminPage;
