import { CotizacionFormValues, IEmpresa } from "@/interfaces/creation";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
interface props {
    empresaId: string
}
export default function Show(props: props) {
    const { jwt } = useUserStore();
    const router = useRouter();

    const validationSchema = z.object({
        EmpresaId: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
        AnoNumero: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int(),
        Id: z.string({ required_error: "Campo invalido", invalid_type_error: "Campo invalido" }).uuid().optional(),
        SolicitudId: z.string({ required_error: "Campo invalido", invalid_type_error: "Campo invalido" }).uuid(),
        ProveedorId: z.string({ required_error: "Campo invalido", invalid_type_error: "Campo invalido" }).uuid(),
        ContactoId: z.string({ required_error: "Campo invalido", invalid_type_error: "Campo invalido" }).uuid().optional(),
        FormaPagoCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int(),
        EstadoCotizacionCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int(),
        Numero: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int(),
        Nombre: z.string({ required_error: "Campo invalido", invalid_type_error: "Campo invalido" }),
        FechaIngreso: z.date({ invalid_type_error: "Campo inválido" }),
        FechaEntrega: z.date({ invalid_type_error: "Campo inválido" }),
        ValorIvaIncluido: z.boolean().default(false),
        Exenta: z.boolean().default(false),
        ValorNeto: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
        Descuento: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).optional(),
        Impuesto: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
        ValorTotal: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
        Observaciones: z.string({ required_error: "Campo invalido", invalid_type_error: "Campo invalido" }).optional(),
        DescuentoPorcentual: z.boolean().default(false),
        Activa: z.boolean().default(false),
        RedondeaImpuesto: z.boolean().default(false)
    });

    const methods = useForm<CotizacionFormValues>({
        resolver: zodResolver(validationSchema),
    });

    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        trigger,
        watch,
        reset,
        control,
        formState: { errors },
      } = methods;
      
    return (
        <>
asd

        </>

    );
}