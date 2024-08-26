import BuscarArticuloMovTarjeta from "@/components/bodega/informes/BuscarArticulos";


export default function MovimientoArticulos() {
  
  return (
    <>
      <div className="">
        <h1 className="text-2xl font-bold mt-4">
          Informe movimiento de articulo
        </h1>
        <BuscarArticuloMovTarjeta label="MovimientoArticulo"/>
      </div>
    </>
  );
}
