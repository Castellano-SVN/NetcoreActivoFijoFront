import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Menu,
  Modal,
  Navbar,
} from "react-daisyui";
import { BellIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { FaAlignJustify } from "react-icons/fa6";
import { useContextStore } from "../store/context.store";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/user.store";
import { api_getMyNotifys } from "@/services/informes.service";

interface props {
  open: () => void;
}

export default function TopBar(props: props) {
  const { menus } = useContextStore();
  const router = useRouter();
  const { jwt } = useUserStore();

  // Estados para notificación
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para cargar notificaciones
 const fetchNotificationCount = useCallback(async () => {
  try {
    setLoading(true);
    const response = await api_getMyNotifys(jwt);
    setNotificationCount(response.data.data.count);
  } catch (error) {
    console.log(error);
    toast.error("Ha ocurrido un error al obtener las notificaciones");
  } finally {
    setLoading(false);
  }
}, []);

  // Ejecutar al montar el componente y en cada cambio de ruta
  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount, router.pathname]);

  const handleClickIrInventario = () => {
    router.push("/inventario");
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar className="shadow-md bg-primary text-base-100">
        <div className="hidden lg:flex flex-1">
          <Menu horizontal className="px-1">
            {menus.map((e, index) => (
              <Menu.Item
                key={index}
                className={e.active ? "font-extrabold" : ""}
              >
                <a onClick={() => router.push(e.href)}>{e.name}</a>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        
        <div className="lg:hidden flex flex-1 justify-end">
          <Button
            tag="a"
            color="ghost"
            tabIndex={0}
            className="lg:hidden"
            onClick={() => props.open()}
          >
            <FaAlignJustify className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Botón de notificaciones (lado derecho) */}
        <div className="flex-none">
          <div className="relative">
            <Button
              shape="circle"
              color="ghost"
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <BellIcon className="w-6 h-6" />
              )}
            </Button>

            {/* Mostrar spinner o contador según el estado */}
            {loading ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
                <span className="animate-spin">
                  <ArrowPathIcon className="w-4 h-4 text-primary" />
                </span>
              </span>
            ) : notificationCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                {notificationCount}
              </span>
            ) : null}
          </div>
        </div>
      </Navbar>
      
      <Modal open={isModalOpen}>
        <Modal.Header className="font-bold">Notificaciones</Modal.Header>
        <Modal.Body>
          <p>
            Tienes <span className="font-bold">{notificationCount}</span>{" "}
            inventario(s) por registrar
          </p>
        </Modal.Body>
        <Modal.Actions>
          <Button color="primary" onClick={handleClickIrInventario}>
            Ir a inventario
          </Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>
            Cerrar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}