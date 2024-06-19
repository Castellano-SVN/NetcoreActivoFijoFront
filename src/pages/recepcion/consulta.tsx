import PropiedadesConsulta from "@/components/slugPages/consultas/propiedadesConsulta";
import { IConsulta } from "@/interfaces/creation";
import { api_getOneSolicitud } from "@/services/ingreso.service";
import { useUserStore } from "@/store/user.store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaFilePdf, FaSave, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Consulta() {
    const { jwt } = useUserStore();
    const searchParams = useSearchParams();
    const id = searchParams.get('empresa'); //obtenemos la empresa

    const [dataSolicitud, setDataSolicitud] = useState<IConsulta>();
    const [numero, setNumero] = useState<number | null>(null);
    // Estado para el número ingresado

    const [showConsulta, setShowConsulta] = useState(false);



    const getSolicitud = async () => {
        try {
            if (numero !== null) {
                const data = await api_getOneSolicitud(jwt, id as string, numero);
                setDataSolicitud(data.data.dataList[0]);
                setShowConsulta(true);
            } else {
                toast.error("Ingrese un numero")
                setShowConsulta(false);
            }
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.status === 400) {
                toast.error("Numero de requerimiento invalido")
                setShowConsulta(false);
            } else {
                toast.error("Error al buscar la solicitud")
                setShowConsulta(false);
            }
        }
    }
    
    return (
        <>


            <div className="flex flex-row justify-center p-4">
                <div className="flex flex-col shadow-md border rounded-md w-full md:w-5/6 lg:w-3/5 p-6">
                    {showConsulta === false ? (
                        <>
                            <h5 className="text-2xl font-bold mb-4">Selección de requerimiento</h5>
                            <div className="flex flex-col w-full items-center">
                                <label className="py-2 px-3 ml-4">Ingrese número del requerimiento</label>
                                <input
                                    type="number"
                                    value={numero ?? ''} // Mostrar el número actual en el campo de entrada
                                    onChange={(e) => setNumero(e.target.valueAsNumber || null)} // Actualizar el estado del número
                                    className="block w-full md:w-1/2 lg:w-8/12 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                            <div className="flex flex-col items-center mt-4">
                                <button
                                    className="btn btn-outline w-full md:w-1/4 lg:w-1/4 btn-primary"
                                    onClick={getSolicitud} // Llamar a getSolicitud cuando se hace clic
                                >
                                    <FaSearch />Buscar
                                </button>
                            </div>
                        </>
                    ) :
                        (
                            <>
                                {dataSolicitud && <PropiedadesConsulta solicitud={dataSolicitud} volver={() => setShowConsulta(false)} />}
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}
