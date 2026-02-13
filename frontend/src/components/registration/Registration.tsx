import "./Registration.css"
import {useState} from "react"

export default function Registration() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  function LoginOnChange(value : string) {
    setLogin(value)
  }
  function PasswordOnChange(value : string) {
    setPassword(value)
  }


  function handleSubmit(event : React.SubmitEvent<HTMLButtonElement>) {
    event.preventDefault()
    console.log(`Login:${login}, Password:${password}`)
  }
  return (
    <>
      <form className = "auth-form">
        <label className = "auth-labels">
          Логин
          <input type="text" onChange={(e) =>LoginOnChange(e.target.value)}></input>
        </label>
        <label className = "auth-labels">
          Пароль
          <input type="password" onChange={(e) =>PasswordOnChange(e.target.value)}></input>
        </label>
        <div className = "auth-buttons">
          <button type = "submit" onSubmit={(e) =>handleSubmit(e)}>Войти</button>
          <button type = "submit">Зарегистрироваться</button>
        </div>
      </form>
    </>
  );
}
