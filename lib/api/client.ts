import axios from "axios";

import { getToken, removeToken } from "@/lib/token";

const clientApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
});

clientApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clientApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: {
    response: {
      status: number;
    };
  }) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      removeToken();
    }

    return Promise.reject(error);
  }
);

export default clientApi;
