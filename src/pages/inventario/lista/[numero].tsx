import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import router, { useRouter } from "next/router";
import { useUserStore } from "../../../store/user.store";
import {
  api_getAllInFiDe,
  api_getAllPersonasByEmpresa,
  api_getValidation,
  api_postInventarioFisicoDetalle,
} from "../../../services/inventario.service";
import { useContextStore } from "../../../store/context.store";
import {
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllCentroCostoByEmpresa,
  api_getOneEmpresa,
} from "../../../services/bodega.service";
import { IBodega, ICentroCosto, IEmpresa } from "../../../interfaces/creation";
import {
  IFuncionarioEmpresa,
  IInventarioFisicoDetalle,
  InventarioFisicoDetalleFormValues,
} from "../../../interfaces/inventario.interface";
import Select from "react-select";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { FiPlus } from "react-icons/fi";
import { Button, Loading } from "react-daisyui";
import { FaBoxesStacked } from "react-icons/fa6";

export default function ShowInventarioFisico() {
  const { jwt } = useUserStore();
  const { empresa, numero } = router.query;
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

  const validateParams = async () => {
    try {
      await api_getValidation(jwt, empresa as string, Number(numero));
    } catch (error) {
      console.error(error);
      router.back();
    }
  };

  const [dataPersona, setDataPersona] = useState<IFuncionarioEmpresa[]>();
  const getFuncionarios = async () => {
    try {
      const data = await api_getAllPersonasByEmpresa(jwt, empresa as string);
      setDataPersona(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!numero) return;
    if (!empresa) return;
    validateParams();
    setValue("Numero", Number(numero));
    setValue("EmpresaId", empresa as string);
  }, [numero, empresa]);

  const [dataCc, setDataCc] = useState<ICentroCosto[]>();
  const getCentroCostos = async () => {
    try {
      const cc = await api_getAllCentroCostoByEmpresa(jwt, empresa as string);
      setDataCc(cc.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!empresa) return;
    getCentroCostos();
    getFuncionarios();
  }, [empresa]);

  const [selectedPersona, setSelectedPersona] =
    useState<IFuncionarioEmpresa | null>(null);
  const [selectedCc, setSelectedCc] = useState<ICentroCosto | null>(null);
  const [selectedBodega, setSelectedBodega] = useState<IBodega | null>(null);

  const [dataBodega, setDataBodega] = useState<IBodega[]>();
  const getBodegas = async () => {
    try {
      const bodega = await api_getAllBodegaByEmpresaYCentroCosto(
        jwt,
        empresa as string,
        selectedCc?.id as string
      );
      console.log(bodega);
      setDataBodega(bodega.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!empresa) return;
    if (!selectedCc) return;
    // if (empresa && selectedCc?.id) {
    getBodegas();
    // }
  }, [selectedCc]);

  const InvFisicoDetalleSchema = z.object({
    EmpresaId: z.string({ invalid_type_error: "Tipo de dato invalido" }),
    Numero: z.number({ invalid_type_error: "Tipo de dato invalido" }),
    FuncionarioId: z
      .string({ invalid_type_error: "Tipo de dato invalido" })
      .optional(),
    CentroCostoId: z
      .string({ invalid_type_error: "Tipo de dato invalido" })
      .optional(),
    BodegaId: z.string({ invalid_type_error: "Tipo de dato invalido", required_error:"Campo Requerido." }),
  });

  const methods = useForm<InventarioFisicoDetalleFormValues>({
    resolver: zodResolver(InvFisicoDetalleSchema),
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

  const onSubmit = async (data: InventarioFisicoDetalleFormValues) => {
    try {
      console.log("data del formulario: ", data);
      await api_postInventarioFisicoDetalle(jwt, data);
      toast.success("Detalles de Inventariado registrado con exito.");
      setModalShow(false);
      reset();
      getInvFisDet();
    } catch (error) {
      console.log(error);
      toast.error("ha ocurrido un error inesperado.");
    }
  };

  useEffect(() => {
    if (selectedPersona) {
      setValue("FuncionarioId", selectedPersona.funcionarioId);
    }
  }, [selectedPersona]);

  useEffect(() => {
    if (selectedCc) {
      setValue("CentroCostoId", selectedCc.id);
    }
  }, [selectedCc]);

  useEffect(() => {
    if (selectedBodega) {
      setValue("BodegaId", selectedBodega.id);
    }
  }, [selectedBodega]);

  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getOneEmpresa = async () => {
      if (empresa) {
        try {
          const data = await api_getOneEmpresa(jwt, empresa as string);
          setDataEmpresa(data.data.dataList[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getOneEmpresa();
  }, [jwt, empresa]);

  const [dataInventarioFisicoDetalle, setDataInventarioFisicoDetalle] =
    useState<IInventarioFisicoDetalle[]>();
  const getInvFisDet = async () => {
    try {
      const data = await api_getAllInFiDe(
        jwt,
        empresa as string,
        Number(numero)
      );
      setDataInventarioFisicoDetalle(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!empresa) return;
    if (!numero) return;
    getInvFisDet();
  }, [numero, empresa]);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const handleShowModal = useCallback(() => {
    setModalShow(!modalShow);
  }, [modalShow]);

  return (
    <>
      <Head>
        <title>
          {dataEmpresa ? `Empresa ${dataEmpresa.razonSocial}` : `Empresa`}
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full transition duration-300 ease-in-out">
        <div className="flex flex-col bg-primary bordered rounded-md shadow-md ">
          <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-md">
            <h3 className="text-large font-bold text-base-100">
              {dataEmpresa ? dataEmpresa?.razonSocial.toUpperCase() : ""}
            </h3>
            <h3 className="text-large font-bold text-base-100">
              {dataEmpresa ? dataEmpresa?.giro?.toUpperCase() : ""}
            </h3>
          </div>
        </div>

        <div className="flex md:flex-row lg:flex-row flex-col-reverse justify-around items-center mt-4 md:mt-4 lg:mt-2  rounded-lg border shadow-md  py-2 ">
          <button
            type="button"
            className="btn btn-primary mt-2 md:mt-0"
            onClick={() => router.back()}
          >
            <FaArrowLeft />
            Volver
          </button>
          {dataEmpresa && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleShowModal}
              className="btn btn-primary join-item"
            >
              <FiPlus /> Agregar Inventario
            </button>
          )}
        </div>

        {modalShow && (
          <>
            <form
              className="border rounded-lg mt-2 shadow-md w-10/12 grid grid-cols-1 lg:grid-cols-12 gap-4 mx-auto p-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="col-span-3">
                {dataPersona?.length !== 0 && (
                  <>
                    <Select
                      className="my-2 w-full px-0 md:px-8"
                      placeholder="Seleccione el Funcionario "
                      options={dataPersona}
                      onChange={(option) => setSelectedPersona(option)}
                      value={selectedPersona}
                      loadingMessage={() => "Cargando opciones..."}
                      isLoading={dataPersona?.length === 0}
                      getOptionValue={(option) => option.funcionarioId}
                      getOptionLabel={(option) =>
                        option.persona.nombres +
                        " " +
                        option.persona.apellidoPaterno
                      }
                      menuPortalTarget={document.body}
                    />
                  </>
                )}
              </div>

              <div className="col-span-3">
                {dataCc?.length !== 0 && (
                  <Select
                    className="my-2 w-full px-0 md:px-8 "
                    placeholder="Seleccione el Centro de costo "
                    options={dataCc}
                    onChange={(option) => setSelectedCc(option)}
                    value={selectedCc}
                    loadingMessage={() => "Cargando opciones..."}
                    isLoading={dataCc?.length === 0}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nombre}
                    menuPortalTarget={document.body}
                  />
                )}
              </div>

              <div className="col-span-3">
                <Controller
                  control={control}
                  name="BodegaId"
                  render={({ field: { onChange, value, name, ref } }) => (
                    <Select
                      className="mt-2 px-0 md:px-8"
                      placeholder="Seleccione Bodega"
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.nombre}
                      value={selectedBodega}
                      options={dataBodega}
                      onChange={(option) => setSelectedBodega(option)}
                      menuPortalTarget={document.body}
                      loadingMessage={() => "Cargando opciones..."}
                      isLoading={dataBodega?.length === 0}
                      isClearable
                    />
                  )}
                />
                {errors.BodegaId && (
                <span className="text-red-600 block">
                  {errors.BodegaId.message}
                </span>
              )}
              </div>

              <div className="col-span-3">
                <button
                  type="submit"
                  className="btn btn-outline btn-primary my-2 p-2 w-3/4"
                >
                  Guardar <FaSave />
                </button>
              </div>
            </form>
          </>
        )}

        {dataInventarioFisicoDetalle && empresa && numero ? (
          <div className="w-full mt-2 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dataInventarioFisicoDetalle.map((e) => (
                <TableInvDetalle
                  numero={numero as string}
                  inventarioFisico={e}
                  empresa={empresa as string}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-primary text-center mt-4">
            <Loading size="lg" />
          </div>
        )}
      </div>
    </>
  );
}

interface props {
  inventarioFisico: IInventarioFisicoDetalle;
  empresa: string;
  numero: string;
}

export function TableInvDetalle(props: props) {
  return (
    <div className="shadow-md hover:border-primary border-2 border-gray-300 rounded-md grid grid-cols-3 gap-4 ">
      <div className="col-span-1 text-start p-2">
        <label className="font-semibold">Rut Encargado:</label>{" "}
        <span className="">{props.inventarioFisico.encargadoRut}</span>
      </div>

      <div className="col-span-2 text-start p-2">
        <label className="font-semibold">Nombre Encargado:</label>{" "}
        <span className="">{props.inventarioFisico.encargado}</span>
      </div>

      <div className="col-span-1 text-start p-2">
        <label className="font-semibold">Fecha registro:</label>{" "}
        <span className="">
          {props.inventarioFisico.fechaRegistro
            ? props.inventarioFisico.fechaRegistro
            : "Fecha no disponible"}
        </span>
      </div>

      <div className="col-span-1 text-start p-2">
        <label className="font-semibold">Centro de Costos:</label>{" "}
        <span className="">{props.inventarioFisico.centroCosto}</span>
      </div>

      <div className="col-span-1 text-start p-2">
        <label className="font-semibold">Bodega:</label>{" "}
        <span className="">{props.inventarioFisico.bodega}</span>
      </div>
      <div className="col-span-3 grid grid-cols-3 gap-2 text-start bg-gray-200 p-2">
        <label className="font-semibold col-span-3">Acciones:</label>
        <div className="col-start-4 col-end-5 flex items-center">
          <a
            onClick={() =>
              router.push(
                `/inventario/lista/${props.numero}/${props.inventarioFisico.id}?empresa=${props.empresa}&centrocosto=${props.inventarioFisico.centroCostoId}&bodega=${props.inventarioFisico.bodegaId}`
              )
            }
            className="flex items-center cursor-pointer hover:font-bold bg-primary text-primary-content p-1 px-2 rounded-md"
          >
            <span className="text-sm">Inventariar</span>
            <FaBoxesStacked className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
