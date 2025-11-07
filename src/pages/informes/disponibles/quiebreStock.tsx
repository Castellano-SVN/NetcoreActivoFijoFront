import WarningAlert from "@/components/alerts/warningAlert";
import TablaQuiebreStock from "@/components/bodega/informes/tablas/TableQuiebreStock";
import FormularioStock from "@/components/bodega/informes/tablas/formularioStock";
import StockBodega from "@/components/stock/stockBodega";
import { IBodegaQuiebre } from "@/interfaces/creation";
import {
  api_getBodegas_almacenes,
  api_getEstadoArticulos,
} from "@/services/bodega.service";
import { api_getinformeQuiebreStock } from "@/services/informes.service";
import { useTiposStore } from "@/store/tipos.store";
import { useUserStore } from "@/store/user.store";
import router from "next/router";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { toast } from "react-toastify";
interface formI {
  CentroCosto: string;
  Bodega: string;
  Almacen: string;
  Articulo?: string;
  FechaDesde: Date;
  FechaHasta: Date;
}
interface props {
  dataQuiebre: IBodegaQuiebre[];
  dataQuiebrePdf: IBodegaQuiebre[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}
interface submitI {
  centro: string;
  bodega: string;
  almacen: string;
  // El signo de interrogación '?' indica que este campo es opcional
  Desde: string;
  Hasta: string;
}
interface dataI {
  id: string;
  nombre: string;
  codigo: null | string;
  collection: {
    codigo: string;
    nombre: string;
    stockMin: number;
    cantidad: number;
    id: string;
  }[];
}
export default function QuiebreStock(props: props) {
  const { jwt } = useUserStore();
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const [data, setData] = useState<dataI | undefined>(undefined);

  const getAlmacenes = async (id: string, isAlmacen: boolean) => {
    try {
      const data = await api_getBodegas_almacenes(jwt, id as string, isAlmacen);
      setData(data.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getFormData = (data: submitI) => {
    if (!data.almacen) {
      return getAlmacenes(data.bodega, false);
    }
    return getAlmacenes(data.almacen, true);
  };
  return (
    <div className="">
      <h1 className="text-2xl font-bold mt-4">Informe Quiebre de stock</h1>
      <FormularioStock loadData={getFormData} />
      {data && <StockBodega data={data} />}
    </div>
  );
}
