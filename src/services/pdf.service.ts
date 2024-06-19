import axios from 'axios';
import Cookies from "js-cookie";
let token = Cookies.get("bearer")
const api = axios.create({
    headers: {
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


export function api_pdf_consulta(bearer: string,id:number,guid:string) {

    return api.get(`/api/ingreso/pdf/consulta?id=${id}&guid=${guid}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

