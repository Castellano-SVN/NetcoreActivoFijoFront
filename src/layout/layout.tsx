import { useUserStore } from "../store/user.store";
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

  const userToken = router.isReady
    ? (router.query.user as string | undefined)
    : undefined;

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
    if (!router.isReady || !hydrated) return;

    if (!userToken) return;

    setLoading(true);
    try {
      setJwt(userToken);
      const { user: _, ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true },
      );
    } finally {
      setLoading(false);
    }
  }, [router.isReady, hydrated, userToken]);

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
          <code className="rounded bg-neutral px-1">user</code>, o tener
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
