import { FaPlus } from "react-icons/fa";
interface props {
    change: () => void;
}
export default function CreateSubFamily(props: props) {
  return (
    <>
      <div className="flex flex-row justify-start md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
        <div className="flex flex-col">
          <span className="font-bold text-xl">Editor de subfamilias</span>
        </div>
      </div>
      <div className="flex flex-col">

          
            <div className="mt-2">
              <button
                className="px-16 btn btn-primary btn-primary"
               
              >
                Crear Familia <FaPlus />
              </button>
              <div className="my-2">
          <button
            className="px-16 btn btn-outline btn-primary"
            onClick={() => props.change()}
          >
            Volver
          </button>
        </div>
            </div>
            </div>
    </>
  );
}
