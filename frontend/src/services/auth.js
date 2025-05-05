import API from './api';

export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const registerUser = async (email, password) => {
  const { data } = await API.post('/auth/register', { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const getCurrentUser = async () => {
  const { data } = await API.get('/auth/me');
  return data;
};