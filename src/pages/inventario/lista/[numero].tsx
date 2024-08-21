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
import { api_getAllBodegaByEmpresaYCentroCosto, api_getAllCentroCostoByEmpresa, api_getOneEmpresa } from "../../../services/bodega.service";
import { IBodega, ICentroCosto, IEmpresa } from "../../../interfaces/creation";
import { IFuncionarioEmpresa, InventarioFisicoDetalleData, InventarioFisicoDetalleFormValues } from "../../../interfaces/inventario.interface";
import Select from "react-select";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { FiPlus } from "react-icons/fi";
import { Button, Loading } from "react-daisyui";

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
    setValue('Numero', Number(numero));
    setValue('EmpresaId', empresa as string);
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
    getCentroCostos();
    getFuncionarios();
  }, [empresa]);

  const [selectedPersona, setSelectedPersona] = useState<IFuncionarioEmpresa | null>(null);
  const [selectedCc, setSelectedCc] = useState<ICentroCosto | null>(null);
  const [selectedBodega, setSelectedBodega] = useState<IBodega | null>(null);

  const [dataBodega, setDataBodega] = useState<IBodega[]>();
  const getBodegas = async () => {
    try {
      const bodega = await api_getAllBodegaByEmpresaYCentroCosto(jwt, empresa as string, selectedCc?.id as string);
      console.log(bodega)
      setDataBodega(bodega.data.dataList);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (empresa && selectedCc?.id) {
      getBodegas()
    }
  }, [selectedCc])


  const InvFisicoDetalleSchema = z.object({
    EmpresaId: z.string({ invalid_type_error: "Tipo de dato invalido" }),
    Numero: z.number({ invalid_type_error: "Tipo de dato invalido" }),
    FuncionarioId: z.string({ invalid_type_error: "Tipo de dato invalido" }).optional(),
    CentroCostoId: z.string({ invalid_type_error: "Tipo de dato invalido" }).optional(),
    BodegaId: z.string({ invalid_type_error: "Tipo de dato invalido" }).optional()
  });

  const methods = useForm<InventarioFisicoDetalleFormValues>({
    resolver: zodResolver(InvFisicoDetalleSchema)
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
      console.log('data del formulario: ', data);
      await api_postInventarioFisicoDetalle(jwt, data);
      toast.success("Detalles de Inventariado registrado con exito.");
      setModalShow(false);
    } catch (error) {
      console.log(error);
      toast.error("ha ocurrido un error inesperado.");
    }


  }

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
  
  const [dataInventarioFisicoDetalle, setDataInventarioFisicoDetalle] = useState<InventarioFisicoDetalleData[]>();
  const getInvFisDet = async () => {
    try {
      await api_getAllInFiDe(jwt, empresa as string, Number(numero));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
              <FiPlus /> Agregar Detalle
            </button>
          )}
        </div>

        {modalShow && (
          <>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="border rounded-lg shadow-md w-10/12 grid grid-cols-1 lg:grid-cols-12 gap-4 mx-auto p-2">
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
                        getOptionLabel={(option) => option.persona.nombres + " " + option.persona.apellidoPaterno}
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
                  {dataBodega?.length !== 0 && (
                    <Select
                      className="my-2 w-full px-0 md:px-8 "
                      placeholder="Seleccione la bodega"
                      options={dataBodega}
                      onChange={(option) => setSelectedBodega(option)}
                      value={selectedBodega}
                      loadingMessage={() => "Cargando opciones..."}
                      isLoading={dataBodega?.length === 0}
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.nombre}
                      menuPortalTarget={document.body}

                    />
                  )}
                </div>

                <div className="col-span-3">
                  <button type="submit" className="btn btn-outline btn-primary my-2 p-2 w-3/4">
                    Guardar <FaSave />
                  </button>
                </div>
              </div>
            </form>

          </>
        )}
        {/* {dataInventarioFisicoDetalle && empresa ? (
          <div className="w-full mt-2 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dataInventarioFisicoDetalle
                .sort((a, b) => a.numero - b.numero)
                .map((e) => (
                  <TableInventory inventarioFisico={e} empresa={empresaId} />
                ))}
            </div>
          </div>
        ) : (
          <div className="text-primary text-center mt-4">
            <Loading size="lg" />
          </div>
        )} */}
      </div>




    </>
  );
}


