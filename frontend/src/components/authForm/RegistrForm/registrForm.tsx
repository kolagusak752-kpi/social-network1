import { useState } from "react";
import { register } from "../../../api/auth";
import { useNavigate } from "react-router-dom";

export default function RegistrForm() {
  const [login, setLogin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error("Паролі не збігаються");
      }
      let deviceId = crypto.randomUUID();
      await register({ email: login, username, password, deviceId });
      localStorage.setItem("deviceId", deviceId);
      navigate("/login");
    } catch (error: any) {
      setError(error.message);
    }
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Регистрация</h2>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login">
              Email (Логин)
            </label>
            <input
              id="login"
              className="auth-input"
              type="email"
              placeholder="Введите email"
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="username">
              Имя пользователя
            </label>
            <input
              id="username"
              className="auth-input"
              type="text"
              placeholder="Придумайте никнейм"
              onChange={(e) => setUsername(e.target.value)}
              required
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
              placeholder="Введите пароль"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              className="auth-input"
              type="password"
              placeholder="Повторите пароль"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </>
  );
}
