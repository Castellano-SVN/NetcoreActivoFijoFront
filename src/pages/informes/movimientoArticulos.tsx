import TableMoveArticle from "@/components/bodega/informes/tablemovartic";
import PDFMovimientoArticulo from "@/components/pdf/informes/pdfmovimientoarticulo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";

export default function MovimientoArticulos() {
    
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Registro movimiento de artículos en unidades</h1>
            <div className="flex flex-row justify-around w-full">
                <div className="flex flex-col mr-4">
                    <div className="flex flex-row items-center mb-2">
                        <label className="w-40 text-left">Codigo de Articulo:</label>
                        <input
                            type="number"
                            value={5001407}
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                    <div className="flex flex-row items-center mb-2">
                        <label className="w-40 text-left">Descripcion del Articulo:</label>
                        <input
                            type="text"
                            value="aposito colageno 10x11"
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                    <div className="flex flex-row items-center mb-2">
                        <label className="w-40 text-left">Stock Critico:</label>
                        <input
                            type="number"
                            value={35}
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row items-center mb-2">
                        <label className="w-40 text-center">Desde:</label>
                        <input
                            type="text"
                            value="01-07-2024"
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                    <div className="flex flex-row items-center mb-2">
                        <label className="w-40 text-center">Hasta:</label>
                        <input
                            type="text"
                            value="02-07-2024"
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <TableMoveArticle />
            </div>

            <div className="mt-4">
                <PDFDownloadLink document={<PDFMovimientoArticulo />} fileName='Movimiento_Articulo_pdf'>
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
    );
}
