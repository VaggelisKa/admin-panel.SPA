import { gql } from '@apollo/client';

export const QUERY_USER = gql `
    query GetUser {
      user {
        id
        email
        username
        roles
        created_at
      }
    }
`;

export const QUERY_USERS = gql `
  query GetUsers {
    users {
      id
      email
      username
      roles
      created_at
    }
  }
`;
