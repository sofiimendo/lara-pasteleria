import { useState } from "react";
import { Link } from "react-router-dom";
import "./Registro.css";

const API_URL = "http://localhost:4000";

const datosIniciales = {
  nombre: "",
  email: "",
  password: "",
  confirmarPassword: "",
};

export default function Registro() {
  const [datos, setDatos] = useState({ ...datosIniciales });
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setDatos((actuales) => ({
      ...actuales,
      [name]: value,
    }));

    setMensaje("");
  }

  async function registrar(evento) {
    evento.preventDefault();
    setMensaje("");
    setExito(false);

    if (datos.password !== datos.confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (new TextEncoder().encode(datos.password).length > 72) {
      setMensaje("La contraseña no puede superar los 72 bytes.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/clientes/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          email: datos.email.trim().toLowerCase(),
          password: datos.password,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.message || "No pudimos crear tu cuenta."
        );
      }

      setExito(true);
      setMensaje(resultado.message || "Cuenta creada correctamente.");
      setDatos({ ...datosIniciales });
      setMostrarPassword(false);
      setMostrarConfirmacion(false);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrarte."
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

        <h1 className="registro__titulo">Crear cuenta</h1>

        <p className="registro__descripcion">
          Registrate para enviar tus consultas a Lara Pastelería.
        </p>

        <form className="registro__formulario" onSubmit={registrar}>
          <label htmlFor="registro-nombre">Nombre y apellido</label>
          <input
            id="registro-nombre"
            name="nombre"
            type="text"
            value={datos.nombre}
            onChange={actualizarCampo}
            required
            maxLength={100}
            autoComplete="name"
          />

          <label htmlFor="registro-email">Correo electrónico</label>
          <input
            id="registro-email"
            name="email"
            type="email"
            value={datos.email}
            onChange={actualizarCampo}
            required
            maxLength={254}
            autoComplete="email"
          />

          <label htmlFor="registro-password">Contraseña</label>

          <div className="registro__campo-password">
            <input
              id="registro-password"
              name="password"
              type={mostrarPassword ? "text" : "password"}
              value={datos.password}
              onChange={actualizarCampo}
              required
              minLength={12}
              autoComplete="new-password"
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

          <p className="registro__ayuda">
            Debe tener al menos 12 caracteres.
          </p>

          <label htmlFor="registro-confirmar">
            Repetir contraseña
          </label>

          <div className="registro__campo-password">
            <input
              id="registro-confirmar"
              name="confirmarPassword"
              type={mostrarConfirmacion ? "text" : "password"}
              value={datos.confirmarPassword}
              onChange={actualizarCampo}
              required
              minLength={12}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="registro__ojito"
              onClick={() => setMostrarConfirmacion((actual) => !actual)}
              aria-label={
                mostrarConfirmacion
                  ? "Ocultar confirmación de contraseña"
                  : "Mostrar confirmación de contraseña"
              }
              aria-pressed={mostrarConfirmacion}
            >
              {mostrarConfirmacion ? "🙈" : "👁️"}
            </button>
          </div>

          {mensaje && (
            <p
              className={`registro__mensaje ${
                exito ? "registro__mensaje--exito" : ""
              }`}
              role={exito ? "status" : "alert"}
            >
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            className="registro__boton"
            disabled={cargando}
          >
            {cargando ? "CREANDO CUENTA..." : "REGISTRARME"}
          </button>
        </form>

        <p className="registro__login">
          ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </section>
    </main>
  );
}