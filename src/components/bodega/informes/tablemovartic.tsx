import { IParteEntrada, IParteSalida } from "@/interfaces/creation";
import { useEffect, useState } from "react";
import { Table } from "react-daisyui";

interface props {
    dataEntrada: IParteEntrada[];
    dataSalida: IParteSalida[];
}
export default function TableMoveArticle(props: props) {

    return (
        <>
            <Table className="shadow-md border rounded-md" >
                <Table.Head className="bg-primary text-base-100">
                    <span>Encargado</span>
                    <span>Fecha</span>
                    <span>Rut Proveedor</span>
                    <span>Proveedor</span>
                    <span>Concepto</span>
                    <span>Tipo Documento</span>
                    <span>N° Documento</span>
                    <span>Precio Compra</span>
                    <span>UN Entradas</span>
                    <span>UN Salidas</span>
                    <span>UN Saldo</span>
                </Table.Head>

                <Table.Body>
                    {props.dataEntrada.map((entrada, indexEntrada) => (
                        <Table.Row hover key={indexEntrada}>
                            <span>{entrada.recepcionDetalle?.recepcion?.funcionarioEmpresa?.funcionario?.idNavigation?.nombres ?? "No disponible"} {entrada.recepcionDetalle?.recepcion?.funcionarioEmpresa?.funcionario?.idNavigation.apellidoPaterno ?? " "}</span>
                            <span>{new Date(entrada.fecha).toLocaleDateString() ?? "No disponible"}</span>
                            <span>{entrada.recepcionDetalle?.recepcion?.cotizacion?.proveedor?.rut ?? "No disponible"}</span>
                            <span>{entrada.recepcionDetalle?.recepcion?.cotizacion?.proveedor?.razonSocial ?? "No disponible"}</span>
                            <span>-</span>
                            <span>{entrada.recepcionDetalle?.recepcion?.tipoDocumentoRecepcionCodigoNavigation?.nombre ?? "No disponible"}</span>
                            <span>{entrada.numero}</span>
                            <span>{entrada.recepcionDetalle?.recepcion?.cotizacion?.cotizacionDetalles[0]?.valorUnitario ?? "No disponible"}</span>
                            <span>{entrada.cantidad ?? "No disponible"}</span>
                            <span>-</span>
                            <span>{entrada.almacenArticulo.cantidad ?? "No disponible"}</span>
                        </Table.Row>
                    ))}
                    {props.dataSalida.map((salida, indexSalida) => (
                        <Table.Row hover key={indexSalida}>
                            <span>{salida.almacenArticulo.almacen.bodega.empresa.funcionarioEmpresas[0].funcionario.idNavigation.nombres ?? "No disponible"} {salida.almacenArticulo.almacen.bodega.empresa.funcionarioEmpresas[0].funcionario.idNavigation.apellidoPaterno ?? " "}</span>
                            <span>{new Date(salida.fecha).toLocaleDateString() ?? "No disponible"}</span>
                            <span>{salida.almacenArticulo.almacen.bodega.empresa.rut ?? "No disponible"}</span>
                            <span>{salida.almacenArticulo.almacen.bodega.nombre ?? "No disponible"}</span>
                            <span>Depacho Mercaderia</span>
                            <span>Guia de salida interna</span>
                            <span>{salida.numero ?? "No disponible"}</span>
                            <span>-</span>
                            <span>-</span>
                            <span>{salida.cantidad ?? "No disponible"}</span>
                            <span>{salida.almacenArticulo.cantidad ?? "No disponible"}</span>
                        </Table.Row>
                    ))}

                </Table.Body>
            </Table>
        </>
    );
}