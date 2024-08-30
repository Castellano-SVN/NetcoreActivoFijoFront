import { IParteEntrada, IParteSalida } from "@/interfaces/creation";
import { useEffect, useState } from "react";
import { Table } from "react-daisyui";

interface movimientoI {
  cantidad: number;
  fecha: Date;
  numero: number;
  fechaString: string;
  tipo: "entrada" | "salida";
  proveedorRut?: string;
  proveedorNombre?: string;
  funcionarioNombre?: string;
  tipoDocumento?: number;
  numeroDocumento?: number;
  precioCompra?: number;
  cantidadSalida?: number;
  saldo: number;
}
interface articleProps {
  article: {
    cantidad: number;
    direccion: string;
    id: string;
    nombre: string;
    empresa: string;
    almacen: string;
    fechaDesde: string;
    fechaHasta: string;
  };
}
interface ITdr {
  codigo: number;
  nombre: string;
}
interface props {
  movimientos: movimientoI[];
  articulos: articleProps;
  label: string;
}

export default function TableMovArtAndTarjetaExi(props: props) {
  
  useEffect(() => {
    console.log("movimiento:", props.movimientos);
  }, [props]);

  return (
    <>
      <div className="overflow-x-auto border">
        <Table className="shadow-md border rounded-md text-center">
          <Table.Head className="bg-primary text-base-100">
            <span>Encargado</span>
            <span>Fecha</span>
            <span>Rut Proveedor</span>
            <span>Proveedor</span>
            <span>Tipo Documento</span>
            <span>N° Documento</span>
            <span>Precio Compra</span>
            <span>UN Entradas</span>
            <span>UN Salidas</span>
            <span>UN Saldo</span>
            {props.label == "TarjetaExistencia" && <span>VAL Entradas</span>}
            {props.label == "TarjetaExistencia" && <span>VAL Salidas</span>}
            {props.label == "TarjetaExistencia" && <span>VAL Saldo</span>}
          </Table.Head>
          <Table.Body>
            {props.movimientos.map(
              (mov, index) =>
                mov.tipo === "entrada" ? (
                  <>
                    <Table.Row hover>
                      <span>{mov.funcionarioNombre ?? "No disponible"}</span>
                      <span>
                        {new Date(mov.fecha).toLocaleDateString() ??
                          "No disponible"}
                      </span>
                      <span>{mov.proveedorRut ?? "No disponible"}</span>
                      <span>{mov.proveedorNombre ?? "No disponible"}</span>
                      <span>{mov.tipoDocumento}</span>
                      <span>{mov.numeroDocumento === 0 ? "No disponible" : mov.numeroDocumento}</span>
                      <span>{mov.precioCompra === 0 ? "No disponible" : mov.precioCompra}</span>
                      <span className="text-green-500">
                        +{mov.cantidad ?? "No disponible"}
                      </span>
                      <span>-</span>
                      <span>{mov.saldo}</span>
                      {props.label === "TarjetaExistencia" ? <span> {mov.precioCompra && mov.cantidad ? mov.precioCompra * mov.cantidad : "No disponible"}</span>: (<></>)}
                      {props.label === "TarjetaExistencia" ? <span>-</span>:(<></>)}
                      {props.label === "TarjetaExistencia" ? <span> {mov.precioCompra && mov.saldo ? mov.precioCompra * mov.saldo : "No disponible"}</span>: (<></>)} 
                    </Table.Row>
                  </>
                  
                ) : mov.tipo === "salida" && (
                  <Table.Row hover>
                    <span>{mov.funcionarioNombre ?? "No disponible"}</span>
                    <span>
                      {new Date(mov.fecha).toLocaleDateString() ??
                        "No disponible"}
                    </span>
                    <span>{mov.proveedorRut ?? "No disponible"}</span>
                    <span>{mov.proveedorNombre ?? "No disponible"}</span>
                    <span>{mov.tipoDocumento}</span>
                    <span>{mov.numeroDocumento ?? "No disponible"}</span>
                    <span>{mov.precioCompra ?? "No disponible"}</span>
                    <span>-</span>
                    <span className="text-red-500">
                        -{mov.cantidad ?? "No disponible"}
                      </span>
                    <span>{mov.saldo}</span>
                  </Table.Row>
                )
            )}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}
