import { URL } from '@api/constants'
import { getAccessToken } from "./constants";

export const getGroup = async (id) => {
  return await fetch(`${URL}/groups/${id}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};

export const getGroupOrders = async (id) => {
  return await fetch(`${URL}/groups/${id}/orders`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`
    }
  })
};

export const postGroupOrders = async (id, orders) => {
  return await fetch(`${URL}/groups/${id}/orders`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify(orders)
  })
};
