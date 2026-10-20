import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).trim().replace(/\/+$/, "");

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cargando) return;

    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        setError(
          resultado.message ||
            "No pudimos iniciar sesión. Intentá nuevamente."
        );
        return;
      }

      if (
        typeof resultado.token !== "string" ||
        !resultado.token ||
        resultado.usuario?.rol !== "admin"
      ) {
        setError(
          "El servidor no devolvió una sesión de administrador válida."
        );
        return;
      }

      sessionStorage.setItem("lara_admin_token", resultado.token);

      sessionStorage.setItem(
        "lara_admin_usuario",
        JSON.stringify(resultado.usuario)
      );

      navigate("/admin", { replace: true });
    } catch {
      setError(
        "No pudimos conectar con el servidor. Intentá nuevamente en unos momentos."
      );
    } finally {
      setCargando(false);
    }
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
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={cargando}
          />

          <label htmlFor="admin-password">Contraseña</label>

          <input
            id="admin-password"
            type="password"
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={cargando}
          />

          {error && (
            <p
              role="alert"
              style={{
                color: "#c85d32",
                fontSize: "14px",
                marginTop: "12px",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <button
            className="admin-login-submit"
            type="submit"
            disabled={cargando}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
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