import WarningAlert from "@/components/alerts/warningAlert";
import TablaQuiebreStock from "@/components/bodega/informes/tablas/TableQuiebreStock";
import { IBodegaQuiebre } from "@/interfaces/creation";
import { api_getEstadoArticulos } from "@/services/bodega.service";
import { api_getinformeQuiebreStock } from "@/services/informes.service";
import { useTiposStore } from "@/store/tipos.store";
import { useUserStore } from "@/store/user.store";
import router from "next/router";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { toast } from "react-toastify";

interface props {
  dataQuiebre: IBodegaQuiebre[];
  dataQuiebrePdf: IBodegaQuiebre[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

export default function QuiebreStock(props: props) {
  const { jwt } = useUserStore();
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
    <>
      <div className="">
        <h1 className="text-2xl font-bold mt-4">Informe Quiebre de Stock</h1>
        {props.dataQuiebre.length != 0 ? (
          <div className="w-11/12 md:w-8/12 m-auto border shadow-md rounded-lg p-2 transition duration-300 transform hover:border-primary mt-4 mb-4">
            <label className="mb-4 font-bold">Artículos con bajo stock</label>
            <TablaQuiebreStock
              dataQuiebre={props.dataQuiebre}
              dataQuiebrePdf={props.dataQuiebrePdf}
              fetchNextPage={props.fetchNextPage}
              hasNextPage={props.hasNextPage}
              isFetchingNextPage={props.isFetchingNextPage}
            />
          </div>
        ) : (
          <>
            <WarningAlert
              message={"No se han encontrado artículos con bajo stock"}
            />
          </>
        )}
      </div>
    </>
  );
}
