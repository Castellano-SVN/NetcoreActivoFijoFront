import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Menu } from "react-daisyui";
import { useContextStore } from "../store/context.store";
interface props {
  open: () => void;
}
interface Imenus {
  label: string;
  action?: () => {};
  children?: Imenus[];
}
export default function Menus(props: props) {
  const router = useRouter();
  const [openBodega, setOpenBodega] = useState(false);
  const [openEmpresa, setOpenEmpresa] = useState(false);
  const [openAlmacen, setOpenAlmacen] = useState(false);
  const {menus} = useContextStore()

  const toggleBodega = useCallback(() => {
    setOpenBodega((val) => !val);
  }, [openBodega]);

  const toggleAlmacen = useCallback(() => {
    setOpenAlmacen((val) => !val);
  }, [openAlmacen]);

  const toggleEmpresa = useCallback(() => {
    setOpenEmpresa((val) => !val);
  }, [openEmpresa]);
  return (
    <>
    <Menu className="p-4 w-80 h-full bg-primary text-base-100">
      <Menu.Item className="border-b flex flex-row justify-end mb-2">
        <a onClick={props.open} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0_2_26747)">
              <path
                d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_2_26747">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
      </Menu.Item>
      {
          menus.map((e,index) => 
          <Menu.Item  key={index} className={e.active ? "font-extrabold" : ""}>
            <a  onClick={() => router.push(e.href)}>{e.name}</a>
          </Menu.Item>)
        }
    </Menu>
    </>
  );
}
