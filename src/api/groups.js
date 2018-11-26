import { URL } from '@api/constants'

export const getGroup = async (id) => {
  return await fetch(`${URL}/groups/${id}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};
