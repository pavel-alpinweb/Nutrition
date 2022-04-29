import axios from 'axios';
import Cookies from 'js-cookie';
import { eventBus } from '@/modules/utils';
import { BASE_API_URL } from '@/modules/constants';

export const token = Cookies.get('nutrition_jws');

export const HTTP = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    Authorization: 'Bearer ',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
HTTP.interceptors.request.use((config) => {
  const checkToken = config.url === '/auth/registration' || config.url === '/auth/changeCredential'
    ? Cookies.get('nutrition_registration_jws')
    : Cookies.get('nutrition_jws');
    // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${checkToken || ''}`;
  return config;
},
(error) => {
// Do something with request error
  eventBus.emit('showToast', {
    severity: 'error',
    summary: 'Непредвиденная ошибка',
    detail: 'Что-то очень пошло не так!',
    life: 3000,
  });
  return Promise.reject(error);
});

// Add a response interceptor
HTTP.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if (response.config.method !== 'get') {
    eventBus.emit('showToast', {
      severity: 'success',
      summary: response.data.title,
      detail: response.data.message,
      life: 5000,
    });
  }
  return response.data;
},
(error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  if (error.response.status === 401) {
    eventBus.emit('forceRedirect', '/login');
  }
  eventBus.emit('showToast', {
    severity: 'error',
    summary: error.response.data.title || 'Непредвиденная ошибка',
    detail: error.response.data.message || 'Что-то очень пошло не так!',
    life: 5000,
  });
  if (error.response.data.reasons.length) {
    error.response.data.reasons.forEach((reason) => {
      eventBus.emit('showToast', {
        severity: 'error',
        summary: reason.title || 'Непредвиденная ошибка',
        detail: reason.message || 'Что-то очень пошло не так!',
        life: 5000,
      });
    });
  }
  return Promise.reject(error);
});
