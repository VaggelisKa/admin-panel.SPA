import React from 'react';
import { AppProps } from 'next/app';

import Layout from '../components/Layout';
import AuthContextProvider from '../context/AuthContextProvider';

import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default App;
