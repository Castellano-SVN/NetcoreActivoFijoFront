
import { useContextStore } from "@/store/context.store";
import { useEffect} from "react";
import ListaEmpresasPage from "@/components/inventario-informe/ListaEmpresaPage";

export default function Index() {

  const { setActive } = useContextStore()
  useEffect(() => {
    setActive("Toma inventario");
  }, []);


  return (
    <>
     <ListaEmpresasPage label="Toma Inventario" />
    </>
  );

}
