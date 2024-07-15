import axios from 'axios';
import Cookies from "js-cookie";
let token = Cookies.get("bearer")
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

export function api_postGuiaEntrega(bearer: string, data: any) {
    return api.post(`guiaentrega`, data, { headers: { "Authorization": `Bearer ${bearer}` } })
}
