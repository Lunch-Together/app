import { URL } from '../api/constants'

export const postUser = async (username, password, nickname) => {
  return await fetch(`${URL}/users`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      nickname
    })
  });
};
