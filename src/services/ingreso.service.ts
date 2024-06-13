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


export function api_Ingresos(bearer: string, data: any) {

    const params = new URLSearchParams(data).toString();
    return api.get(`ingreso/articulos?${params}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_postSolicitud(bearer: string, data: any) {
    return api.post(`ingreso/solicitud`, data, { headers: { "Authorization": `Bearer ${bearer}` } })
  }
  