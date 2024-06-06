import Requerimiento from "@/components/slugPages/ingresos/requerimientos";
import { useEffect, useState } from "react";
import { z } from "zod";
import { IArticuloIngreso } from "../../interfaces/creation";
import ArticulosSearch from "../../components/slugPages/ingresos/articulosSearch";
import ArticuloList from "../../components/slugPages/ingresos/articulosList";

export default function Ingreso() {

  const [showTable, setShowTable] = useState(false);
  const [ArticleList, SetArticleList] = useState<IArticuloIngreso[]>([]);
  const [ArticleSelected, SetArticleSelected] = useState<IArticuloIngreso[]>([]);
  const [showRequerimiento, setShowRequerimiento] = useState(false);

  const addArticle = (article: IArticuloIngreso) => {
    SetArticleSelected(prevSelected => [...prevSelected, article]);
  };

  useEffect(() => {
    console.log(ArticleSelected);
  }, [ArticleSelected]);

  const handleButtonClick = () => {
    setShowRequerimiento(true);
  };
  const handleButtonBackClick = () => {
    setShowRequerimiento(false);
  };

  const removeArticle = (index: number) => {
    SetArticleSelected(prevSelected => prevSelected.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-row justify-center w-full mx-auto">
      <div className="shadow-md basis-1/2 border-2">
        {showRequerimiento === false ? (
          <>
            <ArticulosSearch setList={SetArticleList} />
            <ArticuloList list={ArticleList} addArticulo={addArticle} />
            <div>
              <button className="btn btn-outline btn-primary my-4" onClick={handleButtonClick}>Ver Requerimiento</button>
            </div>

          </>
        ) :
          (
            <>
              <Requerimiento removeArticulo={removeArticle} selectArticle={ArticleSelected} />
              <div>
                <button className="btn btn-outline btn-primary my-4" onClick={handleButtonBackClick}>Volver</button>
              </div>
            </>
          )}
      </div>

    </div>
  );
}
