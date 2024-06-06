import Requerimiento from "@/components/slugPages/ingresos/requerimientos";
import { useState } from "react";
import { z } from "zod";
import { IArticuloIngreso } from "../../interfaces/creation";
import ArticulosSearch from "../../components/slugPages/ingresos/articulosSearch";
import ArticuloList from "../../components/slugPages/ingresos/articulosList";



export default function Ingreso() {

  const [showTable, setShowTable] = useState(false);
  const [ArticleList,SetArticleList] = useState<IArticuloIngreso[]>([]);
;




  return (
    <div className=" flex  flex-row justify-center w-full mx-auto">
      <div className="shadow-md basis-1/2 border-2 borderer ">
          <ArticulosSearch setList={SetArticleList}/>
          <div>
          <ArticuloList list={ArticleList}/>

          </div>
      </div>
    </div>  
  );
}
