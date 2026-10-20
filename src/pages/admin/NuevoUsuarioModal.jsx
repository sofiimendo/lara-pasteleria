import { useState } from "react";
import "./NuevoUsuarioModal.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const formularioInicial = {
  nombre: "",
  email: "",
  password: "",
  confirmarPassword: "",
};

function NuevoUsuarioModal({ onCerrar, onUsuarioCreado }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError("");
  }

  async function guardarUsuario(evento) {
    evento.preventDefault();
    setError("");

    const nombre = formulario.nombre.trim();
    const email = formulario.email.trim().toLowerCase();
    const password = formulario.password;

    if (!nombre || !email) {
      setError("Completá el nombre y el email.");
      return;
    }

    if (password.length < 12) {
      setError("La contraseña debe tener al menos 12 caracteres.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("La contraseña no puede superar los 72 bytes.");
      return;
    }

    if (password !== formulario.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const token = sessionStorage.getItem("lara_admin_token");

    if (!token) {
      setError("Tu sesión venció. Volvé a iniciar sesión.");
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message || "No se pudo crear el usuario."
        );
      }

      if (!datos.usuario?._id) {
        throw new Error(
          "El servidor no devolvió el usuario creado."
        );
      }

      onUsuarioCreado?.(datos.usuario);
      onCerrar();
    } catch (err) {
      setError(
        err.message || "Ocurrió un error al crear el usuario."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div
      className="nuevo-usuario-overlay"
      onMouseDown={(evento) => {
        if (
          evento.target === evento.currentTarget &&
          !guardando
        ) {
          onCerrar();
        }
      }}
    >
      <section
        className="nuevo-usuario-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nuevo-usuario-titulo"
      >
        <div className="nuevo-usuario-heading">
          <div>
            <h2 id="nuevo-usuario-titulo">
              Agregar usuario
            </h2>
            <p>
              Creá una cuenta para acceder al panel administrativo.
            </p>
          </div>

          <button
            type="button"
            className="nuevo-usuario-cerrar"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>

        <form onSubmit={guardarUsuario}>
          <div className="nuevo-usuario-grid">
            <label>
              Nombre *
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={actualizarCampo}
                maxLength={100}
                placeholder="Ej: Lara Pastelería"
                autoComplete="name"
                required
                disabled={guardando}
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                name="email"
                value={formulario.email}
                onChange={actualizarCampo}
                maxLength={254}
                placeholder="Ej: usuario@correo.com"
                autoComplete="email"
                required
                disabled={guardando}
              />
            </label>

            <label>
              Contraseña *
              <input
                type="password"
                name="password"
                value={formulario.password}
                onChange={actualizarCampo}
                minLength={12}
                autoComplete="new-password"
                placeholder="Mínimo 12 caracteres"
                required
                disabled={guardando}
              />
            </label>

            <label>
              Confirmar contraseña *
              <input
                type="password"
                name="confirmarPassword"
                value={formulario.confirmarPassword}
                onChange={actualizarCampo}
                minLength={12}
                autoComplete="new-password"
                placeholder="Repetí la contraseña"
                required
                disabled={guardando}
              />
            </label>

            <p className="nuevo-usuario-ayuda">
              La cuenta se creará con rol Administrador y estado
              Activo. La contraseña debe tener al menos 12
              caracteres.
            </p>
          </div>

          {error && (
            <p className="nuevo-usuario-error" role="alert">
              {error}
            </p>
          )}

          <div className="nuevo-usuario-acciones">
            <button
              type="button"
              className="nuevo-usuario-cancelar"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="nuevo-usuario-guardar"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar usuario"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NuevoUsuarioModal;