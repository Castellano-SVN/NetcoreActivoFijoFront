import GuiaEntrega from "@/components/bodega/salida/guiaEntrega";
import { api_getEstadoArticulos } from "@/services/inventario.service";
import { useContextStore } from "@/store/context.store";
import { useTiposStore } from "@/store/tipos.store";
import { useUserStore } from "@/store/user.store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Index() {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Salidas");
    }, []);
    const { jwt } = useUserStore();
    const searchParams = useSearchParams();
    const search = searchParams.get("empresa");
    const idEmpresa = String(search);
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
                <div className="container shadow-md border rounded-md">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Guía de Entrega</h1>
                    </div>
                    <div className="flex flex-row justify-center mb-4">
                        <div className="flex flex-col w-full">
                             <GuiaEntrega />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


