import { User } from 'src/user/user.model';

export const checkIfAdmin = (user: User): boolean => {
  return user.role === 'admin' || user.role === 'super-admin';
};
