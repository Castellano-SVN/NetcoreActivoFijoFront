import { useMutation } from "react-query";
import { useUserStore } from "../store/user.store";
import { generateToken } from "../services/jwt.service";
import { useCallback, useEffect, useState } from "react";
import TopBar from "./topBar";
import Body from "./body";
import { Drawer, Loading } from "react-daisyui";
import Menus from "./menus";
import InfoBar from "./infoBar";
import { useRouter } from "next/router";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  const remotetoken = router.isReady
    ? (router.query.remotetoken as string | undefined)
    : undefined;

  const { setJwt, jwt } = useUserStore();
  const mutation = useMutation(generateToken);

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
    const fetchToken = async (rut: string) => {
      setLoading(true);
      try {
        
        const result = await mutation.mutateAsync(rut);
        if (result.data) {
          setJwt(result.data);
          const { remotetoken: _, ...restQuery } = router.query;
          router.replace(
            {
              pathname: router.pathname,
              query: restQuery,
            },
            undefined,
            { shallow: true },
          );
        }
      } catch (error) {
        console.error("Error al generar el token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!router.isReady || !remotetoken) return;
    fetchToken(remotetoken);
  }, [router.isReady, remotetoken]);

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" color="primary" />
      </div>
    );
  }

  if (!jwt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold text-primary">
          Sesión no iniciada
        </h1>
        <p className="max-w-md text-base-content/80">
          Debe acceder desde el portal de membresía Netcore con un enlace que
          incluya el parámetro{" "}
          <code className="rounded bg-neutral px-1">remotetoken</code>, o tener
          una sesión activa en este navegador.
        </p>
      </div>
    );
  }

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
        {jwt !== "" && !loading &&<><InfoBar /><TopBar open={toggleVisible} /></>}
        {jwt !== "" && !loading ? (
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
