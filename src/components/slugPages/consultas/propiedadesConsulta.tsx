import { ConsultaFormValues, IConsulta } from "@/interfaces/creation";
import { api_postCotizaciones } from "@/services/bodega.service";
import { api_pdf_consulta, api_putSolicitud } from "@/services/ingreso.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "module";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Select, Table } from "react-daisyui";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaArrowLeft, FaFilePdf, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { z } from "zod";
import Observaciones from "@/components/bodega/persona/observaciones";
import Image from 'next/image'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PDFConsulta from "@/components/pdf/consulta";
import ReactPDF from "@react-pdf/renderer";


interface props {
    solicitud: IConsulta;
    volver: () => void;
}


const SolicitudDetalleSchema = z.object({
    centroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    empresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    articulo: z.object({
        codigo: z.string().optional(),
        id: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
        nombre: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" })
    }),
    cantidad: z.number({ required_error: "Campo requerido", invalid_type_error: "Campo inválido" }).min(1, "Mínimo de 1"),
    cantidadAprobada: z.number().optional(),
    id: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    observaciones: z.string().optional(),
    orden: z.number({ required_error: "Campo requerido", invalid_type_error: "Campo inválido" }),
    solicitudId: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    subFamiliaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
});

const SolicitudConsultaSchema = z.object({
    EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    CentroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    FechaIngreso: z.string({ required_error: "Campo requerido", invalid_type_error: "Campo inválido" }),
    Nombre: z.string({ required_error: "Campo requerido", invalid_type_error: "Opción inválida" }),
    Numero: z.number({ required_error: "Campo requerido", invalid_type_error: "Campo inválido" }),
    ProgramaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Campo inválido" }),
    EstadoSolicitudCodigo: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).min(1).max(2),
    Observaciones: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    SolicitudDetalles: z.array(SolicitudDetalleSchema)
});

export default function PropiedadesConsulta(props: props) {

    const searchParams = useSearchParams();
    const id = searchParams.get('empresa');
    const { jwt } = useUserStore();


    const methodsConsulta = useForm<ConsultaFormValues>({ resolver: zodResolver(SolicitudConsultaSchema), defaultValues: { SolicitudDetalles: [] } })
    const { handleSubmit, setValue, register, getValues, formState: { errors }, control } = methodsConsulta;
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "SolicitudDetalles",
        keyName: "guid"
    });

    const onSubmit = async (data: ConsultaFormValues) => {
        data.EstadoSolicitudCodigo = parseInt(data.EstadoSolicitudCodigo.toString());
        console.log(data);
        try {
            await api_putSolicitud(jwt, data);
            toast.success("Cotización guardada correctamente");


        } catch (error) {
            console.log(error);
            toast.error("Ocurrió un error al guardar la cotización");
        }
    };

    useEffect(() => {
        if (props.solicitud) {
            append(props.solicitud.solicitudDetalles); //POSIBLEMENTE MALO
            // setValue('SolicitudDetalles', props.solicitud.solicitudDetalles);
            setValue('EmpresaId', props.solicitud.empresaId);
            setValue('CentroCostoId', props.solicitud.centroCostoId);
            setValue('Nombre', props.solicitud.nombre);
            setValue('Numero', props.solicitud.numero);
            setValue('ProgramaId', props.solicitud.programaId);
            setValue('Observaciones', props.solicitud.observaciones);
            setValue('FechaIngreso', props.solicitud.fechaIngreso);
        }
    }, [props.solicitud, setValue]);

    useEffect(() => {
        setValue('EmpresaId', id as string)
        console.log("los errores son:" + errors)
    }, [id, errors]);

    const getPDF = async (id:number,guid:string) => {
        // ReactPDF.renderToStream(<PDFConsulta />);
        try {
            const response = await api_pdf_consulta(jwt, id, guid);

            // Crear una URL para el Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            
            // Crear un enlace temporal y simular un clic para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `documento_${id}.pdf`); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            
            // Limpiar el enlace temporal y revocar la URL
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url); // Libera memoria utilizada por el Blob
        } catch (error) {
            console.error('Error al descargar el PDF:', error);

        }
    }
    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)}>



                <div className="flex flex-col md:flex-row lg:flex-row w-full">
                    <label className="py-2 px-3 ml-4">Nombre: </label>
                    <input type="text" {...register("Nombre", {
                        setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue
                    })}
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
                            className="block w-full md:w-20 lg:w-20 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" readOnly />
                        <label className="label text-error">
                            {errors.Numero && (
                                <span>{errors.Numero.message}</span>
                            )}
                        </label>
                    </div>
                    <div className="flex flex-col md:flex-row lg:flex-row w-full">
                        <label className="py-2 px-3 ml-4">Fecha de ingreso: </label>
                        <Controller
                            control={control}
                            name="FechaIngreso" 
                            render={({ field }) => (
                            <DatePicker
                                selected={field.value} 
                                onChange={(date) => field.onChange(date)} 
                                onBlur={field.onBlur} 
                                className="input input-bordered focus:outline-offset-0 w-full"
                                dropdownMode="select"
                                yearDropdownItemNumber={15}
                                peekNextMonth
                                showYearDropdown
                                showMonthDropdown
                                dateFormat={"dd/MM/yyyy"}
                            />
                            )}
                        />
                        {/* <input type="date"
                            {...register("FechaIngreso", {
                                // setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue
                            })}
                            className="block w-full md:w-40 lg:w-40 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" readOnly /> */}
                        <label className="label text-error">
                            {errors.FechaIngreso && (
                                <span>{errors.FechaIngreso.message}</span>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row lg:flex-row w-full mt-2">
                    <label className="py-2 px-3 ml-4">Centro de costo:</label>
                    {/* <Select className="border-primary focus:border-primary active:border-primary" defaultValue={''}
                                    {...register("CentroCostoId", { setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue })} >
                                </Select> */}
                    {errors.CentroCostoId && <span className="text-error">{errors.CentroCostoId.message}</span>}
                </div>


                <div className="flex flex-col md:flex-row lg:flex-row mt-2">
                    <label className="py-2 px-3 ml-4">Programa:</label>
                    <label className="py-2 px-3">{props.solicitud.programa.nombre}</label>
                    <input type="hidden" {...register('ProgramaId',
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
                                value={1}
                                {...register('EstadoSolicitudCodigo', { setValueAs: (value) => value === '' ? undefined : value })}

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
                                value={2}
                                {...register('EstadoSolicitudCodigo', { setValueAs: (value) => value === '' ? undefined : value })}

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

                <div className="flex flex-col md:flex-row lg:flex-row w-full justify-center border-y">
                    <div className="overflow-x-auto shadow-md rounded-md border my-4">
                        <Table /* {...args} */>
                            <Table.Head className="bg-slate-200">
                                <span>Codigo</span>
                                <span>Nombre</span>
                                <span>Cantidad</span>
                                <span>Glosa</span>
                                <span>Acciones</span>
                            </Table.Head>
                            <Table.Body>
                                {fields.map((detalle, index) => (
                                    <Table.Row className="hover:bg-gray-100" key={index}>
                                        <span>{detalle.articulo.codigo}</span>
                                        <span>{detalle.articulo.nombre}</span>
                                        
                                        <span>
                                            <input type="number"
                                                {...register(`SolicitudDetalles.${index}.cantidad`, {
                                                    setValueAs: (defaultValue) => defaultValue === "" ? undefined : Number(defaultValue)
                                                })}
                                                readOnly
                                                className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        </span>
                                        <span>
                                            <input type="text"
                                                readOnly
                                                {...register(`SolicitudDetalles.${index}.observaciones`, {
                                                    setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue
                                                })}
                                                className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        </span>
                                        <span className="flex flex-row justify-center">
                                            <FaTrash className="text-error cursor-pointer hover:font-bold" />
                                        </span>
                                    </Table.Row>
                                ))}
                                <Table.Row className="hover:bg-gray-100">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span className="flex flex-row  justify-center">
                                        <FaPlus className="text-error cursor-pointer hover:font-bold " />
                                    </span>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row lg:flex-row w-full mt-2">
                    <label className="py-2 px-3 ml-4">Observacion:</label>
                    <textarea
                        rows={4}
                        {...register('Observaciones',
                            { setValueAs: (defaultValue) => defaultValue === "" ? undefined : defaultValue })}
                        className="py-2 px-3 w-full border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary "
                        readOnly></textarea>
                    <label className="label text-error">
                        {errors.Observaciones && (
                            <span>{errors.Observaciones.message}</span>
                        )}
                    </label>
                </div>

                <div className="flex flex-col md:flex-row lg:flex-row justify-end w-full mt-2">
                    <button className="btn btn-outline btn-secondary" onClick={props.volver}><FaArrowLeft />Atras</button>
                    {id && <button type="button" onClick={async () => {await getPDF(props.solicitud.numero,id)}} className="btn btn-outline btn-accent my-2 md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Exportar</button>}
                    <button className="btn btn-outline btn-primary" type="submit"><FaSave />Guardar</button>
                </div>

            </form>
        </>
    );
}


