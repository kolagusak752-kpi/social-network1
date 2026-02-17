import "./registrForm.css";
import { useState } from "react";

export default function regisrtForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(
      `Login:${login}, Password:${password}, ConfirmPassword:${confirmPassword}`,
    );
  }
  return (
    <>
      <div className="auth-container">
        <form className="auth-form">
          <h2 className="auth-title">Регистрация</h2>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login">
              Логин
            </label>
            <input
              id="login"
              className="auth-input"
              type="text"
              placeholder="Введите логин"
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
