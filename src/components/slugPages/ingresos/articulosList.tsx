import { FaPenToSquare } from "react-icons/fa6";
import { IArticuloIngreso } from "../../../interfaces/creation";
import { useState } from "react";

interface Props {
  list: IArticuloIngreso[];
  addArticulo: (article: IArticuloIngreso) => void;
}

export default function ArticuloList(props: Props) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleAddArticle = (index: number, article: IArticuloIngreso) => {
    props.addArticulo(article);
    setSelectedRows((prevSelected) => [...prevSelected, index]);
  };

  if (props.list.length === 0) {
    return "no hay datos";
  }

  return (
    <div className="overflow-x-auto border rounded-md shadow-md mx-2 my-2">
      <table className="table">
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
              key={index}
              className={`hover:bg-gray-100 ${selectedRows.includes(index) ? "bg-green-200" : ""
                }`}
            >
              <td>{element.codigo}</td>
              <td>{element.subFamilium?.familium.nombre}</td>
              <td>{element.subFamilium?.nombre}</td>
              <td>{element.nombre}</td>
              <td>{element.descripcion}</td>
              <td>
                <FaPenToSquare
                  className="cursor-pointer hover:font-bold"
                  onClick={() => handleAddArticle(index, element)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
