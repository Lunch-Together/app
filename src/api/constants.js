import { SecureStore } from 'expo';

export const URL = 'http://10.110.161.53:3000';
export const getAccessToken = async function() {
  return await SecureStore.getItemAsync('token');
};
