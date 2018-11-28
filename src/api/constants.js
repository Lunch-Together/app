import { SecureStore } from 'expo';

export const URL = 'http://192.168.1.69:3000';
export const getAccessToken = async function() {
  return await SecureStore.getItemAsync('token');
};
