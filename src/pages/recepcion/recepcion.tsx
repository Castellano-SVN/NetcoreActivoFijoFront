import ConOrden from "@/components/slugPages/recepcion/conOrden";
import SinOrden from "@/components/slugPages/recepcion/sinOrden";
import { ICotizacion, IOrdenCompra } from "@/interfaces/creation";
import { api_getOneConOrdenCompra, api_getOneSinOrdenCompra } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";



export default function recepcion() {
    const { jwt } = useUserStore();

    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Recepcion");
    }, []);

    const searchParams = useSearchParams()
    const search = searchParams.get('empresa')
    const idEmpresa = String(search); // Convertir a cadena


    const [showConOrden, setShowConOrden] = useState(false);
    const [dataOrdenCompra, setDataOrdenCompra] = useState<IOrdenCompra[]>();
    const [dataSinOrdenCompra, setDataSinOrdenCompra] = useState<ICotizacion[]>();


    const [showSinOrden, setShowSinOrden] = useState(false);
    const [numero, setNumero] = useState<number | null>(null);
    const [numeroCotizacion, setNumeroCotizacion] = useState<number | null>(null);


    const [conOrden, setConOrden] = useState(true);

    const getOrdenCompra = async () => {
        try {
            if (numero !== null) {
                const data = await api_getOneConOrdenCompra(jwt, idEmpresa, numero);
                setDataOrdenCompra(data.data.dataList);
                setShowConOrden(true);
            } else {
                toast.error("Ingrese un numero")
                setShowConOrden(false);
            }
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.status === 400) {
                toast.error("Numero de orden de compra invalido")
                setShowConOrden(false);
            } else {
                toast.error("Error al buscar la orden de compra")
                setShowConOrden(false);
            }
        }
    }

    const getSinOrdenCompra = async () => {
        try {
            if (numeroCotizacion !== null) {
                const data = await api_getOneSinOrdenCompra(jwt, idEmpresa, numeroCotizacion);
                setDataSinOrdenCompra(data.data.dataList);
                setShowSinOrden(true);
            } else {
                toast.error("Ingrese un numero de cotización")
                setShowSinOrden(false);
            }
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.status === 400) {
                toast.error("Numero de cotización invalido")
                setShowSinOrden(false);
            } else {
                toast.error("Error al buscar la cotización")
                setShowSinOrden(false);
            }
        }
    }





    return (
        <React.Fragment>
            <div className="flex items-center justify-center">
                <div className="container shadow-md border rounded-md">
                    <div className="p-6">
                        {!(showConOrden || showSinOrden) && (
                            <>
                                <div className="mb-2 flex justify-center">
                                    <fieldset className="border rounded-md w-1/2 p-2 flex flex-col lg:flex-row lg:justify-center ">
                                        <legend><h1 className="text-2xl font-bold">Recepción de Artículos</h1></legend>
                                        <label className="mr-4">
                                            <input
                                                type="radio"
                                                name="orden"
                                                value="conOrden"
                                                checked={conOrden}
                                                onChange={() => setConOrden(true)}
                                                className="radio radio-xs radio-primary ml-2 mr-2"
                                            />
                                            Con orden de compra
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="orden"
                                                value="sinOrden"
                                                checked={!conOrden}
                                                onChange={() => setConOrden(false)}
                                                className="radio radio-xs radio-primary ml-2 mr-2"
                                            />
                                            Sin orden de compra
                                        </label>
                                    </fieldset>
                                </div>
                            </>
                        )}
                        <div>
                            {conOrden ? (
                                <>
                                    <div className="flex flex-row justify-center p-4">
                                        <div className="flex flex-col shadow-md border rounded-md w-full p-6">
                                            {showConOrden === false ? (
                                                <>
                                                    <h5 className="text-2xl font-bold mb-4">Selección Recepción con orden de compra</h5>
                                                    <div className="flex flex-col w-full items-center">
                                                        <label className="py-2 px-3 ml-4">Ingrese número de la orden de compra</label>
                                                        <input
                                                            type="number"
                                                            value={numero ?? ''} // Mostrar el número actual en el campo de entrada
                                                            onChange={(e) => setNumero(e.target.valueAsNumber || null)} // Actualizar el estado del número
                                                            className="block w-full md:w-1/3 lg:w-1/3 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center mt-4">
                                                        <button
                                                            className="btn btn-outline w-full md:w-1/4 lg:w-1/4 btn-primary"
                                                            onClick={getOrdenCompra}  // Llamar a getSolicitud cuando se hace clic
                                                        >
                                                            <FaSearch />Buscar
                                                        </button>
                                                    </div>
                                                </>
                                            ) :
                                                (
                                                    <>
                                                        {dataOrdenCompra && numero && <ConOrden valorPdf={conOrden} dataConOrdenCompra={dataOrdenCompra} numero={numero} setShowConOrden={setShowConOrden} setNumero={setNumero} />}
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-row justify-center p-4">
                                        <div className="flex flex-col shadow-md border rounded-md w-full p-6">
                                            {showSinOrden === false ? (
                                                <>
                                                    <h5 className="text-2xl font-bold mb-4">Selección Recepción sin orden de compra</h5>
                                                    <div className="flex flex-col w-full items-center">
                                                        <label className="py-2 px-3 ml-4">Ingrese número de la cotización</label>
                                                        <input
                                                            type="number"
                                                            value={numeroCotizacion ?? ''} // Mostrar el número actual en el campo de entrada
                                                            onChange={(e) => setNumeroCotizacion(e.target.valueAsNumber || null)} // Actualizar el estado del número
                                                            className="block w-full md:w-1/3 lg:w-1/3 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center mt-4">
                                                        <button
                                                            className="btn btn-outline w-full md:w-1/4 lg:w-1/4 btn-primary"
                                                            onClick={getSinOrdenCompra}
                                                        >
                                                            <FaSearch />Buscar
                                                        </button>
                                                    </div>
                                                </>
                                            ) :
                                                (
                                                    <>
                                                        {dataSinOrdenCompra && <SinOrden dataSinOrdenCompra={dataSinOrdenCompra} />}
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}