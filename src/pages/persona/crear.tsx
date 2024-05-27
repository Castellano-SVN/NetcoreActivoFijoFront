import Image from "next/image";
import { Inter } from "next/font/google";
import { Location } from "../../components/location";
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
import ContentForm from "../../components/contentForm";
import Rut from "../../components/bodega/persona/rut";
import Nombre from "../../components/bodega/persona/nombre";
import Contacto from "../../components/bodega/persona/contacto";
import Observaciones from "../../components/bodega/persona/observaciones";
import InfoLaboral from "../../components/bodega/persona/infolaboral";
import NacionalidadEstadoCivil from "../../components/bodega/persona/NacionalidadEstadoCivil";
import LugarNacimiento from "../../components/bodega/persona/LugarNacimiento";
import { Alert, Button, Modal, Toast } from "react-daisyui";
import { isValidRUT, zodRut, nullableNumber } from "@/helpers/validations";
import Nacimiento from "../../components/bodega/persona/nacimiento";
import { validate } from "rut.js";
import { IPersona, PersonaFormValues } from "../../interfaces/creation";
import { DiCode } from "react-icons/di";
import { api_postPersonas, api_putPersonas } from "../../services/bodega.service";
import { useUserStore } from "../../store/user.store";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import router from "next/router";
import { useTiposStore } from "../../store/tipos.store";
import { api_getCiudades, api_getComuna, api_getRegiones } from "../../services/tipos.service";

export default function CreatePerson() {
  const validationSchema = z.object({
    Id: z.string().optional(),
    RunCuerpo: z
      .number({
        required_error: "Run requerido",
        invalid_type_error: "Run incorrecto",
      })
      .min(4, { message: "Run incorrecto" }),
    RunDigito: z.string({}).optional(),
    Nombre: z.string().optional(),
    Nombres: z.string().min(3, { message: "Nombre inválido" }),
    ApellidoPaterno: z
      .string()
      .min(3, { message: "Apellido Paterno inválido" }),
    ApellidoMaterno: z
      .string()
      .refine((value) => value.trim().length === 0 || value.length >= 3, {
        message:
          "El Apellido Materno debe tener al menos 3 caracteres o estar vacío",
      })
      .optional(),
    Email: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    SexoCodigo: z.number({
      required_error: "Opción inválida",
      invalid_type_error: "Opción inválida",
    }),
    FechaNacimiento: z
      .date({ invalid_type_error: "Campo inválido" })
      .optional(),
    NacionalidadCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional(),
    EstadoCivilCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional(),
    NivelEducacionalCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional(),
    RegionCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional(),
    CiudadCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional(),
    ComunaCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional(),
    RegionNacimientoCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional().default(0),
    CiudadNacimientoCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional().default(0),
    ComunaNacimientoCodigo: z
      .number({
        required_error: "Opción inválida",
        invalid_type_error: "Opción inválida",
      })
      .optional().default(0),
    VillaPoblacion: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    Direccion: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    Telefono: z
      .number({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    Celular: z
      .number({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    Observaciones: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    Ocupacion: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    TelefonoLaboral: z
      .number({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    DireccionLaboral: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    Huella: z
      .any({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    ImagenHuella: z
      .any({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    AreaGeograficaCodigo: z
      .number({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    NroDepartamento: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<PersonaFormValues>({
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

  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);
  const { jwt } = useUserStore();
  const {
    setRegiones,
    setCiudades,
    setComunas,
    regiones
  } = useTiposStore();
  const test = watch("FechaNacimiento");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      if (data.Id) {
        await api_putPersonas(jwt, data);
        toast.success("Persona actualizada correctamente");
      } else {
        await api_postPersonas(jwt, data);
        toast.success("Persona guardada correctamente");
      }
      setIsLoading(false);
      setTimeout(() => {
        router.back();
      }, 3000); // Redirigir después de 1 segundo (se puede ajustar este valor según la necesidad)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (axios.isAxiosError(error) && error.response && error.response.data) toast.error(error.response.data.message)
      }
      else {
        toast.error("Ocurrió un error al guardar la persona");

      }
      setIsLoading(false);
    }
  };
  const [show, setShow] = useState<boolean>(false);
  const handleFormError = () => {
    // Mostrar un toast de error indicando que hay errores en el formulario
    toast.error('Por favor, completa correctamente todos los campos.');
  };
  const getRegionesList = async () => {
    try {
      const regiones = await api_getRegiones(jwt);
      setRegiones(regiones.data.dataList);
    } catch (error) {
      console.log(error);
    }
  }

  const getComunasList = async (region: number, ciudad: number) => {
    try {
      const list = await api_getComuna(jwt, region, ciudad);
      setComunas(list.data.dataList);
    } catch (error) {
      console.log(error);
    }
  }
  const getCiudadesList = async (region: number) => {
    try {
      const ciudades = await api_getCiudades(jwt, region);
      setCiudades(ciudades.data.dataList);
    } catch (error) {
      console.log(error);
    }
  }
  const setUserEdit = async () => {

    const personaEditLS = localStorage.getItem("personaEdit")
    if (!personaEditLS) {
      setShow(true);
      return
    };
    const personaEdit: { persona: IPersona } = JSON.parse(personaEditLS);
    await getRegionesList();
    if (personaEdit.persona.regionCodigo) await getCiudadesList(personaEdit.persona.regionCodigo)
    if (personaEdit.persona.regionCodigo && personaEdit.persona.ciudadCodigo) await getComunasList(personaEdit.persona.regionCodigo, personaEdit.persona.ciudadCodigo)
    toast.info("Editando persona existente");
    setValue("Nombres", personaEdit.persona.nombres);
    setValue("Id", personaEdit.persona.id);
    setValue("ApellidoPaterno", personaEdit.persona.apellidoPaterno);
    setValue("ApellidoMaterno", personaEdit.persona.apellidoMaterno ? personaEdit.persona.apellidoMaterno : undefined);
    setValue("Telefono", personaEdit.persona.telefono ? personaEdit.persona.telefono : undefined);
    setValue("Celular", personaEdit.persona.celular ? personaEdit.persona.celular : undefined);
    setValue("Email", personaEdit.persona.email ? personaEdit.persona.email : undefined);
    setValue("RegionCodigo", personaEdit.persona.regionCodigo ? personaEdit.persona.regionCodigo : 0);
    setValue("CiudadCodigo", personaEdit.persona.ciudadCodigo ? personaEdit.persona.ciudadCodigo : 0);
    setValue("ComunaCodigo", personaEdit.persona.comunaCodigo ? personaEdit.persona.comunaCodigo : 0);
    setValue("VillaPoblacion", personaEdit.persona.villaPoblacion ? personaEdit.persona.villaPoblacion : undefined);
    setValue("NroDepartamento", personaEdit.persona.nroDepartamento ? personaEdit.persona.nroDepartamento : undefined);
    setValue("Direccion", personaEdit.persona.direccion ? personaEdit.persona.direccion : undefined);
    setValue("NacionalidadCodigo", personaEdit.persona.nacionalidadCodigo ? personaEdit.persona.nacionalidadCodigo : undefined);
    setValue("EstadoCivilCodigo", personaEdit.persona.estadoCivilCodigo ? personaEdit.persona.estadoCivilCodigo : undefined);
    setValue("FechaNacimiento", personaEdit.persona.fechaNacimiento ? new Date(personaEdit.persona.fechaNacimiento) : undefined);
    setValue("SexoCodigo", personaEdit.persona.sexoCodigo);
    setValue("RegionNacimientoCodigo", personaEdit.persona.regionNacimientoCodigo ? personaEdit.persona.regionNacimientoCodigo : undefined);
    setValue("CiudadNacimientoCodigo", personaEdit.persona.ciudadNacimientoCodigo ? personaEdit.persona.ciudadNacimientoCodigo : undefined);
    setValue("ComunaNacimientoCodigo", personaEdit.persona.comunaNacimientoCodigo ? personaEdit.persona.comunaNacimientoCodigo : undefined);
    setValue("NivelEducacionalCodigo", personaEdit.persona.nivelEducacionalCodigo ? personaEdit.persona.nivelEducacionalCodigo : undefined);
    setValue("AreaGeograficaCodigo", personaEdit.persona.areaGeograficaCodigo ? personaEdit.persona.areaGeograficaCodigo : undefined);
    setValue("Ocupacion", personaEdit.persona.ocupacion ? personaEdit.persona.ocupacion : undefined);
    setValue("TelefonoLaboral", personaEdit.persona.telefonoLaboral ? personaEdit.persona.telefonoLaboral : undefined);
    setValue("DireccionLaboral", personaEdit.persona.direccionLaboral ? personaEdit.persona.direccionLaboral : undefined);
    setValue("Observaciones", personaEdit.persona.observaciones ? personaEdit.persona.observaciones : undefined);
    setShow(true);
  }
  useEffect(
    () => {
      setUserEdit();
    }, []);

  return (
    <div className="m-2">
      <Head>
        <title>Creacion de persona</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button size="sm" onClick={handleShow}>
        <DiCode className="w-full h-full text-error" />
      </Button>
      {show && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, handleFormError)}>
            <ContentForm title="Datos Personales">
              <Rut errors={errors} />
              <Nombre errors={errors} />
              <Contacto errors={errors} />
              <Location errors={errors} />
              <NacionalidadEstadoCivil errors={errors} />
              <Nacimiento errors={errors} />
              <LugarNacimiento errors={errors} />
            </ContentForm>
            <ContentForm title="Datos Laborales">
              <InfoLaboral errors={errors} />
            </ContentForm>
            <ContentForm title="Observaciones">
              <Observaciones errors={errors} />
            </ContentForm>


            <div className="my-2">
              <div className="flex flex-wrap md:justify-end lg:justify-end justify-center mx-4">
                <Button loading={isLoading} disabled={isLoading} color="primary">
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      )}

    </div>
  );
}
