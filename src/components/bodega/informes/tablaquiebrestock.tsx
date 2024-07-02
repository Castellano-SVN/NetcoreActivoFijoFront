import { Table } from "react-daisyui";

export default function TablaQuiebreStock() {
    return (
        <>
            <Table className="shadow-md border rounded-md" >
                <Table.Head className="bg-primary text-base-100">
                    <span>Correlativo</span>
                    <span>Codigo Articulo</span>
                    <span>Codigo Familia</span>
                    <span>Familia</span>
                    <span>Codigo-Subfamilia</span>
                    <span>SubFamilia</span>
                    <span>Descripcion Articulo</span>
                    <span>Cantidad Registro Sistema</span>
                    <span>Stock Critico</span>
                    <span>Proceso Compra</span>
                </Table.Head>

                <Table.Body>
                    <Table.Row hover>
                        <span>Correlativo 1</span>
                        <span>Codigo Articulo 1</span>
                        <span>Codigo Familia 1</span>
                        <span>Familia 1</span>
                        <span>Codigo-Subfamilia 1</span>
                        <span>SubFamilia 1</span>
                        <span>Descripcion Articulo 1</span>
                        <span>Cantidad Registro Sistema 1</span>
                        <span>Stock Critico 1</span>
                        <span>Proceso Compra 1</span>
                    </Table.Row>

                    <Table.Row hover>
                        <span>Correlativo 2</span>
                        <span>Codigo Articulo 2</span>
                        <span>Codigo Familia 2</span>
                        <span>Familia 2</span>
                        <span>Codigo-Subfamilia 2</span>
                        <span>SubFamilia 2</span>
                        <span>Descripcion Articulo 2</span>
                        <span>Cantidad Registro Sistema 2</span>
                        <span>Stock Critico 2</span>
                        <span>Proceso Compra 2</span>
                    </Table.Row>

                    <Table.Row hover>
                        <span>Correlativo 3</span>
                        <span>Codigo Articulo 3</span>
                        <span>Codigo Familia 3</span>
                        <span>Familia 3</span>
                        <span>Codigo-Subfamilia 3</span>
                        <span>SubFamilia 3</span>
                        <span>Descripcion Articulo 3</span>
                        <span>Cantidad Registro Sistema 3</span>
                        <span>Stock Critico 3</span>
                        <span>Proceso Compra 3</span>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
}