import axios from 'axios';
import errorLog from 'debug';

const API = axios.create({
  // For Heroku
  // baseURL: process.env.DATABASE_URL || 'https://endpoint.yourcode.app/dtangram/api',

  // For Heroku
  baseURL: process.env.API_URL || 'http://localhost:5000',

  // For Heroku Staging
  // baseURL: 'https://herolog.herokuapp.com/',

  // For Heroku Production
  // baseURL: 'https://hero-log-production.herokuapp.com/',

  // For hosting locally
  // baseURL: process.env.API_URL || 'https://endpoint.yourcode.app/dtangram/api',

  // For localhosting on Port 4000 for database
  // baseURL: process.env.API_URL || 'http://localhost:4000',
});

API.interceptors.response.use(
  response => (response ? response.data : {}),
  (error) => {
    errorLog(error);
    return error;
  },
);

// for each api request going out
API.interceptors.request.use(async (config) => {
  // pull the token out of local storage
  const token = localStorage.getItem('token');
  // if there is no token do nothing
  if (!token) return config;
  // if there is a token, set a header for any request that contains the token
  return {
    ...config,
    headers: { common: { token } },
  };
});

export default API;
