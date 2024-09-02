import { OutPutQuiebreStockFormValues } from "@/interfaces/creation";
import { IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { useEffect } from "react";
import { Table } from "react-daisyui";
import { Control, FieldArrayWithId, useFieldArray, UseFormSetValue } from "react-hook-form";



export default function TablaQuiebreStock() {

    return (
        <>
            <fieldset className="w-11/12 md:w-8/12 m-auto border shadow-md rounded-lg p-2 transition duration-300 transform hover:border-primary mt-3">
                <legend>Bodega </legend>
                <div className="overflow-x-auto w-full">


                    <Table className="shadow-md border rounded-md" >
                        <Table.Head className="bg-primary text-base-100">
                            <span>Correlativos</span>
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

                            <Table.Row hover >
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </Table.Row>

                        </Table.Body>
                    </Table>
            

                    </div>
            </fieldset>
        </>
    );
}