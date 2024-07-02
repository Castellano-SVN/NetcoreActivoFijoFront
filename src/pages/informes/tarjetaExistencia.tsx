import TablaTarjetaExistencia from "@/components/bodega/informes/tablatarjetaexistencia";
import PDFTarjetaExistencia from "@/components/pdf/informes/pdftarjetaexistencia";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";

export default function TarjetaExistencia() {
    return (
        <>
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Tarjeta Existencia</h1>
                <div className="flex flex-col md:flex-row lg:flex-row md:justify-around lg:justify-around w-full">
                    <div className="flex flex-col mr-4">
                        <div className="flex flex-col lg:flex-row items-center mb-2">
                            <label className="w-full lg:w-40 text-center lg:text-left">Codigo de Articulo:</label>
                            <input
                                type="number"
                                value={5001407}
                                className="input input-bordered input-primary flex-grow"
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center mb-2">
                            <label className="w-full lg:w-40 text-center lg:text-left">Descripcion del Articulo:</label>
                            <input
                                type="text"
                                value="aposito colageno 10x11"
                                className="input input-bordered input-primary flex-grow"
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center mb-2">
                            <label className="w-full lg:w-40 text-center lg:text-left">Stock Critico:</label>
                            <input
                                type="number"
                                value={35}
                                className="input input-bordered input-primary flex-grow"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-col lg:flex-row items-center mb-2">
                            <label className="w-full lg:w-40 text-center">Desde:</label>
                            <input
                                type="text"
                                value="01-07-2024"
                                className="input input-bordered input-primary flex-grow"
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center mb-2">
                            <label className="w-full lg:w-40 text-center">Hasta:</label>
                            <input
                                type="text"
                                value="02-07-2024"
                                className="input input-bordered input-primary flex-grow"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <TablaTarjetaExistencia />
                </div>

                <div className="mt-4">
                    <PDFDownloadLink document={<PDFTarjetaExistencia />} fileName='Tarjeta_existencia_pdf'>
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
        </>
    );
}