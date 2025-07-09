import { useInfiniteQuery } from "react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { FaEye, FaPlus, FaSearch } from "react-icons/fa";
import { Button, Modal } from "react-daisyui";
import { toast } from "react-toastify";
import { FaCircleXmark, FaPenToSquare } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import {
  api_deleteArticulo,
  api_getArticulos,
} from "@/services/bodega.service";
import ErrorAlert from "@/components/alerts/errorAlert";
import WarningAlert from "@/components/alerts/warningAlert";
import { IArticulo } from "@/interfaces/creation";

interface props {
  guid: string;
  familyGuid: string;
  subFamilyGuid: string;
  create: () => void;
}

export default function Page(props: props) {
  const router = useRouter();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const { jwt } = useUserStore();

  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "startsWith" | "contains" | "endsWith" | "exact"
  >("contains");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchItems = async ({ pageParam = 1 }) => {
    if (isSearching && searchTerm.trim()) {
      const response = await api_getArticulos(
        jwt,
        props.subFamilyGuid,
        pageParam,
        { searchTerm, searchType }
      );
      return response.data;
    } else {
      const response = await api_getArticulos(
        jwt,
        props.subFamilyGuid,
        pageParam
      );
      return response.data;
    }
  };

  // Manejo de búsqueda
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
    [`articulo-${props.subFamilyGuid}`, searchTerm, searchType, isSearching],
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

  if (status === "error")
    return (
      <ErrorAlert
        message="Ocurrió un error al buscar los artículos de la Sub-Familia"
        action={() => router.back()}
      />
    );

  const allItems = data?.pages?.flatMap((page) => page.dataList) || [];
  const noItems = allItems.length === 0;
  if (isLoading && noItems) return "Cargando...";

  return (
    <>
      <div className="flex flex-row justify-start mt-4 ml-4">
        <span className="font-bold text-2xl">Artículos</span>
      </div>

      {/* Filtro de búsqueda */}
      <div className="flex flex-col md:flex-row items-center gap-2 mx-2 my-4 p-4 border rounded-lg shadow-sm bg-white">
        <div className="w-full md:w-1/2">
          <div className="flex flex-row items-center">
            <input
              type="text"
              placeholder="Buscar artículos..."
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
            {["startsWith", "contains", "endsWith", "exact"].map((type) => (
              <label
                key={type}
                className="flex items-center cursor-pointer ml-2"
              >
                <input
                  type="radio"
                  name="searchType"
                  className="radio radio-sm radio-primary"
                  checked={searchType === type}
                  onChange={() => setSearchType(type as any)}
                />
                <span className="ml-1 text-sm">
                  {type === "startsWith"
                    ? "Comienza con"
                    : type === "contains"
                    ? "Contiene"
                    : type === "endsWith"
                    ? "Termina con"
                    : "Exacto"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {noItems ? (
        <>
          <WarningAlert
            message={
              isSearching
                ? "No se encontraron resultados para la búsqueda"
                : "No existen artículos vinculados a esta subfamilia"
            }
          />
          <button
            className="px-12 btn btn-primary mt-2"
            onClick={() => props.create()}
          >
            Crear Artículo <FaPlus />
          </button>
        </>
      ) : (
        <div className="flex flex-wrap mx-2">
          {data?.pages?.map((page, pageIndex) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-2"
              key={pageIndex}
            >
              {page.dataList.map((articulo: IArticulo, index: number) => (
                <Element
                  element={articulo}
                  key={index}
                  refetch={refetch}
                  create={props.create}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Paginación y acciones */}
      <div className="flex flex-col mt-4 items-center">
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
            <div className="mt-4">
              <button
                className="px-12 btn btn-primary"
                onClick={() => props.create()}
              >
                Crear Artículo <FaPlus />
              </button>
            </div>
          </>
        ) : (
          !noItems && (
            <div className="mt-2">
              <button
                className="px-16 btn btn-primary mb-2"
                onClick={() => props.create()}
              >
                Crear Artículo <FaPlus />
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
}

function Element({
  element,
  refetch,
  create,
}: {
  element: IArticulo;
  refetch: () => void;
  create: () => void;
}) {
  const router = useRouter();
  const { jwt } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickDelete = () => setIsModalOpen(true);
  const handleClickClose = () => setIsModalOpen(false);
  const handleClickYes = async () => {
    try {
      const dataDelete = await api_deleteArticulo(jwt, element.id);
      if (dataDelete.status === 200) {
        toast.success("Artículo eliminado con éxito");
        setIsModalOpen(false);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

  const editArticulo = () => {
    sessionStorage.setItem("editArticulo", JSON.stringify({ articulo: element }));
    create();
  };

  return (
    <>
      <div className="hover:shadow-md border rounded-md shadow">
        <div
          className="flex flex-row justify-between p-2 tooltip tooltip-primary"
          data-tip={element.descripcion}
        >
          <div className="basis-1/3 flex flex-col">
            <span className="font-bold mb-2">Nombre</span>
            <span className="text-sm">{element.nombre}</span>
          </div>
          <div className="basis-1/3 flex flex-col text-right">
            <span className="font-bold mb-2">Precio</span>
            <span className="text-sm">${element.valor}</span>
          </div>
          <div className="basis-1/3 flex flex-col text-right">
            <span className="font-bold mb-2">Código</span>
            <span className="text-sm">{element.codigo}</span>
          </div>
        </div>
        <div className="flex flex-row p-3 bg-[#FAF6FF] justify-around">
          <span className="font-bold text-sm">Acciones</span>
          <div className="flex space-x-4">
            <a
              onClick={editArticulo}
              className="flex items-center cursor-pointer hover:font-bold"
            >
              <span className="underline text-primary text-sm">Editar</span>
              <FaPenToSquare className="ml-2 text-primary" />
            </a>
            <a
              onClick={handleClickDelete}
              className="flex items-center cursor-pointer hover:font-bold"
            >
              <span className="underline text-error text-sm">Borrar</span>
              <FaCircleXmark className="ml-2 text-error" />
            </a>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">
              ¿Estás seguro que deseas eliminar el Artículo?
            </h3>
            <div className="modal-action flex justify-center">
              <button
                className="btn btn-outline btn-primary mr-2 w-20"
                onClick={handleClickClose}
              >
                No
              </button>
              <button
                className="btn btn-outline btn-accent w-20"
                onClick={handleClickYes}
              >
                Sí
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
