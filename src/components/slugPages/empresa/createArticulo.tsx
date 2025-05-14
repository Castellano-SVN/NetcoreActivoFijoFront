import { FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-daisyui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArticuloFormValues,
  IArticulo,
  ICuenta,
  ISubFamilia,
  ITipoUnidad,
  IYears,
} from "@/interfaces/creation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import {
  api_getOneSubFamilias,
  api_postArticulos,
  api_postSubFamilias,
  api_putArticulos,
} from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

interface props {
  guid: string;
  subFamilyGuid: string;
  familyGuid: string;
  yearGuid: IYears[];
  tipoUnidad: ITipoUnidad[];
  change: () => void;
}
export default function CreateArticulo(props: props) {
  const router = useRouter();
  const { jwt } = useUserStore();
  const validationSchema = z.object({
    EmpresaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    AnoNumero: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    SubFamiliaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Id: z
      .string({
        required_error: "Campo requerido",
        invalid_type_error: "Campo requerido",
      })
      .optional(),
    TipoUnidadCodigo: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Codigo: z
      .string({
        required_error: "Campo requerido",
        invalid_type_error: "El campo debe ser numerico",
      })
      .optional(),
    Nombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Valor: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Descripcion: z
      .string({
        required_error: "Campo requerido",
        invalid_type_error: "Campo requerido",
      })
      .optional(),
    Eliminado: z
      .boolean({
        required_error: "Campo requerido",
        invalid_type_error: "Campo requerido",
      })
      .default(false),
  });

  const methods = useForm<ArticuloFormValues>({
    resolver: zodResolver(validationSchema),
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

  const onSubmit: SubmitHandler<ArticuloFormValues> = async (
    data: ArticuloFormValues
  ) => {
    try {
      if (!data.Id) {
        await api_postArticulos(jwt, data);
        toast.success("Artículo guardado correctamente");
        reset();
      } else {
        await api_putArticulos(jwt, data);
        toast.success("Artículo actualizado correctamente");
      }
      props.change();
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        if (
          error.response?.data?.message ===
          "Ya existe un articulo con el mismo código."
        ) {
          toast.error("Ya existe un articulo con el mismo código.");
        } else {
          toast.error("Error en la solicitud");
        }
      } else if (error instanceof Error) {
        toast.error("Ocurrió un error inesperado");
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  const [slugs, setSlugs] = useState<{ subFamilia: string; familia: string }>();
  const SubfamiliasQuerys = async (subFamilia: string, familia: string) => {
    await getSubFamilia(subFamilia, familia);
  };

  useEffect(() => {
    if (!router.query.slug) return;
    const empresa = router.query.slug[0];
    const familia = router.query.slug[1];
    const subFamilia = router.query.slug[2];
    console.log(router.query.slug);
    if (subFamilia) SubfamiliasQuerys(subFamilia, familia);
    setSlugs({
      familia: familia as string,
      subFamilia: subFamilia as string,
    });
  }, [router.query]);

  const [dataSubFamilia, setDataSubFamilia] = useState<ISubFamilia>();

  const getSubFamilia = async (id: string, familia: string) => {
    try {
      const dataGet = await api_getOneSubFamilias(jwt, id, familia);
      setDataSubFamilia(dataGet.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("se ejecuto 1 vez");
    setValue("EmpresaId", props.guid);
    setValue("SubFamiliaId", props.subFamilyGuid);
  }, [props.guid, props.familyGuid]);

  useEffect(() => {
    if (!dataSubFamilia) return;
    setValue("AnoNumero", dataSubFamilia?.anoNumero);
  }, [dataSubFamilia]);

  const [show, setShow] = useState<boolean>(false);
  const setArticuloEdit = async () => {
    const articuloEditLs = localStorage.getItem("editArticulo");
    if (!articuloEditLs) {
      setShow(false);
      return;
    }
    const editArticulo: { articulo: IArticulo } = JSON.parse(articuloEditLs);
    toast.info("Editando articulo existente");
    setValue("EmpresaId", editArticulo.articulo.empresaId);
    setValue("AnoNumero", editArticulo.articulo.anoNumero);
    setValue("SubFamiliaId", editArticulo.articulo.subFamiliaId);
    setValue("Id", editArticulo.articulo.id);
    setValue("Codigo", editArticulo.articulo.codigo);
    setValue("Nombre", editArticulo.articulo.nombre);
    setValue("Valor", editArticulo.articulo.valor);
    setValue("Descripcion", editArticulo.articulo.descripcion);
    setValue("Eliminado", editArticulo.articulo.eliminado);
    setShow(true);
    localStorage.clear();
  };
  useEffect(() => {
    setArticuloEdit();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-start md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
        <div className="flex flex-col">
          <span className="font-bold text-xl">Creación de artículo</span>
        </div>
      </div>
      <div className="flex flex-row justify-center md:justify-center lg:justify-center  mt-0 md:mt-4 md:ml-4">
        <FormProvider {...methods}>
          <div className="mt-2">
            <form
              className="flex flex-col  p-8 text-left border shadow-md rounded-md mb-4 mx-2 md:mx-auto lg:mx-auto"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-row">
                <div className="flex flex-col mr-2">
                  <span className="text-base font-semibold leading-6 text-gray-900">
                    Nombre:
                  </span>
                  <input
                    type="text"
                    {...register("Nombre", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                    className="mt-1 w-full h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content "
                  />
                  <label className="label text-error">
                    {errors.Nombre ? errors.Nombre.message : ""}
                  </label>
                </div>

                <div className="flex flex-col">
                  <span className="text-base font-semibold leading-6 text-gray-900 ">
                    Código:
                  </span>
                  <input
                    type="text"
                    {...register("Codigo", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                    className="mt-1 w-full h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content"
                  />
                  <label className="label text-error">
                    {errors.Codigo ? errors.Codigo.message : ""}
                  </label>
                </div>
              </div>

              <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                Valor:
              </span>
              <input
                type="number"
                step="0.01"
                {...register("Valor", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                className="mt-1 w-2/4 h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content "
              />
              <label className="label text-error">
                {errors.Valor ? errors.Valor.message : ""}
              </label>

              <div className="flex flex-col md:flex-row lg:flex-row">
                <div className="flex flex-col">
                  <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                    Tipo unidad codigo:
                  </span>
                  <select
                    {...register("TipoUnidadCodigo", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                    className="mt-1 h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content"
                  >
                    <option key={0} value={""}>
                      Seleccione un tipo unidad
                    </option>
                    {props.tipoUnidad.map((option, index) => (
                      <option key={index} value={option.codigo}>
                        {option.nombre}
                      </option>
                    ))}
                  </select>
                  <label className="label text-error">
                    {errors.TipoUnidadCodigo
                      ? errors.TipoUnidadCodigo.message
                      : ""}
                  </label>
                </div>
              </div>

              <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                Descripción:
              </span>
              <textarea
                {...register("Descripcion")}
                className=" mt-1 w-full rounded-md text-base font-semibold leading-6 text-gray-900 focus:ring-2 focus:ring-primary border bg-primary-content"
                rows={3}
              ></textarea>
              <label className="label text-error">
                {errors.Descripcion ? errors.Descripcion.message : ""}
              </label>

              {show ? (
                <div className="mt-2">
                  <div className="flex justify-center">
                    <button className="px-16 btn btn-primary" type="submit">
                      Modificar Artículo <FaPlus />
                    </button>
                  </div>
                  <div className="my-2 flex justify-center">
                    <button
                      className="px-16 btn btn-outline btn-primary"
                      onClick={() => props.change()}
                    >
                      Volver
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex justify-center">
                    <button className="px-16 btn btn-primary" type="submit">
                      Crear Artículo <FaPlus />
                    </button>
                  </div>
                  <div className="my-2 flex justify-center">
                    <button
                      className="px-16 btn btn-outline btn-primary"
                      onClick={() => props.change()}
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </FormProvider>
      </div>
    </>
  );
}
