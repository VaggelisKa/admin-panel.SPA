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

export const RESET_PASSWORD_MUTATION = gql `
    mutation ResetPassword($newPassword: String!, $token: String!) {
        resetPassword(newPassword: $newPassword, token: $token) {
            message
        }
    }
`;

export const UPDATE_ROLES_MUTATION = gql `
    mutation UpdateRoles($id: String!, $newRoles: [RoleOptions!]!) {
        updateRoles(id: $id, newRoles: $newRoles) {
            id
            username
            email
            roles
            created_at
        }
    }
`;

export const DELETE_USER_MUTATION = gql `
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id) {
            message
        }
    }
`;

export const SOCIAL_MEDIA_LOGIN_MUTATION = gql `
    mutation SocialMediaLogin(
        $username: String!,
        $email: String,
        $id: String!,
        $expiration: String!
        $provider: Provider!
    ) {
        socialMediaLogin(
            username: $username,
            email: $email,
            id: $id,
            expiration: $expiration,
            provider: $provider
        ) {
            id
            username
            email
            roles
            created_at
        }
    }
`;
