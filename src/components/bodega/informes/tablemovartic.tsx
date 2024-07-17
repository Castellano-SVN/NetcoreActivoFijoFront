import { IParteEntrada, IParteSalida } from "@/interfaces/creation";
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
                    <Table.Row hover>
                        <span></span>
                        <span>{new Date(entrada.fecha).toLocaleDateString()}</span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </Table.Row>
                    ))}
                    {props.dataSalida.map((salida, indexSalida) => (
                    <Table.Row hover>
                        <span></span>
                        <span>{new Date(salida.fecha).toLocaleDateString()}</span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </Table.Row>
                    ))}

                </Table.Body>
            </Table>
        </>
    );
}