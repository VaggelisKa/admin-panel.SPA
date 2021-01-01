import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { AuthContext } from 'context/AuthContextProvider';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user]);

  return ( user ? <h2>Welcome to your dashboard, {user.username}</h2> : <p>Loading...</p> );
};

export default Dashboard;
