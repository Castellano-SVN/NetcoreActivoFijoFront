import { ReactNode, useEffect, useState } from "react";
import { useContextStore } from "../../store/context.store";
import { FaChevronDown, FaChevronUp, FaClipboardCheck } from "react-icons/fa";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/user.store";
import { api_getEmpresas } from "@/services/bodega.service";
import { useInfiniteQuery } from "react-query";
import React from "react";
import WarningAlert from "@/components/alerts/warningAlert";
import { IEmpresa } from "@/interfaces/creation";
import { FaClipboardQuestion, FaDolly, FaFilePen } from "react-icons/fa6";



export default function index() {




  const { setActive } = useContextStore()
  useEffect(() => {
    setActive("Recepcion");
  }, [])

  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const { jwt } = useUserStore();
  const fetchItems = async ({ pageParam = 1 }) => {
    const response = await api_getEmpresas(jwt, pageParam);
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
  } = useInfiniteQuery("empresas", fetchItems, {
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

  const allItems = data?.pages?.flatMap((page) => page.dataList) || [];
  const noItems = allItems.length === 0;
  if (isLoading && noItems) return "Cargando...";

  return (
    <React.Fragment>
      <div className="flex items-center justify-center">
        <div className="container shadow">
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">Empresas</span>
            </div>
          </div>
          {noItems ? (
            <>
              <WarningAlert message="No existen empresas" />
            </>
          ) : (
            <div className="flex flex-wrap mx-4">
              {data?.pages?.map((page, pageIndex) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2" key={pageIndex}>
                  {page.dataList.map((empresa: IEmpresa, index: number) => (
                    <Element element={empresa} key={index} />
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

              </div>
            </>
            ) : (
              !noItems && (
                <div className="mt-2">

                </div>
              )
            )}
          </div>
        </div>
      </div>
    </React.Fragment>

  )
}

function Element({ element }: { element: IEmpresa }) {
  const router = useRouter();


  const deleteElement = () => {
    console.log("delete");
  }

  return (
    <div
      className=" hover:shadow-md  border rounded-md  shadow animate-fadein"
    >
      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Razon social</span>
          <span className="text-sm align-left">
            {element.razonSocial}
          </span>
        </div>
        <div className="basis-1/2 flex flex-col justify-left text-right ">
          <span className="font-bold mb-2">Giro</span>
          <span className="text-sm align-left">
            {element.giro ? element.giro : "No informado"}
          </span>
        </div>
      </div>
      <div className="flex flex-row p-3 bg-[#FAF6FF] justify-around">
        <span className="basis-1/2 font-bold text-sm text-left">Acciones</span>
        <div className="flex  flex-wrap justify-end space-x-4">
        <a
            onClick={() => router.push(`/recepcion/cotizacion/${element.id}`)}
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Cotizaciones</span>
            <FaFilePen className="text-primary ml-2" />
          </a>
          <a
            onClick={() => router.push(`/recepcion/recepcion?empresa=${element.id}`)}
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Recepción</span>
            <FaClipboardCheck className="text-primary ml-2" />
          </a>

          <a
            onClick={() => { router.push(`/recepcion/ingreso?empresa=${element.id}`) }}
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Ingreso</span>
            <FaDolly className="text-primary ml-2" />
          </a>

          <a
            onClick={() => { router.push(`/recepcion/consulta?empresa=${element.id}`) }}
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Consulta</span>
            <FaClipboardQuestion className="text-primary ml-2" />
          </a>

        </div>
      </div>
    </div>
  );
}