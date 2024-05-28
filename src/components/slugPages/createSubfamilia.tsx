import { FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-daisyui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ICuenta, IYears, SubFamiliaFormValues } from "@/interfaces/creation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import { api_postSubFamilias } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";


interface props {
  guid: string;
  familyGuid: string;
  yearGuid: IYears[];
  cuentasGuid: ICuenta[];
  change: () => void;
}
export default function CreateSubFamily(props: props) {
  const router = useRouter();
  const { jwt } = useUserStore();
  const ref = useRef<HTMLDialogElement>(null);

  const validationSchema = z.object({
    EmpresaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    AnoNumero: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    Id: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    Codigo: z.number({
        required_error: "Campo requerido",
        invalid_type_error: "El campo debe ser numerico",
    }),
    FamiliaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    CuentaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    Nombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Descripcion: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    Eliminado: z.boolean({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).default(false),
  });

  const methods = useForm<SubFamiliaFormValues>({
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

  useEffect(() => {
    console.log("se ejecuto 1 vez")
    setValue("EmpresaId", props.guid);
    setValue("FamiliaId", props.familyGuid);
  }, [props.guid, props.familyGuid]);

  const onSubmit: SubmitHandler<SubFamiliaFormValues> = async (
    data: SubFamiliaFormValues
  ) => {
    try {
      console.log(data);
      // await api_postSubFamilias(jwt, data);
      // handleClose();
      // refetch();
      // toast.success("Familia guardada correctamente");
    } catch (error) {}
  };
  return (
    <>
      <div className="flex flex-row justify-start md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
        <div className="flex flex-col">
          <span className="font-bold text-xl">Editor de subfamilias</span>
        </div>
      </div>
      <div className="flex flex-row justify-center md:justify-center lg:justify-center  mt-0 md:mt-4 md:ml-4">
        <FormProvider {...methods}>
        <div className="mt-2">
          <form
              className="flex flex-col p-4 text-left"
              onSubmit={handleSubmit(onSubmit)}
            >
              <span className="text-base font-semibold leading-6 text-gray-900 ">
                Codigo:
              </span>
              <input
                type="text"
                {...register("Codigo", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                className="mt-1 w-full h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content"
                maxLength={4}
              />
              <label className="label text-error">
                {errors.Codigo ? errors.Codigo.message : ""}
              </label>

              <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                Nombre:
              </span>
              <input
                type="text"
                {...register("Nombre", {
                  setValueAs: (value) =>
                    value === "" ? undefined : value,
                })}
                className="mt-1 w-full h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content "
              />
              <label className="label text-error">
                {errors.Nombre ? errors.Nombre.message : ""}
              </label>

              <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                Descripcion:
              </span>
              <textarea
                {...register("Descripcion")}
                className=" mt-1 w-full rounded-md text-base font-semibold leading-6 text-gray-900 focus:ring-2 focus:ring-primary border bg-primary-content"
                rows={10}
              ></textarea>
              <label className="label text-error">
                {errors.Descripcion ? errors.Descripcion.message : ""}
              </label>
              
            <div className="mt-2">
              <button
                className="px-16 btn btn-primary btn-primary"
                type="submit"
              >
                Crear Sub-Familia <FaPlus />
              </button>
              <div className="my-2">
              <button
                className="px-16 btn btn-outline btn-primary"
                onClick={() => props.change()}
              >
                Volver
              </button>
              </div>
            </div>
          </form>
        </div>
        </FormProvider>
      </div>    
    </>
  );
}
