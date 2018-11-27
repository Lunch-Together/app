import { getAccessToken, URL } from '../api/constants'

export const getMeGroup = async () => {
  return await fetch(`${URL}/me/group`, {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`,
    }
  })
};
