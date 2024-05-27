import { useMutation } from "react-query";
import { useUserStore } from "../store/user.store";
import { generateToken } from "../services/jwt.service";
import { useEffect } from "react";
import TopBar from "./topBar";
import { Breadcrumbs } from "react-daisyui";
type LayoutProps = {
  children: React.ReactNode;
};

export default function Body(props: LayoutProps) {
  return (
        <div className="m-1 md:m-4  text-center">
        {props.children}
        </div>
  );
}
