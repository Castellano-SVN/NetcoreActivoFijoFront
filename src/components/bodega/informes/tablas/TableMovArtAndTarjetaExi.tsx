import { IParteEntrada, IParteSalida } from "@/interfaces/creation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Table } from "react-daisyui";
import { z } from "zod";
import PDFMovimientoArticulo from "../../../pdf/informes/pdfmovimientoarticulo";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import PDFTarjetaExistencia from "../../../pdf/informes/pdftarjetaexistencia";
import { api_getInputOutputExcel } from "@/services/informes.service";
import { useUserStore } from "@/store/user.store";

interface movimientoI {
  cantidad: number;
  fecha: Date;
  numero: number;
  fechaString: string;
  tipo: "entrada" | "salida";
  proveedorRut?: string;
  proveedorNombre?: string;
  funcionarioNombre?: string;
  tipoDocumento?: number;
  numeroDocumento?: number;
  precioCompra?: number;
  cantidadSalida?: number;
  saldo: number;
}
interface articleProps {
  article: {
    cantidad: number;
    direccion: string;
    id: string;
    nombre: string;
    empresa: string;
    almacen: string;
    fechaDesde: string;
    fechaHasta: string;
    codigo?: string;
    valor: number;
  };
}
interface ITdr {
  codigo: number;
  nombre: string;
}
interface props {
  movimientos: movimientoI[];
  articulos: articleProps;
  label: string;
}

interface IDataToSend {
  FechaDesde: string;
  FechaHasta: string;
  Codigo?: string;
  Nombre: string;
  Valor: number;
  Movimientos: movimientoI[];
}

export default function TableMovArtAndTarjetaExi(props: props) {
  const [dataToSend, setDataToSend] = useState<IDataToSend>({
    FechaDesde: props.articulos.article.fechaDesde,
    FechaHasta: props.articulos.article.fechaHasta,
    Codigo: props.articulos.article.codigo,
    Nombre: props.articulos.article.nombre,
    Valor: props.articulos.article.valor,
    Movimientos: [],
  });

  useEffect(() => {
    setDataToSend({
      FechaDesde: props.articulos.article.fechaDesde,
      FechaHasta: props.articulos.article.fechaHasta,
      Codigo: props.articulos.article.codigo,
      Nombre: props.articulos.article.nombre,
      Valor: props.articulos.article.valor,
      Movimientos: props.movimientos,
    });
  }, [
    props.articulos.article.fechaDesde,
    props.articulos.article.fechaHasta,
    props.articulos.article.codigo,
    props.articulos.article.nombre,
    props.movimientos,
  ]);

  /* useEffect(() => {
    console.log("movimiento:", props);
  }, [props]); */

  /* const movimiento = z.object({
    FechaDesde: z.date(),
    FechaHasta: z.date(),
    Codigo: z.string().optional(),
    NombreArticulo: z.string(),

  }); */

  const { jwt } = useUserStore();


  const downloadExcel = async () => {
    try {
      const response = await api_getInputOutputExcel(
        jwt,
        props.articulos.article.empresa,
        props.articulos.article.almacen,
        props.articulos.article.fechaDesde,
        props.articulos.article.fechaHasta,
        props.articulos.article.id
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

      // Crear un enlace temporal y simular un clic para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `movimiento_de_articulo_${props.articulos.article.nombre}.xlsx`); // Nombre del archivo
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
        <Table className="shadow-md border rounded-md text-center">
          <Table.Head className="bg-primary text-base-100">
            <span>Encargado</span>
            <span>Fecha</span>
            <span>Rut Proveedor</span>
            <span>Proveedor</span>
            <span>Tipo Documento</span>
            <span>N° Documento</span>
            <span>Precio Compra</span>
            <span>UN Entradas</span>
            <span>UN Salidas</span>
            <span>UN Saldo</span>
            {props.label == "TarjetaExistencia" && <span>VAL Entradas</span>}
            {props.label == "TarjetaExistencia" && <span>VAL Salidas</span>}
            {props.label == "TarjetaExistencia" && <span>VAL Saldo</span>}
          </Table.Head>
          <Table.Body>
            {props.movimientos.map((mov, index) =>
              mov.tipo === "entrada" ? (
                <>
                  <Table.Row hover>
                    <span>{mov.funcionarioNombre ?? "No disponible"}</span>
                    <span>
                      {new Date(mov.fecha).toLocaleDateString() ??
                        "No disponible"}
                    </span>
                    <span>{mov.proveedorRut ?? "No disponible"}</span>
                    <span>{mov.proveedorNombre ?? "No disponible"}</span>
                    <span>{mov.tipoDocumento ?? "No disponible"}</span>
                    <span>
                      {mov.numeroDocumento === 0
                        ? "No disponible"
                        : mov.numeroDocumento}
                    </span>
                    <span>
                      {(mov.precioCompra === 0 || !mov.precioCompra
                        ? props.articulos.article?.valor || "No disponible"
                        : mov.precioCompra
                      ).toLocaleString()}
                    </span>
                    <span className="text-green-500">
                      +{mov.cantidad ?? "No disponible"}
                    </span>
                    <span>-</span>
                    <span>{mov.saldo}</span>
                    {props.label === "TarjetaExistencia" ? (
                      <span>
                        {" "}
                        {(
                          props.articulos.article.valor * mov.cantidad
                        ).toLocaleString()}
                      </span>
                    ) : (
                      <></>
                    )}
                    {props.label === "TarjetaExistencia" ? (
                      <span>-</span>
                    ) : (
                      <></>
                    )}
                    {props.label === "TarjetaExistencia" ? (
                      <span>
                        {" "}
                        {(
                          props.articulos.article.valor * mov.saldo
                        ).toLocaleString()}
                      </span>
                    ) : (
                      <></>
                    )}
                  </Table.Row>
                </>
              ) : (
                mov.tipo === "salida" && (
                  <Table.Row hover>
                    <span>{mov.funcionarioNombre ?? "No disponible"}</span>
                    <span>
                      {new Date(mov.fecha).toLocaleDateString() ??
                        "No disponible"}
                    </span>
                    <span>{mov.proveedorRut ?? "No disponible"}</span>
                    <span>{mov.proveedorNombre ?? "No disponible"}</span>
                    <span>{mov.tipoDocumento ?? "No disponible"}</span>
                    <span>
                      {mov.numeroDocumento === 0
                        ? "No disponible"
                        : mov.numeroDocumento}
                    </span>
                    <span>
                      {(mov.precioCompra === 0 || !mov.precioCompra
                        ? props.articulos.article?.valor || "No disponible"
                        : mov.precioCompra
                      ).toLocaleString()}
                    </span>
                    <span>-</span>
                    <span className="text-red-500">
                      -{mov.cantidad ?? "No disponible"}
                    </span>
                    <span>{mov.saldo}</span>
                    {props.label === "TarjetaExistencia" ? (
                      <span>-</span>
                    ) : (
                      <></>
                    )}
                    {props.label === "TarjetaExistencia" ? (
                      <span>
                        {" "}
                        {(
                          props.articulos.article?.valor * mov.cantidad
                        ).toLocaleString()}
                      </span>
                    ) : (
                      <></>
                    )}
                    {props.label === "TarjetaExistencia" ? (
                      <span>
                        {" "}
                        {(
                          props.articulos.article?.valor * mov.saldo
                        ).toLocaleString()}
                      </span>
                    ) : (
                      <></>
                    )}
                  </Table.Row>
                )
              )
            )}
          </Table.Body>
        </Table>
        {dataToSend.Movimientos.length > 0 && props.label == "MovimientoArticulo" && (<>
          <PDFDownloadLink
            document={<PDFMovimientoArticulo data={dataToSend} />}
            fileName={`Movimiento_de_Articulo_${props.articulos.article.nombre}`}
          >
            {({ loading, url, error, blob }) =>
              loading ? (
                "Cargando.."
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-accent my-4"
                >
                  <FaFilePdf />
                  Exportar
                </button>
              )
            }
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
        </>)}
        {dataToSend.Movimientos.length > 0 && props.label == "TarjetaExistencia" && (<>
          <PDFDownloadLink
            document={<PDFTarjetaExistencia data={dataToSend} />}
            fileName={`Tarjeta_de_existencia_Articulo_${props.articulos.article.nombre}`}
          >
            {({ loading, url, error, blob }) =>
              loading ? (
                "Cargando.."
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-accent my-4"
                >
                  <FaFilePdf />
                  Exportar
                </button>
              )
            }
          </PDFDownloadLink>

          
        </>)}
      </div>
    </>
  );
}
