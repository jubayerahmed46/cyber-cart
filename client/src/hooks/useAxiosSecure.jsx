import axios from "axios";
import { useEffect } from "react";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

function useAxiosSecure() {
  useEffect(() => {
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  return instance;
}

export default useAxiosSecure;
