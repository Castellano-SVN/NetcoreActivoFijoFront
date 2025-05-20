import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
let token = Cookies.get("bearer");
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 1) Timeout (código ECONNABORTED)
    if (error.code === "ECONNABORTED") {
      console.error("Timeout de la petición:", error.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde."
      );
    }
    // 2) Sin respuesta (p. ej. servidor caído o CORS bloqueado)
    else if (error.request && !error.response) {
      console.error("No hubo respuesta del servidor:", error.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde."
      );
    }
    // 3) Error 404: logout
    else if (error.response?.status === 404) {
      console.log("Error 404 - Deslogueando...");
      // Ejemplo de logout:
      // Cookies.remove('bearer');
      // window.location.href = '/login';
    }
    // 4) Errores 5xx genéricos
    else if (error.response?.status! >= 500) {
      console.error(`Error ${error.response!.status} del servidor`);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde."
      );
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
