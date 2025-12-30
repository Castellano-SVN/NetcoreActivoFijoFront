import { Options } from '@/components/static';
import { CentroFormValues } from '@/interfaces/creation';
import { api_getEmpresas, api_getPersonas } from '@/services/bodega.service';
import { api_getTipoEstablecimientoSalud } from '@/services/tipos.service';
import { useTiposStore } from '@/store/tipos.store';
import { useUserStore } from '@/store/user.store';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Input, Modal, Select, Table } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';
import { LuSearch, LuCircleX   } from 'react-icons/lu';
import { useQuery } from "react-query";
import { IPersona } from "@/interfaces/creation";


interface props {
  errors: FieldErrors<CentroFormValues>
}
interface Empresa {
  id: string
  rutCuerpo: number | null;
  rutDigito: string | null;
  razonSocial: string
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
}
interface CentroCosto {
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


export default function InstitucionalCentro({ errors }: props) {

  const {
    register,
    watch,
    setValue,
  } = useFormContext();

  const { jwt } = useUserStore();
  const { setTipoEstablecimientoSalud, tipoEstablecimientoSalud } = useTiposStore();
  const tipoestablecimientoQuery = useQuery("tipoEstablecimientoSalud", () => api_getTipoEstablecimientoSalud(jwt), {
    enabled: useTiposStore.getState().tipoEstablecimientoSalud.length === 0,
    onSuccess: (data) => {
      setTipoEstablecimientoSalud(data.data.dataList);
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Permitir solo numeros
    event.target.value = value;
  };
  const [action, SetAction] = useState("Action");
  const [visualEmpresa, setVisualEmpresa] = useState({
    Empresa: "",
    CentroCosto: "",
    administrador: ""
  })
  /*
    Set company
  */
  //EDICION O NUEVO ELEMENTO A PARTIR DE CENTRO COSTO
  useEffect(() => {
    const newElementChildren = sessionStorage.getItem("CentroCostoElements");
    if (newElementChildren) {
      const data: { CentroCostoId: string, centroCostoNombre: string, EmpresaId: string, empresaName: string } = JSON.parse(newElementChildren);
      setValue("CentroCostoId", data.CentroCostoId);
      setValue("EmpresaId", data.EmpresaId);
      visualEmpresa.CentroCosto = data.centroCostoNombre,
      visualEmpresa.Empresa = data.empresaName
      /* localStorage.removeItem("CentroCostoElements") */
      console.log('cc = ',data.centroCostoNombre)
    }
  }, [])
  const openModal = (action: string) => {
    SetAction(action);
    setModalState(true);
  };
  const assignPersona = (element: IPersona) => {
    console.log(element)
    visualEmpresa.administrador = `${element.runCuerpo}-${element.runDigito} - ${element.nombres} ${element.apellidoPaterno}`
    setValue("AdministradorId", element.id);
    setModalState(false);
  }
  const defineName = (razonSocial: string) => {
    return `${razonSocial.toUpperCase()}`;
  }
  /*
    Set Company
  */


  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [modalState, setModalState] = useState<boolean>(false);
  useEffect(() => { setPage(1) }, [modalState])
  const { isLoading, error, data, refetch } = useQuery(
    "personas",
    () => api_getPersonas(jwt, page),
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
    refetch();
  }, [page]);

  const resetCentro = () => {
    setValue("AdministradorId", undefined);
    setVisualEmpresa(prevVisualEmpresa => {
      return {
        ...prevVisualEmpresa,
        administrador: ""
      };
    });
  }

  return (
    <div className="my-2">
      <div className="flex flex-wrap">

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="sr-only">Search</label>
          <div className="relative w-full">
            <input
              readOnly
              type="text"
              value={visualEmpresa.Empresa}
              id="voice-search"

              className="border border-gray-400 input bg-white text-sm rounded-lg block w-full p-2.5"
              placeholder={"Empresa"}
              required
            />
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="sr-only">Search</label>
          <div className="relative w-full">
            <input
              readOnly
              type="text"
              value={visualEmpresa.CentroCosto}
              id="voice-search"

              className="border border-gray-400 input bg-white text-sm rounded-lg block w-full p-2.5"
              placeholder={"Centro costo"}
              required
            />
          </div>
        </div>
        <BusquedaEmpresa
          title="Administrador"
          openModal={() => {
            openModal("AdministradorId");
          }}
          clean={resetCentro}
          registerString={visualEmpresa.administrador}

        />
        {modalState && <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <dialog
            id="my_modal_3"
            className="modal fade-in"
            open={modalState}
          >
            <div className="modal-box bg-white rounded-lg shadow-lg p-4">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => setModalState(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Empresas</h3>
              <Table size="xs">
                <Table.Head>
                  <span>Rut</span>
                  <span>Razón social</span>
                  <span>Acción</span>
                </Table.Head>

                <Table.Body>
                  {data?.data.dataList.map((option: IPersona, index: number) => (

                    <EmpresaShow key={index} empresa={option} action={assignPersona} />

                  ))}
                </Table.Body>
              </Table>
              <EmpresaPagination page={page} totalPages={meta.pages} setPage={setPage}></EmpresaPagination>

            </div>
          </dialog>
        </div>}
      </div>
      <div className="flex flex-wrap">

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Establecimiento de salud</span>
          </label>
          <Select defaultValue={''} {...register("TipoEstablecimientoSaludCodigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
            <Select.Option value={''} disabled>
              Seleccione el establecimiento
            </Select.Option>
            {tipoEstablecimientoSalud.map((tipoEstablecimientoSalud, index) => (
              <Select.Option key={index} value={tipoEstablecimientoSalud.codigo}>
                {tipoEstablecimientoSalud.nombre}
              </Select.Option>
            ))}
          </Select>
          <label className="label text-error">
            {errors.ComunaCodigo ? errors.ComunaCodigo.message : ""}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Código contabilidad</span>
          </label>
          <Input {...register("CodigoContabilidad", { setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.CodigoContabilidad ? errors.CodigoContabilidad.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Código dipres</span>
          </label>
          <Input {...register("CodigoDipres", { setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.CodigoDipres ? errors.CodigoDipres.message : ""}
          </label>
        </div>

      </div>

      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Ruta reporte</span>
          </label>
          <Input {...register("RutaReporte", { setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.RutaReporte ? errors.RutaReporte.message : ""}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Código previred</span>
          </label>
          <Input {...register("CodigoPrevired", { setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.CodigoPrevired ? errors.CodigoPrevired.message : ""}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Código gesparvu</span>
          </label>
          <Input type='number' {...register("CodigoGesparvu", { setValueAs: (value) => value === "" ? undefined : Number(value) })} onChange={handleChange} />
          <label className="label text-error">
            {errors.CodigoGesparvu ? errors.CodigoGesparvu.message : ""}
          </label>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Administracion central</span>
          </label>
          <div className="flex justify-center items-center">
            <Input type="checkbox"
              className="toggle rounded-full "
              {...register("AdministracionCentral")}
            />
          </div>
          <label className="label text-error">
            {errors.AdministracionCentral ? errors.AdministracionCentral.message : ""}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Contabilización</span>
          </label>
          <Input type="checkbox"
            className="toggle rounded-full "

            {...register("Contabilizacion")}
          />
          <label className="label text-error">
            {errors.Contabilizacion ? errors.Contabilizacion.message : ""}                    </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Libro remuneraciones</span>
          </label>
          <Input type="checkbox"
            className="toggle rounded-full "

            {...register("LibroRemuneraciones")}
          />
          <label className="label text-error">
            {errors.LibroRemuneraciones ? errors.LibroRemuneraciones.message : ""}                    </label>
        </div>


      </div>
    </div>
  );
}

const BusquedaEmpresa = ({
  title,
  openModal,
  clean,
  registerString,
}: {
  title: string;
  clean: () => void;
  openModal: () => void;
  registerString: string;
}) => {
  const { register, watch } = useFormContext();

  return (
    <>
      <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2 ">
        <label className="sr-only">Search</label>
        <div className="relative w-full flex flex-row border border-gray-300 rounded-lg">
          <input
            value={registerString}
            readOnly
            type="text"
            id="voice-search"
            className="border border-gray-400 input bg-white text-sm rounded-lg block w-full p-2.5"
            placeholder={title}
            required
          />
          <button
            onClick={openModal}
            type="button"
            className="flex inset-y-0 right-0 items-center"
            aria-label="Search"
          >
            <LuSearch />
          </button>

          <button
            onClick={clean}
            type="button"
            className="flex inset-y-0 right-0 items-center px-2"
            aria-label="Clear"
          >
            <LuCircleX />
          </button>

        </div>
      </div>
    </>
  );
};

function EmpresaShow({ empresa, action }: { empresa: IPersona, action: (item: IPersona) => void }) {
  return (
    <Table.Row>
      <span>
        {empresa.runCuerpo}-{empresa.runDigito}
      </span>
      <span className="uppercase">
        {empresa.nombres} {empresa.apellidoPaterno}
      </span>
      <span>
        <button className="btn btn-outline btn-primary" onClick={() => { action(empresa) }}>Seleccionar</button>
      </span>
    </Table.Row>
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
    <div className="flex justify-center items-center">
      <div className="w-3/7">
        <div className="join grid grid-cols-2 pb-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="join-item btn btn-outline"
          >
            Página anterior
          </button>
          <button
            disabled={page === totalPages}
            className="join-item btn btn-outline"
            onClick={() => setPage(page + 1)}
          >
            Próxima página
          </button>
        </div>
      </div>
    </div>
  );
}