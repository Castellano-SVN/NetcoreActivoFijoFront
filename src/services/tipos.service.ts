import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
let token = Cookies.get("bearer");
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
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

export function api_getNacionalidades(bearer: string) {
  return api.get(`nacionalidad`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getSexos(bearer: string) {
  return api.get(`sexos`, { headers: { Authorization: `Bearer ${bearer}` } });
}

export function api_getEstadoCivil(bearer: string) {
  return api.get(`estadocivil`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getNivelEducacional(bearer: string) {
  return api.get(`niveleducacional`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAreaGeografica(bearer: string) {
  return api.get(`areageografica`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getRegiones(bearer: string) {
  return api.get(`Region`, { headers: { Authorization: `Bearer ${bearer}` } });
}

export function api_getCiudades(bearer: string, region: number) {
  return api.get(`Ciudad/${region}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getComuna(bearer: string, region: number, ciudad: number) {
  return api.get(`Comuna/${region}/${ciudad}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getTipoAdministracion(bearer: string) {
  return api.get(`tipoadministracion`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getActividadEconomicaPrincipal(bearer: string) {
  return api.get(`actividadeconomicaprincipal`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getSectorActividadEconomicaPrincipal(
  bearer: string,
  actividad: number
) {
  return api.get(`sectoractividadeconomica/${actividad}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getTipoEstablecimientoSalud(bearer: string) {
  return api.get(`tipoEstablecimientoSalud`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postTipoAlmacen(bearer: string, data: any) {
  return api.post(`tipoalmacen/`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_putTipoAlmacen(bearer: string, data: any) {
  return api.put(`tipoalmacen/`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getTipoAlmacen(
  bearer: string,
  page = 1,
  searchParams?: {
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  }
) {
  let url = `tipoalmacen/?page=${page}`;

  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm
    )}&searchType=${searchParams.searchType}`;
  }

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postAlmacen(bearer: string, data: any) {
  return api.post(`almacen/`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAno(bearer: string) {
  return api.get(`ano/`, { headers: { Authorization: `Bearer ${bearer}` } });
}
export function api_getTipoUnidad(bearer: string) {
  return api.get(`tipoUnidad/`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
