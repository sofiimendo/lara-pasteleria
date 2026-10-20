import { useState } from "react";
import "./NuevoUsuarioModal.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

function EditarUsuarioModal({
  usuario,
  onCerrar,
  onUsuarioActualizado,
}) {
  const [nombre, setNombre] = useState(usuario.nombre || "");
  const [email, setEmail] = useState(usuario.email || "");
  const [activo, setActivo] = useState(usuario.activo !== false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function guardarCambios(evento) {
    evento.preventDefault();
    setError("");

    const token = sessionStorage.getItem("lara_admin_token");

    if (!token) {
      setError("Tu sesión venció. Volvé a iniciar sesión.");
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/api/usuarios/${usuario._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            activo,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message || "No se pudo actualizar el usuario."
        );
      }

      onUsuarioActualizado(datos.usuario);
      onCerrar();
    } catch (err) {
      setError(
        err.message || "Ocurrió un error al actualizar el usuario."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="nuevo-usuario-overlay">
      <section
        className="nuevo-usuario-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-usuario-titulo"
      >
        <div className="nuevo-usuario-heading">
          <div>
            <h2 id="editar-usuario-titulo">Editar usuario</h2>
            <p>Modificá los datos y permisos de esta cuenta.</p>
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

        <form onSubmit={guardarCambios}>
          <div className="nuevo-usuario-grid">
            <label>
              Nombre *
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={100}
                required
                disabled={guardando}
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                required
                disabled={guardando}
              />
            </label>

            <label className="nuevo-usuario-estado-campo">
              Estado de la cuenta
              <select
                value={activo ? "activo" : "inactivo"}
                onChange={(e) =>
                  setActivo(e.target.value === "activo")
                }
                disabled={guardando}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
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
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditarUsuarioModal;