import { Navigate, Outlet } from "react-router-dom" 
import { useAuthStore } from "../store/useAuthStore"
import { Loader } from "lucide-react"

const AdminRoute = () => {
    const {authUser, ischeckingAuth} = useAuthStore()

    if(ischeckingAuth){
        return <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin "/>
        </div>
    }

    if(!authUser || authUser.role !== "ADMIN"){
       return <Navigate to={"/"}/>
    }


  return <Outlet/>
}

export default AdminRoute