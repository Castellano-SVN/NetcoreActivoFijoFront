import PDFConOrden from "@/components/pdf/recepcion/recepcionConOrden";
import { FormValueRecepcionData, IOrdenCompra } from "@/interfaces/creation";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { Button, Modal, Table, Textarea } from "react-daisyui";
import { Controller, useForm } from "react-hook-form";
import { FaFilePdf } from "react-icons/fa";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api_postRecepcionYDetalle } from "@/services/bodega.service";
import { toast } from "react-toastify";

interface props {
    valorPdf: boolean;
    dataConOrdenCompra: IOrdenCompra[];
    numero: number;
    setShowConOrden: (value: boolean) => void;  // define el tipo de la función
    setNumero: (value: number | null) => void;
}


export default function ConOrden(props: props) {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Recepcion");
    }, []);

    const searchParams = useSearchParams();
    const id = searchParams.get('empresa'); //obtenemos la empresa
    const empresaId = id?.toString();
    const estado = props.valorPdf;

    const { jwt } = useUserStore();

    // const getPDF = async (empresaId: string, estado: boolean) => {
    //     /* ReactPDF.renderToStream(<PDFConsulta />); */
    //     try {
    //         //const response = await api_pdf_recepcion(jwt, empresaId, estado);

    //         // Crear una URL para el Blob
    //         //const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));


    //         // Crear un enlace temporal y simular un clic para descargar el archivo
    //         //const link = document.createElement('a');
    //         //link.href = url;
    //         //link.setAttribute('download', `documento_${valorEstado}.pdf`); // Nombre del archivo
    //         //document.body.appendChild(link);
    //         //link.click();

    //         // Limpiar el enlace temporal y revocar la URL
    //         //link.parentNode?.removeChild(link);
    //         //window.URL.revokeObjectURL(url); // Libera memoria utilizada por el Blob
    //     } catch (error) {
    //         console.error('Error al descargar el PDF:', error);

    //     }
    // }

    const RecepcionDataSchema = z.object({
        Recepcion: z.object({
            CotizacionId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            AnoNumero: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).int(),
            Id: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            CentroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            CentroCostoName: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            BodegaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            AlmacenId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            BodegaName: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            FuncionarioId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            TipoDocumentoRecepcionCodigo: z.string({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
            NumeroDocumento: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).int(),
            FechaIngreso: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            FechaRecepcion: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            Observaciones: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            NumeroRecepcion: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).optional(),
            FechaDocumento: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
            Nula: z.boolean().default(false),
        }),
        RecepcionDetalle: z.array(
            z.object({
                CotizacionId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                ObservacionDetalle: z.string({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).optional(),
                Codigo: z.string({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).optional(),
                Nombre: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
                ArticuloId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                Precio: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
                Recepcionado: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
                EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                CotizacionDetalleId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
                AnoNumero: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).int(),
                CantidadPorRecepcionar: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
                Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }).min(1, { message: "campo debe ser mayor a 0" }),
                Observaciones: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }).optional(),
            })
        ),
    });


    const methods = useForm<FormValueRecepcionData>({
        resolver: zodResolver(RecepcionDataSchema),
    });


    const { register, handleSubmit, formState: { errors }, control, setValue, reset } = methods;

    const [showPdf, setShowPdf] = useState(false);

    const [dataPost, setDataPost] = useState<FormValueRecepcionData | null>(null);
    const onSubmit = async (data: FormValueRecepcionData) => {
         try {
             data.Recepcion.TipoDocumentoRecepcionCodigo = parseInt(data.Recepcion.TipoDocumentoRecepcionCodigo.toString());
             console.log('Data del formulario:', data); // Nota la coma en lugar del +
 
             // Hacer la solicitud al servicio
             const response = await api_postRecepcionYDetalle(jwt, data);
 
             // Mostrar el mensaje de éxito
             if (response) {
                 toast.success("Articulo recepcionado correctamente");
                 setShowPdf(true);
                 setDataPost(data);
             }
 
         } catch (error) {
             console.error('Error al guardar: ', error);
             toast.error('ha ocurrido un error');
             setShowPdf(false);
         }

        /* console.log('Data del formulario:', data); */
    };

    const volverHandleClick = () => {
        props.setShowConOrden(false);
        reset();
        props.setNumero(null);
    };

    useEffect(() => {
        try {
            if (props.dataConOrdenCompra) {
                props.dataConOrdenCompra.map((ordenCompra) => {
                    setValue('Recepcion.CotizacionId', ordenCompra.cotizacionId);
                    setValue('Recepcion.EmpresaId', ordenCompra.empresaId);
                    setValue('Recepcion.AnoNumero', ordenCompra.anoNumero);
                    setValue('Recepcion.FuncionarioId', ordenCompra.funcionarioId);
                    ordenCompra.ordenCompraDetalles.map((detalles) => {
                        setValue('Recepcion.CentroCostoName', detalles.cotizacionDetalle.solicitudDetalle.centroCosto.nombre)
                        detalles.cotizacionDetalle.solicitudDetalle.centroCosto.bodegas.map((bodegas) => {
                            setValue('Recepcion.BodegaName', bodegas.nombre)
                        })
                    })
                    const fecha = new Date(ordenCompra.fecha);
                    setValue('Recepcion.FechaIngreso', fecha);
                });

                const recepcionDetalle = props.dataConOrdenCompra.map((ordenCompra) => ({
                    CotizacionId: ordenCompra.cotizacionId,
                    ObservacionDetalle: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.observaciones)
                        .join(','),
                    CotizacionDetalleId: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.id)
                        .join(','),
                    EmpresaId: ordenCompra.empresaId,
                    AnoNumero: ordenCompra.anoNumero,
                    Codigo: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.articulo.codigo)
                        .join(','),
                    Nombre: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.articulo.nombre)
                        .join(','),
                    ArticuloId: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.articulo.id)
                        .join(','),
                    Precio: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.valorUnitario)
                        .join(','),
                    Recepcionado: ordenCompra.ordenCompraDetalles
                        .map((detalle) => detalle.cotizacionDetalle.solicitudDetalle.cantidadAprobada)
                        .join(','),
                    CantidadPorRecepcionar: 0,
                    Cantidad: 0,
                    Observaciones: '',
                }));

                setValue('RecepcionDetalle', recepcionDetalle);
            }
        } catch (error) {
            console.log(error);
        };
    }, [props.dataConOrdenCompra, setValue]);

    return (
        <div className="flex justify-center items-center">
            <div className="p-6 bg-white rounded w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">Recepción de Artículos con orden de compra</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-left mb-2" htmlFor="Folio Recepcion">Folio Recepcion:</label>
                            <input type="number"
                                {...register("Recepcion.NumeroRecepcion", { setValueAs: (value) => value === '' ? undefined : Number(value) })}
                                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            {errors.Recepcion?.NumeroRecepcion && <span className="text-red-600">{errors.Recepcion.NumeroRecepcion.message}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-left mb-2" >Fecha:</label>

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

                        <div>
                            <label className="block text-left mb-2" htmlFor="centroDeCosto">Centro de costo:</label>
                            <select {...register("Recepcion.CentroCostoId", { setValueAs: (value) => value === '' ? undefined : value })} className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                <option key={0} value={0} disabled>Seleccione una opción</option>
                                {props.dataConOrdenCompra.map((ordenCompra, index) => (
                                    ordenCompra.ordenCompraDetalles.map((centroCosto, detalleIndex) => (
                                        <option key={index} value={centroCosto.cotizacionDetalle.solicitudDetalle.centroCosto.id}>
                                            {centroCosto.cotizacionDetalle.solicitudDetalle.centroCosto.nombre}
                                        </option>
                                    ))))}
                            </select>
                            {errors.Recepcion?.CentroCostoId && <span className="text-red-600">{errors.Recepcion.CentroCostoId.message}</span>}

                        </div>

                        <div>
                            <label className="block text-left mb-2" htmlFor="bodega">Bodega:</label>
                            <select {...register("Recepcion.BodegaId", { setValueAs: (value) => value === '' ? undefined : value })} className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" >
                                <option key={0} value={0} disabled>Seleccione una opción</option>
                                {
                                    props.dataConOrdenCompra.map((ordenCompra, index) => (
                                        ordenCompra.ordenCompraDetalles.map((centroCosto, detalleIndex) => (
                                            centroCosto.cotizacionDetalle.solicitudDetalle.centroCosto.bodegas.map((bodegas, bodegaindex) => (
                                                <option key={bodegaindex} value={bodegas.id}>
                                                    {bodegas.nombre}
                                                </option>
                                            ))))))
                                }
                            </select>
                            {errors.Recepcion?.BodegaId && <span className="text-red-600">{errors.Recepcion.BodegaId.message}</span>}
                        </div>

                        <div>
                            <label className="block text-left mb-2" htmlFor="bodega">Almacen:</label>
                            <select {...register("Recepcion.AlmacenId", { setValueAs: (value) => value === '' ? undefined : value })} className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" >
                                <option key={0} disabled selected>Seleccione una opción</option>
                                {
                                    props.dataConOrdenCompra.map((ordenCompra, index) => (
                                        ordenCompra.ordenCompraDetalles.map((centroCosto, detalleIndex) => (
                                            centroCosto.cotizacionDetalle.solicitudDetalle.centroCosto.bodegas.map((bodegas, bodegaindex) => (
                                                bodegas.almacens.map((almacen, almacenIndex) => (
                                                    <option key={almacenIndex} value={almacen.id}>
                                                        {almacen.nombre}
                                                    </option>
                                                ))
                                            ))
                                        ))
                                    ))
                                }
                            </select>
                            {errors.Recepcion?.AlmacenId && <span className="text-red-600">{errors.Recepcion.AlmacenId.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-6">
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


                    <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-4">
                        <Table className='border shadow-lg'>
                            <Table.Head className="bg-primary text-white">
                                <span>Codigo</span>
                                <span>Nombre</span>
                                <span>Cantidad</span>
                                <span>Precio</span>
                                <span>Observación</span>
                                <span>Recepcionado</span>
                                <span>Por recepcionar</span>
                                <span>Cantidad recibida</span>
                                <span>Observaciones</span>
                            </Table.Head>

                            <Table.Body>
                                {props.dataConOrdenCompra.map((ordenCompra) => (
                                    ordenCompra.ordenCompraDetalles.map((ordenDetalle, index) => (
                                        <Table.Row key={index} hover={true}>
                                            <span>{ordenDetalle.cotizacionDetalle.articulo.codigo}</span>
                                            <span>{ordenDetalle.cotizacionDetalle.articulo.nombre}</span>
                                            <span>{ordenDetalle.cotizacionDetalle.cantidad}</span>
                                            <span>{ordenDetalle.cotizacionDetalle.valorUnitario}</span>
                                            <span>{ordenDetalle.cotizacionDetalle.observaciones}</span>
                                            <span>{ordenDetalle.cotizacionDetalle.solicitudDetalle.cantidadAprobada}</span>
                                            <span>
                                                <input type="number"
                                                    {...register(`RecepcionDetalle.${index}.CantidadPorRecepcionar`, { setValueAs: (value) => value === '' ? undefined : Number(value) })}
                                                    className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                            </span>
                                            <span>
                                                <input type="number"
                                                    {...register(`RecepcionDetalle.${index}.Cantidad`, { setValueAs: (value) => value === '' ? undefined : Number(value) })}
                                                    className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                                {errors.RecepcionDetalle && errors.RecepcionDetalle[index] && (
                                                    <span className="text-red-600">{errors.RecepcionDetalle[index].Cantidad?.message}</span>
                                                )}
                                            </span>
                                            <span>
                                                <input type="text"
                                                    {...register(`RecepcionDetalle.${index}.Observaciones`, { setValueAs: (value) => value === '' ? undefined : value })}
                                                    className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                                {errors.RecepcionDetalle && errors.RecepcionDetalle[index] && (
                                                    <span className="text-red-600">{errors.RecepcionDetalle[index].Observaciones?.message}</span>
                                                )}
                                            </span>
                                        </Table.Row>
                                    ))))}
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="mb-4">
                        <label className="block text-left mb-2" htmlFor="Descripcion_generals">Descripcion General:</label>
                        <Textarea
                            rows={4}
                            {...register("Recepcion.Observaciones", { setValueAs: (value) => value === '' ? undefined : value })}
                            className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                    </div>

                    <div className="mb-4 flex flex-col md:flex-row lg:flex-row justify-end">
                        <button
                            type="button"
                            className="btn btn-outline btn-secondary mb-3 md:mb-0 lg:mb-0 md:my-0 lg:my-0 md:mx-2 lg:mx-2"
                            onClick={volverHandleClick}>
                            Volver
                        </button>


                        {showPdf && dataPost ?
                            <Modal open={showPdf}>
                                <Modal.Header>¿Desea crear un reporte de la Recepcion?</Modal.Header>
                                <Modal.Body>
                                    <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                        <div className="col-span-2">
                                            <PDFDownloadLink document={<PDFConOrden data={dataPost} />} fileName={`Orden_De_Compra_Numero_${props.numero}_pdf`}>
                                                {
                                                    ({ loading, url, error, blob }) => loading ? (
                                                        "Cargando.."
                                                    ) : (
                                                        <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Exportar</button>
                                                    )
                                                }
                                            </PDFDownloadLink>
                                        </div>
                                        <div className="col-span-2">
                                            <Button type="button" className="btn btn-outline btn-secondary w-1/2 mt-2" onClick={() => router.reload()}>
                                                salir
                                            </Button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                            :
                            <button type="submit" className="btn btn-outline btn-primary md:my-0 lg:my-0 md:mx-2 lg:mx-2 inline-block">Guardar</button>}

                    </div>
                </form>
            </div >
        </div >
    );
}
