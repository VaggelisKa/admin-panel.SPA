export type Role = 'CLIENT' | 'ITEMEDITOR' | 'ADMIN' | 'SUPERADMIN';

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
