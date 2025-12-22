import { ReactNode, useEffect, useState } from "react";
import { useContextStore } from "../../store/context.store";
import { FaSearch, FaTruck, FaWarehouse } from "react-icons/fa";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/user.store";
import { api_getEmpresas } from "@/services/bodega.service";
import { useInfiniteQuery } from "react-query";
import React from "react";
import WarningAlert from "@/components/alerts/warningAlert";
import { IEmpresa } from "@/interfaces/creation";
import {
  FaCircleXmark,
  FaClipboardQuestion,
  FaDolly,
  FaFilePen,
} from "react-icons/fa6";
import { toast } from "react-toastify";

export default function index() {
  const { setActive, currentMenu } = useContextStore();
  useEffect(() => {
    setActive("Salidas");
  }, []);

  const sectionTitle =
    currentMenu?.titulo ||
    // @ts-ignore: algunos menús usan nombre
    currentMenu?.nombre ||
    "Salidas";

  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });

  // para el buscador
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "startsWith" | "contains" | "endsWith" | "exact"
  >("contains");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { jwt } = useUserStore();

  //modificamos fetch de acuerdo a nuestro endpoint
  const fetchItems = async ({ pageParam = 1 }) => {
    if (isSearching && searchTerm) {
      return api_getEmpresas(jwt, pageParam, {
        searchTerm,
        searchType,
      }).then((res) => res.data);
    }
    return api_getEmpresas(jwt, pageParam).then((res) => res.data);
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
  } = useInfiniteQuery(
    ["empresas", searchTerm, searchType, isSearching],
    fetchItems,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.pages > pages.length) {
          return pages.length + 1;
        } else {
          return undefined; // no more pages to load
        }
      },
      keepPreviousData: true,
      onSuccess: (data) => {
        const lastPage = data.pages[data.pages.length - 1];
        setMeta({
          total: lastPage.total,
          pages: lastPage.pages,
        });
      },
    }
  );

  //funciones de búsqueda.
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setIsSearching(true);
      refetch();
    } else {
      toast.info("Ingrese un término de búsqueda");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    refetch();
  };

  const allItems = data?.pages?.flatMap((page) => page.dataList) || [];
  const noItems = allItems.length === 0;
  if (isLoading && noItems) return "Cargando...";

  return (
    <React.Fragment>
      <div className="flex items-center justify-center">
        <div className="container py-2">
          <div className="d-flex justify-content-between align-items-center my-4 border-bottom pb-2">
            <h3 className="titulo-seccion">{sectionTitle}</h3>
          </div>
          {/* Buscador*/}
          <div className="w-full my-4">
            <div className="border rounded-lg shadow-sm bg-white p-4">

              {/* Label */}
              <label className="block mb-2 text-sm font-semibold">
                Buscar empresas:
              </label>

              {/* Input */}
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder=""
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="input input-bordered w-full rounded-full"
                />

                {/* Buscar */}
                <button
                  type="button"
                  className="btn btn-primary rounded-full px-10 shrink-0"
                  onClick={() => {
                    if (searchTerm.trim() === "") return;
                    handleSearch();
                  }}
                >
                  Buscar
                </button>

                {isSearching && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={clearSearch}
                    aria-label="Limpiar búsqueda"
                  >
                    <FaCircleXmark className="text-error" />
                  </button>
                )}
              </div>

              {/* Radios */}
              <div className="flex flex-wrap gap-8 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-primary"
                    checked={searchType === "startsWith"}
                    onChange={() => setSearchType("startsWith")}
                  />
                  <span>Comienza</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-primary"
                    checked={searchType === "contains"}
                    onChange={() => setSearchType("contains")}
                  />
                  <span>Contiene</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-primary"
                    checked={searchType === "endsWith"}
                    onChange={() => setSearchType("endsWith")}
                  />
                  <span>Termina con</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-primary"
                    checked={searchType === "exact"}
                    onChange={() => setSearchType("exact")}
                  />
                  <span>Exacto</span>
                </label>
              </div>

            </div>
          </div>

          {noItems ? (
            <WarningAlert
              message={
                isSearching
                  ? "No se encontraron resultados para la búsqueda"
                  : "No existen empresas registradas"
              }
            />
          ) : (
            <div className="flex flex-wrap mx-4">
              {data?.pages?.map((page, pageIndex) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2"
                  key={pageIndex}
                >
                  {page.dataList.map((empresa: IEmpresa, index: number) => (
                    <Element element={empresa} key={index} />
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col">
            {hasNextPage ? (
              <>
                <div className="mt-2">
                  <button
                    className="px-12 btn btn-outline btn-primary"
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
                <div className="mt-4"></div>
              </>
            ) : (
              !noItems && <div className="mt-2"></div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function Element({ element }: { element: IEmpresa }) {
  const router = useRouter();

  const deleteElement = () => {
    console.log("delete");
  };

  return (
    <div className=" hover:shado-wmd  border rounded-md  shadow animate-fadein">
      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Razón social</span>
          <span className="text-sm align-left">{element.razonSocial}</span>
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
          {/* <a
            onClick={() => router.push(`/recepcion/cotizacion/${element.id}`)}
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Cotizaciones</span>
            <FaFilePen className="text-primary ml-2" />
          </a> */}
          <a
            onClick={() =>
              router.push(`/salida/guiaEntregaTraspaso?empresa=${element.id}`)
            }
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">
              Traspaso bodegas
            </span>
            <FaWarehouse className="text-primary ml-2" />
          </a>
          <a
            onClick={() =>
              router.push(`/salida/guiaEntregaSalida?empresa=${element.id}`)
            }
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">Salidas</span>
            <FaTruck className="text-primary ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
