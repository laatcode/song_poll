import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;