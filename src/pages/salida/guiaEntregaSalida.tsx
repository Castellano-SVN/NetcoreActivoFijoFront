import { useContextStore } from "@/store/context.store";
import { useEffect } from "react";


export default function Salidas(){
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Salidas");
    }, []);

    
    return(
        <>
        <h1>holi</h1>
        </>
    )
}