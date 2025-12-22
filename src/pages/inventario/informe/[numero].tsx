import WarningAlert from "@/components/alerts/warningAlert";
import PDFInventarioFisico from "@/components/pdf/informes/pdfinventariofisico";
import { IBodega } from "@/interfaces/creation";
import { IInventarioFisicoDetalle } from "@/interfaces/inventario.interface";
import { api_getIFRByDetalle, api_getIFRByDetalleToExcel } from "@/services/informes.service";
import { api_getAllInFiDe } from "@/services/inventario.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import React from "react";
import {
  PDFDownloadLink,
  BlobProviderParams,
} from "@react-pdf/renderer";
import router from "next/router";
import { useEffect, useState } from "react";
import { Loading, Table } from "react-daisyui";
import {
  FaArrowAltCircleLeft,
  FaArrowCircleLeft,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import { z } from "zod";

export default function InformeInventarioFisico() {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

  const { jwt } = useUserStore();
  const { empresa, numero } = router.query;

  const empresaId = empresa as string;
  const numeroI = Number(numero);

  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const [dataInventarioFisicoDetalle, setDataInventarioFisicoDetalle] =
    useState<IInventarioFisicoDetalle[]>([]);
  const getInvFisDet = async () => {
    try {
      setLoading(true);
      const data = await api_getAllInFiDe(jwt, empresaId, numeroI);
      setDataInventarioFisicoDetalle(data.data.dataList);
      setShowWarning(false); // Aquí actualizo el estado de showWarning
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!empresaId) return;
    if (!numeroI) return;
    getInvFisDet();
  }, [numeroI, empresaId]);

  return (
    <>
      <div className="w-6 p-4 flex flex-row">
        <button
          type="button"
          className="btn btn-outline btn-primary"
          onClick={() => router.back()}
        >
          <FaArrowCircleLeft />
          Volver{" "}
        </button>
      </div>
      {loading ? (
        <div className="text-primary text-center mt-4">
          <Loading size="lg" />
        </div>
      ) : showWarning ? (
        <WarningAlert message={"Sin detalle programado."} />
      ) : dataInventarioFisicoDetalle.length > 0 ? (
        <div className="grid grid-cols-1 mx-auto gap-2">
          {dataInventarioFisicoDetalle.map((e, index) => (
            <Info detalle={e} jwt={jwt} numeroIn={numeroI} />
          ))}
        </div>
      ) : (
        <WarningAlert message={"Sin detalles de inventario creados."} />
      )}
    </>
  );
}

interface IInventarioFisicoRegistro {
  codigoArticulo?: string;
  codigoFamilia: number;
  familia: string;
  codigoSubFamilia: number;
  subFamilia: string;
  descripcionArticulo?: string;
  cantidadSistema: number;
  cantidadFisica: number;
  encargado: string;
  fechaInventario: Date;
}

interface props {
  detalle: IInventarioFisicoDetalle;
  jwt: string;
  numeroIn: number;
}

function Info(props: props) {
  const [dataRegistro, setDataRegistro] = useState<IInventarioFisicoRegistro[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const getRegistrosByDetalle = async () => {
    try {
      setLoading(true);
      const data = await api_getIFRByDetalle(props.jwt, props.detalle.id);
      setDataRegistro(data.data.dataList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!props.detalle.id) return;
    getRegistrosByDetalle();
  }, [props.detalle.id]);

  return (
    <>
      {loading ? (
        <div className="text-primary text-center mt-4">
          <Loading size="lg" />
        </div>
      ) : (
        <div className="border shadow-md rounded-lg p-2 hover:border-primary mt-3">
          <label className="mouse-pointer select-none font-bold">
            {props.detalle.bodega}
          </label>
          {dataRegistro.length > 0 ? (
            <TablaRegistro
              registro={dataRegistro}
              bodega={props.detalle.bodega}
              numeroIn={props.numeroIn}
              jwt={props.jwt}
              ifdId={props.detalle.id}
            />
          ) : (
            <WarningAlert message={"Bodega sin registros de inventario"} />
          )}
        </div>
      )}
    </>
  );
}

interface propsArticle {
  registro: IInventarioFisicoRegistro[];
  bodega: string | undefined;
  numeroIn: number;
  jwt: string;
  ifdId: string;
}

interface IDataToSend {
  bodega: string | undefined;
  registros: IInventarioFisicoRegistro[];
}

function TablaRegistro(props: propsArticle) {
  const [dataToSend, setDataToSend] = useState<IDataToSend>({
    bodega: props.bodega,
    registros: [],
  });

  useEffect(() => {
    setDataToSend({
      bodega: props.bodega,
      registros: props.registro,
    });
  }, [props.registro, props.bodega]);

  const downloadExcel = async () => {
    try {
      const response = await api_getIFRByDetalleToExcel(
        props.jwt,
        props.ifdId,
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

      // Crear un enlace temporal y simular un clic para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventario_numero_${props.numeroIn}.xlsx`); // Nombre del archivo
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
      <div className="overflow-x-auto border">
        <Table className=" text-center">
          <Table.Head>
            <span>Correlativo</span>
            <span>Encargado Inv</span>
            <span>Fecha Inv</span>
            <span>Codigo Artículo</span>
            <span>Familia</span>
            <span>Sub-Familia</span>
            <span>Descripcion Artículo</span>
            <span>Cantidad Sistema</span>
            <span>Cantidad Fisica</span>
            <span>Diferencia Inventario</span>
          </Table.Head>

          {props.registro.map((e, index) => (
            <>
              <Table.Body key={index}>
                <Table.Row hover={true}>
                  <span>{index + 1}</span>
                  <span>{e.encargado}</span>
                  <span>
                    {e.fechaInventario
                      .toLocaleString()
                      .replace("T", " ")
                      .replace(/\..+/, "")}
                  </span>
                  <span>{e.codigoArticulo}</span>

                  <span className=" flex flex-col">
                    <label>{e.familia}</label>
                    <label className="font-medium">{e.codigoFamilia}</label>
                  </span>

                  <span className=" flex flex-col">
                    <label>{e.subFamilia}</label>
                    <label className="font-medium">{e.codigoSubFamilia}</label>
                  </span>
                  <span>{e.descripcionArticulo}</span>
                  <span>{e.cantidadSistema}</span>
                  <span>{e.cantidadFisica}</span>
                  <span
                    className={
                      e.cantidadFisica - e.cantidadSistema < 0
                        ? "text-red-600 font-semibold"
                        : e.cantidadFisica - e.cantidadSistema > 0
                          ? "text-green-600 font-semibold"
                          : "text-gray-900 font-semibold"
                    }
                  >
                    {e.cantidadFisica - e.cantidadSistema}
                  </span>
                </Table.Row>
              </Table.Body>
            </>
          ))}
        </Table>
        {dataToSend.registros.length > 0 && (
          <>
            <PDFDownloadLink
              document={
                <PDFInventarioFisico
                  data={dataToSend}
                  numeroIn={props.numeroIn}
                />
              }
              fileName={`inventario_numero_${props.numeroIn}`}
            >
              {(({
                loading,
                error,
              }: BlobProviderParams) => {
                if (loading) return <span>Cargando...</span>;
                if (error) return <span>Error al generar PDF</span>;

                return (
                  <button
                    type="button"
                    className="btn btn-outline btn-accent mt-4"
                  >
                    <FaFilePdf />
                    Exportar
                  </button>
                );
              }) as unknown as React.ReactNode}
            </PDFDownloadLink>

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
        )}
      </div>
    </>
  );
}
