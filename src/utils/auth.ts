import api from './api';
import Cookies from 'js-cookie';

interface LoginParams {
  username: string;
  password: string;
}

// auth.ts
const auth = {
  login: async ({ username, password }: LoginParams): Promise<{data: any, status: number}> => {
    const response = await api.post('/login/', { username, password });
    const data = await response.json();

    if (response.status === 200) { // if response is ok
      if (data.data && data.data.access) { // check if access_token exists in the nested data
        Cookies.set('access_token', data.data.access); // set the access_token in the cookies
      } else {
        console.log("No access_token in response data:", data); // for debugging
      }
    } else {
      console.log("Login response not ok:", response.status); // for debugging
    }

    return { data, status: response.status }; // return data and status instead of the raw response
  },
  logout: async (): Promise<void> => {
    Cookies.remove('access_token');
    console.log('deleted')
  },
};



export default auth;
