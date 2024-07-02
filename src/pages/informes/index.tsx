import { useContextStore } from "@/store/context.store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-daisyui";
import MovimientoArticulos from "./movimientoArticulos";
import TarjetaExistencia from "./tarjetaExistencia";
import InventarioFisico from "./inventarioFisico";
import QuiebreStock from "./quiebreStock";


export default function index() {

    const { setActive } = useContextStore();
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [activeButton, setActiveButton] = useState<string | null>(null);


    useEffect(() => {
        setActive("Informes");
    }, []);

    useEffect(() => {
        if (currentPage) {
            setActiveButton(currentPage);
        }
    }, [currentPage]);

    const handleButtonClick = (page: string) => {
        setCurrentPage(page);
    };


    return (
        <>
            <div className="flex flex-col items-center shadow-lg border rounded-md">
                <div className="flex flex-col lg:flex-row md:justify-center lg:justify-center border rounded-md my-4 p-4 w-9/12">
                    <Button
                        className={`mb-2 md:mr-2 lg:mr-2 btn btn-outline btn-primary ${activeButton === "movimientoArticulos" ? "btn-active" : ""}`}
                        onClick={() => handleButtonClick("movimientoArticulos")}
                    >
                        Movimiento de artículo
                    </Button>
                    <Button
                        className={`mb-2 md:mr-2 lg:mr-2 btn btn-outline btn-primary ${activeButton === "tarjetaExistencia" ? "btn-active" : ""}`}
                        onClick={() => handleButtonClick("tarjetaExistencia")}
                    >
                        Tarjeta de existencia
                    </Button>
                    <Button
                        className={`mb-2 md:mr-2 lg:mr-2 btn btn-outline btn-primary ${activeButton === "inventarioFisico" ? "btn-active" : ""}`}
                        onClick={() => handleButtonClick("inventarioFisico")}
                    >
                        Informe inventario físico
                    </Button>
                    <Button
                        className={`btn btn-outline btn-primary ${activeButton === "quiebreStock" ? "btn-active" : ""}`}
                        onClick={() => handleButtonClick("quiebreStock")}
                    >
                        Quiebre de stock
                    </Button>
                </div>

                {currentPage === "movimientoArticulos" && (
                    <>
                        <div className="mb-4 p-4 border rounded-md w-11/12">
                            <MovimientoArticulos />
                        </div>
                    </>
                )}
                {currentPage === "tarjetaExistencia" && (
                    <>
                        <div className="mb-4 p-4 border rounded-md w-11/12">
                            <TarjetaExistencia />
                        </div>
                    </>
                )}
                {currentPage === "inventarioFisico" && (
                    <>
                        <div className="mb-4 p-4 border rounded-md w-11/12">
                            <InventarioFisico />
                        </div>
                    </>
                )}
                {currentPage === "quiebreStock" && (
                    <>
                        <div className="mb-4 p-4 border rounded-md w-11/12">
                            <QuiebreStock />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}