
import PDFGuiaEntrega from "@/components/pdf/guiaEntrega";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Table } from "react-daisyui";
import { FaFilePdf } from "react-icons/fa";

export default function GuiaEntrega() {
    return (
        <div className="flex justify-center items-center">
            <div className="p-6 bg-white rounded w-full max-w-3xl">
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega origen:</label>
                        <input id="numeroDocumento" type="text" value="BODEGA CENTRAL" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega destino:</label>
                        <input id="numeroDocumento" type="text" value="BODEGA CESFAM DR. SOTERO DEL RIO" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>



                </div>
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-6">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Dirección origen:</label>
                        <input id="numeroDocumento" type="text" value="AV.CARRASCAL 4747" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Dirección destino:</label>
                        <input id="numeroDocumento" type="text" value="CALLE SARGENTO URRUTIA N*125" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>

                </div>

                <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center">
                    <Table className='border shadow-lg'>
                        <Table.Head className="bg-primary text-white">
                            <span>Correlativo</span>
                            <span>Código articulo</span>
                            <span>Código familia</span>
                            <span>Familia</span>
                            <span>Código sub-familia</span>
                            <span>Sub-familia</span>
                            <span>Descripción articulo</span>
                            <span>Cantidad</span>

                        </Table.Head>
                        <Table.Body>
                            <Table.Row hover={true}>
                                <span>1</span>
                                <span>20001001</span>
                                <span>200</span>
                                <span>200 CURACIONES Y EXAMENES</span>
                                <span>200001</span>
                                <span>INSUMOS MEDICOS</span>
                                <span>APOSITO COLAGENO 10X11</span>
                                <span>20</span>
                            </Table.Row>

                            <Table.Row hover={true}>
                                <span>2</span>
                                <span>20001002</span>
                                <span>200</span>
                                <span>200 CURACIONES Y EXAMENES</span>
                                <span>200001</span>
                                <span>INSUMOS MEDICOS</span>
                                <span>CREMA HUMECTANTE UREA</span>
                                <span>40</span>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>

                <PDFDownloadLink document={<PDFGuiaEntrega />} fileName='prueba_pdf'>
                    {
                        ({ loading, url, error, blob }) => loading ? (
                            "Cargando.."
                        ) : (
                            <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Guardar</button>
                        )

                    }
                </PDFDownloadLink>
            </div>
        </div>
    );
}