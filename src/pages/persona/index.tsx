import { useQuery } from "react-query";
import { api_getPersonas, api_postPersonas_huella } from "../../services/bodega.service";
import { useUserStore } from "../../store/user.store";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { MdFactory } from "react-icons/md";
import { useRouter } from "next/router";
import { Divider } from "react-daisyui";
import { RiFingerprintLine } from "react-icons/ri";
import { IPersona } from "@/interfaces/creation";
import { toast } from "react-toastify";



export default function Index() {
  const { jwt } = useUserStore();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState<number>(1);
  const { isLoading, error, data, refetch } = useQuery(
    "personas",
    () => api_getPersonas(jwt, page),
    {
      enabled: true,
      onSuccess: (data) => {
        setMeta({
          total: data.data.total,
          pages: data.data.pages,
        });
      },
    }
  );
  useEffect(() => {
    refetch()
  }, [page])
  return (
    <>
      <MenuPersonas total={meta.total} isLoading={isLoading} />
      <div className="border-b border-primary my-4" />
      <div className="flex flex-wrap justify-around">
        {data?.data.dataList.map((option: IPersona, index: number) => (
          <div key={index} className="w-full lg:w-1/3 p-4 md:w-1/3">
            <PersonaShow persona={option} />
          </div>
        ))}
      </div>
      <PersonaPagination page={page} totalPages={meta.pages} setPage={setPage}></PersonaPagination>
    </>
  );
}

function MenuPersonas({
  total,
  isLoading,
}: {
  total: number;
  isLoading: boolean;
}) {
  const { push } = useRouter();

  return (
    <>
      <div className="container px-5 md:px-10 lg:px-10 py-2 flex flex-col lg:flex-row md:flex-row justify-around ">
        <div className="flex justify-center text-center">
          <div className={isLoading ? "stats shadow shadow-primary skeleton text-primary w-4/5 md:w-auto lg:w-auto" : "stats shadow shadow-primary text-primary w-4/5 md:w-auto lg:w-auto"}>
            <div className="stat">
              <div className="stat-title">
                {isLoading ? (
                  <span style={{ color: "transparent" }}>{total}</span>
                ) : (
                  <div className="text-primary">Total Usuarios</div>
                )}
              </div>
              <div className="stat-value text-center">
                {isLoading ? (
                  <span style={{ color: "transparent" }}>{total}</span>
                ) : (
                  total
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            toast.info('Agregando nueva persona');
            localStorage.removeItem("personaEdit")
            localStorage.removeItem("region")
            localStorage.removeItem("rutedit")
            push("/persona/crear")
          }}
          className="self-center btn btn-primary sm:btn-xs md:btn-sm lg:btn-md md:my-0 my-2 btn-outline rounded-lg"
        >
          Agregar <FaPlus />
        </button>



      </div>
    </>


  );
}


function PersonaShow({ persona }: { persona: IPersona }) {
  const { push } = useRouter();
  const { jwt } = useUserStore();

  const edit = (persona: IPersona) => {
    localStorage.setItem("personaEdit", JSON.stringify({ persona: persona }))
    localStorage.setItem("region", JSON.stringify({ region: persona.regionCodigo, ciudad: persona.ciudadCodigo, comuna: persona.comunaCodigo }))
    localStorage.setItem("rutedit", JSON.stringify({ runcuerpo: persona.runCuerpo, rundigito: persona.runDigito }))
    push("/persona/crear")
  }
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };


  const handleUpload = async () => {
    if (selectedFile) {
      // Aquí puedes enviar el archivo al servidor
      console.log(selectedFile);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        await api_postPersonas_huella(jwt, persona.id as string, formData)

      } catch (error) {

      }
    } else {
      // toast('Selecciona un archivo primero');
    }
  };
  return (
    <div className="rounded-lg border border-primary shadow-md hover:shadow-xl transition duration-300 ease-in-out w-full h-full">
      <div className="bg-primary px-6 py-4 rounded-t-lg">
        <h3 className="text-large font-bold text-white w-full h-full">
          {persona.nombres?.toUpperCase()} {persona.apellidoPaterno?.toUpperCase()} {persona.apellidoMaterno?.toUpperCase()}
        </h3>
      </div>
      <div className="p-6 flex-grow mb-3">
        <p className="text-gray-800">
          <span className="font-semibold">Email:</span> {persona.email || "Sin información."}
        </p>
        <p className="text-gray-800 mt-2">
          <span className="font-semibold">Teléfono:</span> {persona.celular || "Sin información."}
        </p>
        <p className="text-gray-800 mt-2 md:inline-block whitespace-nowrap">
          <span className="font-semibold">Huella:</span> <span className="">{persona.huella ? "Huella registrada." : "Sin registros."}</span>
        </p>
      </div>

      <div className="border-b border-primary my-4" />
      
      <div className="flex  justify-around m-2">

        <div className="tooltip" data-tip="Editar Huella">
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button className="btn bg-transparent border-none " onClick={() => {
            const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}>
            <RiFingerprintLine className={`h-7 w-7 bg-transparent border-none ${persona.huella ? 'text-primary' : 'text-error'
              }`} />
          </button>

          <dialog id="my_modal_1" className="modal">
            <div className="modal-box p-4 bg-white rounded-lg shadow-lg">
              <h3 className="font-bold text-xl mb-2">Editar Huella Digital</h3>
              <p className="text-sm mb-4">Selecciona una imagen para subir:</p>
              <div className="flex items-center justify-center p-2 rounded-md">
                <input
                  type="file"
                  className="file-input file-input-sm  max-w-xs border-none"
                  accept="image/png, image/jpeg, image/gif, image/bmp, image/webp"
                  onChange={handleFileChange}

                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUpload}
                  className="btn btn-primary px-4 py-2 mr-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                >
                  Subir
                </button>

                <button
                  className="btn btn-secondary px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-md"
                  onClick={() => {
                    const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
                    if (modal) {
                      modal.close();
                    }
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </dialog>

        </div>

        <div className="tooltip" data-tip="Editar Persona">
          <button onClick={() => { edit(persona) }}>
            <FaPencilAlt className="h-6 w-6 text-error mt-2" />
          </button>

        </div>
      </div>

    </div>
  );
}



function PersonaPagination({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn btn-primary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Página anterior
        </button>
        <div className="text-lg text-accent">
          Página {page} de {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-primary btn-outline rounded-lg px-6 py-2 text-lg md:text-base"
        >
          Próxima página
        </button>
      </div>
    </div>
  );
}
