import { useEffect, useState } from "react";
import { authApi } from "../../../api/auth";
import { usersApi } from "../../../api/users";
import { useNavigate } from "react-router-dom";
import UseDebounce from "../../../hooks/UseDebounce";

export default function RegistrForm() {
  const [login, setLogin] = useState("");
  const [username, setUsername] = useState("");
  const debouncedUsername = UseDebounce(username, 500);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ isError: false, message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedUsername) return;
    usersApi.checkUsername(debouncedUsername)
      .then((data) => {
        if (data?.exists) {
          setError({ isError: true, message: "Такий користувач вже існує" });
        } else {
          setError({ isError: false, message: "" });
        }
      })
      .catch(() => {});
  }, [debouncedUsername]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error("Паролі не співпадають");
      }
      await authApi.register({ email: login, username, password });
      localStorage.setItem("email", login);
      navigate("/verify");
    } catch (error: any) {
      setError({ isError: true, message: error.message });
    }
  }

  return (
    <>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Реєстрація</h2>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login">
              Email (Логiн)
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
              Ім'я користувача
            </label>
            <input
              id="username"
              className="auth-input"
              type="text"
              placeholder="Придумайте никнейм"
              maxLength={10}
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
              Підтвердіть пароль
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
          {error.isError && <p className="error">{error.message}</p>}
          <button type="submit" className="auth-button">
            Зареєструватися
          </button>
        </form>
      </div>
    </>
  );
}
