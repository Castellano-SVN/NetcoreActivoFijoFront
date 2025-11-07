import { useContextStore } from "@/store/context.store";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-daisyui";
import MovimientoArticulos from "./movimientoArticulos";
import TarjetaExistencia from "./tarjetaExistencia";
import InventarioFisico from "./inventarioFisico";
import QuiebreStock from "./quiebreStock";
import WarningAlert from "@/components/alerts/warningAlert";
import { useUserStore } from "@/store/user.store";
import { api_getinformeQuiebreStock } from "@/services/informes.service";
import { IBodegaQuiebre } from "@/interfaces/creation";
import { useInfiniteQuery } from "react-query";
import { useTiposStore } from "@/store/tipos.store";
import { api_getEstadoArticulos } from "@/services/inventario.service";

export default function index() {
  const [tab, setTab] = useState<number>(0);

  const { setActive } = useContextStore();

  useEffect(() => {
    setActive("Informes");
  }, []);

  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (page: string) => {
    setCurrentPage(page);
  };
  const { jwt } = useUserStore();
  const { empresa } = router.query;

  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });

  const [dataQuiebreStockPDF, setDataQuiebreStockPDF] = useState<
    IBodegaQuiebre[]
  >([]);
  const fetchQuiebreStockPDF = async ({ pageParam = 1, perPage = 0 }) => {
    const responsePdf = await api_getinformeQuiebreStock(
      jwt,
      empresa as string,
      pageParam,
      perPage,
    );
    setDataQuiebreStockPDF(responsePdf.data.dataList);
  };
  useEffect(() => {
    //fetchQuiebreStockPDF({ pageParam: 1, perPage: 0 });
  }, [empresa]);

  const fetchQuiebreStock = async ({ pageParam = 1, perPage = 5 }) => {
    const response = await api_getinformeQuiebreStock(
      jwt,
      empresa as string,
      pageParam,
      perPage,
    );
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
  } = useInfiniteQuery(`quiebreStock-${empresa}`, fetchQuiebreStock, {
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
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();

  const getEstadosArticulos = async () => {
    if (EstadoArticulo.length !== 0) return;

    try {
      const _data = await api_getEstadoArticulos(jwt);
      setEstadoArticulo(_data.data.dataList);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!jwt) return;
    getEstadosArticulos();
  }, []);
  return (
    <>
      <div className="w-11/12 md:w-8/12  m-auto p- flex flex-col">
        <div className=" shadow  flex flex-row justify-around rounded p-1">
          <a
            onClick={() => {
              setTab(0);
            }}
            className={`${
              tab == 0 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Movimiento de artículos
          </a>
          <a
            onClick={() => {
              setTab(1);
            }}
            className={`${
              tab == 1 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Tarjeta de Existencia
          </a>
          <a
            onClick={() => {
              setTab(2);
            }}
            className={`${
              tab == 2 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Quiebre de stock
          </a>
          {/* <a
            onClick={() => {
              setTab(2);
            }}
            className={`${
              tab == 2 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Inventario Fisico
          </a> */}
        </div>
      </div>
      <div className="m-auto flex flex-col">
        {tab == 0 && <MovimientoArticulos />}
        {tab == 1 && <TarjetaExistencia />}
        {/* {tab == 2 &&(
            <InventarioFisico/>
        )}  */}
        {tab == 2 && (
          <QuiebreStock
            dataQuiebre={allItems}
            dataQuiebrePdf={dataQuiebreStockPDF}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </>
  );
}
