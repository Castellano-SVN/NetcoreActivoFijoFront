import { IArticuloIngreso, IPrograma, RequerimientosFormValues } from "@/interfaces/creation";
import { api_getProgramaByEmpresa } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaFileExport } from "react-icons/fa";
import { FaCircleXmark, FaPlus, FaRegFloppyDisk } from "react-icons/fa6";
import { z } from "zod";
interface props {
    selectArticle: IArticuloIngreso[];
    removeArticulo: (index: number) => void;
}

export default function Requerimiento(props: props) {
    const { jwt } = useUserStore();
    const [dataPrograma, setDataPrograma] = useState<IPrograma[]>();
    // const getPrograma = async () => {
    //     try {
    //         const dataGet = await api_getProgramaByEmpresa(jwt,);
    //         setDataPrograma(dataGet.data.dataList);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const ValidationSchemaArticulo = z.object({
        Codigo: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).optional(),
        NombreArticulo: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
        Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
        Glosa: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    })

    const validationSchema = z.object({
        Nombre: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
        Articulo: z.array(ValidationSchemaArticulo),
        ProgramaId: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
        Observaciones: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    });


    const methods = useForm<RequerimientosFormValues>({
        resolver: zodResolver(validationSchema),
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


    return (
        <>
            <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
                <FormProvider {...methods}>
                    <div className="max-w-3xl mx-auto bg-white p-8">
                        <form>
                            <h5 className="text-2xl font-bold mb-4">Requerimiento</h5>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ingrese Nombre</label>
                                <div className="flex justify-center">
                                    <input {...register("Nombre", { setValueAs: (value) => value === "" ? undefined : value })}
                                        type="text"
                                        className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <label className="label text-error">
                                        {errors.Nombre ? errors.Nombre.message : ""}
                                    </label>
                                </div>
                            </div>
                            <div className="my-6 flex justify-center border rounded-md shadow-md">
                                <div className="w-full max-w-4xl overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nro</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Glosa</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {props.selectArticle.map((element: IArticuloIngreso, index: number) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{element.codigo}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{element.nombre}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                                                        <input {...register("Cantidad", { setValueAs: (value) => value === "" ? undefined : value })}
                                                            className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                        <label className="label text-error">
                                                            {errors.Cantidad ? errors.Cantidad.message : ""}
                                                        </label>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                                                        <input {...register("Glosa", { setValueAs: (value) => value === "" ? undefined : value })}
                                                            className="mt-1 block w-4/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                        <label className="label text-error">
                                                            {errors.Glosa ? errors.Glosa.message : ""}
                                                        </label>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                                                        <FaCircleXmark className="text-error cursor-pointer hover:font-bold"
                                                            onClick={() => props.removeArticulo(index)}
                                                        />

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Programa</label>
                                <div className="flex justify-center">
                                    <select {...register("ProgramaId", { setValueAs: (value) => value === "" ? undefined : value })}
                                        id="centro_costo"
                                        className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Seleccione Programa</option>
                                        <option value="centro_1">Programa 1</option>
                                        <option value="centro_2">Programa 2</option>
                                    </select>
                                    <label className="label text-error">
                                        {errors.ProgramaId ? errors.ProgramaId.message : ""}
                                    </label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Observación</label>
                                <div className="flex justify-center">
                                    <textarea {...register("Observaciones", { setValueAs: (value) => value === "" ? undefined : value })}
                                        placeholder="Escriba aqui..."
                                        className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    ></textarea>
                                    <label className="label text-error">
                                        {errors.Observaciones ? errors.Observaciones.message : ""}
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button className="my-2 mx-0 md:mx-2 py-2 px-4 rounded-md shadow-sm btn btn-outline btn-primary">
                                    <FaPlus />
                                    Nuevo
                                </button>

                                <button className="my-2 mx-0 md:mx-2 py-2 px-4 rounded-md shadow-sm btn btn-outline btn-primary">
                                    <FaRegFloppyDisk />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </FormProvider>
            </div>
        </>
    )
}