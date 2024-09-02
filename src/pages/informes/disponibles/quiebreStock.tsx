import WarningAlert from "@/components/alerts/warningAlert";
import TablaQuiebreStock from "@/components/bodega/informes/tablas/TableQuiebreStock";
import { api_getinformeQuiebreStock } from "@/services/informes.service";
import { useUserStore } from "@/store/user.store";
import router from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";




export default function QuiebreStock() {
    const { jwt } = useUserStore();
    const { empresa } = router.query;

    const getAllArticulosQuiebreStock = async () => {
        try {
          const response = await api_getinformeQuiebreStock(jwt, empresa as string);
          console.log("esta es la data:",response.data.dataList);
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(()=>{
        getAllArticulosQuiebreStock();
    },[])
    return (
        <>
            <div className="">
                <h1 className="text-2xl font-bold mt-4">
                    Informe Quiebre de stock
                </h1>
                <TablaQuiebreStock />


            </div>
        </>
    );
}
