import "./registrForm.css"
import { useState } from "react";

export default function regisrtForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`Login:${login}, Password:${password}, ConfirmPassword:${confirmPassword}`);
  }
  return (
    <>
      <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
        <label className="auth-labels">
          Логин
          <input type="text" onChange={(e) => setLogin(e.target.value)}></input>
        </label>
        <label className="auth-labels">
          Пароль
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
        <label>
            Подтвердите пароль
            <input
            type = "password"
            onChange = {(e) => setConfirmPassword(e.target.value)}>
            </input>
        </label>
        <div className="auth-buttons">
          <button type="submit">Зарегистрироваться</button>
        </div>
      </form>
    </>
  );
}