import { IBodega, ICentroCosto, IPersona } from "@/interfaces/creation";
import { IAlmacen, IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { api_getAllAlmacenArticuloByEmpByCenByBodByAlm, api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllCentroCostoByEmpresa, api_getAllPersonas, api_postPersonas } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import { IFuncionarioEmpresa } from "@/interfaces/inventario.interface";
import { api_getAllPersonasByEmpresa } from "@/services/inventario.service";
import { Button, Input, Modal, Table } from "react-daisyui";
import { useMixStore } from "@/store/mix.store";
import { useQuery } from "react-query";
import { api_getSexos } from "@/services/tipos.service";
import { toast } from "react-toastify";
import router from "next/router";
import { FaSave } from "react-icons/fa";
import WarningAlert from "@/components/alerts/warningAlert";



interface FormValueGuiaSalidaDetalle {
    EmpresaId: string;
    CentroCostoId: string;
    BodegaId: string;
    AlmacenId: string;
    FuncionarioEntregaId: string;
    PersonaRecibeId: string;
    MotivoSalida: string;
    Observacion: string;
    //GuiaSalidaDetalle
}

export default function Salidas() {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Salidas");
    }, []);
    const { jwt } = useUserStore();
    const searchParams = useSearchParams();
    const search = searchParams.get("empresa");
    const idEmpresa = String(search); // Convertir a cadena

    const [dataCc, setDataCc] = useState<ICentroCosto[]>();
    const getCentroCostos = async () => {
        try {
            const cc = await api_getAllCentroCostoByEmpresa(jwt, idEmpresa);
            setDataCc(cc.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    const [dataFuncionario, setDataFuncionario] = useState<IFuncionarioEmpresa[]>();
    const getFuncionarios = async () => {
        try {
            const data = await api_getAllPersonasByEmpresa(jwt, idEmpresa);
            setDataFuncionario(data.data.dataList);
        } catch (error) {
            console.log(error);
        }
    };
    const [dataPersona, setDataPersona] = useState<IPersona[]>();
    const getPersonas = async () => {
        try {
            const data = await api_getAllPersonas(jwt);
            setDataPersona(data.data.dataList);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa) return;
        getCentroCostos();
        getFuncionarios();
        getPersonas();
    }, [idEmpresa]);

    const GuiaSalida = z.object({
        EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CentroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        AlmacenId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        FuncionarioEntregaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        PersonaRecibeId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        MotivoSalida: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        Observacion: z.string({ invalid_type_error: "Tipo invalido" }).optional()
        /* GuiaSalidaDetalle:z.array(GuiSalidaDetalles) */
    });

    const methods = useForm<FormValueGuiaSalidaDetalle>({ resolver: zodResolver(GuiaSalida)/* ,defaultValues:{GuiaSalidaDetalle:[]} */ });
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset, control } = methods;

    useEffect(() => {
        console.log('codigo errores: ', errors)
    }, [errors]);

    const onSubmit = async (data: FormValueGuiaSalidaDetalle) => {
        console.log(data);
    }

    const CCId = watch('CentroCostoId');
    const bodegaId = watch('BodegaId');
    const almacenId = watch('AlmacenId');

    const [dataBodega, setDataBodega] = useState<IBodega[]>();
    const getBodegas = async () => {
        try {
            const bodega = await api_getAllBodegaByEmpresaYCentroCosto(jwt, idEmpresa, CCId);
            setDataBodega(bodega.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCId) return;
        getBodegas();
    }, [idEmpresa, CCId]);

    const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
    const getAllAlmacenByEmpByCenByBod = async () => {
        try {
            const data = await api_getAllAlmacenByEmpByCenByBod(jwt, idEmpresa, CCId, bodegaId);
            setDataAlmacen(data.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCId || !bodegaId) return;
        getAllAlmacenByEmpByCenByBod();
    }, [idEmpresa, CCId, bodegaId]);

    const modalRef = useRef<HTMLDialogElement>(null);

    const handleShowModal = useCallback(() => {
        modalRef.current?.showModal();
    }, []);
    
    // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    //     control,
    //     name: "ParteSalida",
    // });
    const [dataAlmacenArticulo, setDataAlmacenArticulo] = useState<IAlmacenArticulo[]>([]);
    const getAllAlmacenArticuloByEmpByCenByBodByAlm = async () => {
        try {
            const data = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(jwt, idEmpresa, CCId, bodegaId, almacenId);
            setDataAlmacenArticulo(data.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCId || !bodegaId || !almacenId) return;
        getAllAlmacenArticuloByEmpByCenByBodByAlm();
    }, [idEmpresa, CCId, bodegaId, almacenId]);


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-3/4 border shadow-md grid md:grid-cols-12 rounded-md p-4 gap-4 mx-auto">
                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Centro costo" className="label font-semibold tex-left">Centro Costo*</label>
                            <select className="select select-primary"
                                {...register('CentroCostoId', { setValueAs: (value) => value === '' ? undefined : value })}>
                                <option value='' selected disabled>Seleccione una opcion: </option>
                                {dataCc?.map((cc, index) => (
                                    <option value={cc.id}>{cc.nombre}</option>
                                ))}
                            </select>
                            {errors.CentroCostoId && (
                                <span className="text-red-600 block">
                                    {errors.CentroCostoId.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Bodega" className="label font-semibold tex-left">Bodega*</label>
                            <select className="select select-primary"
                                {...register('BodegaId', { setValueAs: (value) => value === '' ? undefined : value })}>
                                <option value='' selected disabled>Seleccione una opcion: </option>
                                {dataBodega?.map((bodega, index) => (
                                    <option value={bodega.id}>{bodega.nombre}</option>
                                ))}
                            </select>
                            {errors.BodegaId && (
                                <span className="text-red-600 block">
                                    {errors.BodegaId.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Almacen" className="label font-semibold tex-left">Almacen*</label>
                            <select className="select select-primary"
                                {...register('AlmacenId', { setValueAs: (value) => value === '' ? undefined : value })}>
                                <option value='' selected disabled>Seleccione una opcion: </option>
                                {dataAlmacen.map((almacen, index) => (
                                    <option value={almacen.id}>{almacen.nombre}</option>
                                ))}
                            </select>
                            {errors.AlmacenId && (
                                <span className="text-red-600 block">
                                    {errors.AlmacenId.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Encargado" className="label font-semibold tex-left">Encargado*</label>
                            <Controller
                                control={control}
                                name="FuncionarioEntregaId"
                                render={({ field: { onChange, value, name, ref } }) => (
                                    <Select
                                        className="border-2 border-primary rounded-md"
                                        placeholder="Rut formato 12123123-1"
                                        getOptionValue={(option) => option.persona.runCuerpo + "-" + option?.persona.runDigito || ""}
                                        getOptionLabel={(option) => option.persona.nombres + " " + option.persona.apellidoPaterno}
                                        value={dataFuncionario?.find((e) => e.persona.id === value)}
                                        options={dataFuncionario}
                                        onChange={(val) =>
                                            setValue("FuncionarioEntregaId", val?.persona.id as string)
                                        }
                                        menuPortalTarget={document.body}
                                        loadingMessage={() => "Cargando opciones..."}
                                        isLoading={dataFuncionario?.length === 0}
                                        isClearable
                                    />
                                )}
                            />
                            {errors.FuncionarioEntregaId && (
                                <span className="text-red-600 block">
                                    {errors.FuncionarioEntregaId.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Recibe" className="label font-semibold tex-left">Destinatario*</label>
                            <Controller
                                control={control}
                                name="PersonaRecibeId"
                                render={({ field: { onChange, value, name, ref } }) => (
                                    <Select
                                        className="border-2 border-primary rounded-md"
                                        placeholder="Rut formato 12123123-1"
                                        getOptionValue={(option) => option.runCuerpo + "-" + option.runDigito || ""}
                                        getOptionLabel={(option) => option.nombres + " " + option.apellidoPaterno}
                                        value={dataPersona?.find((e) => e.id === value)}
                                        options={dataPersona}
                                        onChange={(val) =>
                                            setValue("PersonaRecibeId", val?.id as string)
                                        }
                                        menuPortalTarget={document.body}
                                        loadingMessage={() => "Cargando opciones..."}
                                        isLoading={dataPersona?.length === 0}
                                        isClearable
                                    />
                                )}
                            />
                            {errors.PersonaRecibeId && (
                                <span className="text-red-600 block">
                                    {errors.PersonaRecibeId.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="flex flex-col items-center">
                            <label htmlFor="nuevo usuario" className="label font-semibold tex-left">¿No has encontrado al destinatario?</label>
                            <button type="button" onClick={handleShowModal} className="btn btn-primary btn-outline w-1/2 my-0">Añadir Destinario</button>                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Motivo de la salida" className="label font-semibold tex-left">Motivo de la salida*</label>
                            <textarea rows={2}
                                {...register('MotivoSalida', { setValueAs: (value) => value === "" ? undefined : value })}
                                placeholder="Porfavor ingrese el motivo..." className="textarea textarea-primary w-full" />
                            {errors.MotivoSalida && (
                                <span className="text-red-600 block">
                                    {errors.MotivoSalida.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Observacion" className="label font-semibold tex-left">Observaciones</label>
                            <textarea rows={2}
                                {...register('Observacion')}
                                className="textarea textarea-primary w-full" />
                        </div>
                    </div>

                    <div className="col-span-12 ">
                    <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-2">
                        {almacenId && dataAlmacenArticulo.length > 0 ? (
                            <Table className='border shadow-lg'>
                                <Table.Head className="bg-primary text-white">
                                    <span>Selección</span>
                                    <span>Código artículo</span>
                                    <span>Código familia</span>
                                    <span>Familia</span>
                                    <span>Código sub-familia</span>
                                    <span>Sub-familia</span>
                                    <span>Descripción artículo</span>
                                    <span>Cantidad sistema</span>
                                    <span>Cantidad salida</span>

                                </Table.Head>
                                <Table.Body>
                                    {dataAlmacenArticulo.map((almacenArticulo, index) => {
                                        //const fieldsIndex = fields.findIndex((field) => field.ArticuloId === almacenArticulo.articuloId);
                                        return (
                                            <Table.Row key={index} hover={true}>
                                                {/* <input
                                                    type="checkbox"
                                                    defaultChecked={false}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            append({
                                                                AlmacenId: almacenArticulo.almacenId,
                                                                ArticuloId: almacenArticulo.articuloId,
                                                                Cantidad: 0,
                                                                CodigoArticulo: almacenArticulo.articulo.codigo,
                                                                CodigoFamilia: almacenArticulo.articulo.subFamilium.familium.codigo,
                                                                Familia: almacenArticulo.articulo.subFamilium.familium.nombre,
                                                                CodigoSubFamilia: almacenArticulo.articulo.subFamilium.codigo,
                                                                SubFamilia: almacenArticulo.articulo.subFamilium.nombre,
                                                                DescripcionArticulo: almacenArticulo.articulo.descripcion
                                                            });
                                                        } else {
                                                            remove(fieldsIndex);
                                                        }
                                                    }}
                                                /> */}
                                                <span>{almacenArticulo.articulo.codigo}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.familium.codigo}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.familium.nombre}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.codigo}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.nombre}</span>
                                                <span>{almacenArticulo.articulo.descripcion}</span>
                                                <span>{almacenArticulo.cantidad}</span>
                                                {/* {fields.find((field, fieldIndex) => fieldIndex === fieldsIndex) ? (
                                                    <input
                                                        type="number"
                                                        {...register(`ParteSalida.${fieldsIndex}.Cantidad`, {
                                                            setValueAs: (value) => value === "" ? undefined : Number(value)
                                                        })}
                                                        className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                ) : (
                                                    <></>
                                                )} */}
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        ) : almacenId && dataAlmacenArticulo.length === 0 ? (
                            <WarningAlert message={"No hay artículos disponibles en este almacén"} />
                        ) : (
                            <></>
                        )}
                    </div>
                    </div>

                    <div className="col-span-4 ">
                        <div className="flex flex-col ">
                            <button className="btn btn-primary btn-outline"><FaSave/>Guardar</button>
                        </div>
                    </div>
                </div>
            </form>
            <ModalPersonaRecibe modalRef={modalRef} actualizarPersonas={getPersonas} />
        </>
    )
}

interface ModalPersonaRecibeProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    actualizarPersonas: () => Promise<void>;
}

interface FormModalPersona {
    RunCuerpo: number;
    RunDigito: string;
    Nombres: string;
    ApellidoPaterno: string;
    SexoCodigo: number;
    Email: string;
    Celular: number;
}

function ModalPersonaRecibe({ modalRef, actualizarPersonas }: ModalPersonaRecibeProps) {
    const { jwt } = useUserStore();

    const schema = z.object({
        RunCuerpo: z.number({ required_error: 'Campo requerido', }),
        RunDigito: z.string({ required_error: 'Campo requerido' }),
        Nombres: z.string({ required_error: 'Campo requerido' }),
        ApellidoPaterno: z.string({ required_error: 'Campo requerido' }),
        SexoCodigo: z.number({ required_error: 'Campo requerido' }),
        Email: z.string().optional(),
        Celular: z.number().optional()
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormModalPersona>({
        resolver: zodResolver(schema)
    });



    const { sexos, setSexos } = useMixStore();
    const Query = useQuery("sexos", () => api_getSexos(jwt), {
        enabled: useMixStore.getState().sexos.length === 0,
        onSuccess: (data) => {
            setSexos(data.data.dataList);
        },
    });

    const handleRunCuerpoChange = (e: any) => {
        const value = e.target.value;
        const truncatedValue = value.replace(/\D/g, '').slice(0, 8);
        if (truncatedValue.length < value.length) {
            e.target.value = truncatedValue;
        }
    };

    const handleRunDigitoChange = (e: any) => {
        let value = e.target.value.toUpperCase(); // Convertimos a mayúscula para simplificar la validación
        value = value.replace(/[^0-9K]/g, '').slice(0, 1);  // Solo números o 'K'
        e.target.value = value;
    };

    const handleCelularChange = (e: any) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, '').slice(0, 9); // Solo 0-9 y '+', máximo 12 caracteres
        e.target.value = value;
    };

    const [rutValido, setRutValido] = useState(true);

    const validarRut = (rutCuerpo: number, rutDigito: string) => {
        // Convierte el cuerpo del RUT a string y elimina puntos y guiones
        const rut = rutCuerpo.toString().replace(/[\.-]/g, '');

        // Obtiene el dígito verificador ingresado
        const dv = rutDigito.toUpperCase();

        // Calcula el dígito verificador
        let suma = 0;
        let multiplicador = 2;

        for (let i = rut.length - 1; i >= 0; i--) {
            suma += parseInt(rut.charAt(i)) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        let dvCalculado: number | string = 11 - (suma % 11);
        dvCalculado = dvCalculado === 11 ? 0 : dvCalculado === 10 ? 'K' : dvCalculado;

        // Compara el dígito verificador calculado con el ingresado
        return dvCalculado.toString() === dv;
    };

    const onSubmit = async (data: FormModalPersona) => {
        try {
            if (!validarRut(data.RunCuerpo, data.RunDigito)) {
                setRutValido(false);
                toast.error("Rut chileno invalido.")
                return; // No se envía el formulario si el RUT es inválido
            }
            setRutValido(true);
            await api_postPersonas(jwt, data);
            toast.success('Destinatario agregado con exito.');
            reset();
            modalRef.current?.close();
            actualizarPersonas();  //para actualizar la data de personas se vuelve a llamar.
        } catch (error) {
            console.error('Error al guardar la persona:', error);
        }
    };

    return (
        <>
            <Modal ref={modalRef}>
                <Modal.Header className="font-bold">Agregar Persona</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2">
                            <div className="flex flex-col mr-1">
                                <label htmlFor="RunCuerpo" className="label">RUN Cuerpo: *</label>
                                <div className="flex flex-col">
                                    <input
                                        type="number"
                                        placeholder="Ej: 20111111"
                                        {...register('RunCuerpo', { setValueAs: (value) => value === "" ? undefined : parseInt(value) })}
                                        className="input input-primary w-full"
                                        onChange={handleRunCuerpoChange} />
                                    {errors.RunCuerpo && <p className="text-red-500 text-xs mt-1">{errors.RunCuerpo.message}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col ml-1">
                                <label htmlFor="RunDigito" className="label md:text-right">RUN Dígito: *</label>
                                <div className="flex flex-col">
                                    <Input
                                        type="text"
                                        placeholder="Ej: 7"
                                        {...register('RunDigito', { setValueAs: (value) => value === "" ? undefined : value })} className="input input-primary"
                                        onChange={handleRunDigitoChange} />
                                    {errors.RunDigito && <p className="text-red-500 text-xs mt-1">{errors.RunDigito.message}</p>}
                                </div>
                            </div>
                            {
                                !rutValido && (
                                    <p className="col-span-2 text-red-500 text-xs mt-1">
                                        El RUT ingresado no es válido.
                                    </p>
                                )
                            }
                            <div className="flex flex-col mr-1">
                                <label htmlFor="Nombres" className="label">Nombres: *</label>
                                <Input type="text" {...register('Nombres', { setValueAs: (value) => value === "" ? undefined : value })} className="input input-primary input-bordered w-full" />
                                {errors.Nombres && <p className="text-red-500 text-xs mt-1">{errors.Nombres.message}</p>}
                            </div>
                            <div className="flex flex-col ml-1">
                                <label htmlFor="ApellidoPaterno" className="label">Apellido Paterno: *</label>
                                <Input type="text" {...register('ApellidoPaterno', { setValueAs: (value) => value === "" ? undefined : value })} className="input input-primary input-bordered w-full" />
                                {errors.ApellidoPaterno && <p className="text-red-500 text-xs mt-1">{errors.ApellidoPaterno.message}</p>}
                            </div>
                            <div className="flex flex-col mr-1">
                                <label htmlFor="SexoCodigo" className="label">Seleccione su sexo: *</label>
                                <select className="select select-primary w-full"  {...register('SexoCodigo', { setValueAs: (value) => value === "" ? undefined : parseInt(value) })}>
                                    <option value="" selected disabled>Selecione una opcion</option>
                                    {sexos.map((e, index) => (
                                        <option key={index} value={e.codigo}>{e.nombre}</option>
                                    ))}
                                </select>
                                {errors.SexoCodigo && <p className="text-red-500 text-xs mt-1">{errors.SexoCodigo.message}</p>}
                            </div>
                            <div className="flex flex-col ml-1">
                                <label htmlFor="Email" className="label">Email: </label>
                                <Input type="text" {...register('Email')} className="input input-primary input-bordered w-full" />
                                {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email.message}</p>}
                            </div>
                            <div className="flex flex-col mr-1">
                                <label htmlFor="Celular" className="label">Celular: </label>
                                <Input
                                    type="number"
                                    {...register('Celular', { setValueAs: (value) => value === "" ? undefined : parseInt(value) })}
                                    placeholder="Formato 925789405"
                                    onChange={handleCelularChange}
                                    className="input input-primary input-bordered w-full" />
                                {errors.Celular && <p className="text-red-500 text-xs mt-1">{errors.Celular.message}</p>}
                            </div>
                        </div>
                        <div className="modal-action">
                            <Button type="submit" className="btn btn-primary">Guardar</Button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Actions>
                    <form method="dialog">
                        <Button>Cerrar</Button>
                    </form>
                </Modal.Actions>
            </Modal>
        </>
    );
}