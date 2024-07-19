import { IParteEntrada, IParteSalida } from "@/interfaces/creation";
import { useState } from "react";
import { Table } from "react-daisyui";

interface props {
    dataEntrada: IParteEntrada[];
    dataSalida: IParteSalida[];
}
export default function TablaTarjetaExistencia(props: props) {
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
                    <span>VAL Entradas</span>
                    <span>VAL Salidas</span>
                    <span>VAL Saldo</span>
                </Table.Head>

                <Table.Body>
                {props.dataEntrada.map((entrada, indexEntrada) => (
                    <Table.Row hover key={indexEntrada}>
                        <span>{entrada.recepcionDetalle.recepcion.funcionarioEmpresa.funcionario.idNavigation.nombres} {entrada.recepcionDetalle.recepcion.funcionarioEmpresa.funcionario.idNavigation.apellidoPaterno}</span>
                        <span>{new Date(entrada.fecha).toLocaleDateString()}</span>
                        <span>{entrada.recepcionDetalle.recepcion.cotizacion.proveedor.rut}</span>
                        <span>{entrada.recepcionDetalle.recepcion.cotizacion.proveedor.razonSocial}</span>
                        <span>Compra</span>
                        <span>{entrada.recepcionDetalle.recepcion.tipoDocumentoRecepcionCodigoNavigation.nombre}</span>
                        <span>{entrada.numero}</span>
                        <span>{entrada.recepcionDetalle.recepcion.cotizacion.cotizacionDetalles[0].valorUnitario}</span>
                        <span>{entrada.cantidad}</span>
                        <span>-</span>
                        <span>{entrada.almacenArticulo.cantidad}</span>
                        <span>{entrada.recepcionDetalle.recepcion.cotizacion.cotizacionDetalles[0].valorUnitario * entrada.cantidad}</span>
                        <span>-</span>
                        <span>{entrada.recepcionDetalle.recepcion.cotizacion.cotizacionDetalles[0].valorUnitario * entrada.cantidad}</span>
                    </Table.Row>
                ))}
                {props.dataSalida.map((salida, indexSalida) => (
                    <Table.Row hover key={indexSalida}>
                        <span>{salida.almacenArticulo.almacen.bodega.empresa.funcionarioEmpresas[0].funcionario.idNavigation.nombres} {salida.almacenArticulo.almacen.bodega.empresa.funcionarioEmpresas[0].funcionario.idNavigation.apellidoPaterno}</span>
                        <span>{new Date(salida.fecha).toLocaleDateString()}</span>
                        <span>{salida.almacenArticulo.almacen.bodega.empresa.rut}</span>
                        <span>{salida.almacenArticulo.almacen.bodega.nombre}</span>
                        <span>Depacho Mercaderia</span>
                        <span>Guia de salida interna</span>
                        <span>{salida.numero}</span>
                        <span>-</span>
                        <span>-</span>
                        <span>{salida.cantidad}</span>
                        <span>{salida.almacenArticulo.cantidad}</span>
                        <span>-</span>
                        <span>30000</span>
                        <span>40000</span>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
        </>
    );
}