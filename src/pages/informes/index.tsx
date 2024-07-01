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

    useEffect(() => {
        setActive("Informes");
    }, []);

    const handleButtonClick = (page: string) => {
        setCurrentPage(page);
    };


    return (
        <>
            <div className="flex flex-col items-center shadow-lg border rounded-md">
                <div className="flex justify-center my-4 p-4 border rounded-md w-9/12">
                    <Button
                        className="mr-2 btn btn-outline btn-primary"
                        onClick={() => handleButtonClick("movimientoArticulos")}
                    >
                        Movimiento de artículo
                    </Button>
                    <Button
                        className="mr-2 btn btn-outline btn-primary"
                        onClick={() => handleButtonClick("tarjetaExistencia")}
                    >
                        Tarjeta de existencia
                    </Button>
                    <Button
                        className="mr-2 btn btn-outline btn-primary"
                        onClick={() => handleButtonClick("inventarioFisico")}
                    >
                        Informe inventario físico
                    </Button>
                    <Button
                        className="btn btn-outline btn-primary"
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