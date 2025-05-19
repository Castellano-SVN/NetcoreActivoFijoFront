import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Loading,
  Modal,
  Pagination,
  Table,
} from "react-daisyui";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { animated, useSpring } from "@react-spring/web";
import {
  ItipoAlmacen,
  ItipoAlmacenSchema,
  TipoAlmacenSchema,
} from "../../../schemas/tipo_almacen.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  api_getTipoAlmacen,
  api_postTipoAlmacen,
  api_putTipoAlmacen,
} from "../../../services/tipos.service";
import { useUserStore } from "../../../store/user.store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function TipoAlmacen() {
  const [loading, setLoading] = useState<boolean>(false);
  const { jwt } = useUserStore();

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 5; // Número de elementos por página

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<
    "startsWith" | "contains" | "endsWith" | "exact"
  >("contains");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [data, setData] = useState<ItipoAlmacen[]>([]);
  const [selectedElement, setSelectedElement] = useState<{
    id: string;
    action: "create" | "update";
  }>({ action: "create", id: "" });
  const [modalButton, setModalButton] = useState<boolean>(false);
  const getElement = async (
    page = 1,
    searchParams?: {
      searchTerm?: string;
      searchType?: "startsWith" | "contains" | "endsWith" | "exact";
    }
  ) => {
    try {
      setLoading(true);
      const response = await api_getTipoAlmacen(jwt, page, searchParams);
      setData(response.data.dataList);
      setTotalItems(response.data.total);
      setTotalPages(response.data.pages);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar los datos");
      setLoading(false);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setIsSearching(true);
      setCurrentPage(1); // Resetear a la primera página al buscar
      getElement(1, { searchTerm, searchType });
    } else {
      toast.info("Ingrese un término de búsqueda");
    }
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setCurrentPage(1);
    getElement(1);
  };

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    if (isSearching) {
      getElement(page, { searchTerm, searchType });
    } else {
      getElement(page);
    }
  };

  const newElement = async (data: ItipoAlmacenSchema | ItipoAlmacen) => {
    if (modalButton) return;
    try {
      console.log(selectedElement.action);
      setModalButton(true);
      if (selectedElement.action === "update") {
        await api_putTipoAlmacen(jwt, getValues());
        toast.success("¡El nuevo tipo de almacén se actualizo correctamente!");
      }
      if (selectedElement.action === "create") {
        await api_postTipoAlmacen(jwt, data);
        toast.success("¡El nuevo tipo de almacén se creo correctamente!");
      }
      reset();
      getElement(
        currentPage,
        isSearching ? { searchTerm, searchType } : undefined
      );
      setModalButton(false);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);
  const handleClose = useCallback(() => {
    ref.current?.close();
  }, [ref]);

  useEffect(() => {
    getElement();
  }, []);

  const {
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ItipoAlmacenSchema>({
    resolver: zodResolver(TipoAlmacenSchema),
    mode: "onSubmit",
  });

  const editElement = (data: ItipoAlmacen) => {
    reset();
    const updatedElement = { ...selectedElement };
    updatedElement.action = "update";
    updatedElement.id = data.id;
    setSelectedElement(updatedElement);
    setValue("id", data.id);
    setValue("Codigo", data.codigo);
    setValue("Nombre", data.nombre);
    handleShow();
  };
  const createElement = () => {
    reset();
    const newElement = { ...selectedElement };
    newElement.action = "create";
    newElement.id = "";
    setSelectedElement(newElement);
    handleShow();
  };
  return (
    <>
      <Head>
        <title>Tipo de almacén</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Componente de búsqueda */}
      <div className="flex flex-col md:flex-row items-center gap-2 mx-2 my-4 p-4 border rounded-lg shadow-sm bg-white">
        <div className="w-full md:w-1/2">
          <div className="flex flex-row items-center">
            <input
              type="text"
              placeholder="Buscar tipos de almacén..."
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

      <div className="overflow-x-auto">
        {!loading ? (
          <>
           
            <Table className="w-full border-collapse shadow-md">
              <Table.Head className="bg-primary text-base-100">
                <span className="font-bold">Nombre</span>
                <span className="font-bold">Código</span>
                <span className="font-bold">Acciones</span>
              </Table.Head>
              <Table.Body>
                {data.map((item, index) => (
                  <Table.Row key={index} className="hover:bg-gray-50">
                    <span className="text-gray-700">{item.nombre}</span>
                    <span className="text-gray-700">{item.codigo}</span>
                    <span>
                      <button
                        onClick={() => editElement(item)}
                        className="p-2 rounded-full text-primary"
                      >
                        <CiEdit className="h-6 w-6" />
                      </button>
                    </span>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <span>
                  <Button
                    onClick={createElement}
                    shape="circle"
                    size="sm"
                    className="bg-white shadow-none hover:none"
                  >
                    <CiCirclePlus className="h-6 w-6 text-primary" />
                  </Button>
                </span>
                <span></span>
                <span></span>
              </Table.Footer>
            </Table>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <Button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="join-item"
                  >
                    «
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item"
                  >
                    ‹
                  </Button>

                  {/* Mostrar páginas */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Lógica para mostrar 5 páginas centradas en la página actual
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageToShow}
                        onClick={() => handlePageChange(pageToShow)}
                        active={currentPage === pageToShow}
                        className="join-item"
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item"
                  >
                    ›
                  </Button>
                  <Button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="join-item"
                  >
                    »
                  </Button>
                </Pagination>
              </div>
            )}
            {/* Información de paginación */}
            <div className="text-center mt-2 text-sm text-gray-600">
              Mostrando{" "}
              {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}{" "}
              registros
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center m-4">
            <Loading size="lg" color="primary" />
          </div>
        )}
      </div>

      {/* modal para crear o editar */}
      <Modal backdrop responsive ref={ref}>
        <Modal.Header className="font-bold">
          {selectedElement.action === "create"
            ? "Creación de nuevo Tipo de Almacén"
            : "Cambiar el Tipo de Almacén"}
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <form
            onSubmit={handleSubmit((d) => newElement(d))}
            className="space-y-4"
          >
            <div className="flex flex-col">
              <label className="label">
                <span
                  className={`label-text ${
                    errors.Codigo ? "text-error" : "text-blackl"
                  }`}
                >
                  Código
                </span>
              </label>
              <Input
                {...register("Codigo")}
                color={errors.Codigo ? "error" : "neutral"}
                className="input-primary"
              />
              {errors.Codigo && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.Codigo.message}
                  </span>
                </label>
              )}
            </div>
            <div className="flex flex-col">
              <label className="label">
                <span
                  className={`label-text ${
                    errors.Nombre ? "text-error" : "text-black"
                  }`}
                >
                  Nombre
                </span>
              </label>
              <Input
                {...register("Nombre")}
                color={errors.Nombre ? "error" : "neutral"}
                className="input-primary"
              />
              {errors.Nombre && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.Nombre.message}
                  </span>
                </label>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                color={errors.Codigo || errors.Nombre ? "error" : "primary"}
                className="btn-primary"
              >
                {modalButton && (
                  <span className="loading loading-spinner text-white" />
                )}
                <span className="ml-2">Guardar</span>
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
