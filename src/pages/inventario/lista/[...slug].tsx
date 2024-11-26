import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import router from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllInventarioFisicoEstados,
  api_getAllMarcas,
  api_getAllPersonas,
  api_getEstadoArticulos,
  api_getOneEmpresa,
  api_getProgramaByEmpresa,
  api_postMarcas,
} from "../../../services/bodega.service";
import Head from "next/head";
import { IEmpresa, IInventarioFisicoEstado, IPersona, IPrograma } from "../../../interfaces/creation";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IAlmacen } from "../../../interfaces/modules/IAlmacen.interface";
import { Input, Loading, Modal } from "react-daisyui";
import { z } from "zod";
import { IFuncionarioEmpresa, InventarioFisicoRegistroFormValues } from "@/interfaces/inventario.interface";
import { api_getAllPersonasByEmpresa, api_postInventarioFisicoRegistro } from "@/services/inventario.service";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Select from "react-select";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface estadosI {
  codigo: number;
  nombre: string;
}
export default function Inventariar() {
  const { jwt } = useUserStore();
  const { empresa, bodega, centrocosto } = router.query as {
    empresa: string;
    bodega: string;
    centrocosto: string;
  };

  // Extraer la parte del path que contiene el ID
  const { slug } = router.query; // `slug` corresponde a la parte dinámica del path

  // Extraer el ID del path completo
  const ifdid = slug ? slug[1] as string : null;

  const [almacens, setAlmacens] = useState<any[]>([]);
  const { setActive } = useContextStore();

  useEffect(() => {
    setActive("Toma inventario");
    if (!ifdid) return;
  }, [ifdid]);

  const getAlmacens = async () => {
    const alm = await api_getAllAlmacenByEmpByCenByBod(
      jwt,
      empresa,
      centrocosto,
      bodega
    );
    setAlmacens(alm.data.dataList);
  };
  const [estadosArticulos, setEstadosArticulos] = useState<estadosI[]>([]);

  const estadosArtGet = async () => {
    const estados = await api_getEstadoArticulos(jwt);
    setEstadosArticulos(estados.data.dataList);
  };
  useEffect(() => {
    if (!bodega) return;
    if (!empresa) return;
    getAlmacens();
    estadosArtGet();
  }, [router.query]);

  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();

  useEffect(() => {
    const getOneEmpresa = async () => {
      if (empresa) {
        try {
          const data = await api_getOneEmpresa(jwt, empresa);
          setDataEmpresa(data.data.dataList[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getOneEmpresa();
  }, [jwt, empresa]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [marcas, setMarcas] = useState<MarcasI[]>([]);

  const getMarcas = async () => {
    try {
      const data = await api_getAllMarcas(jwt);
      setMarcas(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMarcas();
  }, []);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const handleShowModal = useCallback(() => {
    setModalShow(!modalShow);
  }, [modalShow]);

  const handleSave = async () => {
    if (inputValue.trim() === '') {
      toast.error('El nombre de la marca es requerido');
      return;
    }

    try {
      const data: MarcasValues = { Nombre: inputValue };
      await api_postMarcas(jwt, data);
      toast.success('Marca agregada con éxito');
      setModalShow(false);
      setInputValue('');
      getMarcas();
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error('Ha ocurrido un error inesperado.');
    }
  };

  const [inputValue, setInputValue] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const [invFisEstado, setInvFisEstado] = useState<IInventarioFisicoEstado[]>([]);
  const getInvFisEstado = async () => {
    try {
      const data = await api_getAllInventarioFisicoEstados(jwt);
      setInvFisEstado(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const [programa, setPrograma] = useState<IPrograma[]>([]);
  const getPrograma = async () => {
    try {
      const data = await api_getProgramaByEmpresa(jwt, empresa);
      setPrograma(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const [dataFuncionario, setDataFuncionario] = useState<IFuncionarioEmpresa[]>([]);
  const getFuncionarios = async () => {
    try {
      const data = await api_getAllPersonasByEmpresa(jwt, empresa);
      setDataFuncionario(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!empresa) return;
    getInvFisEstado();
    getPrograma();
    getFuncionarios();
  }, [empresa]);

  return (
    <>
      <Head>
        <title>
          {dataEmpresa ? `Empresa ${dataEmpresa.razonSocial}` : `Empresa`}
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal ref={modalRef} open={modalShow}>
        <Modal.Header>Generar Nueva Marca</Modal.Header>
        <Modal.Body>
          <label>Nombre de la marca:</label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="input border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
          />
          <br />
        </Modal.Body>
        <Modal.Actions>
          <button className="btn btn-outline btn-primary" type="button" onClick={handleSave}>Guardar</button>
          <button className="btn btn-outline btn-secondary" type="button" onClick={handleShowModal}>Cancelar</button>
        </Modal.Actions>
      </Modal>

      <div className="w-full transition duration-300 ease-in-out">
        <div className="flex flex-col bg-primary bordered rounded-md shadow-md ">
          <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-md">
            <h3 className="text-large font-bold text-base-100">
              {dataEmpresa ? dataEmpresa?.razonSocial.toUpperCase() : ""}
            </h3>
            <h3 className="text-large font-bold text-base-100">
              {dataEmpresa ? dataEmpresa?.giro?.toUpperCase() : ""}
            </h3>
          </div>
        </div>

        <div className="flex md:flex-row lg:flex-row flex-col-reverse justify-start items-center mt-4 lg:mt-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.back()}
          >
            <FaArrowLeft />
            Volver
          </button>
        </div>

        {almacens ? (
          <>
            <div className="w-full grid grid-cols-1 gap-4">
              {almacens.map((e, index) => (
                <ViewAlmacen
                  key={index}
                  almacen={e}
                  empresa={empresa}
                  centrocosto={centrocosto}
                  bodega={bodega}
                  jwt={jwt}
                  estados={estadosArticulos}
                  invFisicoDetalleId={ifdid}
                  marcas={marcas}
                  handleShowModal={handleShowModal}
                  ife={invFisEstado}
                  programa={programa}
                  funcionario={dataFuncionario}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-primary text-center mt-4">
              <Loading size="lg" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface IAllLocations {
  descripcion?: string;
  direccion: string;
  id: string;
}

interface IAllAlmacen {
  empresaId: string;
  bodegaId: string;
  id: string;
  tipoAlmacenId: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  centroCostoId: string;
  locacions?: IAllLocations[];
}

interface props {
  almacen: IAllAlmacen;
  empresa: string;
  bodega: string;
  centrocosto: string;
  jwt: string;
  estados: estadosI[];
  invFisicoDetalleId: string | null;
  marcas: MarcasI[];
  handleShowModal: () => void;
  ife: IInventarioFisicoEstado[];
  programa: IPrograma[];
  funcionario: IFuncionarioEmpresa[];
}
interface articuloI {
  articuloId: string;
  cantidad: number;
  locacion: string | undefined;
  nombre: string;
  descripcion: string;
  subfamilia: string;
  familia: string;
  estado: number;
  anoNumero: number;
  subFamiliaId: string;
}

function ViewAlmacen(props: props) {
  const [almacenArituclos, setAlmacenArticulos] = useState<articuloI[]>([]);

  const getArticles = async () => {
    const articles = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(
      props.jwt,
      props.empresa,
      props.centrocosto,
      props.bodega,
      props.almacen.id
    );

    const newElementsArticles: articuloI[] = [];
    articles.data.dataList.map((e: any) => {
      newElementsArticles.push({
        articuloId: e.articuloId,
        cantidad: e.cantidad,
        descripcion: e.articulo.descripcion,
        familia: e.articulo.subFamilium.familium.nombre,
        locacion: e.locacionId,
        nombre: e.articulo.nombre,
        subfamilia: e.articulo.subFamilium.nombre,
        subFamiliaId: e.articulo.subFamilium.id,
        estado: e.estadoArticuloCodigo,
        anoNumero: e.anoNumero,
      });
    });

    setAlmacenArticulos(newElementsArticles);
  };

  useEffect(() => {
    if (!props.empresa) return;
    if (!props.centrocosto) return;
    if (!props.bodega) return;
    if (!props.almacen) return;
    getArticles();
  }, [props.empresa, props.centrocosto, props.bodega, props.almacen]);

  return (
    <>
      <div className="flex flex-col bordered rounded shadow-md mt-2">
        <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-t-lg">
          <h3 className="text-large font-bold text-base-100 text-center">
            {props.almacen.nombre}
          </h3>
        </div>
        <div className="w-full grid grid-cols-1 gap-4 p-2">
          {props.almacen.locacions?.map(
            (locacion, index) =>
              almacenArituclos.filter((e) => e.locacion === locacion.id)
                .length !== 0 && (
                <ViewLocation
                  locacions={locacion}
                  articulos={almacenArituclos.filter(
                    (e) => e.locacion === locacion.id
                  )}
                  estados={props.estados}
                  empresa={props.empresa}
                  jwt={props.jwt}
                  invFisDetalleId={props.invFisicoDetalleId as string}
                  marcas={props.marcas}
                  handleShowModal={props.handleShowModal}
                  ife={props.ife}
                  programa={props.programa}
                  funcionario={props.funcionario}
                />
              )
          )}
        </div>
      </div>
    </>
  );
}

interface MarcasI {
  id: string;
  nombre: string;
}

interface MarcasValues {
  Nombre: string;
}

function ViewLocation(props: {
  locacions: IAllLocations;
  articulos: articuloI[];
  estados: estadosI[];
  empresa: string;
  jwt: string;
  marcas: MarcasI[];
  invFisDetalleId: string;
  handleShowModal: () => void;
  ife: IInventarioFisicoEstado[];
  programa: IPrograma[];
  funcionario: IFuncionarioEmpresa[];
}) {

  const [selectedPersona, setSelectedPersona] =
    useState<IPersona | null>(null);


  const ValidationSchema = z.object({
    EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    PersonaConteoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    SubFamiliaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    ArticuloId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    MarcaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    EstadoCodigo: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido", }),
    LugarFisicoConteo: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }).optional(),
    LocacionId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }).optional(),
    ProgramaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }).optional(),
    Presentacion: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }).optional(),
    Observaciones: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }).optional(),
    Codigo: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }).optional(),
    NumeroUnidades: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido", }),
  });
  
  const InvFisRegistroSchema = z.object({
    InvFisRegistro: z.array(ValidationSchema),
    InventarioFisicoDetalleId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
  });

  const defaultValues: InventarioFisicoRegistroFormValues = {
    InventarioFisicoDetalleId: props.invFisDetalleId,
    InvFisRegistro: props.articulos.map((articulo) => ({
      EmpresaId: props.empresa,
      FuncionarioId: '',
      PersonaConteoId: '',
      AnoNumero: articulo.anoNumero,
      SubFamiliaId: articulo.subFamiliaId,
      ArticuloId: articulo.articuloId,
      MarcaId: '',
      EstadoCodigo: 0,
      LugarFisicoConteo: '',
      LocacionId: props.locacions.id,
      ProgramaId: '',
      Presentacion: '',
      Observaciones: '',
      Codigo: '',
      NumeroUnidades: 0,
    })),
  };

  const methods = useForm<InventarioFisicoRegistroFormValues>({
    defaultValues,
    resolver: zodResolver(InvFisRegistroSchema)
  });

  const {
    getValues,
    setValue,
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "InvFisRegistro",
  });

  const onSubmit = async (data: InventarioFisicoRegistroFormValues) => {
    try {
      const response = await api_postInventarioFisicoRegistro(props.jwt, data);
      if (response) {
        toast.success('Inventario Registrado con exito');
        reset();
      } else {
        toast.error('ha ocurrido un error registrar el inventario');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ha ocurrido un error inesperado');
      }
    }
    console.log(data);
  };





  return (
    <>
      <div className="flex flex-col bordered rounded shadow-md mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-t-lg">
            <h3 className="text-large font-bold text-base-100 text-center">
              {props.locacions.direccion}
            </h3>
          </div>
          <div className="w-full grid grid-cols-1 gap-4 overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="text-center">
                <tr>
                  <th></th>
                  <th>Nombre artículo</th>
                  <th>Familia</th>
                  <th>Cantidad en almacén</th>
                  <th>Año</th>
                  <th>Persona Conteo</th>
                  <th>Marca</th>
                  <th>Estado</th>
                  <th>Programa</th>
                  <th>Presentacion</th>
                  <th>Lugar Fisico</th>
                  <th>Observaciones</th>
                  <th>Código</th>
                  <th>Número de unidades</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {fields.map((field, index) => (
                  <tr className="hover" key={field.id}>
                    <th>{index + 1}</th>

                    <td>{props.articulos[index].nombre}</td>

                    <td>
                      {props.articulos[index].familia}
                      <br />
                      {props.articulos[index].subfamilia}
                    </td>

                    <td className="font-bold">{props.articulos[index].cantidad}</td>

                    <td>{props.articulos[index].anoNumero}</td>

                    <td>
                      <select
                        {...register(`InvFisRegistro.${index}.PersonaConteoId`, { setValueAs: (value) => value === "" ? undefined : value })}
                        className="select border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"

                      >
                        <option value={""} selected disabled>
                          Seleccione Persona
                        </option>
                        {props.funcionario.sort((a, b) => {
                          if (a.persona.apellidoPaterno < b.persona.apellidoPaterno) return -1;
                          if (a.persona.apellidoPaterno > b.persona.apellidoPaterno) return 1;
                          return a.persona.nombres.localeCompare(b.persona.nombres);
                        }).map((funcionario, index) => (
                          <option key={index} value={funcionario.funcionarioId}>{funcionario.persona.apellidoMaterno ? funcionario.persona.apellidoPaterno + " " + funcionario.persona.apellidoMaterno + " " + funcionario.persona.nombres : funcionario.persona.apellidoPaterno + " " + funcionario.persona.nombres}</option>
                        ))}
                      </select>
                      {errors.InvFisRegistro?.[index]?.PersonaConteoId && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.PersonaConteoId?.message}</span>
                      )}
                    </td>
                    <td>
                      <select
                        {...register(`InvFisRegistro.${index}.MarcaId`, { setValueAs: (value) => value === "" ? undefined : value })}
                        className="select border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        onChange={(e) => {
                          if (e.target.value === "Otras") {
                            e.target.value = '';
                            props.handleShowModal();
                          };
                        }}
                      >
                        <option value={""} disabled selected>
                          Seleccione Marca
                        </option>
                        {props.marcas.map((marca, index) => (
                          <option key={index} value={marca.id}>{marca.nombre}</option>
                        ))}
                        <option value={"Otras"}>Otras</option>
                      </select>
                      {errors.InvFisRegistro?.[index]?.MarcaId && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.MarcaId?.message}</span>
                      )}
                    </td>

                    <td>
                      <select
                        {...register(`InvFisRegistro.${index}.EstadoCodigo`, { setValueAs: (value) => value === 0 ? undefined : Number(value) })}
                        className="select border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value={0} disabled selected>
                          Seleccione Estado
                        </option>
                        {props.ife.map((estado, index) => (
                          <option key={index} value={estado.codigo}>{estado.nombre}</option>
                        ))}
                      </select>
                      {errors.InvFisRegistro?.[index]?.EstadoCodigo && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.EstadoCodigo?.message}</span>
                      )}
                    </td>

                    <td>
                      <select
                        {...register(`InvFisRegistro.${index}.ProgramaId`, { setValueAs: (value) => value === "" ? undefined : value })}
                        className="select border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value={""} disabled selected>
                          Seleccione Programa
                        </option>
                        {props.programa.map((programa, index) => (
                          <option key={index} value={programa.id}>{programa.nombre}</option>
                        ))}
                      </select>
                      {errors.InvFisRegistro?.[index]?.ProgramaId && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.ProgramaId?.message}</span>
                      )}
                    </td>

                    <td>
                      <Input {...register(`InvFisRegistro.${index}.Presentacion`, { setValueAs: (value) => value === "" ? undefined : value })}
                        type="text"
                        className="border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Presentacion"
                      />
                      {errors.InvFisRegistro?.[index]?.Presentacion && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.Presentacion?.message}</span>
                      )}
                    </td>

                    <td>
                      <Input {...register(`InvFisRegistro.${index}.LugarFisicoConteo`, { setValueAs: (value) => value === "" ? undefined : value })}
                        type="text"
                        className="border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Lugar Fisico del Conteo"
                      />
                      {errors.InvFisRegistro?.[index]?.LugarFisicoConteo && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.LugarFisicoConteo?.message}</span>
                      )}
                    </td>

                    <td>
                      <Input {...register(`InvFisRegistro.${index}.Observaciones`, { setValueAs: (value) => value === "" ? undefined : value })}
                        type="text"
                        className="border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Observacion"
                      />
                      {errors.InvFisRegistro?.[index]?.Observaciones && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.Observaciones?.message}</span>
                      )}
                    </td>

                    <td>
                      <Input {...register(`InvFisRegistro.${index}.Codigo`, { setValueAs: (value) => value === "" ? undefined : value })}
                        type="text"
                        className="border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Codigo"
                      />
                      {errors.InvFisRegistro?.[index]?.Codigo && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.Codigo?.message}</span>
                      )}
                    </td>

                    <td>
                      <Input {...register(`InvFisRegistro.${index}.NumeroUnidades`, { setValueAs: (value) => value === 0 || "" ? undefined : Number(value) })}
                        type="number"
                        className="border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Número de unidades"
                      />
                      {errors.InvFisRegistro?.[index]?.NumeroUnidades && (
                        <span className="text-red-600">{errors.InvFisRegistro?.[index]?.NumeroUnidades?.message}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-1/6 m-auto my-2">
            <button type="submit" className="btn btn-outline btn-primary">
              <FaSave />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
