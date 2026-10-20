import { useState } from "react";
import "./EliminarProductoModal.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

function EliminarUsuarioModal({
  usuario,
  onCerrar,
  onUsuarioEliminado,
}) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  async function confirmarEliminacion() {
    if (eliminando) return;

    setError("");

    const token = sessionStorage.getItem("lara_admin_token");

    if (!token) {
      setError("Tu sesión venció. Volvé a iniciar sesión.");
      return;
    }

    try {
      setEliminando(true);

      const respuesta = await fetch(
        `${API_URL}/api/usuarios/${usuario._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message || "No se pudo eliminar el usuario."
        );
      }

      onUsuarioEliminado?.(usuario._id);
      onCerrar();
    } catch (err) {
      setError(
        err.message || "Ocurrió un error al eliminar el usuario."
      );
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div
      className="eliminar-producto-overlay"
      role="presentation"
      onMouseDown={(evento) => {
        if (
          evento.target === evento.currentTarget &&
          !eliminando
        ) {
          onCerrar();
        }
      }}
    >
      <section
        className="eliminar-producto-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="eliminar-usuario-titulo"
        aria-describedby="eliminar-usuario-descripcion"
      >
        <div className="eliminar-producto-icono">
          <span aria-hidden="true">!</span>
        </div>

        <h2 id="eliminar-usuario-titulo">
          ¿Eliminar usuario?
        </h2>

        <p id="eliminar-usuario-descripcion">
          Estás por eliminar la cuenta de{" "}
          <strong>{usuario.nombre}</strong>.
          <br />
          Esta persona perderá el acceso al panel
          administrativo. Esta acción no se puede deshacer.
        </p>

        {error && (
          <p className="eliminar-producto-error" role="alert">
            {error}
          </p>
        )}

        <div className="eliminar-producto-acciones">
          <button
            type="button"
            className="eliminar-producto-cancelar"
            onClick={onCerrar}
            disabled={eliminando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="eliminar-producto-confirmar"
            onClick={confirmarEliminacion}
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default EliminarUsuarioModal;