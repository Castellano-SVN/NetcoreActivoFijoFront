import TablaInventarioFisico from "@/components/bodega/informes/tablainventariofisico";
import PDFInventarioFisico from "@/components/pdf/informes/pdfinventariofisico";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";

export default function InventarioFisico() {
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="p-6 rounded w-full">
                    <h1 className="text-2xl font-bold mb-4">Informe Inventario Fisico</h1>
                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-left mb-2" htmlFor="Folio Recepcion">Encargado toma inventario fisico</label>
                            <input value={'Juan Gonzales'} type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Fecha inventario</label>
                            <input type="text" value={'15-01-2024'} className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <TablaInventarioFisico />
                    </div>

                    <div className="mt-4">
                        <PDFDownloadLink document={<PDFInventarioFisico />} fileName='inventario_fisico_pdf'>
                            {
                                ({ loading, url, error, blob }) => loading ? (
                                    "Cargando.."
                                ) : (
                                    <button type="button" className="btn btn-outline btn-accent"><FaFilePdf />Exportar</button>
                                )

                            }
                        </PDFDownloadLink>
                    </div>
                </div>
            </div>
        </>
    );
}