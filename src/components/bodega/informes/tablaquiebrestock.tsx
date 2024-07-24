import { OutPutQuiebreStockFormValues } from "@/interfaces/creation";
import { IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { useEffect } from "react";
import { Table } from "react-daisyui";
import { Control, FieldArrayWithId, useFieldArray, UseFormSetValue } from "react-hook-form";


interface props {
    almacenArticulo: IAlmacenArticulo[];
    setValue: UseFormSetValue<OutPutQuiebreStockFormValues>;
    control: Control<OutPutQuiebreStockFormValues, any>;
}

export default function TablaQuiebreStock(props: props) {

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control: props.control, // <--- Pasar la propiedad control como opción
        name: 'QuiebreStock',
    });

    useEffect(() => {
        // Agregar nuevos campos
        props.almacenArticulo.map((a, index) => {
            append({
                Correlativo: index + 1,
                CodigoArticulo: a.articulo.codigo,
                CodigoFamilia: a.articulo.subFamilium.familium.codigo,
                Familia: a.articulo.subFamilium.familium.nombre,
                CodigoSubFamilia: a.articulo.subFamilium.codigo,
                SubFamilia: a.articulo.subFamilium.nombre,
                DescripcionArticulo: a.articulo.descripcion,
                CantidadSistema: a.cantidad,
                StockCritico: 0,
                ProcesoCompra: 'Proceso Compra'
            });
        });
    }, [props.almacenArticulo]);

    return (
        <>
            <Table className="shadow-md border rounded-md" >
                <Table.Head className="bg-primary text-base-100">
                    <span>Correlativo</span>
                    <span>Codigo Artículo</span>
                    <span>Codigo Familia</span>
                    <span>Familia</span>
                    <span>Codigo-Subfamilia</span>
                    <span>SubFamilia</span>
                    <span>Descripcion Artículo</span>
                    <span>Cantidad Registro Sistema</span>
                    <span>Stock Critico</span>
                    <span>Proceso Compra</span>
                </Table.Head>

                <Table.Body>
                    {fields.map((field, index) => (
                        <Table.Row hover key={field.id}>
                            <span>{field.Correlativo}</span>
                            <span>{field.CodigoArticulo}</span>
                            <span>{field.CodigoFamilia}</span>
                            <span>{field.Familia}</span>
                            <span>{field.CodigoSubFamilia}</span>
                            <span>{field.SubFamilia}</span>
                            <span>{field.DescripcionArticulo}</span>
                            <span>{field.CantidadSistema}</span>
                            <span>{field.StockCritico}</span>
                            <span>{field.ProcesoCompra}</span>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
}