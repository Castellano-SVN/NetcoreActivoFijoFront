import axios from "axios";
import Cookies from "js-cookie";
let token = Cookies.get("bearer");
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 404) {
      // Aquí ejecutas la acción de deslogueo
      console.log("Error 404 - Deslogueando...");
    }
    return Promise.reject(error);
  }
);

export function api_getAllIFByEmpresa(bearer: string, empresaId: string,page: number) {
  return api.get(`inventariofisico?empresaId=${empresaId}&page=${page}&perPage=6`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getValidation(bearer: string, empresaId: string, numero: number) {
  return api.get(`inventariofisico/lista?empresaId=${empresaId}&numero=${numero}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAllInFiDe(bearer: string, empresaId: string, numero: number) {
  return api.get(`inventariofisicodetalleall?empresaId=${empresaId}&numero=${numero}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postInventarioFisico(bearer: string, data: any) {
  return api.post(`inventariofisico`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_postInventarioFisicoRegistro(bearer: string, data: any) {
  return api.post(`inventariofisicoregistro`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllPersonasByEmpresa(bearer: string, empresaId: string, search?: string) {
  const url = `funcionarioempresa?empresaId=${empresaId}` + (search ? `&search=${search}` : '');
  
  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postInventarioFisicoDetalle(bearer: string, data: any) {
  return api.post(`inventariofisicodetalle`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}