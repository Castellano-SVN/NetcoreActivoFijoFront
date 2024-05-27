import Image from "next/image";
import { Inter } from "next/font/google";
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
import { Button, Modal } from "react-daisyui";
import { isValidRUT, zodRut, nullableNumber } from "@/helpers/validations";
import { validate } from "rut.js";
import { DiCode } from "react-icons/di";
import { EmpresaFormValues } from "../../interfaces/creation";
import ContentForm from "../../components/contentForm";
import DatosEmpresa from "@/components/bodega/empresa/DatosEmpresa";
import ContactoEmpresa from "@/components/bodega/empresa/ContactoEmpresa";
import DireccionEmpresa from "@/components/bodega/empresa/DireccionEmpresa";
import Administracion from "@/components/bodega/empresa/Administracion";
import PieFirma from "@/components/bodega/empresa/PieFirma";
import { api_postEmpresas, api_putEmpresas } from "../../services/bodega.service";
import { useUserStore } from "../../store/user.store";
import { toast, ToastContainer } from "react-toastify";
import { IEmpresa } from "../../interfaces/creation";
import axios from "axios";
import { useRouter } from "next/router";




export default function CreateEmpresa() {
  const { jwt } = useUserStore();

  const validationSchema = z.object({
    RutCuerpo: z.number({ required_error: "Rut requerido", invalid_type_error: "Rut incorrecto" }).min(4, { message: "Rut incorrecto" }),
    RutDigito: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    RazonSocial: z.string({ required_error: "Campo requerido", invalid_type_error: "Campo requerido" }),
    RegionCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int().optional(),
    CiudadCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int().optional(),
    ComunaCodigo: z.number({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).int().optional(),
    TipoAdministracionCodigo: z.number({ required_error: "Campo requerido", invalid_type_error: "Campo requerido" }).int(),
    ActividadEconomicaPrincipalCodigo: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    SectorActividadEconomicaCodigo: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    ActividadEconomicaCodigo: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    Giro: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    Direccion: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    Email: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).email().optional(),
    PaginaWeb: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).url({ message: "url invalida" }).optional(),
    Telefono1: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    Telefono2: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    Fax: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    Celular: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).int().optional(),
    AdministradorId: z.string().uuid().optional(),
    GerenteRRHHId: z.string().uuid().optional(),
    Bloqueada: z.boolean().default(false),
    Id: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    RutaReporte: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    PieFirmaLiquidacion: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    URL: z.string().optional(),
  });
  const methods = useForm<EmpresaFormValues>({
    resolver: zodResolver(validationSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      if (!data.Id) {
        await api_postEmpresas(jwt, data);
        toast.success("Empresa guardada correctamente");
      } else {
        await api_putEmpresas(jwt, data);
        toast.success("Empresa actualizada correctamente");
      }
      setIsLoading(false);
      setTimeout(() => {
        router.back();
      }, 3000); // Redirigir después de 1 segundo (se puede ajustar este valor según la necesidad)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (axios.isAxiosError(error) && error.response && error.response.data) toast.error(error.response.data.message);      }
      else {
        toast.error("Ocurrió un error al guardar la persona");

      }
      setIsLoading(false);
    }
  };
  const handleFormError = () => {
    // Mostrar un toast de error indicando que hay errores en el formulario
    toast.error('Por favor, completa correctamente todos los campos.');
  };




  useEffect(
    () => {

      const empresaEditLS = localStorage.getItem("empresaEdit")
      if (!empresaEditLS) return;
      const empresaEdit: { empresa: IEmpresa } = JSON.parse(empresaEditLS);
      toast.info("Editando empresa existente");
      setValue("RazonSocial", empresaEdit.empresa.razonSocial);
      setValue("TipoAdministracionCodigo", empresaEdit.empresa.tipoAdministracionCodigo);
      setValue("ActividadEconomicaPrincipalCodigo", empresaEdit.empresa.actividadEconomicaPrincipalCodigo ? empresaEdit.empresa.actividadEconomicaPrincipalCodigo : undefined);
      setValue("SectorActividadEconomicaCodigo", empresaEdit.empresa.sectorActividadEconomicaCodigo ? empresaEdit.empresa.sectorActividadEconomicaCodigo : undefined);
      setValue("ActividadEconomicaCodigo", empresaEdit.empresa.actividadEconomicaCodigo ? empresaEdit.empresa.sectorActividadEconomicaCodigo : undefined);
      setValue("Giro", empresaEdit.empresa.giro ? empresaEdit.empresa.giro : undefined);
      setValue("Direccion", empresaEdit.empresa.direccion ? empresaEdit.empresa.direccion : undefined);
      setValue("Email", empresaEdit.empresa.email ? empresaEdit.empresa.email : undefined);
      setValue("PaginaWeb", empresaEdit.empresa.paginaWeb ? empresaEdit.empresa.paginaWeb : undefined);
      setValue("Telefono1", empresaEdit.empresa.telefono1 ? empresaEdit.empresa.telefono1 : undefined);
      setValue("Telefono2", empresaEdit.empresa.telefono2 ? empresaEdit.empresa.telefono2 : undefined);
      setValue("Fax", empresaEdit.empresa.fax ? empresaEdit.empresa.fax : undefined);
      setValue("Celular", empresaEdit.empresa.celular ? empresaEdit.empresa.celular : undefined);
      setValue("AdministradorId", empresaEdit.empresa.administradorId ? empresaEdit.empresa.administradorId : undefined);
      setValue("GerenteRRHHId", empresaEdit.empresa.gerenteRRHHId ? empresaEdit.empresa.gerenteRRHHId : undefined);
      setValue("Bloqueada", empresaEdit.empresa.bloqueada);
      setValue("RutaReporte", empresaEdit.empresa.rutaReporte ? empresaEdit.empresa.rutaReporte : undefined);
      setValue("PieFirmaLiquidacion", empresaEdit.empresa.pieFirmaLiquidacion ? empresaEdit.empresa.pieFirmaLiquidacion : undefined);
      setValue("URL", empresaEdit.empresa.uRL ? empresaEdit.empresa.uRL : undefined);
      setValue("Id", empresaEdit.empresa.id);
    }, []);

  return (
    <div className="m-2">
      <Head>
        <title>Creacion de empresa</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit,handleFormError)}>
          <ContentForm title="Datos Empresa">
            <DatosEmpresa errors={errors} />
          </ContentForm>
          <ContentForm title="Contacto">
            <ContactoEmpresa errors={errors} />
          </ContentForm>
          <ContentForm title="Dirección">
            <DireccionEmpresa errors={errors} />
          </ContentForm>
          <ContentForm title="Administración">
            <Administracion errors={errors} />
          </ContentForm>

          <ContentForm title="Firma">
            <PieFirma errors={errors} />
          </ContentForm>

          <div className="my-2">
            <div className="flex flex-wrap md:justify-end lg:justify-end justify-center mx-4">
              <Button color="primary"
              >Guardar</Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
