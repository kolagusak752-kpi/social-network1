import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verify } from "../../../api/auth";
export default function VerifyForm() {
  const [email, setEmail] = useState(localStorage.getItem("email") || "")
  const [code, setInputCode] = useState("");
  const [error, setError] = useState({ isError: false, message: "" });
  const navigate = useNavigate();
;
  async function handleVerify() {
    event?.preventDefault();
    try {
      await verify({ email, code });
      navigate("/login")
    } catch (error: any) {
      setError({ isError: true, message: error.message });
    }
  }
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleVerify}>
        <h2 className = "auth-title">Підтвердження реєстрації</h2>
        <p>Код надіслано на пошту</p>
        <div className="auth-field">
          <label htmlFor="auth-label">Введіть код:</label>
          <input
            id="auth-input"
            className="auth-input"
            onChange={(e) => setInputCode(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="auth-button">
          Підтвердити
        </button>
        {error.isError && <p className="error">{error.message}</p>}
      </form>
    </div>
  );
}
