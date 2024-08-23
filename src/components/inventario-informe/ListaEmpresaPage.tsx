import WarningAlert from "@/components/alerts/warningAlert";
import { IEmpresa } from "@/interfaces/creation";
import { api_getEmpresas } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useInfiniteQuery } from "react-query";
import Element from "@/components/inventario-informe/Element";

export default function EmpresasPage({ label }: { label: string }) {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

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
        return undefined;
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
                  <Element element={empresa} key={index} label={label} />
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col">
          {hasNextPage ? (
            <>
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
