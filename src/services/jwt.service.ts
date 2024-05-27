import axios from "axios"

const url= process.env.NEXT_PUBLIC_BACKEND_URL;
const generateToken = async (rut:string) => axios.get(`${url}GetToken/${rut}`)

export { generateToken}


