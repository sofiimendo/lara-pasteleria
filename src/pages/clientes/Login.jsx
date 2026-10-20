import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registro.css";

const API_URL = "http://localhost:4000";

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

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.message || "No pudimos iniciar sesión."
        );
      }

      if (
        typeof resultado.token !== "string" ||
        !resultado.token ||
        resultado.cliente?.rol !== "cliente"
      ) {
        throw new Error("La respuesta del servidor no es válida.");
      }

      sessionStorage.setItem("lara_cliente_token", resultado.token);
      sessionStorage.setItem(
        "lara_cliente",
        JSON.stringify(resultado.cliente)
      );

      navigate("/", { replace: true });
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al iniciar sesión."
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