import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext";


const useLogin = () => {
  const [loading,setLoading] = useState(false);
  const {setAuthUser}=useAuthContext();

  const login = async (userName,password)=>{
    const success = handleInputErrors({userName, password});
		if (!success) return;
    setLoading(true)
    try {
        const res = await fetch("/api/auth/login",{
            method:"POST",
            headers:{"content-type" : "application/json"},
            body : JSON.stringify({userName,password})
        });
        const data = await res.json()
        if(data.error){
            throw new Error(data.error)
        }
        localStorage.setItem("user-info",JSON.stringify(data))
        setAuthUser(data)

    } catch (error) {
        toast.error(error.message)
    } finally{
        setLoading(false)
    }

  }
  return {loading,login}
}

export default useLogin

function handleInputErrors({ fullName, userName, password, confirmPassword, gender }) {
	if (!userName || !password ) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}