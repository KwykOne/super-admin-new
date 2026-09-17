import { RootState } from "@/store";
import axios from "axios";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

export default function useAdminData() {
    const token = localStorage.getItem('userToken')
  const [admins, setAdmins] = useState([]);
  const mode = useSelector((state: RootState) => state.modal.mode);

  const baseURL = mode === 'dev' 
    ? import.meta.env.VITE_BACKEND_DEV_URL 
    : import.meta.env.VITE_BACKEND_PROD_URL;

  async function getAdmins() {
    try {
      const response = await axios.get(`${baseURL}api/v1/admin/get-superadmins`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      });
      setAdmins(response.data.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  }

  useEffect(() => {
    getAdmins(); // fetch on mount
    const id = setInterval(() => {
      getAdmins(); // fetch every 3 seconds
    }, 3000);

    return () => clearInterval(id); // cleanup
  }, []);

  return { admins };
}
