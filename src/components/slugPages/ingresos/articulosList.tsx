import { IArticulo } from "../../../interfaces/creation";

interface props {
    list: IArticulo[];
}

export default function ArticuloList(props:props) {


    if (props.list.length === 0) {
        return ('no hay datos')
    }
    return (
        <div className="overflow-x-auto">
  <table className="table table-xs ">
    {/* head */}
    <thead>
      <tr>
        <th>Código</th>
        <th>Familia</th>
        <th>SubFamilia</th>
        <th>Nombre</th>
        <th>Descripcion</th>
        <th>Agregar</th>
      </tr>
    </thead>
    <tbody>
        {props.list.map( (element:IArticulo,index:number) => (
      <tr key={index} className="">
        <th>{element.codigo}</th>
        <td>{element.subFamiliaId}</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
      </tr>

        ) )}
      {/* row 1 */}
      
    </tbody>
  </table>
</div>
    )
}