import { useMutation } from "react-query";
import { useUserStore } from "../store/user.store";
import { generateToken } from "../services/jwt.service";
import { useCallback, useEffect, useState } from "react";
import TopBar from "./topBar";
import Body from "./body";
import { Drawer, Menu } from "react-daisyui";
import Menus from "./menus";
import InfoBar from "./infoBar";
type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  const { setJwt, jwt } = useUserStore();
  const mutation = useMutation(generateToken);
  useEffect(() => {
    const token = async () => {
      try {
        const result = await mutation.mutateAsync("10.680.150-9");
        if (result.data) {
          setJwt(result.data);
        }
      } catch (error) {
        console.error("Error al generar el token:", error);
      }
    };

    token();
  }, []);
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
