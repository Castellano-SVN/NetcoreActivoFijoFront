import { FaPenToSquare, FaPlus, FaMinus } from "react-icons/fa6";
import { IArticuloIngreso, RequerimientosFormValues } from "../../../interfaces/creation";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Props {
  list: IArticuloIngreso[];
  addArticulo: (article: IArticuloIngreso) => void;
  remove: (id: string) => void;
  articlesSelected: IArticuloIngreso[];
}
interface ArticleCuantity extends IArticuloIngreso {
  Cantidad: number | undefined;
  Glosa: string | undefined;
}
export default function ArticuloList(props: Props) {

  const filterSelectedExist = (element: IArticuloIngreso) => !!props.articlesSelected.find(e => e.id === element.id);


  const handleAddArticle = (index: number, article: IArticuloIngreso) => {
    props.addArticulo(article);
  };
  if (props.list.length === 0) {
    return "no hay datos";
  }

  const MobileElement = ({ element }: { element: IArticuloIngreso }) => (
    <div
      className=" hover:shadow-md  border rounded-md  shadow "
    >
      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Nombre</span>
          <span className="text-sm align-left">
            {element.nombre}
          </span>
        </div>
        <div className="basis-1/2 flex flex-col justify-left text-right ">
          <span className="font-bold mb-2">Codigo</span>
          <span className="text-sm align-left">{element.codigo}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Familia</span>
          <span className="text-sm align-left">
            {element.subFamilium.familium.nombre}
          </span>
        </div>
      </div>

      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Subfamilia</span>
          <span className="text-sm align-left">
            {element.subFamilium.nombre}
          </span>
        </div>
      </div>

      <div className="flex  justify-between p-2">
        <div className="flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Descripcion</span>
          <span className="text-sm align-left">
            {element.descripcion}
          </span>
        </div>
      </div>

      <div className="flex flex-row p-3 bg-[#FAF6FF] justify-around border mx">
        <span className="basis-1/2 font-bold text-sm text-left">Acciones</span>
        <div className="flex  flex-wrap justify-end space-x-4">
          <label className="swap swap-rotate text-sm">

            <input type="checkbox" defaultChecked={filterSelectedExist(element) ? true : false} />

            <FaMinus className="swap-on fill-current w-5 h-5 text-error" onClick={() => props.addArticulo(element)} />

            <FaPlus className="swap-off fill-current w-5 h-5 text-primary" onClick={() => props.remove(element.id)} />

          </label>

        </div>
      </div>
    </div>
  );
  const MobileView = () => (
    <div className="grid md:hidden grid-cols-1 gap-4 mx-1">
      {props.list.map((element: IArticuloIngreso, index: number) => (
        <MobileElement element={element} key={index} />
      ))}
    </div>

  )

  const DesktopView = () => (
    <div className="overflow-x-auto  rounded-md shadow-md mx-32 my-2">
      <table className=" table-fixed hidden md:table">
        <thead className="text-center">
          <tr>
            <th>Código</th>
            <th>Familia</th>
            <th>SubFamilia</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Agregar</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {props.list.map((element: IArticuloIngreso, index: number) => (
            <tr
              key={element.id}
              className={`
            ${index % 2 === 0 && "bg-[#FAF6FF]"}`}
            >
              <td>{element.codigo} - {element.id}</td>
              <td>{element.subFamilium?.familium.nombre}</td>
              <td>{element.subFamilium?.nombre}</td>
              <td>{element.nombre}</td>
              <td className="text-sm">{element.descripcion}</td>
              <td align="center">

                <label className="swap swap-rotate1 ">

                  <input type="checkbox" defaultChecked={filterSelectedExist(element) ? true : false} onChange={(e) => e.target.checked ? props.addArticulo(element) : props.remove(element.id)}
                  />

                  <FaMinus className="swap-on swap-flip fill-current w-10 h-10 text-error" />

                  <FaPlus className="swap-off swap-flip fill-current w-10 h-10 text-primary" />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )


  return (
    <>

      <DesktopView />
      <MobileView />

    </>
  );
}
