import { SecureStore } from 'expo';

export const URL = 'http://172.30.1.22:3000';
export const getAccessToken = async function() {
  return await SecureStore.getItemAsync('token');
};
