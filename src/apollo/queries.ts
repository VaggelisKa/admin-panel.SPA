import { gql } from '@apollo/client';

export const QUERY_USER = gql `
    query GetUsers {
      user {
        id
        email
        username
        roles
      }
    }
`;