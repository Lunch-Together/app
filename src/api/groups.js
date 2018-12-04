'use strict';

import { URL } from '../api/constants'
import { getAccessToken } from "./constants";

export const createGroup = async (tableId) => {
  return await fetch(`${URL}/groups`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify({
      TableId: tableId,
    })
  })
};

export const getGroups = async (q = null) => {
  return await fetch(`${URL}/groups?q=${q}`)
};

export const getGroup = async (id) => {
  return await fetch(`${URL}/groups/${id}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};

export const joinGroup = async (id) => {
  return await fetch(`${URL}/groups/${id}/join`, {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`
    }
  })
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
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify(orders)
  })
};

/**
 * 그룹 상태를 결제 상태로 변경한다
 *
 * @param id 그룹 아이디
 * @returns {Promise<Response>}
 */
export const changeGroupToPurchas = async (id) => {
  return await fetch(`${URL}/groups/${id}`, {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getAccessToken()}`
    },
    body: JSON.stringify({
      states: 'payment-in-progress'
    })
  })
};

export const changeGroupToSplit = async () => {

};

