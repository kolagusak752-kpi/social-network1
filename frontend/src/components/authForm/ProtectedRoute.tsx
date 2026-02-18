import { Navigate } from "react-router-dom";
export default function ProtectedRoute() {
    const isAuth: boolean = false
    if(isAuth!) {
        return <Navigate to = "/login" replace></Navigate>
    }
    return <div></div>
}