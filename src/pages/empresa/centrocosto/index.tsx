
import Image from "next/image";
import { Inter } from "next/font/google";
import { CentroFormValues, EmpresaFormValues, ICentroCosto } from "../../../interfaces/creation";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ContentForm from "../../../components/contentForm";
import { Button, Modal } from "react-daisyui";
import { isValidRUT, zodRut, nullableNumber } from "@/helpers/validations";
import { validate } from "rut.js";
import { DiCode } from "react-icons/di";
import NombreCentro from "@/components/bodega/centrocosto/NombreCentro";
import ContactoCentro from "@/components/bodega/centrocosto/ContactoCentro";
import DireccionCentro from "@/components/bodega/centrocosto/DireccionCentro";
import InstitucionalCentro from "@/components/bodega/centrocosto/InstitucionalCentro";
import { api_postCentroCostos } from "../../../services/bodega.service";
import { useUserStore } from "../../../store/user.store";
import { toast,ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';


export default function CreateCost() {
  const { jwt } = useUserStore();
  const validationSchema = z.object({
    Id: z.string().optional(),
    EmpresaId: z.string(),
    CentroCostoId: z.string().optional(),
    AdministradorId: z.string().optional(),
    Nombre: z.string({ required_error: "Campo Requerido", invalid_type_error: "Campo Requerido" }).min(3, { message: "Campo Requerido" }),
    Sigla: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    AreaGeograficaCodigo: z.number({ required_error: "Campo Requerido", invalid_type_error: "Campo Requerido" }).int(),
    TipoEstablecimientoSaludCodigo: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    RegionCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int().optional(),
    CiudadCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int().optional(),
    ComunaCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int().optional(),
    Email: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).email().optional(),
    Direccion: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    Telefono1: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo Invalido" }).int().optional(),
    Telefono2: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo Invalido" }).int().optional(),
    Fax: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo Invalido" }).int().optional(),
    Celular: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo Invalido" }).int().optional(),
    CodigoContabilidad: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    LibroRemuneraciones: z.boolean({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).default(false),
    RutaReporte: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    DepartamentoId: z.number().optional(),
    UnidadId: z.number().optional(),
    CodigoPrevired: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    CodigoGesparvu: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    AdministracionCentral: z.boolean({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).default(false),
    CodigoDipres: z.string({ required_error: "Campo inválido", invalid_type_error: "Tipo Invalido" }).optional(),
    Contabilizacion: z.boolean({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).default(false),
  });
  const methods = useForm<CentroFormValues>({
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
  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (data.Id) {
        await api_postCentroCostos(jwt, data);
        toast.success('El centro costo se ha actualizado correctamente.');
      } else {
        await api_postCentroCostos(jwt, data);
        toast.success('El centro costo se ha creado correctamente.');
      }
      setTimeout(() => {
        router.back();
      }, 3000);
      // router.push('/empresa');
    } catch (error) {
      toast.error('Ha ocurrido un error, vuelve a intentarlo mas tarde.');
      console.log(error);
    }
  };

  const handleFormError = () => {
    // Mostrar un toast de error indicando que hay errores en el formulario
    toast.error('Por favor, completa correctamente todos los campos.');
  };

  useEffect(() => {
    const loadDataLS = sessionStorage.getItem("CentroCostoAll");
    if (loadDataLS) {
      const loadData: { cc: ICentroCosto, empresa: EmpresaFormValues } = JSON.parse(loadDataLS);
      console.log(loadData.cc)
      toast.info("Editando Centro de costo existente");
      setValue("Nombre", loadData.cc.nombre )
      setValue("Id", loadData.cc.id);
      setValue("Sigla", loadData.cc.sigla);
      setValue("Email", loadData.cc.email !== null ? loadData.cc.email : undefined);
      setValue("Celular", loadData.cc.celular !== null ? loadData.cc.celular : undefined);
      setValue("Telefono1", loadData.cc.telefono1 !== null ? loadData.cc.telefono1 : undefined);
      setValue("Telefono2", loadData.cc.telefono2 !== null ? loadData.cc.telefono2 : undefined);
      setValue("Fax", loadData.cc.fax !== null ? loadData.cc.fax : undefined);
      setValue("Direccion", loadData.cc.direccion !== null ? loadData.cc.direccion : undefined);
      setValue("CodigoContabilidad", loadData.cc.codigoContabilidad !== null ? loadData.cc.codigoContabilidad : undefined);
      setValue("CodigoDipres", loadData.cc.codigoDipres !== null ? loadData.cc.codigoDipres : undefined);
      setValue("RutaReporte", loadData.cc.rutaReporte !== null ? loadData.cc.rutaReporte : undefined);
      setValue("CodigoPrevired", loadData.cc.codigoPrevired !== null ? loadData.cc.codigoPrevired : undefined);
      setValue("CodigoGesparvu", loadData.cc.codigoGesparvu !== null ? loadData.cc.codigoGesparvu : undefined);
      setValue("AdministracionCentral", loadData.cc.administracionCentral);
      setValue("Contabilizacion", loadData.cc.contabilizacion);
      setValue("LibroRemuneraciones", loadData.cc.libroRemuneraciones);
      setValue("AreaGeograficaCodigo",loadData.cc.areaGeograficaCodigo);
      setValue("RegionCodigo",loadData.cc.regionCodigo);
      setValue("CiudadCodigo",loadData.cc.ciudadCodigo);
      setValue("ComunaCodigo",loadData.cc.comunaCodigo);
      setValue("TipoEstablecimientoSaludCodigo",loadData.cc.tipoEstablecimientoSaludCodigo);
      sessionStorage.removeItem("CentroCostoAll")
    }

  }, [])

  return (
    <div className="m-2">
      <Head>
        <title>Creación de persona</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit,handleFormError)}>
          <ContentForm title="Nombre">
            <NombreCentro errors={errors} />
          </ContentForm>
          <ContentForm title="Contacto">
            <ContactoCentro errors={errors} />
          </ContentForm>
          <ContentForm title="Dirección">
            <DireccionCentro errors={errors} />
          </ContentForm>
          <ContentForm title="Institucional">
            <InstitucionalCentro errors={errors} />
          </ContentForm>

          <div className="my-2">
            <div className="flex flex-wrap md:justify-end lg:justify-end justify-center mx-4">
              <Button type="submit" color="primary">Guardar</Button>
            </div>
          </div>
        </form>
      </FormProvider>

    </div>
  );

}