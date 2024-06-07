import WarningAlert from "@/components/alerts/warningAlert";
import { IArticuloIngreso, IPrograma, RequerimientosFormValues, ArticleCuantity } from "@/interfaces/creation";
import { api_getProgramaByEmpresa } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { FaFileExport } from "react-icons/fa";
import { FaCircleXmark, FaPlus, FaRegFloppyDisk } from "react-icons/fa6";
import { z } from "zod";


interface props {
    selectArticle: ArticleCuantity[];
    removeArticulo: (index: string) => void;
    empresa: string
}

export default function Requerimiento(props: props) {
    const { jwt } = useUserStore();
    const [dataPrograma, setDataPrograma] = useState<IPrograma[]>([]);
    const getPrograma = async () => {
        try {
            const dataGet = await api_getProgramaByEmpresa(jwt, props.empresa);
            setDataPrograma(dataGet.data.dataList);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPrograma();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        control,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<RequerimientosFormValues>();

    const listArticles = watch("Articulo");
    return (
        <>
            <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
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
                        <div className="my-6 flex justify-center  rounded-md ">
                            <div className="w-full max-w-4xl overflow-x-auto">
                                {props.selectArticle.length !== 0 ? (<table className="min-w-full divide-y divide-gray-200">
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
                                        {listArticles.map((element: ArticleCuantity, index: number) => (
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
                                                        onClick={() => props.removeArticulo(element.id)}
                                                    />

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>) : (<WarningAlert message="No hay productos seleccionados" />)}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Programa</label>
                            <div className="flex justify-center">
                                <select {...register("ProgramaId", { setValueAs: (value) => value === "" ? undefined : value })}
                                    defaultValue={''}
                                    id="centro_costo"
                                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="" disabled>Seleccione Programa</option>
                                    {dataPrograma.map((element: IPrograma, index: number) => (
                                        <option key={index} value={element.id}>{element.nombre}</option>
                                    ))}
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
            </div>
        </>
    )
}