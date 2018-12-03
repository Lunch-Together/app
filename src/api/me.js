import { getAccessToken, URL } from '../api/constants'

export const getMe = async () => {
  return await fetch(`${URL}/me`, {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`,
    }
  })
};

export const getMeGroup = async () => {
  return await fetch(`${URL}/me/group`, {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`,
    }
  })
};
