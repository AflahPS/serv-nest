import { User } from 'src/user/user.model';

export const checkIfAdmin = (user: User): boolean => {
  return user.role === 'admin' || user.role === 'super-admin';
};

export const deletePassword = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
};

export const returnNotFound = (
  err: Error,
  carrier: string,
  isArray?: boolean,
) => {
  if (err?.message !== 'No documents found !') return null;
  const returnObj = { status: 'failed', message: 'No data found!' };
  returnObj[carrier] = isArray ? [] : null;
  return returnObj;
};
