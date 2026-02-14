import { useNavigate } from "react-router-dom"
export default function LandingPage() {
    const navigate = useNavigate()
    return (
    <div>
         <button onClick = {() => navigate("/login")}>
            Войти
        </button>
        <button onClick = {() => navigate("/registration")}>
            Зарегистрироваться
        </button>
    </div>

    )
}