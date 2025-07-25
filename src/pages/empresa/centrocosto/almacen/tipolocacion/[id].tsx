import { useCallback, useEffect, useRef } from "react";
import { useContextStore } from "../../../../../store/context.store";
import { register } from "module";
import { Modal, Divider, Select, Textarea, Button, Input } from "react-daisyui";
import { z } from "zod";
import { appendErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { useUserStore } from "../../../../../store/user.store";
import { useRouter } from "next/router";
import { api_getTipoLocation, api_postLocation, api_postTipoLocation } from "../../../../../services/bodega.service";
import { AxiosError } from "axios";
import { FaArrowLeft } from "react-icons/fa";
interface ITipoAlmacenForm {
  EmpresaId: string;
  Nombre: string;
}
interface ITipoAlmacen {
  empresaId: number;
  nombre: string;
}
export default function Page() {
  const validationSchema = z.object({
    Nombre: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }).min(4, "Campo demasiado corto"),
    EmpresaId: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),

  });
  const router = useRouter();

  const methodsLocation = useForm<ITipoAlmacenForm>({
    resolver: zodResolver(validationSchema),
  });
  const { jwt } = useUserStore();

  const { isLoading, error, data, refetch } = useQuery(
    "AlmacenByID",
    () => api_getTipoLocation(jwt, router.query.id as string),
    {
      enabled: router.query.id !== undefined,
      onError: (err: AxiosError) => {
        toast.error("Ocurrio un error buscando al buscar el tipo de locacion");
        return router.back();
      },
    }
  );
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methodsLocation;

  const { setActive } = useContextStore()
  useEffect(() => {
    setActive("Prestadores");
  }, [])

  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback(() => {
    if (!router.query.id) return router.back();
    //   reset();
    //   defaultValues();
    setValue('EmpresaId', (router.query.id?.toString()));
    locationRef.current?.showModal();
  }, [locationRef]);

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);

  const LocationSubmit = async (data: ITipoAlmacenForm) => {
    try {
      await api_postTipoLocation(jwt, data);
      toast.success("¡El nuevo tipo de Locacion se creo correctamente!");
      reset();
      handleCloseLocation();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (<>
    <div className="flex items-center justify-center">
      <div className="container shadow">
        <div className="overflow-x-auto">
          <div className="flex flex-row justify-between m-4">
            <button type="button" className="btn btn-primary" onClick={()=> router.back()}><FaArrowLeft/>Volver</button>
            <button className="btn btn-primary" onClick={handleShowLocation}>Agregar</button>
          </div>
          <table className="table mt-4">
            {/* head */}
            <thead>
              <tr>
                <th className="font-extrabold text-black">#</th>
                <th className="font-extrabold text-black" align="center">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.dataList.map((e: ITipoAlmacen, index: number) => (
                <tr className="hover:bg-[#FAF6FF]">
                  <th>{index + 1}</th>
                  <td align="center">{e.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Modal backdrop responsive ref={locationRef}>
      <Modal.Header className="font-bold">Tipo de Ubicación</Modal.Header>
      <Divider />
      <Modal.Body>
        <form onSubmit={handleSubmit((d) => LocationSubmit(d))}>
          <div className="my-2">
            <div className="flex flex-wrap">
              <div className="flex flex-col w-full">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <Input
                  {...register("Nombre", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                />
                <label className="label text-error">
                  <span>{errors.Nombre?.message}</span>
                </label>
              </div>
            </div>
            <div className="flex flex-wrap">
            </div>
            <div className="my-2">
              <div className="flex items-center justify-center">
                <Button type="submit" className="text-base-100" color="primary">Guardar</Button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>

  </>
  )
}