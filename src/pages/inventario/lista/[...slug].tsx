import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import router from "next/router";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllAlmacenByEmpByCenByBodPage,
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
import { useFieldArray, useForm, Controller } from "react-hook-form";
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

  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });

  const [page, setPage] = useState<number>(1);
  const getAlmacens = async () => {
    const alm = await api_getAllAlmacenByEmpByCenByBodPage(
      jwt,
      empresa,
      centrocosto,
      bodega,
      page
    );
    setMeta({
      total: alm.data.total,
      pages: alm.data.pages,
    });
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
  }, [router.query, page]);

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

  // const [dataFuncionario, setDataFuncionario] = useState<IFuncionarioEmpresa[]>([]);
  // const getFuncionarios = async () => {
  //   try {
  //     const data = await api_getAllPersonasByEmpresa(jwt, empresa);
  //     setDataFuncionario(data.data.dataList);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [dataPersona, setDataPersona] = useState<IFuncionarioEmpresa[]>([]);
  const [funcionarioSearch, setFuncionarioSearch] = useState("");
  const getFuncionarios = async (search: string) => {
    try {
      if (search.length >= 8) {
        const data = await api_getAllPersonasByEmpresa(jwt, empresa as string, search);
        setDataPersona(data.data.dataList);
      }
      // Ya no limpiamos dataPersona aquí
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (funcionarioSearch.length >= 8) {
        getFuncionarios(funcionarioSearch);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [funcionarioSearch]);


  useEffect(() => {
    if (!empresa) return;
    getInvFisEstado();
    getPrograma();
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
                  funcionario={dataPersona}
                  funcionarioSearch={funcionarioSearch}
                  setFuncionarioSearch={setFuncionarioSearch}
                />
              ))}
              <AlmacenPagination
                page={page}
                totalPages={meta.pages}
                setPage={setPage}
              />
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

function AlmacenPagination({
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
          className="btn btn-primary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Página anterior
        </button>
        <div className="text-lg text-accent">
          Página {page} de {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-primary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Próxima página
        </button>
      </div>
    </div>
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
  funcionarioSearch: string;
  setFuncionarioSearch: (value: string) => void;
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
  const [currentLocPage, setCurrentLocPage] = useState(1);
  const locationsPerPage = 1;
  const [metaLocaciones, setMetaLocaciones] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [currentLocations, setCurrentLocations] = useState<IAllLocations[]>([]);

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

  useEffect(() => {
    if (!props.almacen.locacions || !almacenArituclos.length) {
      setMetaLocaciones({ total: 0, pages: 0 });
      setCurrentLocations([]);
      return;
    }

    const locationsWithArticles = props.almacen.locacions.filter(
      location => almacenArituclos.some(art => art.locacion === location.id)
    );

    setMetaLocaciones({
      total: locationsWithArticles.length,
      pages: Math.ceil(locationsWithArticles.length / locationsPerPage)
    });

    // Calcular locaciones para la página actual
    const indexOfLastLoc = currentLocPage * locationsPerPage;
    const indexOfFirstLoc = indexOfLastLoc - locationsPerPage;
    setCurrentLocations(locationsWithArticles.slice(indexOfFirstLoc, indexOfLastLoc));

  }, [props.almacen.locacions, almacenArituclos, currentLocPage]);

  return (
    <>
      <div className="flex flex-col border rounded shadow-md mt-2">
        <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-t-lg">
          <h3 className="text-large font-bold text-base-100 text-center">
            {props.almacen.nombre}
          </h3>
        </div>
        <div className="w-full grid grid-cols-1 gap-4 p-2">
          {!props.almacen.locacions || props.almacen.locacions.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-lg font-semibold">Sin locaciones disponibles</p>
                <p className="text-sm mt-2">Este almacén no tiene locaciones asignadas</p>
              </div>
            </div>
          ) : metaLocaciones.total === 0 ? (
            <div className="text-center py-4 text-gray-600">
              <div className="bg-gray-100 rounded-lg p-6">
                <p className="text-lg font-semibold">Sin artículos en las locaciones</p>
                <p className="text-sm mt-2">Las locaciones de este almacén no contienen artículos</p>
              </div>
            </div>
          ) : (
            <>
              {currentLocations.map((locacion) => (
                <ViewLocation
                  key={locacion.id}
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
                  funcionarioSearch={props.funcionarioSearch}
                  setFuncionarioSearch={props.setFuncionarioSearch}
                />
              ))}
              {metaLocaciones.total > 0 && (
                <LocationPagination
                  page={currentLocPage}
                  totalPages={metaLocaciones.pages}
                  setPage={setCurrentLocPage}
                  meta={metaLocaciones}
                  almacenName={props.almacen.nombre}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function LocationPagination({
  totalPages,
  page,
  setPage,
  meta,
  almacenName
}: {
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  meta: { total: number; pages: number };
  almacenName: string;
}) {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn btn-secondary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Locación anterior
        </button>
        <div className="text-lg text-accent">
          Locación {page} de {meta.pages}
          <div className="text-sm text-gray-500">
            Total de locaciones: {meta.total}
          </div>
        </div>
        <button
          disabled={page === meta.pages}
          onClick={() => setPage(page + 1)}
          className="btn btn-secondary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Siguiente locación
        </button>
      </div>
    </div>
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
  funcionarioSearch: string;
  setFuncionarioSearch: (value: string) => void;
}) {
  const [currentArticlePage, setCurrentArticlePage] = useState(1);
  const articlesPerPage = 10;
  const [selectedPersona, setSelectedPersona] = useState<IPersona | null>(null);

  const indexOfLastArticle = currentArticlePage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = props.articulos.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalArticlePages = Math.ceil(props.articulos.length / articlesPerPage);

  const ValidationSchema = z.object({
    EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    PersonaConteoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    SubFamiliaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    ArticuloId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    MarcaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido" }),
    EstadoCodigo: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo Invalido", }),
    AnoNumero: z.number(),
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
    InvFisRegistro: currentArticles.map((articulo) => ({
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

  useEffect(() => {
    reset(defaultValues);
  }, [currentArticlePage]);



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
  };





  return (
    <>
      <div className="flex flex-col border rounded shadow-md mt-2">
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
                {fields.map((field, index) => {
                  const articulo = currentArticles[index];
                  return (
                    <tr className="hover" key={field.id}>
                      <th>{indexOfFirstArticle + index + 1}</th>

                      <td>{articulo?.nombre}</td>

                      <td>
                        {articulo?.familia}
                        <br />
                        {articulo?.subfamilia}
                      </td>

                      <td className="font-bold">{articulo?.cantidad}</td>

                      <td>{articulo?.anoNumero}</td>

                      <td>
                        <Controller
                          control={control}
                          name={`InvFisRegistro.${index}.PersonaConteoId`}
                          render={({ field }) => (
                            <Select
                              {...field}
                              onInputChange={(newValue) => {
                                props.setFuncionarioSearch(newValue);
                              }}
                              className="w-full "
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  width: '100%',
                                  minWidth: '200px', // Ajusta este valor según tus necesidades
                                }),
                                container: (provided) => ({
                                  ...provided,
                                  width: '100%',
                                }),
                              }}
                              placeholder="Rut formato 12123123-1"
                              getOptionValue={(option) => option.funcionarioId}
                              getOptionLabel={(option) =>
                                option.persona.apellidoMaterno
                                  ? `${option.persona.apellidoPaterno} ${option.persona.apellidoMaterno} ${option.persona.nombres}`
                                  : `${option.persona.apellidoPaterno} ${option.persona.nombres}`
                              }
                              options={props.funcionario || []}
                              onChange={(option) => {
                                field.onChange(option?.funcionarioId);
                              }}
                              value={props.funcionario?.find(persona => persona.funcionarioId === field.value)}
                              menuPortalTarget={document.body}
                              isClearable
                              loadingMessage={() => "Cargando..."}
                              isLoading={props.funcionarioSearch.length >= 8 && props.funcionario.length === 0}
                              noOptionsMessage={({ inputValue }) =>
                                inputValue.length < 8
                                  ? "Ingrese al menos 8 caracteres"
                                  : "No se encontraron resultados"
                              }
                              filterOption={null}
                            />
                          )}
                        />
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
                  )
                })}
              </tbody>
            </table>
            {/* Paginación de Artículos */}
            <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
                <button
                  type="button"
                  disabled={currentArticlePage === 1}
                  onClick={() => setCurrentArticlePage(prev => prev - 1)}
                  className="btn btn-accent btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="text-lg text-accent">
                  Página {currentArticlePage} de {totalArticlePages}
                  <div className="text-sm text-gray-500">
                    Total de artículos: {props.articulos.length}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={currentArticlePage === totalArticlePages}
                  onClick={() => setCurrentArticlePage(prev => prev + 1)}
                  className="btn btn-accent btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
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
