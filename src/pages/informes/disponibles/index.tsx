import { useContextStore } from "@/store/context.store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-daisyui";
import MovimientoArticulos from "./movimientoArticulos";
import TarjetaExistencia from "./tarjetaExistencia";
import InventarioFisico from "./inventarioFisico";
import QuiebreStock from "./quiebreStock";
import WarningAlert from "@/components/alerts/warningAlert";

export default function index() {
  const [tab, setTab] = useState<number>(0);

  const { setActive } = useContextStore();
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (page: string) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="w-11/12 md:w-8/12  m-auto p- flex flex-col">
        <div className=" shadow  flex flex-row justify-around rounded p-1">
          <a
            onClick={() => {
              setTab(0);
            }}
            className={`${
              tab == 0 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Movimiento de artículos
          </a>
          <a
            onClick={() => {
              setTab(1);
            }}
            className={`${
              tab == 1 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Tarjeta de Existencia
          </a>
          {/* <a
            onClick={() => {
              setTab(2);
            }}
            className={`${
              tab == 2 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Inventario Fisico
          </a> */}
          <a
            onClick={() => {
              setTab(3);
            }}
            className={`${
              tab == 3 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Quiebre de stock
          </a>
        </div>
      </div>
      <div className="m-auto flex flex-col">
        {tab == 0 &&(
            <MovimientoArticulos/>
        )} 
        {tab == 1 &&( 
            <TarjetaExistencia/>
        )}
        {/* {tab == 2 &&(
            <InventarioFisico/>
        )}  */}
        {tab == 3 &&( 
            <QuiebreStock/>
        )}
        </div>
    </>
  );
}
