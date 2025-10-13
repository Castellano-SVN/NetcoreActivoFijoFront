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
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde.",
      );
    }
    // 2) Sin respuesta (p. ej. servidor caído o CORS bloqueado)
    else if (error.request && !error.response) {
      console.error("No hubo respuesta del servidor:", error.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde.",
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
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde.",
      );
    }

    return Promise.reject(error);
  },
);

export function api_getAllIFByEmpresa(
  bearer: string,
  empresaId: string,
  page: number,
  searchParams?: {
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  },
) {
  let url = `inventariofisico?empresaId=${empresaId}&page=${page}&perPage=6`;

  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm,
    )}&searchType=${searchParams.searchType}`;
  }

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getValidation(
  bearer: string,
  empresaId: string,
  numero: number,
) {
  return api.get(
    `inventariofisico/lista?empresaId=${empresaId}&numero=${numero}`,
    {
      headers: { Authorization: `Bearer ${bearer}` },
    },
  );
}
export function api_getAllInFiDe(
  bearer: string,
  empresaId: string,
  numero: number,
) {
  return api.get(
    `inventariofisicodetalleall?empresaId=${empresaId}&numero=${numero}`,
    {
      headers: { Authorization: `Bearer ${bearer}` },
    },
  );
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

export function api_getAllPersonasByEmpresa(
  bearer: string,
  empresaId: string,
  search?: string,
) {
  const url =
    `funcionarioempresa?empresaId=${empresaId}` +
    (search ? `&search=${search}` : "");

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postInventarioFisicoDetalle(bearer: string, data: any) {
  return api.post(`inventariofisicodetalle`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getEstadoArticulos(bearer: string) {
  return api.get(`almacenarticulosestados`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
