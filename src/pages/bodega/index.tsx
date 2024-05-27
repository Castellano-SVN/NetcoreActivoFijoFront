import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUserStore } from "../../store/user.store";
import { useQuery } from "react-query";
import { api_getBodegas, api_getPersonas } from "../../services/bodega.service";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { Divider } from "react-daisyui";
import { toast } from "react-toastify";
import { IBodega } from "@/interfaces/creation";


interface Bodega {
  empresaId: string;
  centroCostoId: string;
  id: string;
  nombre: string;
  sigla: string;
  descripcion: string;

}

export default function Index() {
  const { jwt } = useUserStore();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState<number>(1);
  const { isLoading, error, data, refetch } = useQuery(
    "bodegas",
    () => api_getBodegas(jwt, page),
    {
      enabled: true,
      onSuccess: (data) => {
        setMeta({
          total: data.data.total,
          pages: data.data.pages,
        });
      },
    }
  );
  useEffect(() => {
    refetch()
  }, [page])

  return (
    <>
      <MenuBodega total={meta.total} isLoading={isLoading} />
      <Divider />
      <div className="flex flex-wrap justify-around">
        {data?.data.dataList.map((option: Bodega, index: number) => (
          <div key={index} className="w-full lg:w-1/3 p-4 md:w-1/3">
            <BodegaShow bodega={option} />
          </div>
        ))}
      </div>
      <BodegaPagination page={page} totalPages={meta.pages} setPage={setPage}></BodegaPagination>
    </>
  );
}

function MenuBodega({
  total,
  isLoading,
}: {
  total: number;
  isLoading: boolean;
}) {
  const { push } = useRouter();

  return (
    <>
      <div className="container px-5 md:px-10 lg:px-10 py-2 flex flex-col lg:flex-row md:flex-row justify-around ">
        <div className={isLoading ? "stats shadow skeleton" : "stats shadow"}>
          <div className="stat">
            <div className="stat-title">
              {isLoading ? (
                <span style={{ color: "transparent" }}>{total}</span>
              ) : (
                "Total Bodegas"
              )}
            </div>
            <div className="stat-value ">
              {isLoading ? (
                <span style={{ color: "transparent" }}>{total}</span>
              ) : (
                total
              )}
            </div>
          </div>
        </div>

        <div className="my-8 flex justify-center">
          <div className="pt-2 relative mx-auto text-gray-600 hidden lg:flex md:flex">
            <input
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Filtrar por empresa"
            />
            <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
              <svg
                className="text-gray-600 h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path
                  d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
                />
              </svg>
            </button>
          </div>
        </div>


        <button
          onClick={() => {
            toast.info('Agregando nueva bodega')
            push("/bodega/crear")
          }}
          className="self-center btn btn-neutral sm:btn-xs md:btn-sm lg:btn-md md:my-0 my-2 btn-outline rounded-lg"
        >
          Agregar <FaPlus />
        </button>

        <div className="my-8 flex justify-center lg:hidden md:hidden sm:flex">
          <div className="pt-2 relative mx-auto text-gray-600">
            <input
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Search"
            />
            <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
              <svg
                className="text-gray-600 h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path
                  d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function BodegaShow({ bodega }: { bodega: Bodega  }) {
  const { push } = useRouter();
  const { jwt } = useUserStore();


  return (
    <div className="rounded-lg border border-gray-400 shadow-md hover:shadow-xl transition duration-300 ease-in-out">
      <div className="bg-gray-300 px-6 py-4 rounded-t-lg">
        <h3 className="text-large font-bold text-gray-700">
          {bodega.nombre?.toUpperCase()}
        </h3>
      </div>
      <div className="p-6">
        <p className="text-gray-800">
          <span className="font-semibold">Sigla:</span> {bodega.sigla || "Sin información."}
        </p>
      </div>

      <Divider className="m-0" />
      <div className="flex flex-row justify-around m-2">
        <div className="tooltip" data-tip="Editar bodega">
          <button onClick={() => {  }}>
            <FaPencilAlt className="h-6 w-6 text-error mt-2" />
          </button>
        </div>
      </div>

    </div>
  );
}

function BodegaPagination({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Página anterior
        </button>
        <div className="text-lg">
          Página {page} de {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Próxima página
        </button>
      </div>
    </div>
  );
}
