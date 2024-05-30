import { useInfiniteQuery } from "react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaEye, FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-daisyui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaCircleXmark } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import { api_getFamilias, api_postFamilias } from "@/services/bodega.service";
import { FamiliaFormValues, IFamilia } from "@/interfaces/creation";
import ErrorAlert from "@/components/alerts/errorAlert";
import WarningAlert from "@/components/alerts/warningAlert";

interface props {
  guid: string;
}
export default function Page(props: props) {
  const router = useRouter();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const { jwt } = useUserStore();
  const fetchItems = async ({ pageParam = 1 }) => {
    const response = await api_getFamilias(jwt, props.guid, pageParam);
    return response.data;
  };
  const validationSchema = z.object({
    EmpresaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Id: z
      .string({
        required_error: "Campo requerido",
        invalid_type_error: "Campo requerido",
      })
      .optional(),
    FamiliaId: z
      .string({
        required_error: "Campo requerido",
        invalid_type_error: "Campo requerido",
      })
      .optional(),
    Codigo: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),
    Nombre: z.string({
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

  const methods = useForm<FamiliaFormValues>({
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

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isLoading,
  } = useInfiniteQuery(`familia-${props.guid}`, fetchItems, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pages > pages.length) {
        return pages.length + 1;
      } else {
        return undefined; // no more pages to load
      }
    },
    onSuccess: (data) => {
      const lastPage = data.pages[data.pages.length - 1];
      setMeta({
        total: lastPage.total,
        pages: lastPage.pages,
      });
    },
  });

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    console.log("hola");
    reset();
    setValue("EmpresaId", props.guid);
    ref.current?.showModal();
  }, [ref]);
  const handleClose = useCallback(() => {
    ref.current?.close();
  }, [ref]);

  const onSubmit: SubmitHandler<FamiliaFormValues> = async (
    data: FamiliaFormValues
  ) => {
    try {
      await api_postFamilias(jwt, data);
      handleClose();
      refetch();
      toast.success("Familia guardada correctamente");
    } catch (error) { }
  };

  if (status === "error")
    return (
      <div>
        <ErrorAlert
          message="Ocurrio un error al buscar los datos de la familia"
          action={() => router.back()}
        />
      </div>
    );
  const allItems = data?.pages?.flatMap((page) => page.dataList) || [];
  const noItems = allItems.length === 0;
  if (isLoading && noItems) return "Cargando...";
  return (
    <React.Fragment>
      <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
        <div className="flex flex-col">
          <span className="font-bold text-2xl">Familias</span>
        </div>
      </div>
      {noItems ? (
        <>
          <WarningAlert message="No existen Familias vinculadas a esta empresa" />
          <button
            className="px-12 btn btn-primary"
            onClick={() => handleShow()}
          >
            Crear Familia <FaPlus />
          </button>
        </>
      ) : (
        <div className="flex flex-wrap mx-2">
          {data?.pages?.map((page, pageIndex) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2" key={pageIndex}>
              {page.dataList.map((family: IFamilia, index: number) => (
                <Element element={family} key={index} />
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col">
        {hasNextPage ? (<>
          <div className="mt-2">
            <button className="px-12 btn btn-outline btn-primary"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Cargando más..."
                : hasNextPage
                  ? "Ver más"
                  : "No hay más datos"}
            </button>
          </div>
          <div className="mt-4">
            <button
              className="px-12 btn btn-primary"
              onClick={() => handleShow()}
            >
              Crear Familia <FaPlus />
            </button>
          </div>
        </>
        ) : (
          !noItems && (
            <div className="mt-2">
              <button
                className="px-16 btn btn-primary"
                onClick={() => handleShow()}
              >
                Crear Familia <FaPlus />
              </button>
            </div>
          )
        )}

        <div className="my-2">
          <button
            className="px-16 btn btn-outline btn-primary"
            onClick={() => router.back()}
          >
            Volver
          </button>
        </div>
      </div>
      <Modal ref={ref}>
        <Modal.Header>
          <span className="font-bold flex justify-center text-primary">
            Creacion de Familia
          </span>
          <Button
            onClick={handleClose}
            size="sm"
            color="ghost"
            shape="circle"
            className="text-base font-semibold absolute right-2 top-2"
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <FormProvider {...methods}>
            <form
              className="flex flex-col p-4 text-center"
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
                {...register("Nombre")}
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
              <Button
                color="primary"
                animation
                className="mt-4 md:mx-20 lg:mx-20"
                type="submit"
              >
                Crear
              </Button>
            </form>
          </FormProvider>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

function Element({ element }: { element: IFamilia }) {
  const router = useRouter();

  const deleteElement = () => {
    console.log("delete");
  }
  const Show = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    router.push(`${currentUrl}/${element.id}`)
  }
  return (
    <div
      className=" hover:shadow-md  border rounded-md  shadow animate-fadein"
    >
      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Nombre</span>
          <span className="text-sm align-left">
            {element.nombre}
          </span>
        </div>
        <div className="basis-1/2 flex flex-col justify-left text-right ">
          <span className="font-bold mb-2">Codigo</span>
          <span className="text-sm align-left">
            {element.codigo}
          </span>
        </div>
      </div>
      <div className="flex flex-row p-3 bg-[#FAF6FF] justify-around">
        <span className="basis-1/2 font-bold text-sm text-left">Acciones</span>
        <div className="flex  flex-wrap justify-end space-x-4">
          <a
            onClick={Show}
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Ver</span>
            <FaEye className="text-primary ml-2" />
          </a>
          <a
            onClick={() => { }}
            className="flex items-center"
          >
            <span className="text-sm underline text-primary">Editar</span>
            <FaEye className="text-primary ml-2" />
          </a>

          <a
            onClick={deleteElement}
            className="flex items-center"
          >
            <span className="text-sm underline items-center text-error">Borrar</span>
            <FaCircleXmark className="text-error ml-2" />
          </a>
        </div>
      </div>
    </div>

  );
}
