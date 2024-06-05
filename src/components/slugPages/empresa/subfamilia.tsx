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
import { FaCircleXmark, FaPenToSquare } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import { api_deleteArticulo, api_deleteSubFamilia, api_getSubFamilias } from "@/services/bodega.service";
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
                <Element element={subFamily} key={index} refetch={refetch} create={props.create} />
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

function Element({ element, refetch, create }: { element: ISubFamilia, refetch: () => void, create: () => void }) {
  const router = useRouter();
  const { jwt } = useUserStore();

  const Show = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    console.log(currentUrl)
    router.push(`${currentUrl}/${element.id}`)
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClickDelete = () => {
    setIsModalOpen(true);
  };
  const handleClickClose = () => {
    setIsModalOpen(false);
  };
  const handleClickYes = async () => {
    try {
      const dataDelete = await api_deleteSubFamilia(jwt, element.id);
      if (dataDelete.status === 200) {
        toast.success('Articulo eliminado con exito');
        setIsModalOpen(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error('Ha ocurrido un error');
    }
  };

  const editSubFamilia = () => {
    localStorage.setItem("editSubFamilia", JSON.stringify({ subFamilia: element }));
    create();
  };


  return (
    <>
      <div
        className=" hover:shadow-md  border rounded-md  shadow"
      >
        <div className="flex flex-row justify-between p-2 tooltip tooltip-primary" data-tip={element.descripcion}>
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
            <a className="flex items-center cursor-pointer hover:font-bold" onClick={Show} >
              <span className="text-sm underline text-primary">Ver</span>
              <FaEye className="text-primary ml-2" />
            </a>
            <a className="flex items-center cursor-pointer hover:font-bold" onClick={editSubFamilia} >
              <span className="text-sm underline items-center text-primary">Editar</span>
              <FaPenToSquare className="text-primary ml-2" />
            </a>

            <a className="flex items-center cursor-pointer hover:font-bold" onClick={handleClickDelete}>
              <span className="text-sm underline items-center text-error">Borrar</span>
              <FaCircleXmark className="text-error ml-2" />
            </a>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">¿Estás seguro que deseas eliminar el Articulo?</h3>
            <div className="modal-action flex justify-center">
              <button className="btn btn-outline btn-primary mr-2 w-20" onClick={handleClickClose}>
                No
              </button>
              <button className="btn btn-outline btn-accent w-20" onClick={handleClickYes}>
                Sí
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
