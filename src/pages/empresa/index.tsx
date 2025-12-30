import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useUserStore } from "../../store/user.store";
import { useQuery } from "react-query";
import { api_getEmpresas, api_postEmpresas_Bloquear } from "../../services/bodega.service";
import { useRouter } from "next/router";
import { Table } from "react-daisyui";
import { useContextStore } from "../../store/context.store";
import { FiGrid, FiBox, FiEye } from "react-icons/fi";

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
  }, []);

  const sectionTitle =
    currentMenu?.titulo ||
    // @ts-ignore: algunos menús vienen sin título y se usa nombre
    currentMenu?.nombre ||
    "Empresas";

  const [page, setPage] = useState<number>(1);

  //  solo pagina
  const { isLoading, data, refetch } = useQuery(
    ["empresas", page],
    () => api_getEmpresas(jwt, page),
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

  return (
    <div className="flex items-center justify-center">
      <div className="container py-2">
        <div className="d-flex justify-content-between align-items-center my-4 border-bottom pb-2">
          <h3 className="titulo-seccion">{sectionTitle}</h3>
        </div>

        <MenuEmpresa total={meta.total} isLoading={isLoading} />

        {/*  Buscador eliminado */}

        <div className="flex flex-wrap justify-start">
          {data?.data.dataList.map((option: Empresa, index: number) => (
            <div key={index} className="w-full p-4 md:w-2/3 lg:w-2/3 mx-auto">
              <Show empresa={option} refetch={refetch} />
            </div>
          ))}
        </div>

        <EmpresaPagination page={page} totalPages={meta.pages} setPage={setPage} />
      </div>
    </div>
  );
}

function MenuEmpresa({ total, isLoading }: { total: number; isLoading: boolean }) {
  return (
    <div className="container px-5 md:px-10 lg:px-10 py-2 flex flex-col lg:flex-row md:flex-row justify-around">
      <div className="flex justify-center text-center">
        <div
          className={
            isLoading
              ? "stats shadow skeleton text-[#169eee] w-4/5 md:w-auto lg:w-auto"
              : "stats shadow text-[#169eee] w-4/5 md:w-auto lg:w-auto"
          }
        >
          <div className="stat">
            <div className="stat-title">
              {isLoading ? (
                <span style={{ color: "transparent" }}>{total}</span>
              ) : (
                <div className="text-[#169eee]">Total Prestadores</div>
              )}
            </div>

            <div className="stat-value text-center">
              {isLoading ? <span style={{ color: "transparent" }}>{total}</span> : total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Show({ empresa, refetch }: { empresa: Empresa; refetch: () => void }) {
  const { jwt } = useUserStore();
  const { push } = useRouter();

  const [modalCentroCostos, setModalCentroCostos] = useState<boolean>(false);
  const router = useRouter();

  const EditElementChildren = (centroCosto: CentroCosto, empresa: Empresa) => {
    sessionStorage.setItem(
      "CentroCostoElements",
      JSON.stringify({
        CentroCostoId: centroCosto.id,
        centroCostoNombre: centroCosto.nombre,
        EmpresaId: empresa.id,
        empresaName: empresa.razonSocial,
      })
    );
    sessionStorage.setItem("CentroCostoAll", JSON.stringify({ cc: centroCosto, empresa: empresa }));
    router.push("/empresa/centrocosto");
  };

  const FirstChildren = (empresaId: string, empresaName: string) => {
    sessionStorage.setItem("CentroCostoElements", JSON.stringify({ EmpresaId: empresaId, empresaName: empresaName }));
    router.push("/empresa/centrocosto");
  };

  const AddElementChildren = (centroCostoId: string, centroCostoName: string, empresaId: string, empresaName: string) => {
    sessionStorage.setItem(
      "CentroCostoElements",
      JSON.stringify({ CentroCostoId: centroCostoId, centroCostoNombre: centroCostoName, EmpresaId: empresaId, empresaName: empresaName })
    );
    router.push("/empresa/centrocosto");
  };

  const [messageLock, setMessageLock] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleLockClick = () => {
    const message = !empresa.bloqueada ? "¿Está segur@ que desea bloquear la empresa?" : "¿Está segur@ que desea desbloquear la empresa?";
    setMessageLock(message);

    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const dataArticulo = (empresaId: string) => {
    router.push(`/empresa/articulo/${empresaId}`);
  };

  const editEmpresa = (empresa: Empresa) => {
    sessionStorage.setItem("empresaEdit", JSON.stringify({ empresa: empresa }));
    sessionStorage.setItem("region", JSON.stringify({ region: empresa.regionCodigo, ciudad: empresa.ciudadCodigo, comuna: empresa.comunaCodigo }));
    sessionStorage.setItem("rutEmpresaEdit", JSON.stringify({ rutCuerpo: empresa.rutCuerpo, rutDigito: empresa.rutDigito }));
    push("/empresa/crear");
  };

  const bloquear = async () => {
    try {
      await api_postEmpresas_Bloquear(jwt, empresa.id);
      refetch();
      if (modalRef.current) {
        modalRef.current.close();
      }
    } catch (error) { }
  };

  return (
    <>
      <div className="rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out w-full h-full flex flex-col">
        <div className="px-4 py-3 rounded-t-lg flex justify-between items-center bg-[#169eee]">
          <h3 className="text-lg font-semibold text-white">{empresa.razonSocial?.toUpperCase()}</h3>
        </div>

        <div className="p-6 flex-grow mb-3 text-left">
          <p className="text-gray-800">
            <span className="font-semibold">Administrador: </span>
            {empresa.administrador ? `${empresa.administrador.nombres.toUpperCase()} ${empresa.administrador.apellidoPaterno.toUpperCase()}` : "Sin información."}
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

        <div className="p-3 bg-white border-t">
          <div className="flex items-center justify-between gap-3">
            <button
              disabled={empresa.bloqueada}
              onClick={() => setModalCentroCostos(true)}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                bg-primary text-primary-content
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(124,58,237,0.35)]
                focus:outline-none focus:ring-2 focus:ring-primary/40
                disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
            >
              <FiGrid className="w-4 h-4" />
              Centro de Costos
            </button>

            <button
              disabled={empresa.bloqueada}
              onClick={() => dataArticulo(empresa.id)}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                bg-primary text-primary-content
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(124,58,237,0.35)]
                focus:outline-none focus:ring-2 focus:ring-primary/40
                disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
            >
              Artículos
              <FiBox className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ... todo lo demás de tus modales queda igual ... */}

        {modalCentroCostos && empresa.centroCostos.length !== 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <dialog id="my_modal_3" className="modal fade-in" open={modalCentroCostos}>
              <div className="modal-box bg-white rounded-lg shadow-lg p-4 overflow-hidden">
                <div className="rounded-t-lg bg-[#169eee] px-4 py-3 -m-4 mb-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-base md:text-lg">Centros de Costos:</h3>

                  <button
                    onClick={() => setModalCentroCostos(false)}
                    className="btn btn-sm btn-circle bg-white/15 border-0 text-white hover:bg-white/25"
                    aria-label="Cerrar"
                    type="button"
                  >
                    ✕
                  </button>
                </div>

                <Table size="xs" className="w-full">
                  <thead>
                    <tr>
                      <th className="text-center">Nombre</th>
                      <th className="text-center w-16">Ver</th>
                    </tr>
                  </thead>

                  <tbody>
                    {empresa.centroCostos.map((option: CentroCosto, index: number) => (
                      <tr key={index}>
                        <td className="text-center">{option.nombre}</td>

                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => router.push(`/empresa/centrocosto/${option.id}`)}
                            className="
                              inline-flex items-center justify-center
                              w-9 h-9 rounded-full
                              text-[#6500E4]
                              transition-all duration-200
                              hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(101,0,228,0.30)]
                              focus:outline-none focus:ring-2 focus:ring-[#6500E4]/40
                            "
                            aria-label="Ver centro de costos"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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
          Anterior
        </button>

        <div className="text-lg text-accent">
          Página {page} de {totalPages}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-primary rounded-full px-6 py-2 text-lg md:text-base !text-white disabled:!text-white disabled:opacity-60"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
