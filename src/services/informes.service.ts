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

export function api_getinformeArticulo(
  bearer: string,
  empresa: string,
  almacen: string,
  fechaDesde: string,
  fechaHasta: string,
  articulo?: string,
) {
  let query = `empresa=${empresa}`;
  query = query + `&almacen=${almacen}`;
  query = query + `&fecha_desde=${fechaDesde}`;
  query = query + `&fecha_hasta=${fechaHasta}`;
  if (articulo) query = query + `&articulo=${articulo}`;
  return api.get(`informe/movimientos/busqueda?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getinformeQuiebreStock(
  bearer: string,
  empresa: string,
  page: number,
  perPage: number,
) {
  let query = `empresa=${empresa}&page=${page}&perPage=${perPage}`;
  return api.get(`informe/quiebrestock/busqueda?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getinformeQuiebreStockExcel(
  bearer: string,
  empresa: string,
  perPage: number,
) {
  let query = `empresa=${empresa}&perPage=${perPage}`;
  return api.get(`informe/quiebrestock/busqueda/excel?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
    responseType: "blob",
  });
}

export function api_getinformeInput(
  bearer: string,
  empresa: string,
  almacen: string,
  fechaDesde: string,
  fechaHasta: string,
  articulo: string,
) {
  let query = `empresa=${empresa}`;
  query = query + `&almacen=${almacen}`;
  query = query + `&fecha_desde=${fechaDesde}`;
  query = query + `&fecha_hasta=${fechaHasta}`;
  query = query + `&articulo=${articulo}`;
  return api.get(`informe/movimientos/entradas?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getinformeOutput(
  bearer: string,
  empresa: string,
  almacen: string,
  fechaDesde: string,
  fechaHasta: string,
  articulo: string,
) {
  let query = `empresa=${empresa}`;
  query = query + `&almacen=${almacen}`;
  query = query + `&fecha_desde=${fechaDesde}`;
  query = query + `&fecha_hasta=${fechaHasta}`;
  query = query + `&articulo=${articulo}`;
  return api.get(`informe/movimientos/salidas?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getInputOutputExcel(
  bearer: string,
  empresa: string,
  almacen: string,
  fechaDesde: string,
  fechaHasta: string,
  articulo: string,
  tarjeta: boolean,
) {
  let query = `empresa=${empresa}`;
  query = query + `&almacen=${almacen}`;
  query = query + `&fecha_desde=${fechaDesde}`;
  query = query + `&fecha_hasta=${fechaHasta}`;
  query = query + `&articulo=${articulo}`;
  query = query + `&tarjeta=${tarjeta}`;
  return api.get(`informe/movimientos/excel?${query}`, {
    headers: { Authorization: `Bearer ${bearer}` },
    responseType: "blob",
  });
}

export function api_getIFRByDetalle(
  bearer: string,
  inventarioFisicoDetalleId: string,
) {
  return api.get(
    `inventariofisicoregistro/${inventarioFisicoDetalleId}?excel=false`,
    { headers: { Authorization: `Bearer ${bearer}` } },
  );
}
export function api_getIFRByDetalleToExcel(
  bearer: string,
  inventarioFisicoDetalleId: string,
) {
  return api.get(
    `inventariofisicoregistro/${inventarioFisicoDetalleId}?excel=true`,
    { headers: { Authorization: `Bearer ${bearer}` }, responseType: "blob" },
  );
}
export function api_getMyNotifys(bearer: string) {
  return api.get(`/empresa/myNotifys`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
