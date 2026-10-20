import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registro.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).trim().replace(/\/+$/, "");

export default function LoginCliente() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    email: "",
    password: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setDatos((actuales) => ({
      ...actuales,
      [name]: value,
    }));

    setMensaje("");
  }

  async function iniciarSesion(evento) {
    evento.preventDefault();

    if (cargando) return;

    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/clientes/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: datos.email.trim().toLowerCase(),
          password: datos.password,
        }),
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        setMensaje(
          resultado.message || "No pudimos iniciar sesión."
        );
        return;
      }

      if (
        typeof resultado.token !== "string" ||
        !resultado.token ||
        resultado.cliente?.rol !== "cliente"
      ) {
        setMensaje("La respuesta del servidor no es válida.");
        return;
      }

      sessionStorage.setItem("lara_cliente_token", resultado.token);

      sessionStorage.setItem(
        "lara_cliente",
        JSON.stringify(resultado.cliente)
      );

      navigate("/", { replace: true });
    } catch {
      setMensaje(
        "No pudimos conectar con el servidor. Intentá nuevamente en unos momentos."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="registro">
      <section className="registro__contenedor">
        <Link to="/" className="registro__volver">
          ← Volver al inicio
        </Link>

        <h1 className="registro__titulo">Iniciar sesión</h1>

        <p className="registro__descripcion">
          Ingresá a tu cuenta para enviar consultas a Lara Pastelería.
        </p>

        <form
          className="registro__formulario"
          onSubmit={iniciarSesion}
        >
          <label htmlFor="login-cliente-email">
            Correo electrónico
          </label>

          <input
            id="login-cliente-email"
            name="email"
            type="email"
            value={datos.email}
            onChange={actualizarCampo}
            required
            maxLength={254}
            autoComplete="email"
            disabled={cargando}
          />

          <label htmlFor="login-cliente-password">
            Contraseña
          </label>

          <div className="registro__campo-password">
            <input
              id="login-cliente-password"
              name="password"
              type={mostrarPassword ? "text" : "password"}
              value={datos.password}
              onChange={actualizarCampo}
              required
              autoComplete="current-password"
              disabled={cargando}
            />

            <button
              type="button"
              className="registro__ojito"
              onClick={() => setMostrarPassword((actual) => !actual)}
              aria-label={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              aria-pressed={mostrarPassword}
              disabled={cargando}
            >
              {mostrarPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {mensaje && (
            <p className="registro__mensaje" role="alert">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            className="registro__boton"
            disabled={cargando}
          >
            {cargando ? "INGRESANDO..." : "INICIAR SESIÓN"}
          </button>
        </form>

        <p className="registro__login">
          ¿Todavía no tenés una cuenta?{" "}
          <Link to="/registro">Registrate</Link>
        </p>
      </section>
    </main>
  );
}