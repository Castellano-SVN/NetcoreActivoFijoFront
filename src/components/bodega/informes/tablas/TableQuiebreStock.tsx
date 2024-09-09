import PDFQuiebreStock from "@/components/pdf/informes/pdfquiebrestock";
import {
  IBodegaQuiebre,
  OutPutQuiebreStockFormValues,
} from "@/interfaces/creation";
import { IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { api_getinformeQuiebreStockExcel } from "@/services/informes.service";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import router from "next/router";
import { useEffect } from "react";
import { Table } from "react-daisyui";
import {
  Control,
  FieldArrayWithId,
  useFieldArray,
  UseFormSetValue,
} from "react-hook-form";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

interface props {
  dataQuiebre: IBodegaQuiebre[];
  dataQuiebrePdf: IBodegaQuiebre[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

export default function TablaQuiebreStock(props: props) {
  useEffect(() => {
    console.log("este es la data q llega a la tabla", props.dataQuiebre);
  }, []);
  const { jwt } = useUserStore();
  const { empresa } = router.query;

  const downloadExcel = async () => {
    const dateNow = new Date().toISOString().split('T')[0];
    try {
      const response = await api_getinformeQuiebreStockExcel(
        jwt,
        empresa as string,
        0,
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

      // Crear un enlace temporal y simular un clic para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Informe_Quiebre_De_Stock_${dateNow}.xlsx`); // Nombre del archivo
      document.body.appendChild(link);
      link.click();

      // Limpiar el enlace temporal y revocar la URL
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url); // Libera memoria utilizada por el Blob
        // Limpia el objeto URL después de la descarga
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto border mt-4">
        <Table className="table-auto shadow-md border rounded-md text-center">
          <Table.Head className="bg-primary text-base-100">
            <span>Correlativos</span>
            <span>Codigo Artículo</span>
            <span>Nombre Artículo</span>
            <span>Familia</span>
            <span>Subfamilia</span>
            <span>Bodega</span>
            <span>Cantidad Registro Sistema</span>
            <span>Stock Critico</span>
            <span>Proceso Compra</span>
          </Table.Head>

          <Table.Body>
            {props.dataQuiebre.map((data, index) => (
              <Table.Row hover>
                <span>{index + 1}</span>
                <span>{data.articulo.codigo}</span>
                <span>{data.articulo.nombre}</span>
                <span>
                  <>
                    <span className="block font-semibold">
                      {data.articulo.subFamilia.familia.codigo}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {data.articulo.subFamilia.familia.nombre}
                    </span>
                  </>
                </span>
                <span>
                  <>
                    <span className="block font-semibold">
                      {data.articulo.subFamilia.codigo}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {data.articulo.subFamilia.nombre}
                    </span>
                  </>
                </span>
                <span>{data.almacen.bodega.nombre}</span>
                <span>{data.cantidad}</span>
                <span>{data.cantidadMinima}</span>
                <span className="text-red-500 font-bold">
                  {data.cantidadMinima - data.cantidad}
                </span>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <button
        onClick={props.fetchNextPage}
        className="btn btn-primary rounded-full px-10 my-4"
        disabled={!props.hasNextPage || props.isFetchingNextPage}
      >
        {props.isFetchingNextPage
          ? "Cargando más..."
          : props.hasNextPage
          ? "Ver más"
          : "No hay más datos"}
      </button>

      <div className="col-span-2">
        <PDFDownloadLink
          document={<PDFQuiebreStock dataQuiebrePdf={props.dataQuiebrePdf} />}
          fileName={`informe_quiebre_stock_pdf`}
        >
          {({ loading, url, error, blob }) =>
            loading ? (
              "Cargando.."
            ) : (
              <button
                type="button"
                className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"
              >
                <FaFilePdf />
                Exportar Informe
              </button>
            )
          }
        </PDFDownloadLink>
      </div>

      <div className="col-span-2 mt-3">
        <button
          type="button"
          className="btn btn-outline btn-primary md:my-0 lg:my-0 md:mx-2 lg:mx-2"
          onClick={downloadExcel}
        >
          <FaFileExcel />
          Exportar excel
        </button>
      </div>
    </>
  );
}
