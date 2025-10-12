import ConOrden from "@/components/slugPages/recepcion/conOrden";
import SinOrden from "@/components/slugPages/recepcion/sinOrden";
import { ICotizacion, IOrdenCompra } from "@/interfaces/creation";
import {
  api_getOneConOrdenCompra,
  api_getOneSinOrdenCompra,
} from "@/services/bodega.service";
import { api_getEstadoArticulos } from "@/services/inventario.service";
import { useContextStore } from "@/store/context.store";
import { useTiposStore } from "@/store/tipos.store";
import { useUserStore } from "@/store/user.store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

export default function recepcion() {
  const { jwt } = useUserStore();

  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Recepcion");
  }, []);

  const searchParams = useSearchParams();
  const search = searchParams.get("empresa");
  const idEmpresa = String(search); // Convertir a cadena

  const [dataOrdenCompra, setDataOrdenCompra] = useState<IOrdenCompra[]>();
  const [dataSinOrdenCompra, setDataSinOrdenCompra] = useState<ICotizacion[]>();

  const [showConOrden, setShowConOrden] = useState(false);
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
        toast.error("Ingrese un numero");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Número de orden de compra invalido");
      } else {
        toast.error("Error al buscar la orden de compra");
      }
    }
  };
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const getEstadosArticulos = async () => {
    if (EstadoArticulo.length !== 0) return;

    try {
      const _data = await api_getEstadoArticulos(jwt);
      setEstadoArticulo(_data.data.dataList);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!jwt) return;
    getEstadosArticulos();
  }, []);
  return (
    <React.Fragment>
      <div className="flex items-center justify-center">
        <div className="container">
          <div className="p-1">
            <div>
              <>
                <div className="flex flex-row justify-center p-1">
                  <div className="flex flex-col shadow-md border rounded-md w-full p-2">
                    {showConOrden === false ? (
                      <>
                        <h5 className="text-2xl font-bold mb-4">
                          Orden de compra
                        </h5>
                        <div className="flex flex-col w-full items-center">
                          <label className="py-2 px-3 ml-4">
                            Ingrese número de la orden de compra
                          </label>
                          <input
                            type="number"
                            value={numero ?? ""} // Mostrar el número actual en el campo de entrada
                            onChange={(e) =>
                              setNumero(e.target.valueAsNumber || null)
                            } // Actualizar el estado del número
                            className="block w-full md:w-1/3 lg:w-1/3 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div className="flex flex-col items-center mt-4">
                          <button
                            className="btn btn-outline w-full md:w-1/4 lg:w-1/4 btn-primary"
                            onClick={getOrdenCompra} // Llamar a getSolicitud cuando se hace clic
                          >
                            <FaSearch />
                            Buscar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {dataOrdenCompra && numero && (
                          <ConOrden
                            valorPdf={conOrden}
                            dataConOrdenCompra={dataOrdenCompra}
                            numero={numero}
                            setShowConOrden={setShowConOrden}
                            setNumero={setNumero}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
