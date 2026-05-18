import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"

const PrivateRoute = () => {
    let {user} = useAuth()
  
    return (
        user ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default PrivateRoute