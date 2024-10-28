import { useMutation } from "react-query";
import { useUserStore } from "../store/user.store";
import { generateToken } from "../services/jwt.service";
import { useCallback, useEffect, useState } from "react";
import TopBar from "./topBar";
import Body from "./body";
import { Drawer, Loading, Menu } from "react-daisyui";
import Menus from "./menus";
import InfoBar from "./infoBar";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false);
  const [loading,setLoading] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);
  const rut = searchParams.get('remotetoken')
  const router = useRouter();

  const { setJwt, jwt } = useUserStore();
  const mutation = useMutation(generateToken);
  useEffect(() => {
    const token = async (rut:string) => {
      try {
        const result = await mutation.mutateAsync(rut);
        if (result.data) {
          const params = new URLSearchParams(window.location.search);
          setLoading(true)
          setJwt(result.data);
          params.delete('remotetoken');
          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()), // Convertir los parámetros restantes a un objeto
          }, undefined, { shallow: true });
        }
      } catch (error) {
        console.error("Error al generar el token:", error);
      }
    };
    if (!rut || rut === null) return;
    token(rut);
  }, [rut]);
  
  if (!jwt )return ( <div className="flex items-center justify-center min-h-screen">
    <Loading size="lg" color="primary" />
  </div>)
  return (
    <>
      <Drawer
        open={visible}
        className="z-999"
        onClickOverlay={toggleVisible}
        side={
          <Menus open={toggleVisible}/>
        }
      >
        {jwt !== "" && <><InfoBar /><TopBar open={toggleVisible} /></>}
        {jwt !== "" ? (
            <Body>{props.children}</Body>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
      </Drawer>
    </>
  );
}
