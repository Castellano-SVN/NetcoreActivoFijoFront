import { Table } from "react-daisyui";

export default function TableMoveArticle() {
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
                    <Table.Row hover>
                        <span>Encargado 1</span>
                        <span>Fecha 1</span>
                        <span>Rut Proveedor 1</span>
                        <span>Proveedor 1</span>
                        <span>Concepto 1</span>
                        <span>Tipo Documento 1</span>
                        <span>N° Documento 1</span>
                        <span>Precio Compra 1</span>
                        <span>UN Entradas 1</span>
                        <span>UN Salidas 1</span>
                        <span>UN Saldo 1</span>
                    </Table.Row>

                    <Table.Row hover>
                        <span>Encargado 2</span>
                        <span>Fecha 2</span>
                        <span>Rut Proveedor 2</span>
                        <span>Proveedor 2</span>
                        <span>Concepto 2</span>
                        <span>Tipo Documento 2</span>
                        <span>N° Documento 2</span>
                        <span>Precio Compra 2</span>
                        <span>UN Entradas 2</span>
                        <span>UN Salidas 2</span>
                        <span>UN Saldo 2</span>
                    </Table.Row>

                    <Table.Row hover>
                        <span>Encargado 3</span>
                        <span>Fecha 3</span>
                        <span>Rut Proveedor 3</span>
                        <span>Proveedor 3</span>
                        <span>Concepto 3</span>
                        <span>Tipo Documento 3</span>
                        <span>N° Documento 3</span>
                        <span>Precio Compra 3</span>
                        <span>UN Entradas 3</span>
                        <span>UN Salidas 3</span>
                        <span>UN Saldo 3</span>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
}