import { URL } from '../api/constants'

export const getShopMenus = async function(shopId) {
  return await fetch(`${URL}/shops/${shopId}/menus`, {
    method: 'get'
  })
};

