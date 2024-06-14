import { ConsultaFormValues, IConsulta } from "@/interfaces/creation";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "module";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, Table } from "react-daisyui";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaFilePdf, FaPlus, FaSave } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { z } from "zod";

interface props {
    solicitud: IConsulta[] | undefined;
    volver: () => void;
}


const SolicitudDetalleSchema = z.object({
    EmpresaId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    SolicitudId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    AnoNumero: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
    Id: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    CentroCostoId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    SubFamiliaId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    ArticuloId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).min(1, "Minimo de 1").optional(),
    Orden: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
    Codigo: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    nombre: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    Glosa: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
})

const SolicitudConsultaSchema = z.object({
    EmpresaId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    /* AnoNumero: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
    Id: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    SolicitanteId:z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }), */
    CentroCostoId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    FechaIngreso: z.string({ required_error: "Opción inválida", invalid_type_error: "Campo inválido" }),
    Nombre: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
    Numero: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
    ProgramaId: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
    EstadoSolicitudCodigo: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    Observaciones: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    SolicitudDetalles: z.array(SolicitudDetalleSchema)
});

export default function PropiedadesConsulta(props: props) {

    const searchParams = useSearchParams();
    const id = searchParams.get('empresa');


    const methodsConsulta = useForm<ConsultaFormValues>({ resolver: zodResolver(SolicitudConsultaSchema), defaultValues: { SolicitudDetalles: [] } })
    const { handleSubmit, setValue, register, getValues, formState: { errors }, control } = methodsConsulta;

    const onSubmit = (data: ConsultaFormValues) => {
        console.log(data);
    };
    
    useEffect(() => {
        setValue('EmpresaId', id as string)
        console.log(errors)
    }, [errors,id]);


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {props.solicitud?.map((consulta, index) => {
                    // Convertir fechaIngreso a objeto Date
                    const fechaIngresoDate = new Date(consulta.fechaIngreso);

                    return (
                        <div key={index}>
                            <div className="flex flex-col md:flex-row lg:flex-row w-full">
                                <label className="py-2 px-3 ml-4">Nombre: </label>
                                <input type="text" {...register("Nombre", {
                                    setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue
                                })}
                                    defaultValue={consulta.nombre.toUpperCase()}
                                    className="block w-full md:w-1/2 lg:w-1/2 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" readOnly />
                                <label className="label text-error">
                                    {errors.Nombre && (
                                        <span>{errors.Nombre.message}</span>
                                    )}
                                </label>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row justify-between w-full mt-2">
                                <div className="flex flex-col md:flex-row lg:flex-row w-full">
                                    <label className="py-2 px-3 ml-4">Numero: </label>
                                    <input type="number"
                                        {...register("Numero", {
                                            setValueAs: (defaultValue) => defaultValue === "" ? undefined : Number(defaultValue)
                                        })}
                                        defaultValue={consulta.numero}
                                        className="block w-full md:w-20 lg:w-20 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" readOnly />
                                    <label className="label text-error">
                                        {errors.Numero && (
                                            <span>{errors.Numero.message}</span>
                                        )}
                                    </label>
                                </div>
                                <div className="flex flex-col md:flex-row lg:flex-row w-full">
                                    <label className="py-2 px-3 ml-4">Fecha de ingreso: </label>
                                    <input type="date"
                                        {...register("FechaIngreso", {
                                            setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue
                                        })}
                                        defaultValue={fechaIngresoDate.toISOString().split('T')[0]}
                                        className="block w-full md:w-40 lg:w-40 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" readOnly />
                                    <label className="label text-error">
                                        {errors.FechaIngreso && (
                                            <span>{errors.FechaIngreso.message}</span>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row w-full mt-2">
                                <label className="py-2 px-3 ml-4">Centro de costo:</label>
                                <Select className="border-primary focus:border-primary active:border-primary" defaultValue={''}
                                    {...register("CentroCostoId", { setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue })} >
                                    {consulta.solicitudDetalles.map((detalle, detalleIndex) => (
                                        <Select.Option key={detalleIndex} defaultValue={detalle.centroCostoId} selected>
                                            {detalle.centroCosto.nombre}
                                        </Select.Option>
                                    ))}
                                </Select>
                                {errors.CentroCostoId && <span className="text-error">{errors.CentroCostoId.message}</span>}
                            </div>


                            <div className="flex flex-col md:flex-row lg:flex-row mt-2">
                                <label className="py-2 px-3 ml-4">Programa:</label>
                                <label className="py-2 px-3">{consulta.programa.nombre}</label>
                                <input type="hidden" defaultValue={consulta.programaId} {...register('ProgramaId',
                                    { setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue })} readOnly />
                                <label className="label text-error">
                                    {errors.ProgramaId && (
                                        <span>{errors.ProgramaId.message}</span>
                                    )}
                                </label>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row w-full">
                                <label className="py-2 px-3 ml-4">Estado:</label>
                                <div className="flex flex-row">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="radio radio-xs radio-primary ml-2"
                                            defaultValue={1}
                                            {...register('EstadoSolicitudCodigo',
                                                { setValueAs: (defaultValue) => defaultValue === "" ? undefined : Number(defaultValue) })}
                                            name="estado"
                                        />
                                        <span className="ml-2">Aceptado</span>
                                    </label>
                                    <label className="label text-error">
                                        {errors.EstadoSolicitudCodigo && (
                                            <span>{errors.EstadoSolicitudCodigo.message}</span>
                                        )}
                                    </label>

                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="radio radio-xs radio-primary ml-2"
                                            defaultValue={2}
                                            {...register('EstadoSolicitudCodigo',
                                                { setValueAs: (defaultValue) => defaultValue === "" ? undefined : Number(defaultValue) })}
                                            name="estado"

                                        />
                                        <span className="ml-2">Rechazado</span>
                                    </label>
                                    <label className="label text-error">
                                        {errors.EstadoSolicitudCodigo && (
                                            <span>{errors.EstadoSolicitudCodigo.message}</span>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row w-full justify-center border-b mb-4">
                                <button className="btn btn-outline btn-primary mb-4"><FaPlus />Agregar</button>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row w-full justify-center border-b mb-2">
                                <div className="overflow-x-auto shadow-md rounded-md border mb-4">
                                    <Table /* {...args} */>
                                        <Table.Head className="bg-slate-200">
                                            <span>Codigo</span>
                                            <span>Nombre</span>
                                            <span>Cantidad</span>
                                            <span>Glosa</span>
                                            <span>Acciones</span>
                                        </Table.Head>
                                        <Table.Body>
                                            {consulta.solicitudDetalles.map((detalle, detalleIndex) => (
                                                <Table.Row className="hover:bg-gray-100" key={detalleIndex}>
                                                    <span>{detalle.articulo.codigo}</span>
                                                    <span>{detalle.articulo.nombre}</span>
                                                    <span>
                                                        <input type="number"
                                                            defaultValue={detalle.cantidad}
                                                            {...register(`SolicitudDetalles.${detalleIndex}.Cantidad`, {
                                                                setValueAs: (defaultValue) => defaultValue === "" ? undefined : Number(defaultValue)
                                                            })}
                                                            className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                                    </span>
                                                    <span>
                                                        <input type="text"
                                                            defaultValue={detalle.observaciones}
                                                            {...register(`SolicitudDetalles.${detalleIndex}.Observaciones`, {
                                                                setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue
                                                            })}
                                                            className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                                    </span>
                                                    <span><FaCircleXmark className="text-error cursor-pointer hover:font-bold" /></span>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row w-full mt-2">
                                <label className="py-2 px-3 ml-4">Observacion:</label>
                                <textarea
                                    rows={4}
                                    defaultValue={consulta.observaciones}
                                    {...register('Observaciones',
                                        { setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue })}
                                    className="py-2 px-3 w-full border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary "></textarea>
                                <label className="label text-error">
                                    {errors.Observaciones && (
                                        <span>{errors.Observaciones.message}</span>
                                    )}
                                </label>
                            </div>

                            <div className="flex flex-col md:flex-row lg:flex-row justify-end w-full mt-2">
                                <button className="btn btn-outline btn-secondary" onClick={props.volver}><FaArrowLeft />Atras</button>
                                <button className="btn btn-outline btn-accent my-2 md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Exportar</button>
                                <button className="btn btn-outline btn-primary" type="submit"><FaSave />Guardar</button>

                            </div>
                        </div>
                    );
                })}
            </form>
        </>
    );
}
