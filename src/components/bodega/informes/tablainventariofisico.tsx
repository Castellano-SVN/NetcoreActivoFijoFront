import { Table } from "react-daisyui";

export default function TablaInventarioFisico() {
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
                    <span>Cantidad Fisica</span>
                    <span>Diferencia Inventario</span>
                </Table.Head>

                <Table.Body>
                    <Table.Row hover>
                        <span>Correlativo 1</span>
                        <span>Codigo Artículo 1</span>
                        <span>Codigo Familia 1</span>
                        <span>Familia 1</span>
                        <span>Codigo-Subfamilia 1</span>
                        <span>SubFamilia 1</span>
                        <span>Descripcion Artículo 1</span>
                        <span>Cantidad Registro Sistema 1</span>
                        <span>Cantidad Fisica 1</span>
                        <span>Diferencia Inventario 1</span>
                    </Table.Row>

                    <Table.Row hover>
                        <span>Correlativo 2</span>
                        <span>Codigo Artículo 2</span>
                        <span>Codigo Familia 2</span>
                        <span>Familia 2</span>
                        <span>Codigo-Subfamilia 2</span>
                        <span>SubFamilia 2</span>
                        <span>Descripcion Artículo 2</span>
                        <span>Cantidad Registro Sistema 2</span>
                        <span>Cantidad Fisica 2</span>
                        <span>Diferencia Inventario 2</span>
                    </Table.Row>

                    <Table.Row hover>
                        <span>Correlativo 3</span>
                        <span>Codigo Artículo 3</span>
                        <span>Codigo Familia 3</span>
                        <span>Familia 3</span>
                        <span>Codigo-Subfamilia 3</span>
                        <span>SubFamilia 3</span>
                        <span>Descripcion Artículo 3</span>
                        <span>Cantidad Registro Sistema 3</span>
                        <span>Cantidad Fisica 3</span>
                        <span>Diferencia Inventario 3</span>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
}