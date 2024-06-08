import { useContext } from "react";
import { AuthContext } from "../ContextProvider/Context";


export default function useAuth() {
    return useContext(AuthContext);
}
