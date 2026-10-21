import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import brunch from "../../assets/imagenes/brunch.png";
import taza from "../../assets/elementos/tazita.png";
import medialuna from "../../assets/elementos/medialunaterracota.png";
import ojoAbierto from "../../assets/admin/ojoabierto.svg";
import ojoCerrado from "../../assets/admin/ojocerrado.svg";
import "./Login.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).trim().replace(/\/+$/, "");

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();

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
  }

  return (
    <main className="admin-login">
      <div className="admin-login-contenedor">
        <Link to="/" className="admin-login-back">
          ← Volver al inicio
        </Link>

        <section
          className="admin-login-card"
          aria-labelledby="admin-login-titulo"
        >
          <div className="admin-login-foto">
            <img
              src={brunch}
              alt="Desayuno con café, tostada y frutas de Lara Pastelería"
              className="admin-login-foto-imagen"
            />
          </div>

          <div className="admin-login-panel">
            <img
              src={taza}
              alt=""
              aria-hidden="true"
              className="admin-login-decoracion admin-login-taza"
            />

            <div className="admin-login-formulario">
              <h1 id="admin-login-titulo">Iniciar Sesión</h1>

              <form onSubmit={handleSubmit} aria-busy={cargando}>
                <label
                  htmlFor="admin-email"
                  className="admin-login-label"
                >
                  Correo electrónico
                </label>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="Ingresá tu email"
                  autoComplete="username"
                  maxLength={254}
                  value={email}
                  onChange={(evento) => {
                    setEmail(evento.target.value);
                    setError("");
                  }}
                  required
                  disabled={cargando}
                />

                <label
                  htmlFor="admin-password"
                  className="admin-login-label"
                >
                  Contraseña
                </label>

                <div className="admin-login-password">
                  <input
                    id="admin-password"
                    name="password"
                    type={mostrarPassword ? "text" : "password"}
                    placeholder="Ingresá tu contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(evento) => {
                      setPassword(evento.target.value);
                      setError("");
                    }}
                    required
                    disabled={cargando}
                  />

                  <button
                    type="button"
                    className="admin-login-ojo"
                    onClick={() => {
                      setMostrarPassword((actual) => !actual);
                    }}
                    aria-label={
                      mostrarPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    aria-pressed={mostrarPassword}
                    aria-controls="admin-password"
                    disabled={cargando}
                  >
                    <img
                      src={mostrarPassword ? ojoAbierto : ojoCerrado}
                      alt=""
                    />
                  </button>
                </div>

                {error && (
                  <p className="admin-login-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="admin-login-submit"
                  type="submit"
                  disabled={cargando}
                >
                  {cargando ? "INGRESANDO..." : "INGRESAR"}
                </button>
              </form>
            </div>

            <img
              src={medialuna}
              alt=""
              aria-hidden="true"
              className="admin-login-decoracion admin-login-medialuna"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;