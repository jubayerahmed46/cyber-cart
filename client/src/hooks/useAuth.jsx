import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
