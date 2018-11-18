import { URL } from '@api/constants'

export const postUser = async () => {
  await fetch(`${URL}/users`);
};
