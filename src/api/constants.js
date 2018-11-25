import { SecureStore } from 'expo';

export const URL = 'http://10.0.2.2:3000';
export const getAccessToken = async function() {
  return await SecureStore.getItemAsync('token');
};
