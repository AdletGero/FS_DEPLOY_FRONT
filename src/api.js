// src/api.js
import axios from "axios";

export const AUTH_BASE = import.meta.env.VITE_AUTH_URL+ "/auth";
export const CARS_BASE = import.meta.env.VITE_CARS_URL;

export const TOKEN_KEY = "jwt";

// Храним чистый JWT (без "Bearer ")
export const getJwt = () => sessionStorage.getItem(TOKEN_KEY) || "";
export const setJwt = (jwt) => sessionStorage.setItem(TOKEN_KEY, jwt || "");
export const clearJwt = () => sessionStorage.removeItem(TOKEN_KEY);

// Axios инстанс для CARS-бэка
export const api = axios.create({
    baseURL: CARS_BASE,
});

// Перехватчик: добавляет Authorization: Bearer <jwt>
api.interceptors.request.use((config) => {
    const jwt = getJwt();
    if (jwt) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});
