import { useUserStore } from "../store/user.store";
import { useCallback, useEffect, useRef, useState } from "react";
import TopBar from "./topBar";
import Body from "./body";
import { Drawer, Loading } from "react-daisyui";
import Menus from "./menus";
import InfoBar from "./infoBar";

type LayoutProps = {
  children: React.ReactNode;
};

const LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL || "https://login.netcore.cl";

function isValidToken(value: string | null | undefined): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.toLowerCase() === "null") return false;
  if (trimmed.toLowerCase() === "undefined") return false;
  return true;
}

export default function Layout(props: LayoutProps) {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const processed = useRef(false);

  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  const { setJwt, jwt } = useUserStore();

  useEffect(() => {
    const unsubHydrate = useUserStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsubHydrate;
  }, []);

  useEffect(() => {
    if (!hydrated || processed.current) return;
    processed.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const hasUserParam = urlParams.has("user");
    const tokenFromUrl = urlParams.get("user");
    const tokenFromStore = jwt;

    // ?user= vacío, null o inválido → login
    if (hasUserParam && !isValidToken(tokenFromUrl)) {
      window.location.href = LOGIN_URL;
      return;
    }

    // Token válido en la URL → guardar y limpiar query
    if (isValidToken(tokenFromUrl)) {
      setJwt(tokenFromUrl);
      urlParams.delete("user");
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
      setReady(true);
      return;
    }

    // Sin token en URL ni sesión previa → login
    if (!isValidToken(tokenFromStore)) {
      window.location.href = LOGIN_URL;
      return;
    }

    setReady(true);
  }, [hydrated, jwt, setJwt]);

  if (!hydrated || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" color="primary" />
      </div>
    );
  }

  if (!jwt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" color="primary" />
      </div>
    );
  }

  return (
    <>
      <Drawer
        open={visible}
        className="z-999"
        onClickOverlay={toggleVisible}
        side={<Menus open={toggleVisible} />}
      >
        <InfoBar />
        <TopBar open={toggleVisible} />
        <Body>{props.children}</Body>
      </Drawer>
    </>
  );
}
