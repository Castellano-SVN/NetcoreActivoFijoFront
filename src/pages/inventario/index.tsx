import WarningAlert from "@/components/alerts/warningAlert";
import {
  IBodega,
  ICentroCosto,
  IEmpresa,
  IInventarioFisicoEstado,
  IMarca,
  InventarioFisicoFormValue,
} from "@/interfaces/creation";
import {
  IAlmacen,
  IAlmacenArticulo,
} from "@/interfaces/modules/IAlmacen.interface";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllCentroCostoByEmpresa,
  api_getAllEmpresas,
  api_getAllInventarioFisicoEstados,
  api_getAllMarcas,
  api_postInventarioFisico,
} from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Table } from "react-daisyui";
import { FaPlus } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
interface SelectedArticles {
  id: string;
  codigo?: string | null;
  nombre: string;
  descripcion?: string | null;
}

export default function Index() {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const { jwt } = useUserStore();

  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa[]>([]);
  const [getDataEmpresa, setGetDataEmpresa] = useState("");

  const getAllEmpresas = async () => {
    try {
      const data = await api_getAllEmpresas(jwt);
      setDataEmpresa(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllEmpresas();
  }, []);

  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
  const [getDataCentroCosto, setGetDataCentroCosto] = useState("");
  const getAllCentroCostosByEmpresa = async () => {
    try {
      const data2 = await api_getAllCentroCostoByEmpresa(jwt, getDataEmpresa);
      setDataCentroCosto(data2.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (getDataEmpresa !== "") {
      getAllCentroCostosByEmpresa();
    }
  }, [getDataEmpresa]);

  const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
  const [getDataBodega, setGetDataBodega] = useState("");
  const getAllBodegasByEmpresaYCentroCosto = async () => {
    try {
      const data3 = await api_getAllBodegaByEmpresaYCentroCosto(
        jwt,
        getDataEmpresa,
        getDataCentroCosto
      );
      setDataBodega(data3.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (getDataEmpresa !== "" && getDataCentroCosto !== "") {
      getAllBodegasByEmpresaYCentroCosto();
    }
  }, [getDataEmpresa, getDataCentroCosto]);

  const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
  const [getDataAlmacen, setGetDataAlmacen] = useState("");

  const getAllAlmacenByEmpByCenByBod = async () => {
    try {
      const data4 = await api_getAllAlmacenByEmpByCenByBod(
        jwt,
        getDataEmpresa,
        getDataCentroCosto,
        getDataBodega
      );
      setDataAlmacen(data4.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      getDataEmpresa !== "" &&
      getDataCentroCosto !== "" &&
      getDataBodega !== ""
    ) {
      getAllAlmacenByEmpByCenByBod();
    }
  }, [getDataEmpresa, getDataCentroCosto, getDataBodega]);

  const [dataAlmacenArticulo, setDataAlmacenArticulo] = useState<
    IAlmacenArticulo[]
  >([]);
  const [getDataAlmacenArticulo, setGetDataAlmacenArticulo] = useState("");
  const [nameArticulo, setNameArticulo] = useState("");
  const [codigoArticulo, setCodigoArticulo] = useState("");
  const [DescripcionArticulo, setDescripcionArticulo] = useState("");
  const [idArticulo, setIdArticulo] = useState("");

  const getAllAlmacenArticuloByEmpByCenByBodByAlm = async () => {
    try {
      const data5 = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(
        jwt,
        getDataEmpresa,
        getDataCentroCosto,
        getDataBodega,
        getDataAlmacen
      );
      setDataAlmacenArticulo(data5.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      getDataEmpresa !== "" &&
      getDataCentroCosto !== "" &&
      getDataBodega !== "" &&
      getDataAlmacen !== ""
    ) {
      getAllAlmacenArticuloByEmpByCenByBodByAlm();
    }
  }, [getDataEmpresa, getDataCentroCosto, getDataBodega, getDataAlmacen]);

  const [selectedArticulos, setSelectedArticulos] = useState<
    SelectedArticles[]
  >([]);

  const handleSelectArticulo = () => {
    if (idArticulo && nameArticulo) {
      const selectedArticulo = {
        id: idArticulo,
        nombre: nameArticulo,
        codigo: codigoArticulo,
        descripcion: DescripcionArticulo,
      };

      setSelectedArticulos([...selectedArticulos, selectedArticulo]);
      toast.success("Artículo Agregado");
      ref.current?.close();
    }
  };

  const handleDeleteArticulo = (index: number) => {
    setSelectedArticulos(
      selectedArticulos.filter((articulo, i) => i !== index)
    );
    toast.error("Artículo Eliminado");
  };

  const [dataMarcas, setDataMarcas] = useState<IMarca[]>([]);
  const [dataInventarioFisicoEstados, setDataInventarioFisicoEstados] =
    useState<IInventarioFisicoEstado[]>([]);

  const getAllMarcas = async () => {
    try {
      const marcas = await api_getAllMarcas(jwt);
      setDataMarcas(marcas.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };
  const getAllInventarioFisicoEstados = async () => {
    try {
      const inventarioFisicoEstado = await api_getAllInventarioFisicoEstados(
        jwt
      );
      setDataInventarioFisicoEstados(inventarioFisicoEstado.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllMarcas();
    getAllInventarioFisicoEstados();
  }, []);

  const InventarioFisicoSchema = z.object({
    InventarioFisico: z.object({
      EmpresaId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      FuncionarioId: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Opción inválida",
        })
        .optional(),
      Numero: z.number({
        required_error: "Campo requerido",
        invalid_type_error: "Campo inválido",
      }),
      FechaRegistro: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      FechaInicio: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      FechaTermino: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
    }),
    InventarioFisicoDetalle: z.object({
      EmpresaId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      InventarioFisicoId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      FuncionarioId: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Opción inválida",
        })
        .optional(),
      CentroCostoId: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Opción inválida",
        })
        .optional(),
      BodegaId: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Opción inválida",
        })
        .optional(),
      DependenciaLocacion: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Opción inválida",
        })
        .optional(),
      FechaRegistro: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Opción inválida",
        })
        .optional(),
    }),
    InventarioFisicoRegistro: z.object({
      EmpresaId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      InventarioFisicoId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      InventarioFisicoDetalleId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      FuncionarioId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      PersonaConteoId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      AnoNumero: z.number({
        required_error: "Campo requerido",
        invalid_type_error: "Campo inválido",
      }),
      SubFamiliaId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      ArticuloId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      MarcaId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      EstadoCodigo: z.number({
        required_error: "Campo requerido",
        invalid_type_error: "Campo inválido",
      }),
      LugarFisicoConteo: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      LocacionId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      ProgramaId: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      Presentacion: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      Observaciones: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      Codigo: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
      NumeroUnidades: z.number({
        required_error: "Campo requerido",
        invalid_type_error: "Campo inválido",
      }),
      FechaRegistro: z.string({
        required_error: "Campo requerido",
        invalid_type_error: "Opción inválida",
      }),
    }),
  });

  const methods = useForm<InventarioFisicoFormValue>({
    resolver: zodResolver(InventarioFisicoSchema),
  });
  const {
    getValues,
    setValue,
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<InventarioFisicoFormValue> = async (
    data: InventarioFisicoFormValue
  ) => {
    try {
      await api_postInventarioFisico(jwt, data);
      toast.success("Inventario guardado correctamente");
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error al guardar el inventario");
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center justify-center">
        <div className="container shadow-md border rounded-md">
          <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Toma de Inventario</h1>
            {selectedArticulos.length == 0 && (
              <button
                type="button"
                className="btn btn-outline btn-accent mt-2"
                onClick={handleShow}
              >
                Seleccione un artículo
              </button>
            )}
          </div>
          <div className="flex flex-row justify-center mb-4">
            <div className="flex flex-col w-full">
              <Modal ref={ref}>
                <Modal.Header className="font-bold">
                  Seleccione el artículo
                </Modal.Header>
                <Modal.Body>
                  <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                    {selectedArticulos.length == 0 && (
                      <>
                        <div className="col-span-2">
                          <label
                            className="block text-left mb-2"
                            htmlFor="empresa"
                          >
                            Empresa:
                          </label>
                          <select
                            className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            onChange={(e) => {
                              setGetDataEmpresa(e.target.value);
                            }}
                          >
                            <option key={0} value={0} disabled selected>
                              Seleccione una opción
                            </option>
                            {dataEmpresa.map((empresa, index) => (
                              <option key={index} value={empresa.id}>
                                {empresa.razonSocial}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label
                            className="block text-left mb-2"
                            htmlFor="centrocosto"
                          >
                            CentroCosto:
                          </label>
                          <select
                            className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            onChange={(e) => {
                              setGetDataCentroCosto(e.target.value);
                            }}
                          >
                            <option key={0} value={0} disabled selected>
                              Seleccione una opción
                            </option>
                            {dataCentroCosto.map((centroCosto, index) => (
                              <option key={index} value={centroCosto.id}>
                                {centroCosto.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label
                            className="block text-left mb-2"
                            htmlFor="bodega"
                          >
                            Bodega:
                          </label>
                          <select
                            className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            onChange={(e) => {
                              setGetDataBodega(e.target.value);
                            }}
                          >
                            <option key={0} value={0} disabled selected>
                              Seleccione una opción
                            </option>
                            {dataBodega.map((bodega, index) => (
                              <option key={index} value={bodega.id}>
                                {bodega.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label
                            className="block text-left mb-2"
                            htmlFor="almacen"
                          >
                            Almacen:
                          </label>
                          <select
                            className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            onChange={(e) => {
                              setGetDataAlmacen(e.target.value);
                            }}
                          >
                            <option key={0} value={0} disabled selected>
                              Seleccione una opción
                            </option>
                            {dataAlmacen.map((almacen, index) => (
                              <option key={index} value={almacen.id}>
                                {almacen.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div className="col-span-4">
                      <label className="block text-left mb-2" htmlFor="almacen">
                        Articulo:
                      </label>
                      <select
                        className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        onChange={(e) => {
                          setGetDataAlmacenArticulo(e.target.value);
                          const selectedArticulo = dataAlmacenArticulo.find(
                            (almacenAarticulo) =>
                              almacenAarticulo.articulo.id === e.target.value
                          );
                          if (selectedArticulo) {
                            setIdArticulo(selectedArticulo.articulo.id);
                            setNameArticulo(selectedArticulo.articulo.nombre);
                            setCodigoArticulo(
                              selectedArticulo.articulo.codigo || ""
                            );
                            setDescripcionArticulo(
                              selectedArticulo.articulo.descripcion || ""
                            );
                          }
                        }}
                      >
                        <option key={0} value={0} disabled selected>
                          Seleccione una opción
                        </option>
                        {dataAlmacenArticulo.map((almacenArticulo, index) => (
                          <option
                            key={index}
                            value={almacenArticulo.articulo.id}
                          >
                            {almacenArticulo.articulo.codigo} -{" "}
                            {almacenArticulo.articulo.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Actions>
                  <form method="dialog">
                    <Button
                      className="btn-outline btn-accent mr-1"
                      onClick={handleSelectArticulo}
                    >
                      Agregar artículo
                    </Button>
                    <Button
                      className="btn-outline btn-accent ml-1"
                      onClick={() => ref.current?.close()}
                    >
                      Cancelar
                    </Button>
                  </form>
                </Modal.Actions>
              </Modal>
            </div>

            <span>Empresa: </span>
            <span>Almacen: </span>

          </div>
          <div className="overflow-x-auto ml-3 mr-3 mb-3">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {selectedArticulos.length !== 0 ? (
                  <>
                    <Table className="shadow-md border rouder-border-md rounded-md">
                      <Table.Head className="bg-primary text-base-100">
                        <span>Código artículo</span>
                        <span>Descipción</span>
                        <span>Estado</span>
                        <span>Marca</span>
                        <span>Unidad medida</span>
                        <span>Presentación</span>
                        <span>Cantidad Inventariada</span>
                        <span>Código Qr</span>
                        <span>Fuente Financiamiento</span>
                        <span>Acción</span>
                      </Table.Head>

                      <Table.Body>
                        {selectedArticulos.map((articulos, index) => (
                          <Table.Row hover>
                            <span>{articulos.codigo}</span>
                            <span>{articulos.nombre}</span>
                            <span>
                              <select className="mt-1 block w-4/8 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                {dataInventarioFisicoEstados.map(
                                  (estado, index) => (
                                    <option key={index} value={estado.codigo}>
                                      {estado.nombre}
                                    </option>
                                  )
                                )}
                              </select>
                            </span>
                            <span>
                              <select className="mt-1 block w-4/8 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                {dataMarcas.map((marca, index) => (
                                  <option key={index} value={marca.id}>
                                    {marca.nombre}
                                  </option>
                                ))}
                              </select>
                            </span>
                            <span>Unidad</span>
                            <span></span>
                            <input
                              type="number"
                              className="mt-1 block w-2/4 py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                            <span></span>
                            <span></span>
                            <span>
                              <button
                                onClick={() => handleDeleteArticulo(index)}
                                className="text-red-500"
                              >
                                <FaCircleXmark />
                              </button>
                            </span>
                          </Table.Row>
                        ))}
                        <Table.Row hover>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span>
                            <button
                              onClick={handleShow}
                              className="text-green-500"
                            >
                              <FaPlus />
                            </button>
                          </span>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    <button
                      type="submit"
                      className="btn btn-outline btn-accent mt-3"
                    >
                      Guardar Inventario
                    </button>
                  </>
                ) : (
                  <WarningAlert message="Se debe seleccionar al menos un articulo" />
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
