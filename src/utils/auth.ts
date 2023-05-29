import api from './api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface LoginParams {
  username: string;
  password: string;
}

const auth = {
  login: async ({ username, password }: LoginParams): Promise<{data: any, status: number}> => {
    const response = await api.post('/login/', { username, password });
    const data = await response.json();

    if (response.status === 200) { // if response is ok
      if (data.data && data.data.access) { // check if access_token exists in the nested data
        Cookies.set('access_token', data.data.access); // set the access_token in the cookies
      } else {
        console.log("No access_token in response data:", data); 
      }
    } else {
      console.log("Login response not ok:", response.status); 
    }

    return { data, status: response.status }; // return data and status instead of the raw response
  },
  logout: async (): Promise<void> => {
    const navigate = useNavigate();
    Cookies.remove('access_token');
    console.log('deleted')
    navigate('/')
    window.location.reload();

  },
};



export default auth;
