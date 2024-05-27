import { ReactNode, useEffect, useState } from "react";
import { useContextStore } from "../../store/context.store";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function index() {
    const {setActive} = useContextStore()
    useEffect(() => {
      setActive("Recepcion");
    },[])


    return (
      <div className="flex items-center justify-center">
      <div className="container shadow">
          
      </div>
  </div>
    )
}