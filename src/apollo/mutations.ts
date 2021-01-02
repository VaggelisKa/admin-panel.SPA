import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql `
    mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
            id
            username
            email
            roles
        }
    }
`;

export const SIGNIN_MUTATION = gql `
    mutation Signin($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            username
            email
            roles
        }
    }
`;

export const SIGNOUT_MUTATION = gql `
    mutation Signout {
        signout {
            message
        }
    }
`;

export const REQUEST_TO_RESET_PASSWORD_MUTATION = gql `
    mutation RequestToResetPassword($email: String!) {
        requestToResetPassword(email: $email) {
            message
        }
    }
`;
