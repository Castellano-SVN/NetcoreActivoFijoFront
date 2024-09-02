import BuscarArticuloMovTarjeta from "@/components/bodega/informes/BuscarArticulos";

export default function TarjetaExistencia() {
    
    return (
        <>
        <div className="">
          <h1 className="text-2xl font-bold mt-4">
            Informe Tarjeta Existencia
          </h1>
          <BuscarArticuloMovTarjeta label="TarjetaExistencia"/>
        </div>
      </>
    );
}