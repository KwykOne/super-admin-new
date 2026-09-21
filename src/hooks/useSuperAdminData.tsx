import { RootState } from "@/store";
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux";

export default function useAdminData() {
    const token = localStorage.getItem('userToken')
  const [admins, setAdmins] = useState([]);
  const mode = useSelector((state: RootState) => state.modal.mode);

  const baseURL = mode === 'dev'
    ? import.meta.env.VITE_BACKEND_DEV_URL
    : import.meta.env.VITE_BACKEND_PROD_URL;

  const getAdmins = useCallback(async (): Promise<any[] | null> => {
    try {
      const response = await axios.get(`${baseURL}api/v1/admin/get-superadmins`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      });
      const nextAdmins = Array.isArray(response.data?.data) ? response.data.data : [];
      setAdmins(nextAdmins);
      return nextAdmins;
    } catch (err) {
      console.error("Error fetching admins:", err);
      return null;
    }
  }, [baseURL, token]);

  useEffect(() => {
    getAdmins(); // fetch on mount
    const id = setInterval(() => {
      getAdmins(); // fetch every 3 seconds
    }, 3000);

    return () => clearInterval(id); // cleanup
  }, [getAdmins]);

  return { admins, refreshAdmins: getAdmins };
}
