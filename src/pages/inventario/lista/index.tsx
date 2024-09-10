import {
  api_getAllIFByEmpresa,
  api_postInventarioFisico,
} from "@/services/inventario.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { api_getOneEmpresa } from "../../../services/bodega.service";
import {
  IEmpresa,
  InventarioFisicoFormValue,
} from "../../../interfaces/creation";
import router from "next/router";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  IInventarioFisico,
  InventarioFisicoData,
  InventarioFisicoFormValues,
} from "../../../interfaces/inventario.interface";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { Button, Divider, Loading, Modal } from "react-daisyui";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { FaCircleInfo } from "react-icons/fa6";
import { useQuery } from "react-query";
registerLocale("es", es);

export default function ViewInventoryTaking() {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

  const { jwt } = useUserStore();

  const searchParams = useSearchParams();
  const empresaId = searchParams.get("empresa");
  const [dataInventarioFisico, setDataInventarioFisico] =
    useState<IInventarioFisico[]>();
  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();
  const [modalShow, setModalShow] = useState<boolean>(false);
  useEffect(() => {
    const getOneEmpresa = async () => {
      if (empresaId) {
        try {
          const data = await api_getOneEmpresa(jwt, empresaId);
          setDataEmpresa(data.data.dataList[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getOneEmpresa();
  }, [jwt, empresaId]);

  //seccion data inventario fisico
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });

  const [page, setPage] = useState<number>(1);

  const { isLoading, error, data, refetch } = useQuery(
    "inventariosFisicos",
    () => api_getAllIFByEmpresa(jwt, empresaId as string, page),
    {
      enabled: true,
      onSuccess: (data) => {
        setMeta({
          total: data.data.total,
          pages: data.data.pages,
        });
        setDataInventarioFisico(data.data.dataList);
      },
    }
  );

  useEffect(() => {
    if(!empresaId) return;
    setDataInventarioFisico([]);
    refetch();
  }, [page,empresaId]);

  /* const getInventarioFisico = async () => {
    if (empresaId) {
      try {
        const data = await api_getAllIFByEmpresa(jwt, empresaId);
        setDataInventarioFisico(data.data.dataList);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getInventarioFisico();
  }, [jwt, empresaId]); */

  const programarRevisionSchema = z
    .object({
      EmpresaId: z
        .string({
          required_error: "Campo requerido",
          invalid_type_error: "Campo requerido",
        })
        .optional(),
      FechaInicio: z.date({ required_error: "Campo requerido" }),
      FechaTermino: z.date({ required_error: "Campo requerido" }),
    })
    .refine(
      (data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Elimina la parte de la hora para comparar solo fechas
        return data.FechaInicio >= today;
      },
      {
        message: "La fecha de inicio no puede ser anterior al día de hoy.",
        path: ["FechaInicio"],
      }
    )
    .refine((data) => data.FechaTermino > data.FechaInicio, {
      message:
        "La fecha de término debe ser mayor que la fecha de inicio, incluyendo horas y minutos.",
      path: ["FechaTermino"],
    });

  const methods = useForm<InventarioFisicoFormValues>({
    resolver: zodResolver(programarRevisionSchema),
    defaultValues: {
      FechaInicio: new Date(),
      FechaTermino: new Date(),
    },
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

  const onSubmit: SubmitHandler<InventarioFisicoFormValues> = async (
    data: InventarioFisicoFormValues
  ) => {
    try {
      if (!empresaId) return;
      const response = await api_postInventarioFisico(jwt, {
        ...data,
        empresaId: empresaId,
      });
      if (response) {
        toast.success("Toma programada con exito.");
        refetch();
        reset();
        setModalShow(false);
      } else {
        toast.error("Ha ocurrido un error.");
        console.log(errors);
      }
    } catch (error) {
      toast.error("ha ocurrido un error inesperado");
      console.log(error);
    }
  };

  const postInventariar = async (data: InventarioFisicoData) => {
    try {
      let input: {
        empresaId: string;
        fechaInicio?: Date | undefined;
        fechaFin?: Date | undefined;
      } = {
        empresaId: data.EmpresaId,
        fechaInicio: undefined,
        fechaFin: undefined,
      };
      if (data.FechaInicio) input.fechaInicio = data.FechaInicio;
      if (data.FechaTermino) input.fechaFin = data.FechaTermino;
      await api_postInventarioFisico(jwt, input);
      refetch();
      toast.success("Inventariado registrado con exito.");
    } catch (error) {
      console.log(error);
      toast.error("ha ocurrido un error inesperado.");
    }
  };

  const modalRef = useRef<HTMLDialogElement>(null);

  const handleShowModal = useCallback(() => {
    setModalShow(!modalShow);
  }, [modalShow]);

  const fechaDesde = new Date(watch("FechaInicio"));
  const fechaHasta = new Date(watch("FechaTermino"));
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
            <div className="join">
              <button
                type="button"
                onClick={() => postInventariar({ EmpresaId: dataEmpresa?.id })}
                className="btn btn-primary join-item"
              >
                <FiPlus />
                Inventariar
              </button>
              <button
                type="button"
                onClick={handleShowModal}
                className="btn btn-primary join-item"
              >
                <FiPlus /> Programar revisión
              </button>
            </div>
          )}
        </div>
        {modalShow && (
          <>
            {
              <form
                className="flex justify-center border"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="my-2 w-full lg:w-1/2 border-neutral border p-2 rounded-md shadow-sm">
                  <div className="flex flex-wrap">
                    <div className="flex flex-col w-full">
                      <label className="label">
                        <span className="label-text">Fecha de inicio</span>
                      </label>
                      <Controller
                        control={control}
                        name="FechaInicio"
                        render={({ field }) => (
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(date) => field.onChange(date)}
                            onBlur={field.onBlur}
                            className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-100"
                            dropdownMode="select"
                            yearDropdownItemNumber={15}
                            peekNextMonth
                            showYearDropdown
                            showMonthDropdown
                            showTimeSelect
                            dateFormat={"dd/MM/yyyy HH:mm"}
                            locale="es"
                            timeInputLabel="Hora:"
                            selectsStart
                            startDate={fechaDesde}
                            endDate={fechaHasta}
                          />
                        )}
                      />
                      <label className="label text-error">
                        {errors.FechaInicio && (
                          <span>{errors.FechaInicio.message}</span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <div className="flex flex-col w-full">
                      <label className="label">
                        <span className="label-text">Fecha de termino: </span>
                      </label>
                      <Controller
                        control={control}
                        name="FechaTermino"
                        render={({ field }) => (
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            showTimeSelect
                            onChange={(date) => field.onChange(date)}
                            onBlur={field.onBlur}
                            className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-100"
                            dropdownMode="select"
                            yearDropdownItemNumber={15}
                            peekNextMonth
                            showYearDropdown
                            showMonthDropdown
                            dateFormat={"dd/MM/yyyy HH:mm"}
                            locale="es"
                            selectsEnd
                            startDate={fechaDesde}
                            endDate={fechaHasta}
                            minDate={fechaDesde}
                          />
                        )}
                      />

                      <label className="label text-error">
                        {errors.FechaTermino && (
                          <span>{errors.FechaTermino.message}</span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="my-2">
                    <div className="flex items-center justify-center">
                      <Button
                        type="submit"
                        className="text-base-100"
                        color="primary"
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            }
          </>
        )}
        {dataInventarioFisico && empresaId ? (
          <div className="w-full mt-2 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dataInventarioFisico
                .map((e) => (
                  <TableInventory
                    inventarioFisico={e}
                    empresa={empresaId}
                    refetch={refetch}
                  />
                ))}
            </div>
            <InventarioFisicoPagination
              page={page}
              totalPages={meta.pages}
              setPage={setPage}
            />
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
  inventarioFisico: IInventarioFisico;
  empresa: string;
  refetch: () => void;
}

export function TableInventory(props: props) {
  return (
    <div className="shadow-md hover:border-primary border-2 border-gray-300 rounded-md grid grid-cols-2 gap-4 ">
      <div className="col-span-2 text-start p-2">
        <label className="font-semibold">Número:</label>{" "}
        <span className="">{props.inventarioFisico.numero}</span>
      </div>

      <div className="text-start p-2">
        <label className="font-semibold">Fecha de Inicio:</label>{" "}
        <span className="">
          {props.inventarioFisico.fechaInicio
            ? new Date(props.inventarioFisico.fechaInicio).toLocaleDateString(
                "es-ES",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ) + " hrs."
            : "Fecha no disponible"}
        </span>
      </div>

      <div className="text-start p-2">
        <label className="font-semibold">Fecha de Termino:</label>{" "}
        <span className="">
          {props.inventarioFisico.fechaTermino
            ? new Date(props.inventarioFisico.fechaTermino).toLocaleDateString(
                "es-ES",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ) + " hrs."
            : "Fecha no disponible"}
        </span>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-2 text-start bg-gray-200 p-2">
        <label className="font-semibold col-span-2">Acciones:</label>
        <div className="col-start-4 col-end-5 flex items-center">
          {new Date() >= new Date(props.inventarioFisico.fechaTermino) ? (
            <>
              <a
                onClick={() =>
                  router.push(
                    `/inventario/informe/${props.inventarioFisico.numero}?empresa=${props.empresa}`
                  )
                }
                className="flex items-center cursor-pointer hover:font-bold bg-primary text-primary-content p-1 px-2 rounded-md"
              >
                <span className="text-sm">Informe</span>
                <FaCircleInfo className=" ml-2" />
              </a>
            </>
          ) : (
            <>
              <a
                onClick={() =>
                  router.push(
                    `/inventario/lista/${props.inventarioFisico.numero}?empresa=${props.empresa}`
                  )
                }
                className="flex items-center cursor-pointer hover:font-bold bg-primary text-primary-content p-1 px-2 rounded-md mr-2"
              >
                <span className="text-sm">Ver</span>
                <FaEye className=" ml-2" />
              </a>

              <a
                onClick={() =>
                  router.push(
                    `/inventario/informe/${props.inventarioFisico.numero}?empresa=${props.empresa}`
                  )
                }
                className="flex items-center cursor-pointer hover:font-bold bg-primary text-primary-content p-1 px-2 rounded-md"
              >
                <span className="text-sm">Informe</span>
                <FaCircleInfo className=" ml-2" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InventarioFisicoPagination({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn btn-primary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Página anterior
        </button>
        <div className="text-lg text-accent">
          Página {page} de {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-primary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Próxima página
        </button>
      </div>
    </div>
  );
}
