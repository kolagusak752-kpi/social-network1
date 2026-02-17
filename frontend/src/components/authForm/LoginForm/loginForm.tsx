import "./loginForm.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`Login:${login}, Password:${password}`);
  }
return (
  <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-title">Вхід</h2>
      
      <div className="auth-field">
        <label className="auth-label" htmlFor="login">Логін</label>
        <input 
          id="login"
          className="auth-input"
          type="text" 
          placeholder="Введіть логін..."
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="password">Пароль</label>
        <input
          id="password"
          className="auth-input"
          type="password"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="auth-button">Увійти</button>
      <Link className ="link" to = "/registration">Ще немає акаунту?Зареєструватися</Link>
    </form>
  </div>
);

} 