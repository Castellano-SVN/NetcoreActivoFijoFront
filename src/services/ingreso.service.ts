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

export function api_Ingresos(bearer: string, data: any) {
  const params = new URLSearchParams(data).toString();
  return api.get(`ingreso/articulos?${params}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postSolicitud(bearer: string, data: any) {
  return api.post(`ingreso/solicitud`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getOneSolicitud(
  bearer: string,
  id: string,
  numero: number
) {
  return api.get(`ingreso/buscar/${id}/${numero}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_putSolicitud(bearer: string, data: any) {
  return api.put(`ingreso/actualizar`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_pdf_consulta(bearer: string, id: number, guid: string) {
  return api.get(`ingreso/actualizar/pdf?id=${id}&guid=${guid}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_tipoDocumentoRecepcion(bearer: string) {
  return api.get(`tipoDocumentoRecepcion`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getArticulos(
  bearer: string,
  empresa: string,
  familiaId?: string,
  subFamiliaId?: string,
  input?: string,
  page: number = 1,
  perPage: number = 10 // Valor predeterminado
) {
  let query = `empresa=${empresa}&page=${page}&perPage=${perPage}`;
  if (familiaId) query += `&familia=${familiaId}`;
  if (subFamiliaId) query += `&subfamilia=${subFamiliaId}`;
  if (input) query += `&nombre=${input}`;
  return api.get(`articulo/buscar?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postRecepcionSo(bearer: string, data: any) {
  return api.post(`ingreso/recepcionso`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
