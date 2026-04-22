import LoginForm from "../components/AuthForm/LoginForm/LoginForm"
import RegistrForm from "../components/AuthForm/RegistrForm/RegistrForm"
interface AuthProps {
    form:string
}
export default function AuthPage({form}:AuthProps) {
    return (
        <>
           {form === "login" && <LoginForm />}
           {form === "register" && <RegistrForm />}
        </>
    )
}