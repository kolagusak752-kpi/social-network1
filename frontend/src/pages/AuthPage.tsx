import LoginForm from "../components/AuthForm/LoginForm/LoginForm"
import RegistrForm from "../components/AuthForm/RegistrForm/RegistrForm"
import VerifyForm from "../components/AuthForm/VerifyForm/VerifyForm"
interface AuthProps {
    form:string
}
export default function AuthPage({form}:AuthProps) {
    return (
        <>
           {form === "login" && <LoginForm />}
           {form === "registration" && <RegistrForm />}
           {form === "verify" && <VerifyForm />}
        </>
    )
}