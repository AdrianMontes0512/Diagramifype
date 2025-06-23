import axios from 'axios';

export const API_AUTH = axios.create({
  baseURL: 'https://advydp11z8.execute-api.us-east-1.amazonaws.com/auth', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Login = async (loginData: {
  user_id:string,
  password:string
}) => {
  try {
    const response = await API_AUTH.post('/login', loginData);
    return response.data;
  } catch (error) {
    console.error('Problema al iniciar sesion', error);
    throw error;
  }
};

export const Register = async (loginData: {
  user_id:string,
  password:string
}) => {
  try {
    const response = await API_AUTH.post('/register', loginData);
    return response.data;
  } catch (error) {
    console.error('Problema al iniciar sesion', error);
    throw error;
  }
};

export const ValidateToken = async (token: string) => {
  try {
    const response = await API_AUTH.post('/validate', {
      token: token
    });
    return response.data;
  } catch (error) {
    console.error('Token inválido', error);
    throw error;
  }
};