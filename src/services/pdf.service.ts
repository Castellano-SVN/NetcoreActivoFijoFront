import axios from 'axios';
import Cookies from "js-cookie";
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 404) {
            // Aquí ejecutas la acción de deslogueo
            console.log('Error 404 - Deslogueando...');
        }
        return Promise.reject(error);
    }
);



