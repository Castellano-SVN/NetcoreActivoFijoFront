import { useRouter } from "next/router";
import { useInfiniteQuery, useQuery } from "react-query";
import { useUserStore } from "../../../store/user.store";
import { AxiosError } from "axios";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import IcentroCosto, { IcentroCosto_Bodega } from "../../../interfaces/modules/ICentroCosto.interface";
import { FiPlus } from "react-icons/fi";
import { Button, Collapse, Divider, Input, Modal, Select, Table } from "react-daisyui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlmacenFormValues } from "../../../interfaces/creation";
import { useForm } from "react-hook-form";
import { ItipoAlmacen } from "@/schemas/tipo_almacen.schema";
import { toast } from "react-toastify";
import { api_getAlmacen, api_getOneCentroCosto, api_postAlmacen } from "@/services/bodega.service";
import { api_getTipoAlmacen } from "@/services/tipos.service";
import { IAlmacen } from "../../../interfaces/modules/IAlmacen.interface";
import { FaArchive, FaBox, FaEye, FaPencilAlt, FaSearch, FaArrowLeft } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { SlEye } from "react-icons/sl";
import { FaCircleXmark } from "react-icons/fa6";
import WarningAlert from "@/components/alerts/warningAlert";

export default function Page() {
  const router = useRouter();
  const idString = router.query.id as string;

  // Input (lo que escribes)
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Lo que realmente se ejecuta al apretar Buscar
  const [submittedTerm, setSubmittedTerm] = useState<string>("");

  const [searchType, setSearchType] = useState<"startsWith" | "contains" | "endsWith" | "exact">("contains");

  const isSearching = submittedTerm.trim() !== "";
  const [filteredBodegas, setFilteredBodegas] = useState<IcentroCosto_Bodega[]>([]);

  const { jwt } = useUserStore();
  const [tipoAlmacen, setTipoAlmacen] = useState<ItipoAlmacen[]>([]);
  const [dataCentroCosto, setDataCentroCosto] = useState<IcentroCosto>();

  const { isLoading } = useQuery("CCbyID", () => api_getOneCentroCosto(jwt, idString), {
    enabled: idString !== undefined,
    onSuccess: (data) => {
      if (data.data.dataList.length !== 1) return router.back();
      const centroCosto = data.data.dataList[0];
      setDataCentroCosto(centroCosto);
      // Backup: ensure list renders even before any search runs.
      setFilteredBodegas(centroCosto.bodegas ?? []);
    },
    onError: (err: AxiosError) => {
      if ((err.response?.data as any)?.message === "ID no encontrado") return router.back();
    },
  });

  // Filtro SOLO cuando cambias submittedTerm / searchType / dataCentroCosto
  useEffect(() => {
    if (!dataCentroCosto) return;

    let filtered = dataCentroCosto.bodegas ?? [];

    if (submittedTerm.trim()) {
      const term = submittedTerm.toLowerCase();
      filtered = dataCentroCosto.bodegas.filter((bodega) => {
        const nombre = bodega.nombre?.toLowerCase() || "";
        const sigla = bodega.sigla?.toLowerCase() || "";

        switch (searchType) {
          case "startsWith":
            return nombre.startsWith(term) || sigla.startsWith(term);
          case "contains":
            return nombre.includes(term) || sigla.includes(term);
          case "endsWith":
            return nombre.endsWith(term) || sigla.endsWith(term);
          case "exact":
            return nombre === term || sigla === term;
          default:
            return true;
        }
      });
    }

    setFilteredBodegas(filtered);
  }, [submittedTerm, searchType, dataCentroCosto]);

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (term === "") {
      toast.info("Ingrese un término de búsqueda");
      return;
    }
    setSubmittedTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSubmittedTerm("");
  };

  const createBodega = () => {
    const bodegaData = {
      empresaId: dataCentroCosto?.empresaId,
      empresaName: dataCentroCosto?.empresa.razonSocial,
      centroCostoId: dataCentroCosto?.id,
      centroCostoName: dataCentroCosto?.nombre,
    };
    sessionStorage.setItem("BodegaNew", JSON.stringify(bodegaData));
    router.push("/bodega/crear");
  };

  const editBodega = (almacen: IcentroCosto_Bodega) => {
    const bodegaData = {
      empresaId: dataCentroCosto?.empresaId,
      empresaName: dataCentroCosto?.empresa.razonSocial,
      centroCostoId: dataCentroCosto?.id,
      centroCostoName: dataCentroCosto?.nombre,
      nombre: almacen.nombre,
      sigla: almacen.sigla,
      id: almacen.id,
      descripcion: almacen.descripcion,
    };
    sessionStorage.setItem("BodegaNew", JSON.stringify(bodegaData));
    router.push("/bodega/crear");
  };

  const getTipoAlmacen = async () => {
    try {
      const data = await api_getTipoAlmacen(jwt);
      setTipoAlmacen(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!jwt) return;
    getTipoAlmacen();
  }, [jwt]);

  return (
    <div className="flex justify-center px-4">
      <Head>
        <title>Centro de costo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isLoading && (
        <div className="w-full max-w-5xl rounded-2xl border shadow-md hover:shadow-xl transition duration-300 ease-in-out bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#169eee] text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Volver"
                title="Volver"
              >
                <FaArrowLeft className="w-4 h-4 text-white" />
              </button>

              <h3 className="text-md md:text-lg font-bold text-left truncate">
                {dataCentroCosto?.nombre?.toUpperCase()}
              </h3>
            </div>

            <h3 className="text-sm md:text-lg font-extrabold">
              {dataCentroCosto?.sigla ? dataCentroCosto?.sigla.toUpperCase() : "Siglas no informadas"}
            </h3>
          </div>

          {/* Botones + total */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={createBodega}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-[#169eee] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(22,158,238,0.35)] focus:outline-none focus:ring-2 focus:ring-[#169eee]/40"
              >
                <FiPlus className="w-4 h-4" />
                Crear bodega
              </button>

              <button
                type="button"
                onClick={() => router.push("/bodega/almacen/tipoalmacen")}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-[#169eee] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(22,158,238,0.35)] focus:outline-none focus:ring-2 focus:ring-[#169eee]/40"
              >
                <FaArchive className="w-4 h-4" />
                Tipo de almacenes
              </button>
            </div>

            <div className={isLoading ? "rounded-xl border bg-white shadow-sm px-5 py-3 text-center skeleton" : "rounded-xl border bg-white shadow-sm px-5 py-3 text-center"}>
              <div className="text-xs text-gray-500">Total bodegas</div>
              <div className="text-2xl font-extrabold text-gray-900">
                {isLoading ? <span style={{ color: "transparent" }}>0</span> : dataCentroCosto?.bodegas.length}
              </div>
            </div>
          </div>

          {/* Buscador bodegas */}
          <div className="w-full my-4 px-4">
            <div className="border rounded-lg shadow-sm bg-white p-4">
              <label className="block mb-2 text-sm font-semibold">Buscar bodegas:</label>

              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder=""
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="input input-bordered w-full rounded-full border-gray-300 focus:border-gray-300 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex items-center justify-center rounded-full px-10 py-2 shrink-0 text-sm font-semibold bg-[#6500E4] text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6500E4]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar
                </button>


                {isSearching && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="btn btn-ghost rounded-full"
                    aria-label="Limpiar"
                    title="Limpiar"
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

          {/* Lista bodegas */}
          <div className="px-4 pb-6">
            {filteredBodegas.length === 0 ? (
              <>
                <WarningAlert
                  message={
                    isSearching
                      ? "No se encontraron resultados para la búsqueda"
                      : "No existen Bodegas vinculadas a este centro de costo"
                  }
                />
                <button className="px-12 btn bg-[#169eee] border-[#169eee] text-white hover:opacity-90 rounded-full" onClick={createBodega}>
                  Crear Bodega <FiPlus />
                </button>
              </>
            ) : (
              filteredBodegas.map((option: IcentroCosto_Bodega, index: number) => (
                <div key={index}>
                  <BodegaList bodega={option} index={index} tipoalmacen={tipoAlmacen} edit={editBodega} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BodegaList({
  index,
  bodega,
  tipoalmacen,
  edit,
}: {
  index: number;
  bodega: IcentroCosto_Bodega;
  tipoalmacen: ItipoAlmacen[];
  edit: (almacen: IcentroCosto_Bodega) => void;
}) {
  // Input (lo que escribes)
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Ejecutado (lo que se busca al apretar Buscar)
  const [submittedTerm, setSubmittedTerm] = useState<string>("");

  const [searchType, setSearchType] = useState<"startsWith" | "contains" | "endsWith" | "exact">("contains");
  const isSearching = submittedTerm.trim() !== "";

  const router = useRouter();
  const { jwt } = useUserStore();

  const validationSchema = z.object({
    EmpresaId: z.string().default(bodega.empresaId),
    CentroCostoId: z.string().default(bodega.centroCostoId),
    BodegaId: z.string().default(bodega.id),
    Id: z.string().optional(),
    TipoAlmacenId: z.string(),
    Nombre: z.string().min(4, { message: "Campo incorrecto" }),
  });

  const methods = useForm<AlmacenFormValues>({
    resolver: zodResolver(validationSchema),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = methods;

  const creationRef = useRef<HTMLDialogElement>(null);
  const handleShowCreation = useCallback(() => creationRef.current?.showModal(), []);
  const handleCloseCreation = useCallback(() => creationRef.current?.close(), []);

  // fetch usa queryKey para tomar term / tipo actuales
  const fetchAlmacen = async ({ pageParam = 1, queryKey }: any) => {
    const [, bodegaId, term, sType] = queryKey as [
      string,
      string,
      string,
      "startsWith" | "contains" | "endsWith" | "exact"
    ];

    if (term && term.trim() !== "") {
      const response = await api_getAlmacen(jwt, pageParam, bodegaId, {
        searchTerm: term,
        searchType: sType,
      });
      return response.data;
    }

    const response = await api_getAlmacen(jwt, pageParam, bodegaId);
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery(
    ["almacen", bodega.id, submittedTerm, searchType],
    fetchAlmacen,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.pages > pages.length) return pages.length + 1;
        return undefined;
      },
      keepPreviousData: false,
    }
  );

  const allItems = data?.pages?.flatMap((page) => page.dataList) || [];

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (term === "") {
      toast.info("Ingrese un término de búsqueda");
      return;
    }
    setSubmittedTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSubmittedTerm("");
  };

  const AlmacenSubmit = async (form: AlmacenFormValues) => {
    try {
      await api_postAlmacen(jwt, form);
      if (!form.Id) toast.success("¡El nuevo almacén se creo correctamente!");
      if (form.Id) toast.success("¡Se modifico el almacén correctamente");
      refetch();
      reset();
      handleCloseCreation();
    } catch (error) {
      console.log(error);
    }
  };

  const editAlmacen = (almacen: IAlmacen) => {
    setValue("Id", almacen.id);
    setValue("TipoAlmacenId", almacen.tipoAlmacenId);
    setValue("Nombre", almacen.nombre);
    handleShowCreation();
  };
  console.log("tipoalmacen:", tipoalmacen);

  return (
    <>
      <div className="border border-gray-200 rounded-lg my-2 overflow-hidden">
        {/* Header azul */}
        <div className="flex items-center justify-between bg-[#169eee] text-white px-5 py-3">
          <h3 className="text-sm md:text-base font-bold">
            {bodega.nombre?.toUpperCase()} {bodega.sigla && `- ${bodega.sigla.toUpperCase()}`}
          </h3>
        </div>

        <div className="p-4">
          {/* Buscador almacenes */}
          <div className="border rounded-lg shadow-sm bg-white p-4 my-4">
            <label className="block mb-2 text-sm font-semibold">Buscar almacenes:</label>

            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="input input-bordered w-full rounded-full border-gray-300 focus:border-gray-300 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center justify-center rounded-full px-10 py-2 shrink-0 text-sm font-semibold bg-[#6500E4] text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6500E4]/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buscar
              </button>

              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="btn btn-ghost rounded-full"
                  aria-label="Limpiar"
                  title="Limpiar"
                >
                  <FaCircleXmark className="text-error text-lg" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-8 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`searchType-${bodega.id}`}
                  className="radio radio-primary"
                  checked={searchType === "startsWith"}
                  onChange={() => setSearchType("startsWith")}
                />
                <span>Comienza</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`searchType-${bodega.id}`}
                  className="radio radio-primary"
                  checked={searchType === "contains"}
                  onChange={() => setSearchType("contains")}
                />
                <span>Contiene</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`searchType-${bodega.id}`}
                  className="radio radio-primary"
                  checked={searchType === "endsWith"}
                  onChange={() => setSearchType("endsWith")}
                />
                <span>Termina con</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`searchType-${bodega.id}`}
                  className="radio radio-primary"
                  checked={searchType === "exact"}
                  onChange={() => setSearchType("exact")}
                />
                <span>Exacto</span>
              </label>
            </div>
          </div>

          {/* Mensaje cuando no hay resultados */}
          {allItems.length === 0 && (
            <WarningAlert
              message={
                isSearching
                  ? "No se encontraron resultados para la búsqueda"
                  : "No existen almacenes creados para esta bodega"
              }
            />
          )}

          {isLoading ? (
            <h1>Cargando</h1>
          ) : (
            <>

              {/* Botones inferiores centrados */}
              <div className="w-full flex justify-center mt-3">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      reset();
                      handleShowCreation();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 rounded-full text-sm font-semibold bg-[#169eee] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(22,158,238,0.35)] focus:outline-none focus:ring-2 focus:ring-[#169eee]/40"
                  >
                    <FiPlus className="w-4 h-4" />
                    Crear almacén
                  </button>

                  <button
                    onClick={() => edit(bodega)}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 rounded-full text-sm font-semibold text-[#6500E4] border border-[#6500E4]/40 bg-white transition-all duration-200 hover:bg-[#6500E4]/10 focus:outline-none focus:ring-2 focus:ring-[#6500E4]/25"
                  >
                    <FaPencilAlt className="w-4 h-4" />
                    Editar bodega
                  </button>

                  <button
                    onClick={() => router.push(`/empresa/centrocosto/stock/${bodega.id}`)}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 rounded-full text-sm font-semibold text-[#6500E4] border border-[#6500E4]/40 bg-white transition-all duration-200 hover:bg-[#6500E4]/10 focus:outline-none focus:ring-2 focus:ring-[#6500E4]/25"
                  >
                    <FaBox className="w-4 h-4" />
                    Ver stock
                  </button>
                </div>
              </div>

              {/* NEXT PAGE BUTTON */}
              <button
                onClick={() => fetchNextPage()}
                className="btn bg-[#169eee] border-[#169eee] text-white hover:opacity-90 rounded-full px-10 my-4"
                disabled={!hasNextPage || isFetchingNextPage}
                type="button"
              >
                {isFetchingNextPage ? "Cargando más..." : hasNextPage ? "Ver más" : "No hay más datos"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal crear/editar almacén */}
      <Modal backdrop responsive ref={creationRef}>
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <Modal.Header className="p-0 m-0">
            <div className="w-full bg-[#169eee] text-white px-5 py-3">
              <h3 className="font-bold text-sm md:text-base">Almacén</h3>
            </div>
          </Modal.Header>

          {/* Cuerpo */}
          <Modal.Body className="m-0">
            <div className="px-5 py-4">
              <form onSubmit={handleSubmit((d) => AlmacenSubmit(d))} className="space-y-4">
                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">Nombre:</span>
                  </label>
                  <Input
                    color={errors.Nombre ? "error" : "neutral"}
                    {...register("Nombre", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  />
                  {errors.Nombre && <label className="label text-error">{errors.Nombre.message as any}</label>}
                </div>

                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">Tipo almacén:</span>
                  </label>
                  <Select
                    color={errors.TipoAlmacenId ? "error" : "neutral"}
                    defaultValue={""}
                    {...register("TipoAlmacenId", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  >
                    <Select.Option value="" disabled>
                      Seleccione el tipo de almacén
                    </Select.Option>
                    {tipoalmacen &&
                      tipoalmacen.map((a, i) => (
                        <Select.Option key={i} value={a.id}>
                          {a.nombre}
                        </Select.Option>
                      ))}
                  </Select>

                  {errors.TipoAlmacenId && (
                    <label className="label text-error">{errors.TipoAlmacenId.message as any}</label>
                  )}
                </div>

                <div className="flex justify-center pt-2">
                  <Button type="submit" color="primary">
                    Guardar
                  </Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
}


