import axios from "axios";

const getMembershipBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_MEMBRESIA_URL ||
    process.env.NEXT_PUBLIC_MEMBRESIA_MENU_URL ||
    process.env.NEXT_PUBLIC_STORAGE_URL_MEMBRESIA ||
    process.env.VITE_STORAGE_URL_MEMBRESIA ||
    ""
  );
};

/**
 * Menús/permisos desde Membresía.
 */
export async function api_getModeloMenusPermisos(bearer: string) {
  const baseUrl = getMembershipBaseUrl();
  if (!baseUrl) throw new Error("URL de menús de Membresía no configurada");

  const resp = await axios.get(
    `${baseUrl}/api/JsonPermisosAplicacionMenuPhone`,
    { headers: { Authorization: `Bearer ${bearer}` } },
  );
  return resp.data;
}

/**
 * Redirección al portal (devuelve la data del endpoint RedirectToPortal).
 */
export async function api_redirectToPortal(bearer: string) {
  const baseUrl = getMembershipBaseUrl();
  if (!baseUrl) throw new Error("URL de Membresía no configurada");

  const resp = await axios.post(
    `${baseUrl}/api/RedirectToPortal`,
    { token: bearer },
    { headers: { Authorization: `Bearer ${bearer}` } },
  );
  return resp.data;
}
