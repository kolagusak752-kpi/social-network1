import "./loginForm.css";
import { useState } from "react";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`Login:${login}, Password:${password}`);
  }
return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-labels">Логін</label>
        <input 
          type="text" 
          onChange={(e) => setLogin(e.target.value)} 
          placeholder="Введіть логін..."
        />

        <label className="auth-labels">Пароль</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="auth-buttons">
          <button type="submit">Увійти</button>
        </div>
      </form>
    </div>
  );
} 