import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Admin from 'components/Admin';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';

import { AuthContext } from 'context/AuthContextProvider';
import { User } from 'types';
import { isAdmin } from 'helpers/authHelpers';

const AdminPage = ({userSSR}: {userSSR: User | null}) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!userSSR) {
      router.push('/');
    } else {
      if (!isAdmin(userSSR)) {
        alert('No authorization');
        router.push('/dashboard');
      }
    }
  }, [userSSR]);

  return user ? <Admin /> : <p>Loading...</p>;
};

export default AdminPage;

const USER_INFO = {
  query: `
    query GetUser {
      user {
        id
        email
        username
        roles
      }
    }
  `
};

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies[process.env.NEXT_PUBLIC_TOKEN_NAME!];

    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URI!, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // eslint-disable-next-line quote-props
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(USER_INFO)
    });

    if (!res.ok) {
      return {
        props: {
          userSSR: null
        }
      };
    }

    const data = await res.json();

    return {
      props: {
        userSSR: data.data.user
      }
    };
  } catch (error) {
    return {
      props: {
        userSSR: null
      }
    };
  }
};
