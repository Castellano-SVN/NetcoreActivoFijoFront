import WarningAlert from "@/components/alerts/warningAlert";
import { IEmpresa } from "@/interfaces/creation";
import { api_getEmpresas } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMenuActions } from "@/context/menuActions.context";
import { FaEye, FaSearch } from "react-icons/fa";
import { useInfiniteQuery } from "react-query";
import Element from "@/components/inventario-informe/Element";
import { toast } from "react-toastify";
import { FaCircleXmark } from "react-icons/fa6";

type Props = {
  label: string;
  activeMenuName?: string;
  accions?: number[];
};

export default function EmpresasPage({ label, activeMenuName, accions }: Props) {
  const actionsFromContext = useMenuActions();
  const { setActive, currentMenu } = useContextStore();
  useEffect(() => {
    if (activeMenuName) setActive(activeMenuName);
  }, [activeMenuName, setActive]);

  const menuActions =
    accions ||
    actionsFromContext ||
    currentMenu?.acciones ||
    currentMenu?.accions ||
    currentMenu?.accionesPermitidas ||
    (currentMenu as any)?.listAccions ||
    [];

  useEffect(() => {
    console.log("ListaEmpresasPage accions", menuActions);
  }, [menuActions]);

  const sectionTitle =
    currentMenu?.titulo ||
    currentMenu?.nombre ||
    label;

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

  //modificamos el infinity query
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
          return undefined;
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
    <div className="flex items-center justify-center">
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center my-4 border-bottom pb-2">
          <h3 className="titulo-seccion">{sectionTitle}</h3>
        </div>
        {/* componente de busqueda */}
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
        {/*fin componente de busqueda */}
        {/* modificamos el warning */}
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
                  <Element
                    element={empresa}
                    key={index}
                    label={label}
                    accions={accions}
                  />
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
  );
}
