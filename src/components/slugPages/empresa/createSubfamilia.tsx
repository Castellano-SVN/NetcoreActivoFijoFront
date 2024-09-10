import { FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-daisyui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ICuenta, IFamilia, ISubFamilia, IYears, SubFamiliaFormValues } from "@/interfaces/creation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import { api_getOneFamilias, api_postSubFamilias, api_putSubFamilias } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { toast } from "react-toastify";


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
    }),
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
    CuentaObligacionId: z.string({
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

  const [cuentaYear, setCuentaYear] = useState<ICuenta[]>([]); // Cuenta listada segun el año seleccionado
  const selectCuenta = (id: number) => {
    if (!id) { setCuentaYear([]); return }
    const yearsFilter = props.cuentasGuid.filter(e => e.anoNumero === id)
    setCuentaYear(yearsFilter);
  }


  useEffect(() => {
    console.log("se ejecuto 1 vez")
    setValue("EmpresaId", props.guid);
    setValue("FamiliaId", props.familyGuid);
  }, [props.guid, props.familyGuid]);

  const onSubmit: SubmitHandler<SubFamiliaFormValues> = async (
    data: SubFamiliaFormValues
  ) => {
    try {
      if (!data.Id) {
        await api_postSubFamilias(jwt, data);
        toast.success("SubFamilia guardada correctamente");
        reset();
      } else {
        await api_putSubFamilias(jwt, data);
        toast.success("SubFamilia actualizado correctamente");
      }
      props.change();
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error al guardar la persona");
    }
  };

  const [show, setShow] = useState<boolean>(false);
  const setSubFamiliaEdit = async () => {
    const subFamiliaEditLs = localStorage.getItem("editSubFamilia")
    if (!subFamiliaEditLs) {
      setShow(false);
      return
    };
    const editSubFamilia: { subFamilia: ISubFamilia } = JSON.parse(subFamiliaEditLs);
    toast.info("Editando SubFamilia existente");
    setValue("EmpresaId", editSubFamilia.subFamilia.empresaId);
    setValue("AnoNumero", editSubFamilia.subFamilia.anoNumero);
    setValue("Id", editSubFamilia.subFamilia.id);
    setValue("Codigo", editSubFamilia.subFamilia.codigo);
    setValue("FamiliaId", editSubFamilia.subFamilia.familiaId);
    setValue("CuentaId", editSubFamilia.subFamilia.cuentaId);
    setValue("CuentaObligacionId", editSubFamilia.subFamilia.cuentaObligacionId);
    setValue("Nombre", editSubFamilia.subFamilia.nombre);
    setValue("Descripcion", editSubFamilia.subFamilia.descripcion);
    setValue("Eliminado", editSubFamilia.subFamilia.eliminado);
    setShow(true);
    localStorage.clear();
  }
  useEffect(
    () => {
      setSubFamiliaEdit();
    }, []);



  /*  const onSubmit: SubmitHandler<SubFamiliaFormValues> = async (
     data: SubFamiliaFormValues
   ) => {
     try {
       console.log(data);
       await api_postSubFamilias(jwt, data);
       reset();
       toast.success("Sub-Familia guardada correctamente");
     } catch (error) { }
   }; */

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
              className="flex flex-col p-8 text-left border shadow-md rounded-md mb-4 mx-2 md:mx-auto lg:mx-auto"
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
                      setValueAs: (value) =>
                        value === "" ? undefined : value,
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
                    type="number"
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
                </div>
              </div>


              <span className="mt-1 text-base font-semibold leading-6 text-gray-900">
                Año:
              </span>
              <select
                {...register("AnoNumero", {
                  onChange: (e) => {
                    selectCuenta(getValues("AnoNumero"));
                  },
                  setValueAs: (value) => (value === "" ? undefined : Number(value))
                })}

                className="mt-1 w-2/4 h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content"
              >
                <option value="">Seleccione un año</option>
                {props.yearGuid.map((option, index) => (
                  <option key={index} value={option.numero}>
                    {option.nombre}
                  </option>
                ))}
              </select>
              <label className="label text-error">
                {errors.AnoNumero ? errors.AnoNumero.message : ""}
              </label>

              <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                Cuenta:
              </span>
              <select
                {...register("CuentaId", {
                  setValueAs: (value) => (value === "" ? undefined : value)
                })}
                className="mt-1 w-2/4 h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content"
              >
                <option key={0} value={""}>Seleccione una cuenta</option>
                {cuentaYear.map((option, index) => (
                  <option key={index} value={option.id}>
                    {option.numeroCuenta}
                  </option>
                ))}
              </select>
              <label className="label text-error">
                {errors.CuentaId ? errors.CuentaId.message : ""}
              </label>

              <span className=" mt-1 text-base font-semibold leading-6 text-gray-900">
                Cuenta Obligacion:
              </span>
              <select
                {...register("CuentaObligacionId", {
                  setValueAs: (value) => (value === "" ? undefined : value)
                })}
                className="mt-1 w-2/4 h-10 rounded-md text-base font-semibold leading-6 text-gray-900 border focus:ring-2 focus:ring-primary bg-primary-content"
              >
                <option key={0} value={""}>Seleccione una cuenta</option>
                {cuentaYear.map((option, index) => (
                  <option key={index} value={option.id}>
                    {option.numeroCuenta}
                  </option>
                ))}
              </select>
              <label className="label text-error">
                {errors.CuentaObligacionId ? errors.CuentaObligacionId.message : ""}
              </label>
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
                    <button
                      className="px-16 btn btn-primary"
                      type="submit"
                    >
                      Modificar Sub-Familia <FaPlus />
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
                </div>) : (
                <div className="mt-2">
                  <div className="flex justify-center">
                    <button
                      className="px-16 btn btn-primary"
                      type="submit"
                    >
                      Crear Sub-Familia <FaPlus />
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
                </div>)}
            </form>
          </div>
        </FormProvider>
      </div>
    </>
  );
}
