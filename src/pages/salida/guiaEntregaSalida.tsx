import { IBodega, ICentroCosto } from "@/interfaces/creation";
import { IAlmacen } from "@/interfaces/modules/IAlmacen.interface";
import { api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllCentroCostoByEmpresa } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";


interface FormValueGuiaSalidaDetalle {
    EmpresaId: string;
    CentroCostoId: string;
    BodegaId: string;
    AlmacenId: string;
    AnoNumero: number;
    FuncionarioEntregaId: string;
    PersonaRecibeId: string;
    Fecha: Date;
    MotivoSalida: string;
    Numero: number;
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

    useEffect(() => {
        if (!idEmpresa) return;
        getCentroCostos();
    }, [idEmpresa]);

    const GuiaSalida = z.object({
        EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CentroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        AlmacenId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        FuncionarioEntregaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        PersonaRecibeId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        Fecha: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        MotivoSalida: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        Numero: z.number({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
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



    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-3/4 border shadow-md grid md:grid-cols-12 rounded-md p-3 gap-4 mx-auto">
                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Centro costo" className="label font-semibold tex-left">Centro Costo</label>
                            <select className="select select-primary"
                                {...register('CentroCostoId', { setValueAs: (value) => value === '' ? undefined : value })}>
                                <option value='' selected disabled>Seleccione una opcion: </option>
                                {dataCc?.map((cc, index) => (
                                    <option value={cc.id}>{cc.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Bodega" className="label font-semibold tex-left">Bodega</label>
                            <select className="select select-primary"
                                {...register('BodegaId', { setValueAs: (value) => value === '' ? undefined : value })}>
                                <option value='' selected disabled>Seleccione una opcion: </option>
                                {dataBodega?.map((bodega, index) => (
                                    <option value={bodega.id}>{bodega.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-span-4">
                        <div className="flex flex-col">
                            <label htmlFor="Almacen" className="label font-semibold tex-left">Almacen</label>
                            <select className="select select-primary"
                                {...register('AlmacenId', { setValueAs: (value) => value === '' ? undefined : value })}>
                                <option value='' selected disabled>Seleccione una opcion: </option>
                                {dataAlmacen.map((almacen, index) => (
                                    <option value={almacen.id}>{almacen.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="flex flex-col">
                        <label htmlFor="Almacen" className="label font-semibold tex-left">Almacen</label>
                           {/*  <Select
                                className="my-2 w-full px-0 md:px-8"
                                placeholder="Seleccione el Funcionario "
                                options={dataPersona}
                                onChange={(option) => setSelectedPersona(option)}
                                value={selectedPersona}
                                loadingMessage={() => "Cargando opciones..."}
                                isLoading={dataPersona?.length === 0}
                                getOptionValue={(option) => option.funcionarioId}
                                getOptionLabel={(option) =>
                                    option.persona.nombres +
                                    " " +
                                    option.persona.apellidoPaterno
                                }
                                menuPortalTarget={document.body}
                            /> */}
                        </div>
                    </div>


                </div>
            </form>
        </>
    )
}