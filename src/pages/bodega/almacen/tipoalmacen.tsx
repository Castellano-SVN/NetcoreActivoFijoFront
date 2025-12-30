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
  const itemsPerPage = 20; // Número de elementos por página

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
      {/* Buscador de almacenes */}
      <div className="w-full my-4">
        <div className="border rounded-lg shadow-sm bg-white p-4">
          <label className="block mb-2 text-sm font-semibold">
            Buscador de almacenes:
          </label>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="input input-bordered w-full rounded-full"
            />

            <button
              type="button"
              className="
          btn rounded-full px-10 shrink-0
          bg-[#6500E4] border-[#6500E4] text-white
          hover:opacity-90
          focus:outline-none focus:ring-2 focus:ring-[#6500E4]/40"
              onClick={handleSearch}
            >
              Buscar
            </button>

            {isSearching && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn btn-ghost rounded-full shrink-0"
                aria-label="Limpiar"
              >
                <FaCircleXmark className="text-error text-lg" />
              </button>
            )}
          </div>

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

      <div className="overflow-x-auto">
        {!loading ? (
          <>
            <Table className="w-full border-collapse shadow-md">
              <thead>
                <tr>
                  <th className="!bg-[#169eee] !text-white font-bold text-sm md:text-base py-3">Nombre</th>
                  <th className="!bg-[#169eee] !text-white font-bold text-sm md:text-base py-3">Código</th>
                  <th className="!bg-[#169eee] !text-white font-bold text-sm md:text-base py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <Table.Body>
                {data.map((item, index) => (
                  <Table.Row key={index} className="hover:bg-gray-50">
                    <span className="text-gray-700">{item.nombre}</span>
                    <span className="text-gray-700">{item.codigo}</span>
                    <span className="text-center">
                      <button
                        onClick={() => editElement(item)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#169eee]
                   hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(22,158,238,0.25)]
                   focus:outline-none focus:ring-2 focus:ring-[#169eee]/40 transition"
                        aria-label="Editar"
                        type="button"
                      >
                        <CiEdit className="h-6 w-6" />
                      </button>
                    </span>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <tfoot>
              <tr>
                <td className="py-3" colSpan={3}>
                  <button
                    type="button"
                    onClick={createElement}
                    className="
    inline-flex items-center gap-2
    px-5 py-2 rounded-full text-sm font-medium
    bg-[#6500E4] text-white
    transition-all duration-200
    hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(101,0,228,0.35)]
    focus:outline-none focus:ring-2 focus:ring-[#6500E4]/40"
                  >
                    Nuevo
                  </button>
                </td>
              </tr>
            </tfoot>
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
        {/* Backdrop suave (no negro) */}
        <style jsx global>{`
    .modal::backdrop {
      background: rgba(15, 23, 42, 0.25) !important; /* gris azulado suave */
      backdrop-filter: blur(2px);
    }
  `}</style>

        {/* Header azul */}
        <div className="bg-[#169eee] text-white px-6 py-4 rounded-t-2xl">
          <h3 className="font-bold">
            {selectedElement.action === "create"
              ? "Crear nuevo tipo de almacén:"
              : "Cambiar el Tipo de Almacén"}
          </h3>
        </div>
        <Divider className="m-0" />
        <Modal.Body className="bg-white">
          <form onSubmit={handleSubmit((d) => newElement(d))} className="space-y-4">
            <div className="flex flex-col">
              <label className="label">
                <span className={`label-text ${errors.Codigo ? "text-error" : "text-black"}`}>
                  Código
                </span>
              </label>

              <Input
                {...register("Codigo")}
                color={errors.Codigo ? "error" : "neutral"}
                className="
            input input-bordered w-full
            border-gray-300
            focus:border-gray-300 focus:outline-none
            focus:ring-0
          "
              />

              {errors.Codigo && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.Codigo.message}</span>
                </label>
              )}
            </div>

            <div className="flex flex-col">
              <label className="label">
                <span className={`label-text ${errors.Nombre ? "text-error" : "text-black"}`}>
                  Nombre
                </span>
              </label>

              <Input
                {...register("Nombre")}
                color={errors.Nombre ? "error" : "neutral"}
                className="
            input input-bordered w-full
            border-gray-300
            focus:border-gray-300 focus:outline-none
            focus:ring-0
          "
              />

              {errors.Nombre && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.Nombre.message}</span>
                </label>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={modalButton}
                className="
            btn rounded-full px-10
            bg-[#6500E4] border-[#6500E4] text-white
            hover:opacity-90
          "
              >
                {modalButton && <span className="loading loading-spinner text-white" />}
                <span className="ml-2">Guardar</span>
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </>
  );
}
