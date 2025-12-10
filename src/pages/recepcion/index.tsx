import { ReactNode, useEffect, useState } from "react";
import { useContextStore } from "../../store/context.store";
import {
  FaChevronDown,
  FaChevronUp,
  FaClipboardCheck,
  FaSearch,
} from "react-icons/fa";
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
import { api_getEstadoArticulos } from "@/services/inventario.service";
import { useTiposStore } from "@/store/tipos.store";

export default function index() {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Recepcion");
  }, []);

  // Dentro del componente index
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "startsWith" | "contains" | "endsWith" | "exact"
  >("contains");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const { jwt } = useUserStore();
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
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
    },
  );

  const getEstadosArticulos = async () => {
    if (EstadoArticulo.length === 0) {
      try {
        const _data = await api_getEstadoArticulos(jwt);
        setEstadoArticulo(_data.data.dataList);
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    if (!jwt) return;
    getEstadosArticulos();
  }, []);
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
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">Empresas</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 mx-2 my-4 p-4 border rounded-lg shadow-sm bg-white">
            <div className="w-full md:w-1/2">
              <div className="flex flex-row items-center">
                <input
                  type="text"
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-primary w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn btn-primary ml-2"
                  onClick={handleSearch}
                  disabled={searchTerm.trim() === ""}
                >
                  <FaSearch />
                </button>
                {isSearching && (
                  <button className="btn btn-ghost ml-2" onClick={clearSearch}>
                    <FaCircleXmark className="text-error" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 mt-2 md:mt-0">
              <div className="flex flex-row flex-wrap gap-2 justify-center md:justify-start">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-sm radio-primary"
                    checked={searchType === "startsWith"}
                    onChange={() => setSearchType("startsWith")}
                  />
                  <span className="ml-1 text-sm">Comienza con</span>
                </label>

                <label className="flex items-center cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-sm radio-primary"
                    checked={searchType === "contains"}
                    onChange={() => setSearchType("contains")}
                  />
                  <span className="ml-1 text-sm">Contiene</span>
                </label>

                <label className="flex items-center cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-sm radio-primary"
                    checked={searchType === "endsWith"}
                    onChange={() => setSearchType("endsWith")}
                  />
                  <span className="ml-1 text-sm">Termina con</span>
                </label>

                <label className="flex items-center cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="searchType"
                    className="radio radio-sm radio-primary"
                    checked={searchType === "exact"}
                    onChange={() => setSearchType("exact")}
                  />
                  <span className="ml-1 text-sm">Exacto</span>
                </label>
              </div>
            </div>
          </div>

          {noItems ? (
            <WarningAlert
              message={
                isSearching
                  ? "No se encontraron resultados para la búsqueda"
                  : "No existen empresas"
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
          <a
            onClick={() =>
              router.push(`/recepcion/recepcion?empresa=${element.id}&OC=true`)
            }
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">
              Recepción con OC
            </span>
            <FaClipboardCheck className="text-primary ml-2" />
          </a>
          <a
            onClick={() =>
              router.push(`/recepcion/soc?empresa=${element.id}&OC=true`)
            }
            className="flex items-center cursor-pointer hover:font-bold"
          >
            <span className="text-sm underline text-primary">
              Recepción sin OC
            </span>
            <FaClipboardCheck className="text-primary ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
