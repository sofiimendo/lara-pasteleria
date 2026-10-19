import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <button
          className="admin-login-back"
          type="button"
          onClick={() => navigate("/")}
        >
          ← Volver al inicio
        </button>

        <div className="admin-login-brand">
          <span className="admin-login-brand-icon">✿</span>
          <h1>Lara Pastelería</h1>
          <p>Panel de administración</p>
        </div>

        <h2>¡Bienvenida!</h2>
        <p className="admin-login-subtitle">
          Ingresá tus datos para administrar tu pastelería.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Correo electrónico</label>
          <input
            id="admin-email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="admin-login-submit" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="admin-login-footer">
          Un espacio para organizar tus creaciones con amor ♡
        </p>
      </div>
    </div>
  );
}

export default Login;