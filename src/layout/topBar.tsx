import { useMutation } from "react-query";
import { useUserStore } from "../store/user.store";
import { generateToken } from "../services/jwt.service";
import { useCallback, useEffect, useState } from "react";
import { Button, Drawer, Dropdown, Menu, Navbar, Tabs } from "react-daisyui";
import { Bars3Icon } from '@heroicons/react/20/solid';
import { useRouter } from "next/router";
import { FaAlignJustify } from "react-icons/fa6";
import { useContextStore } from "../store/context.store";
interface props {
  open: () => void;
}
export default function TopBar(props: props) {
 const {menus} = useContextStore()
  const router = useRouter();
  const handleClick = (path: string) => {
    router.push(path); //path es nuestro camino 
  };
  return (
    <>
       <Navbar className="shadow-md bg-primary text-base-100">
       <div className="hidden lg:flex flex-1">
       <Menu horizontal className="px-1">
       {
  menus.map((e, index) => {
    if (e.children.length === 0) {
      return (
        <Menu.Item key={index} className={e.active ? "font-extrabold" : ""}>
          <a onClick={() => router.push(e.href)}>{e.name}</a>
        </Menu.Item>
      );
    } else {
      return (
<Menu.Item>
            <details>
              <summary className={e.active ? "font-extrabold" : ""} >{e.name}</summary>
              <ul className="p-2 bg-primary">
                {
                   e.children.map((children, index) => (
                  <li>
                    <a onClick={() => router.push(children.href)} className={children.active ? "font-extrabold" : ""}>{children.name}</a>
                  </li>
                  )
                )}
                
              </ul>
            </details>
          </Menu.Item>
      );
    }
  })
}
          {/* <Menu.Item className="font-extrabold	">
            <a onClick={() => router.push("/empresa")}>Prestadores</a>
          </Menu.Item>
          <Menu.Item>
            <a>Recepcion</a>
          </Menu.Item>
          <Menu.Item>
            <a>Despacho</a>
          </Menu.Item> */}
        </Menu>
      </div>
      <div className="lg:hidden flex flex-1 justify-end">
      <Button tag="a"  color="ghost" tabIndex={0} className="lg:hidden" onClick={() => props.open()}>
      <FaAlignJustify className="w-6 h-6"/>
          </Button>
      </div>
    </Navbar>
    </>
  )
}
