
import { ReactElement } from "react";


export default interface  alertInterface{
    status: boolean;
    icon?: ReactElement<any, any>;
    text: string;
}