import React, { useContext, useEffect } from 'react';
import Admin from 'components/Admin';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';

import { AuthContext } from 'context/AuthContextProvider';
import { User } from 'types';
import { isAdmin } from 'helpers/authHelpers';

const AdminPage: React.FC<{user: User}> = ({user}: {user: User}) => {
  const { setAuthUser } = useContext(AuthContext);

  useEffect(() => {
    setAuthUser(user);
  }, [user]);

  return user ? <Admin admin={user}/> : <p>Loading...</p>;
};


const USER_INFO = {
  query: `
    query {
      user {
        id
        email
        username
        roles
        created_at
      }
    }
  `
};

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies[process.env.NEXT_PUBLIC_TOKEN_NAME!];
    if (!token) {
      res.writeHead(302, {Location: '/'});
      res.end();
    }

    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URI!, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // eslint-disable-next-line quote-props
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(USER_INFO)
    });

    if (!response.ok) {
      return {
        props: {
          user: null
        }
      };
    }

    const data: {data: {user: User}} = await response.json();
    if (!data?.data?.user) {
      res.writeHead(302, {Location: '/'});
      res.end();
    }

    if (!isAdmin(data.data.user)) {
      res.writeHead(302, {Location: '/'});
      res.end();
    }

    return {
      props: {
        user: data.data.user
      }
    };
  } catch (error) {
    return {
      props: {
        user: null
      }
    };
  }
};

export default AdminPage;
