export type Role = 'CLIENT' | 'ITEMEDITOR' | 'ADMIN' | 'SUPERADMIN';

export enum Provider {
  facebook = 'Facebook',
  google = 'Google'
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  created_at: string;
}

export interface SignupArgs {
  username: string;
  email: string;
  password: string;
}

export type SigninArgs = Pick<SignupArgs, 'email' | 'password'>
export type SocialMediaLoginArgs = Pick<User, 'id' | 'email' | 'username'>
  & {expiration: string; provider: Provider}
