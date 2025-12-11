import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useUserStore } from "../../store/user.store";
import { QueryObserverResult, useQuery } from "react-query";
import { api_getEmpresas, api_postEmpresas_Bloquear } from "../../services/bodega.service";
import { FaBox, FaEye, FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { Divider, Table } from "react-daisyui";
import { MdFactory } from "react-icons/md";
import { CgLock, CgLockUnlock } from "react-icons/cg";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useContextStore } from "../../store/context.store";
import { FaCircleXmark } from "react-icons/fa6";


interface Persona {
  runCuerpo?: number | null;
  runDigito?: string | null;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  email?: string | null;
  sexoCodigo?: number | null;
  fechaNacimiento?: Date | null;
  nacionalidadCodigo?: number | null;
  estadoCivilCodigo?: number | null;
  nivelEducacionalCodigo?: number | null;
  regionCodigo?: number | null;
  ciudadCodigo?: number | null;
  comunaCodigo?: number | null;
  regionNacimientoCodigo?: number | null;
  ciudadNacimientoCodigo?: number | null;
  comunaNacimientoCodigo?: number | null;
  villaPoblacion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  celular?: string | null;
  observaciones?: string | null;
  ocupacion?: string | null;
  telefonoLaboral?: string | null;
  direccionLaboral?: string | null;
  huella?: string | null;
  imagenHuella?: string | null;
  areaGeograficaCodigo?: number | null;
  nroDepartamento?: string | null;
  administrador: Persona | null;
  gerenteRrhh: Persona | null;
}
interface Empresa {
  id: string;
  rutCuerpo: number | null;
  rutDigito: string | null;
  razonSocial: string;
  regionCodigo?: number | null;
  ciudadCodigo?: number | null;
  comunaCodigo?: number | null;
  tipoAdministracionCodigo: number;
  actividadEconomicaPrincipalCodigo?: number | null;
  sectorActividadEconomicaCodigo?: number | null;
  actividadEconomicaCodigo?: number | null;
  giro?: string | null;
  direccion?: string | null;
  email?: string | null;
  paginaWeb?: string | null;
  telefono1?: number | null;
  telefono2?: number | null;
  fax?: number | null;
  celular?: number | null;
  administradorId?: string | null;
  gerenteRRHHId?: string | null;
  bloqueada: boolean;
  rutaReporte?: string | null;
  pieFirmaLiquidacion?: string | null;
  url?: string | null;
  administrador: Persona | null;
  gerenteRrhh: Persona | null;
  centroCostos: CentroCosto[];
}
interface CentroCosto {
  id: string;
  empresaId: number;
  centroCostoId?: number | null;
  administradorId?: number | null;
  nombre: string;
  sigla?: string | null;
  areaGeograficaCodigo: number;
  tipoEstablecimientoSaludCodigo?: number | null;
  regionCodigo?: number | null;
  ciudadCodigo?: number | null;
  comunaCodigo?: number | null;
  email?: string | null;
  direccion?: string | null;
  telefono1?: number | null;
  telefono2?: number | null;
  fax?: number | null;
  celular?: number | null;
  codigoContabilidad?: string | null;
  libroRemuneraciones: boolean;
  rutaReporte?: string | null;
  departamentoId?: number | null;
  unidadId?: number | null;
  codigoPrevired?: string | null;
  codigoGesparvu?: number | null;
  administracionCentral: boolean;
  codigoDIPRES?: string | null;
  contabilizacion: boolean;
}

export default function Index() {
  const { jwt } = useUserStore();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const { setActive, currentMenu } = useContextStore();
  useEffect(() => {
    setActive("Prestadores");
  }, [])

  const sectionTitle =
    currentMenu?.titulo ||
    // @ts-ignore: algunos menús vienen sin título y se usa nombre
    currentMenu?.nombre ||
    "Empresas";

  // Estados para el buscador 
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<'startsWith' | 'contains' | 'endsWith' | 'exact'>('contains');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  // Modificar query para incluir parámetros de búsqueda
  const { isLoading, error, data, refetch } = useQuery(
    ["empresas", page, searchTerm, searchType, isSearching], // Key con dependencias
    () => api_getEmpresas(jwt, page, isSearching ? { searchTerm, searchType } : undefined),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setMeta({
          total: data.data.total,
          pages: data.data.pages,
        });
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [page]);

  // Manejadores de búsqueda (nuevo)
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setIsSearching(true);
      setPage(1); // Resetear a primera página
    } else {
      toast.info("Ingrese un término de búsqueda");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setPage(1); // Resetear a primera página
  };
  

  return (
    <div className="flex items-center justify-center">

      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center my-4 border-bottom pb-2">
          <h3 className="titulo-seccion">{sectionTitle}</h3>
        </div>

        <MenuEmpresa total={meta.total} isLoading={isLoading} />

        {/* Componente de búsqueda (nuevo) */}
        <div className="flex flex-col md:flex-row items-center gap-2 mx-2 my-4 p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center">
              <input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-primary w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className="btn btn-primary ml-2"
                onClick={handleSearch}
                disabled={searchTerm.trim() === ""}
              >
                <FaSearch />
              </button>
              {isSearching && (
                <button 
                  className="btn btn-ghost ml-2"
                  onClick={clearSearch}
                >
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
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  className="radio radio-sm radio-primary"
                  checked={searchType === "contains"}
                  onChange={() => setSearchType("contains")}
                />
                <span className="ml-1 text-sm">Contiene</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  className="radio radio-sm radio-primary"
                  checked={searchType === "endsWith"}
                  onChange={() => setSearchType("endsWith")}
                />
                <span className="ml-1 text-sm">Termina con</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
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

        <div className="flex flex-wrap justify-start">
          {data?.data.dataList.map((option: Empresa, index: number) => (
            <div key={index} className="w-full lg:w-1/3 p-4 md:w-1/3">
              <Show empresa={option} refetch={refetch} />
            </div>
          ))}
        </div>
        <EmpresaPagination
          page={page}
          totalPages={meta.pages}
          setPage={setPage}
        ></EmpresaPagination>
      </div>
    </div>
  );
}

function MenuEmpresa({
  total,
  isLoading,
}: {
  total: number;
  isLoading: boolean;
}) {
  const { push } = useRouter();

  return (
    <div className="container px-5 md:px-10 lg:px-10 py-2 flex flex-col lg:flex-row md:flex-row justify-around ">
      <div className="flex justify-center text-center">
        <div className={isLoading ? "stats shadow skeleton text-primary w-4/5 md:w-auto lg:w-auto" : "stats shadow  text-primary w-4/5 md:w-auto lg:w-auto"}>
          <div className="stat">
            <div className="stat-title">
              {isLoading ? (
                <span style={{ color: "transparent" }}>{total}</span>
              ) : (
                <div className="text-primary">Total Prestadores</div>
              )}
            </div>
            <div className="stat-value text-center">
              {isLoading ? (
                <span style={{ color: "transparent" }}>{total}</span>
              ) : (
                total
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Show({ empresa, refetch }: { empresa: Empresa, refetch: () => void; }) {
  const { jwt } = useUserStore();
  const { push } = useRouter();

  const [modalCentroCostos, setModalCentroCostos] = useState<boolean>(false);
  const router = useRouter();

  const EditElementChildren = (centroCosto: CentroCosto, empresa: Empresa) => {
    sessionStorage.setItem("CentroCostoElements", JSON.stringify({ CentroCostoId: centroCosto.id, centroCostoNombre: centroCosto.nombre, EmpresaId: empresa.id, empresaName: empresa.razonSocial }));
    sessionStorage.setItem("CentroCostoAll", JSON.stringify({ cc: centroCosto, empresa: empresa }));
    router.push("/empresa/centrocosto")
  }
  const FirstChildren = (empresaId: string, empresaName: string) => {
    sessionStorage.setItem("CentroCostoElements", JSON.stringify({ EmpresaId: empresaId, empresaName: empresaName }));
    router.push("/empresa/centrocosto")
  }
  const AddElementChildren = (centroCostoId: string, centroCostoName: string, empresaId: string, empresaName: string) => {

    sessionStorage.setItem("CentroCostoElements", JSON.stringify({ CentroCostoId: centroCostoId, centroCostoNombre: centroCostoName, EmpresaId: empresaId, empresaName: empresaName }));
    router.push("/empresa/centrocosto")
  }
  const [messageLock, setMessageLock] = useState('');
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleLockClick = () => {
    const message = !empresa.bloqueada ? "¿Está segur@ que desea bloquear la empresa?" : "¿Está segur@ que desea desbloquear la empresa?";
    setMessageLock(message);

    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }

  const dataArticulo = (empresaId: string) => {
    router.push(`/empresa/articulo/${empresaId}`)
  }
  const editEmpresa = (empresa: Empresa) => {
    sessionStorage.setItem("empresaEdit", JSON.stringify({ empresa: empresa }));
    sessionStorage.setItem("region", JSON.stringify({ region: empresa.regionCodigo, ciudad: empresa.ciudadCodigo, comuna: empresa.comunaCodigo }));
    sessionStorage.setItem("rutEmpresaEdit", JSON.stringify({ rutCuerpo: empresa.rutCuerpo, rutDigito: empresa.rutDigito }));
    push("/empresa/crear"); //  mane
  }


  const bloquear = async () => {
    try {
      await api_postEmpresas_Bloquear(jwt, empresa.id)
      refetch();
      if (modalRef.current) {
        modalRef.current.close();
      }
    } catch (error) {

    }
  }

  return (
    <>
      <div className="rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out w-full h-full flex flex-col">
        <div className="px-4 py-3 rounded-t-lg flex justify-between items-center bg-primary ">
          <h3 className="text-lg font-semibold text-primary-content">
            {empresa.razonSocial?.toUpperCase()}
          </h3>
        </div>

        <div className="p-6 flex-grow mb-3 text-left">
          <p className="text-gray-800">
            <span className="font-semibold">Administrador: </span>
            {empresa.administrador
              ? `${empresa.administrador.nombres.toUpperCase()} ${empresa.administrador.apellidoPaterno.toUpperCase()}`
              : "Sin información."}
          </p>
          <p className="text-gray-800 mt-2">
            <span className="font-semibold">Gerente: </span>
            {empresa.gerenteRrhh ? `${empresa.gerenteRrhh.nombres.toUpperCase()} ${empresa.gerenteRrhh.apellidoPaterno.toUpperCase()}` : "Sin información."}
          </p>
          <p className="text-gray-800 mt-2">
            <span className="font-semibold">Dirección: </span>
            {empresa.direccion ? `${empresa.direccion.toUpperCase()}` : "Sin información."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center p-3 bg-gray-50 border">
          <span className="font-semibold text-gray-800">Acciones</span>
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row  justify-right">
            <div className="tooltip" data-tip="Centro de costos">
              <button
                disabled={empresa.bloqueada}
                onClick={() => setModalCentroCostos(true)}
                className="flex items-center text-primary"
              >
                <span className="">Centro de costos</span>
                <MdFactory className="h-6 w-6 mr-2 ml-2" />
              </button>
            </div>
            <div className="tooltip" data-tip="Artículos">
              <button
                disabled={empresa.bloqueada}
                onClick={() => dataArticulo(empresa.id)}
                className="flex items-center text-primary"
              >
                <span className="">Artículos</span>
                <FaBox className="h-6 w-6 mr-2 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {modalCentroCostos && empresa.centroCostos.length === 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <dialog
              id="my_modal_3"
              className="modal fade-in"
              open={modalCentroCostos}
            >
              <div className="modal-box bg-white rounded-lg shadow-lg p-4">
                <button
                  onClick={() => setModalCentroCostos(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
                <h3 className="font-bold text-lg">Centro de costos</h3>
                <div className="flex flex-col">
                  <span>No existen Centros de costos</span>
                  {/* <span>Desea crear uno?</span>
                  <button
                    onClick={() => FirstChildren(empresa.id, empresa.razonSocial)}
                    className="btn btn-outline btn-primary mt-2"
                  >
                    Crear
                  </button> */}
                </div>
              </div>
            </dialog>
          </div>
        )}

        {modalCentroCostos && empresa.centroCostos.length !== 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <dialog
              id="my_modal_3"
              className="modal fade-in"
              open={modalCentroCostos}
            >
              <div className="modal-box bg-white rounded-lg shadow-lg p-4">
                <button
                  onClick={() => setModalCentroCostos(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
                <div className="flex flex-row justify-around">
                  <h3 className="font-bold text-lg">Centro de costos</h3>
                </div>
                <Table size="xs" className="w-full">
                  <Table.Head align="center">
                    <span>Nombre</span>
                    <span>Ver</span>
                  </Table.Head>
                  <Table.Body>
                    {empresa.centroCostos.map(
                      (option: CentroCosto, index: number) => (
                        <Table.Row align="center" key={index}>
                          <span>{option.nombre}</span>
                          <span className="flex flex-row justify-around">
                            <button onClick={() => router.push(`/empresa/centrocosto/${option.id}`)}>
                              <FaEye className="h-4 w-4 text-primary" />
                            </button>
                          </span>
                        </Table.Row>
                      )
                    )}
                  </Table.Body>
                </Table>
              </div>
            </dialog>
          </div>
        )}
      </div>
    </>
  );

}

function EmpresaPagination({
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
          className="btn btn-primary rounded-full px-6 py-2 text-lg md:text-base !text-white disabled:!text-white disabled:opacity-60"
        >
          Página anterior
        </button>
        <div className="text-lg text-accent">
          Página {page} de {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-primary rounded-full px-6 py-2 text-lg md:text-base !text-white disabled:!text-white disabled:opacity-60"
        >
          Próxima página
        </button>
      </div>
    </div>
  );
}
