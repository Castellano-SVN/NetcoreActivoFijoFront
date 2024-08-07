import PDFSinOrden from "@/components/pdf/recepcion/recepcionSinOrden";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect } from "react";
import { Table } from "react-daisyui";
import { FaFilePdf } from "react-icons/fa";
import { FormValueRecepcionData, FormValueRecepcionSoData, ICotizacion } from "@/interfaces/creation";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import router from "next/router";
import DatePicker from "react-datepicker";
import { api_postRecepcionYDetalle } from "@/services/bodega.service";
import { toast } from "react-toastify";
interface props {
    dataSinOrdenCompra: ICotizacion[];
}

export default function SinOrden(props: props) {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Recepcion");
    }, []);
    const data = props.dataSinOrdenCompra;
    const searchParams = useSearchParams();
    const idEmpresa = searchParams.get('empresa');
    const { jwt } = useUserStore();
    

    useEffect(()=>{
        console.log(jwt);
    },[])

    const RecepcionDataSchema = z.object({
        Recepcion: z.object({
            CotizacionId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            AnoNumero: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).int(),
            CentroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            BodegaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            FuncionarioId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            TipoDocumentoRecepcionCodigo: z.string({ required_error: "Selecciona una opción", invalid_type_error: "Tipo inválido" }),
            NumeroDocumento: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).int(),
            FechaIngreso: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            FechaRecepcion: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            Observaciones: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            NumeroRecepcion: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            FechaDocumento: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            Nula: z.boolean().default(false),
        }),
        RecepcionDetalle: z.array(
            z.object({
                CotizacionId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                CotizacionDetalleId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                AnoNumero: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).int(),
                Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).min(1, { message: "campo debe ser mayor a 0" }),
                Observaciones: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            })
        ),
    });
    const methods = useForm<FormValueRecepcionSoData>({
        resolver: zodResolver(RecepcionDataSchema),
    });

    const { register, handleSubmit, formState: { errors }, control, setValue } = methods;

    useEffect(() => {
        try {
            if (data) {
                data.map((cotizacion) => {
                    setValue('Recepcion.CotizacionId', cotizacion.id);
                    setValue('Recepcion.EmpresaId', cotizacion.empresaId);
                    setValue('Recepcion.AnoNumero', cotizacion.anoNumero);
                    setValue('Recepcion.FuncionarioId', cotizacion.cotizacionDetalles[0].solicitudDetalle.solicitud.funcionarioEmpresa.funcionarioId);
                    const fecha = new Date(cotizacion.fechaIngreso);
                    setValue('Recepcion.FechaIngreso', fecha);
                    setValue('Recepcion.Observaciones', "");
                });

                const recepcionDetalle = data.map((cotizacion) => ({
                    CotizacionId: cotizacion.id,
                    EmpresaId: cotizacion.empresaId,
                    AnoNumero: cotizacion.anoNumero,
                    CotizacionDetalleId: cotizacion.cotizacionDetalles
                        .map((detalle) => detalle.id)
                        .join(','),
                    Cantidad: 0,
                    Observaciones: '',
                }));

                setValue('RecepcionDetalle', recepcionDetalle);
            }
        } catch (error) {
            console.log(error);
        };
    }, [data, setValue]);

    const onSubmit = async (data: FormValueRecepcionSoData) => {
        try {
            data.Recepcion.TipoDocumentoRecepcionCodigo = parseInt(data.Recepcion.TipoDocumentoRecepcionCodigo.toString());
            console.log('Datos enviados:', data);
            const response = await api_postRecepcionYDetalle(jwt, data);
            if (response) {
                toast.success("Articulo/s recepcionado/s correctamente")
            }
        } catch (error) {
            console.error('Error al guardar la data:', error);
            toast.error('ha ocurrido un al recepcionar');
        }
    };

    return (
        <div className="flex justify-center items-cente">
            <form onSubmit={handleSubmit(onSubmit)}>
                {data.map((sinOrden, index) => (
                    <div className="p-6 bg-white rounded w-full max-w-3xl">
                        <h1 className="text-2xl font-bold mb-4">Recepción de Artículos sin orden de compra</h1>
                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                            <div>
                                <label className="block text-left mb-2" htmlFor="Folio Recepcion">Folio Recepcion:</label>
                                <input type="number"
                                    {...register("Recepcion.NumeroRecepcion", { setValueAs: (value) => value === '' ? undefined : Number(value) })}
                                    className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                {errors.Recepcion?.NumeroRecepcion && <span className="text-red-600">{errors.Recepcion.NumeroRecepcion.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-left mb-2" >Fecha recepcion:</label>

                                <Controller
                                    control={control}
                                    name="Recepcion.FechaRecepcion"
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            onBlur={field.onBlur}
                                            className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            dropdownMode="select"
                                            yearDropdownItemNumber={15}
                                            peekNextMonth
                                            showYearDropdown
                                            showMonthDropdown
                                            dateFormat={"dd/MM/yyyy"}
                                        />
                                    )}
                                />
                                {errors.Recepcion?.FechaRecepcion && <span className="text-red-600">{errors.Recepcion.FechaRecepcion.message}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                            <div>
                                <label className="block text-left mb-2" htmlFor="centroDeCosto">Centro de costo:</label>
                                <select {...register("Recepcion.CentroCostoId", { setValueAs: (value) => value === '' ? undefined : value })} className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    <option key={0} value={0} disabled>Seleccione una opción</option>

                                    {sinOrden.cotizacionDetalles.map((cotizacion, cotizacionIndex) => (
                                        <option key={cotizacionIndex} value={cotizacion.solicitudDetalle.centroCosto.id}>
                                            {cotizacion.solicitudDetalle.centroCosto.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.Recepcion?.CentroCostoId && <span className="text-red-600">{errors.Recepcion.CentroCostoId.message}</span>}
                            </div>
                            <div>
                                <label className="block text-left mb-2" htmlFor="bodega">Bodega:</label>
                                <select {...register("Recepcion.BodegaId", { setValueAs: (value) => value === '' ? undefined : value })} className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    <option key={0} value={0} disabled>Seleccione una opción</option>

                                    {sinOrden.cotizacionDetalles.map((cotizacion, cotizacionIndex) => (
                                        cotizacion.solicitudDetalle.centroCosto.bodegas.map((bodegas, bodegaIndex) => (

                                            <option key={`${cotizacionIndex}-${bodegaIndex}`} value={bodegas.id}>
                                                {bodegas.nombre}
                                            </option>
                                        ))))}
                                </select>
                                {errors.Recepcion?.BodegaId && <span className="text-red-600">{errors.Recepcion.BodegaId.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">

                            <div>
                                <label className="block text-left mb-2" htmlFor="numeroDocumento">Número documento:</label>
                                <input type="number"
                                    {...register("Recepcion.NumeroDocumento", { setValueAs: (value) => value === '' ? undefined : Number(value) })}
                                    className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                {errors.Recepcion?.NumeroDocumento && <span className="text-red-600">{errors.Recepcion.NumeroDocumento.message}</span>}
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-left mb-2" htmlFor="fechaDocumento">Fecha de documento:</label>
                                <Controller
                                    control={control}
                                    name="Recepcion.FechaDocumento"
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            onBlur={field.onBlur}
                                            className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            dropdownMode="select"
                                            yearDropdownItemNumber={15}
                                            peekNextMonth
                                            showYearDropdown
                                            showMonthDropdown
                                            dateFormat={"dd/MM/yyyy"}
                                        />
                                    )}
                                />
                                {errors.Recepcion?.FechaDocumento && <span className="text-red-600">{errors.Recepcion.FechaDocumento.message}</span>}
                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-center">Tipo de documento:</label>
                                <div className="flex justify-center">
                                    <label className="mr-4">
                                        <input type="radio" {...register("Recepcion.TipoDocumentoRecepcionCodigo", { setValueAs: (value) => value === '' ? undefined : value })} value={1} className="radio radio-xs radio-primary ml-2 mr-2" />
                                        Factura
                                    </label>
                                    <label>
                                        <input type="radio"  {...register("Recepcion.TipoDocumentoRecepcionCodigo", { setValueAs: (value) => value === '' ? undefined : value })} value={2} className="radio radio-xs radio-primary ml-2 mr-2" />
                                        Guia de despacho
                                    </label>
                                </div>
                                {errors.Recepcion?.TipoDocumentoRecepcionCodigo && <span className="text-red-600">{errors.Recepcion.TipoDocumentoRecepcionCodigo.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                            <div>
                                <label className="block text-left mb-2" htmlFor="area">Area:</label>
                                <input id="" type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                            </div>
                            <div>
                                <label className="block text-left mb-2" htmlFor="proveedor">Proveedor:</label>
                                <input id="" value={sinOrden.proveedor.nombreComercial} type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                            </div>
                        </div>

                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                            <div>
                                <label className="block text-left mb-2" htmlFor="rutEncargado">Rut encargado bodega:</label>
                                <input id="rutEncargado" type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-left mb-2" htmlFor="nombreEncargado">Nombre encargado bodega:</label>
                                <input id="nombreEncargado" type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>


                        <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-4">
                            <Table className='border shadow-lg'>
                                <Table.Head className="bg-primary text-white">

                                    <span>Código articulo</span>
                                    <span>Descripción articulo</span>
                                    <span>Código familia</span>
                                    <span>Familia</span>
                                    <span>Código sub-familia</span>
                                    <span>Sub-familia</span>
                                    <span>Precio compra</span>
                                    <span>Cantidad recibida</span>
                                    <span>Observaciones</span>

                                </Table.Head>
                                <Table.Body>

                                    {sinOrden.cotizacionDetalles.map((cotizacion, cotizacionIndex) => (
                                        <Table.Row hover={true}>
                                            <span>{cotizacion.articulo.codigo}</span>
                                            <span>{cotizacion.articulo.nombre}</span>
                                            <span>{cotizacion.articulo.subFamilium.familium.codigo}</span>
                                            <span>{cotizacion.articulo.subFamilium.familium.nombre}</span>
                                            <span>{cotizacion.articulo.subFamilium.codigo}</span>
                                            <span>{cotizacion.articulo.subFamilium.nombre}</span>
                                            <span>{cotizacion.valorUnitario}</span>
                                            <span>
                                                <input type="number"
                                                    {...register(`RecepcionDetalle.${index}.Cantidad`, { setValueAs: (value) => value === '' ? undefined : Number(value) })}
                                                    className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                                {errors.RecepcionDetalle && errors.RecepcionDetalle[index] && (<span className="text-red-600">{errors.RecepcionDetalle[index].Cantidad?.message}</span>)}
                                            </span>
                                            <span>
                                                <input type="text"
                                                    {...register(`RecepcionDetalle.${index}.Observaciones`, { setValueAs: (value) => value === '' ? undefined : value })}
                                                    className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                                {errors.RecepcionDetalle && errors.RecepcionDetalle[index] && (<span className="text-red-600">{errors.RecepcionDetalle[index].Observaciones?.message}</span>
                                                )}
                                            </span>
                                        </Table.Row>
                                    ))}

                                </Table.Body>
                            </Table>
                        </div>
                        <div className="mb-4 flex justify-end">
                            <button
                                className="btn btn-outline btn-secondary md:my-0 lg:my-0 md:mx-2 lg:mx-2 inline-block"
                                onClick={() => router.back()}
                            >
                                Volver
                            </button>
                            <div className="inline-block">
                                <PDFDownloadLink document={<PDFSinOrden />} fileName='sinOrdenDeCompra_pdf'>
                                    {
                                        ({ loading, url, error, blob }) => loading ? (
                                            "Cargando.."
                                        ) : (
                                            <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Exportar</button>
                                        )

                                    }
                                </PDFDownloadLink>
                            </div>
                            <button type="submit" className="btn btn-outline btn-primary md:my-0 lg:my-0 md:mx-2 lg:mx-2 inline-block">Guardar</button>
                        </div>
                    </div>
                ))}
            </form>
        </div>
    );
}
