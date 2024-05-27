import { EmpresaFormValues } from "@/interfaces/creation";
import { Button, Input, Modal, Select, Table } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { Options } from "../../static";
import { useTiposStore } from "../../../store/tipos.store";
import {
  api_getAreaGeografica,
  api_getTipoAdministracion,
} from "../../../services/tipos.service";
import { useQuery } from "react-query";
import { useUserStore } from "../../../store/user.store";
interface props {
  errors: FieldErrors<EmpresaFormValues>;
}
import { FaSearch } from "react-icons/fa";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { api_getPersonas } from "../../../services/bodega.service";
interface Persona {
  id : string;
  runCuerpo?: number | null;
  runDigito?: string | null;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
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
}

export default function Administracion({ errors }: props) {
  const { jwt } = useUserStore();
  const { register, watch,setValue } = useFormContext();
  const [action, SetAction] = useState("Action");
  const [visualPersona, setVisualPersona] = useState({
    Gerente: "",
    Administrador: ""
  })
  /*
    Set Person
  */
 
    const openModal = (action: string) => {
    SetAction(action);
    setModalState(true);
  };
  const assignPerson = (element:Persona) => {
    if (action === "AdministradorId") {
      visualPersona.Administrador = `${element.runCuerpo}-${element.runDigito} -  ${defineName(element.nombres,element.apellidoPaterno,element.apellidoMaterno)}`
      setVisualPersona(visualPersona);
      setValue(action,element.id);
    }
     if (action === "GerenteRRHHId") 
      {
      visualPersona.Gerente = `${element.runCuerpo}-${element.runDigito} - ${defineName(element.nombres,element.apellidoPaterno,element.apellidoMaterno)}`
      setVisualPersona(visualPersona);
      setValue(action,element.id);
    }
    setModalState(false);
  }

  const defineName = (nombres: string, aP: string, aM: string | null)  =>{
    const apellidoMaterno = aM !== null ? aM : '';
    return `${nombres.toUpperCase()} ${aP.toUpperCase()} ${apellidoMaterno.toUpperCase()}`;
  }
  /*
    Set Person
  */

  const { setTipoAdministracion, tipoAdministracion } = useTiposStore();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value.replace(/\D/g, ""); // Permitir solo números
    event.target.value = value;
  };

  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [modalState, setModalState] = useState<boolean>(false);
  useEffect(() => {setPage(1)},[modalState])
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

  const Query = useQuery(
    "tipoAdministracion",
    () => api_getTipoAdministracion(jwt),
    {
      enabled: useTiposStore.getState().tipoAdministracion.length === 0,
      onSuccess: (data) => {
        setTipoAdministracion(data.data.dataList);
      },
    }
  );

  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Tipo Administración</span>
          </label>
          <div className="form-control w-full max-w-xs">
            <Select
              defaultValue={"default"}
              {...register("TipoAdministracionCodigo", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              onChange={handleChange}
            >
              {tipoAdministracion.map((option, index) => (
                <Select.Option key={index} value={option.codigo}>
                  {option.nombre}
                </Select.Option>
              ))}
            </Select>
          </div>

          <label className="label text-error">
            {errors.TipoAdministracionCodigo
              ? errors.TipoAdministracionCodigo.message
              : ""}
          </label>
        </div>
      </div>
      <div className="flex flex-wrap">
      <BusquedaPersona
        title="Administrador"
        openModal={() => {
          openModal("AdministradorId");
        }}
        registerString={visualPersona.Administrador}
        />
      <BusquedaPersona
        title="Gerente RRHH"
        openModal={() => {
          openModal("GerenteRRHHId");
        }}
        registerString={visualPersona.Gerente}
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
            <h3 className="font-bold text-lg">Seleccionar Persona</h3>
            <Table size="xs">
        <Table.Head>
          <span>Rut</span>
          <span>Nombre</span>
          <span>Acción</span>
        </Table.Head>

        <Table.Body> 
          {data?.data.dataList.map((option: Persona, index: number) => (
              
            <PersonaShow key={index} persona={option} action={assignPerson}/>
              
          ))}
        </Table.Body>
      </Table>
      <PersonaPagination page={page} totalPages={meta.pages} setPage={setPage}></PersonaPagination>

          </div>
        </dialog>
      </div>}
      </div>
    </div>
  );
}

const BusquedaPersona = ({
  title,
  openModal,
  registerString,
}: {
  title: string;
  openModal: () => void;
  registerString: string;
}) => {
  const { register, watch } = useFormContext();

  return (
    <>
      <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
        <label className="sr-only">Buscar</label>
        <div className="relative w-full">
          <input
            onClick={openModal}
            value={registerString}
            readOnly
            type="text"
            id="voice-search"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5"
            placeholder={title}
            required
          />
          <button
            onClick={openModal}
            type="button"
            className="flex absolute inset-y-0 right-0 items-center pr-3"
          >
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-primary "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

function PersonaShow({ persona ,action}: { persona: Persona,action:(item:Persona) => void }) {
  return (
    <Table.Row>
      <span>
        {persona.runCuerpo}-{persona.runDigito}
      </span>
      <span className="uppercase">
        {persona.nombres} {persona.apellidoPaterno} {persona.apellidoMaterno}
      </span>
      <span>
        <button className="btn btn-outline btn-primary" onClick={() => {action(persona)}}>Seleccionar</button>
      </span>
    </Table.Row>
  );
}

function PersonaPagination({
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
