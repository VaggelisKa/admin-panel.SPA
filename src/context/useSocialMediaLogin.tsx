import { useContext, useEffect, useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

import { SOCIAL_MEDIA_LOGIN_MUTATION } from 'apollo/mutations';
import { Provider, SocialMediaLoginArgs, User } from 'types';
import { AuthContext } from 'context/AuthContextProvider';

interface FacebookLoginRes {
    name: string;
    id: string;
    email: string;
    expiresIn: number
}

interface GoogleLoginRes {
    profileObj: {
        email: string;
        givenName: string
        googleId: string
    };
    tokenObj: {
        expires_at: number
        expires_in: number
    }
}

export const useSocialMediaLogin = () => {
  const [loadingResult, setLoadingResult] = useState(false);
  const [errorResult, setErrorResult] = useState<ApolloError | undefined>(undefined);

  const [socialMediaLogin, { error, loading }] = useMutation<{socialMediaLogin: User},
    SocialMediaLoginArgs>(SOCIAL_MEDIA_LOGIN_MUTATION);
  const { setAuthUser, handleAuthAction } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    setLoadingResult(loading);
  }, [loading]);

  useEffect(() => {
    setErrorResult(error);
  }, [error]);

  const facebookLogin = async (response: FacebookLoginRes) => {
    try {
      const { id, name, email, expiresIn } = response;
      const expiration = Date.now() + expiresIn * 1000;

      const userRes = await socialMediaLogin({
        variables: {
          id,
          username: name,
          email,
          expiration: expiration.toString(),
          provider: Provider.facebook
        }
      });

      if (userRes?.data?.socialMediaLogin) {
        const { socialMediaLogin } = userRes.data;

        setAuthUser(socialMediaLogin);
        handleAuthAction('close');
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
      setAuthUser(null);
    }
  };

  const googleLogin = async (response: GoogleLoginRes) => {
    try {
      const { givenName, email, googleId } = response.profileObj;
      const { expires_in } = response.tokenObj;
      const expiration = Date.now() + expires_in * 1000;

      const userRes = await socialMediaLogin({
        variables: {
          id: googleId,
          username: givenName,
          email,
          expiration: expiration.toString(),
          provider: Provider.google
        }
      });

      if (userRes?.data?.socialMediaLogin) {
        const { socialMediaLogin } = userRes.data;

        setAuthUser(socialMediaLogin);
        handleAuthAction('close');
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
      setAuthUser(null);
    }
  };

  return {
    facebookLogin,
    googleLogin,
    loadingResult,
    errorResult
  };
};

