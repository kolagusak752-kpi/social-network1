import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function LoginForm() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      let deviceId = localStorage.getItem("deviceId")
      if(!deviceId) {
        deviceId = crypto.randomUUID()
        localStorage.setItem("deviceId", deviceId)
      }
      await login({ email: loginInput, password,deviceId});
      await checkAuth()
      navigate("/");
    } catch (error:any) {
      setError(error.message)
      console.log("login error:", error);
    }
  }
  if(error) {
    return(
      <div>
        {error}
      </div>
    )
  }
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={(e)=>handleSubmit(e)}>
        <h2 className="auth-title">Вхід</h2>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login">
            Логін
          </label>
          <input
            id="login"
            className="auth-input"
            type="text"
            placeholder="Введіть логін..."
            onChange={(e) => setLoginInput(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-button">
          Увійти
        </button>
        <Link className="link" to="/registration">
          Ще немає акаунту?Зареєструватися
        </Link>
      </form>
    </div>
  );
}
