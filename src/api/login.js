import { URL } from '../api/constants'

export const postLogin = async (username, password) => {
  return await fetch(`${URL}/login`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
};
