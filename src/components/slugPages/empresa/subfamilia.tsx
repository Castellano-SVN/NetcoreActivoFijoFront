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
import { api_getSubFamilias } from "@/services/bodega.service";
import ErrorAlert from "@/components/alerts/errorAlert";
import { ISubFamilia } from "@/interfaces/creation";
import WarningAlert from "@/components/alerts/warningAlert";

interface props {
  guid: string;
  familyGuid: string;
  create: () => void
}
export default function Page(props: props) {
  const router = useRouter();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const { jwt } = useUserStore();
  const fetchItems = async ({ pageParam = 1 }) => {
    const response = await api_getSubFamilias(jwt, props.familyGuid, pageParam);
    return response.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isLoading,
  } = useInfiniteQuery(`subFamilia-${props.familyGuid}`, fetchItems, {
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


  if (status === "error")
    return (
      <div>
        <ErrorAlert
          message="Ocurrio un error al buscar los datos de SubFamilia"
          action={() => router.back()}
        />
      </div>
    );
  const allItems = data?.pages?.flatMap((page) => page.dataList) || [];
  const noItems = allItems.length === 0;
  if (isLoading && noItems) return "Cargando...";
  return (
    <React.Fragment>
      <div className="flex flex-row justify-start md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
        <div className="flex flex-col">
          <span className="font-bold text-2xl">SubFamilias</span>
        </div>
      </div>
      {noItems ? (
        <>
          <WarningAlert message="No existen SubFamilias vinculadas a esta empresa" />
          <button
            className="px-12 btn btn-primary"
            onClick={() => props.create()}
          >
            Crear Subfamilia <FaPlus />
          </button>
        </>
      ) : (
        <div className="flex flex-wrap mx-2">
          {data?.pages?.map((page, pageIndex) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2" key={pageIndex}>
              {page.dataList.map((subFamily: ISubFamilia, index: number) => (
                <Element element={subFamily} key={index} />
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
              onClick={() => props.create()}
            >
              Crear SubFamilia <FaPlus />
            </button>
          </div>
        </>
        ) : (
          !noItems && (
            <div className="mt-2">
              <button
                className="px-16 btn btn-primary "
                onClick={() => props.create()}
              >
                Crear SubFamilia <FaPlus />
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
    </React.Fragment>
  );
}

function Element({ element }: { element: ISubFamilia }) {
  const router = useRouter();

  const deleteElement = () => {
    console.log("delete");
  }
  const Show = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    console.log(currentUrl)
    router.push(`${currentUrl}/${element.id}`)
  }
  return (
    <>
      <div
        className=" hover:shadow-md  border rounded-md  shadow"
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
    </>
  );
}
