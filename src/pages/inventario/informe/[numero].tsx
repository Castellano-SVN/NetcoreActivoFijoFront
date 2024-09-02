import { IBodega } from "@/interfaces/creation";
import { api_getAllBodegasByEmpresa } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import router from "next/router";
import { useEffect, useState } from "react";

export default function InformeInventarioFisico() {
    const { setActive } = useContextStore();
    useEffect(() => {
        setActive("Toma inventario");
    }, []);

    const { jwt } = useUserStore();
    const { empresa, numero } = router.query;

    const empresaId = empresa as string;
    const numeroI = Number(numero);

    //todo malo nuevamente hacer lo siguiente: mostrar las bodegas que tiene un detalle
    //y dentro de ella todos los registros

    const [bodega, setBodega] = useState<IBodega[]>([]);
    const getBodegas = async () => {
        try {
            const data = await api_getAllBodegasByEmpresa(jwt, empresaId);
            setBodega(data.data.dataList);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!empresaId) return;
        getBodegas();
    }, [empresaId]);

    return (
        <>
            <div className="grid grid-cols-1 mx-auto gap-2">
                {bodega.map((e, index) => (
                    <Info bodega={e} />
                ))}
            </div>
        </>
    );
}

interface props {
    bodega:IBodega;
}

function Info(props:props) {
    return (
        <>
            <fieldset className=" border shadow-md rounded-lg p-2 transition duration-300 transform hover:border-primary mt-3">
                <legend className="mouse-pointer select-none">
                    <span>Informacion de la bodega: </span>
                    {props.bodega.nombre} <br />
                    {/* {props.bodega.descripcion == undefined ? (
                        "Sin codigo" + " " + props.article.nombre
                    ) : (
                        <>
                            <label>
                                {" "}
                                <span className="font-bold">Codigo: </span>
                                {props.article.codigo + " "}
                            </label>
                        </>
                    )} */}
                </legend>
                {/* {movimientos.length > 0 ? (
                    <>
                        <TableMovArtAndTarjetaExi
                            movimientos={movimientos}
                            articulos={props}
                            label={props.label}

                        />
                    </>
                ) : (
                    <>
                        <WarningAlert message={"Articulo sin movimientos en esta fecha."} />
                    </>
                )} */}
            </fieldset>
        </>
    );
}