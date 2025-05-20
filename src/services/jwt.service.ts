import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const generateToken = async (rut: string) => {
  try {
    return await axios.get(`${url}GetToken/${rut}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Timeout (código ECONNABORTED)
    if (axiosError.code === "ECONNABORTED") {
      console.error("Timeout de la petición:", axiosError.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor"
      );
    }
    // Sin respuesta (p. ej. servidor caído o CORS bloqueado)
    else if (axiosError.request && !axiosError.response) {
      console.error("No hubo respuesta del servidor:", axiosError.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor"
      );
    }
    // Error de base de datos (normalmente un error 500 con mensaje específico)
    else if (axiosError.response?.status! >= 500) {
      toast.error(
        "Error de conexión a la base de datos"
      );
    }
    
    throw error; // Re-lanzar el error para que pueda ser manejado por el código que llama a esta función
  }
};

export { generateToken };