import BuscarArticuloMovTarjeta from "@/components/bodega/informes/BuscarArticulos";
import { api_getEstadoArticulos } from "@/services/inventario.service";
import { useTiposStore } from "@/store/tipos.store";
import { useUserStore } from "@/store/user.store";
import { useEffect } from "react";

export default function MovimientoArticulos() {
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const { jwt } = useUserStore();

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
    <>
      <div className="">
        <h1 className="text-2xl font-bold mt-4">
          Informe movimiento de artículos
        </h1>
        <BuscarArticuloMovTarjeta label="MovimientoArticulo" />
      </div>
    </>
  );
}
