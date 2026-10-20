import { useState } from "react";
import "./EliminarProductoModal.css";

const API_URL = "http://localhost:4000";

function EliminarProductoModal({
  producto,
  onCerrar,
  onProductoEliminado,
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
        `${API_URL}/api/productos/${producto._id}`,
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
          datos.message || "No se pudo eliminar el producto."
        );
      }

      onProductoEliminado?.(producto._id);
      onCerrar();
    } catch (err) {
      setError(
        err.message || "Ocurrió un error al eliminar el producto."
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
        aria-labelledby="eliminar-producto-titulo"
        aria-describedby="eliminar-producto-descripcion"
      >
        <div className="eliminar-producto-icono">
          <span aria-hidden="true">!</span>
        </div>

        <h2 id="eliminar-producto-titulo">
          ¿Eliminar producto?
        </h2>

        <p id="eliminar-producto-descripcion">
          Estás por eliminar{" "}
          <strong>{producto.nombre}</strong>.
          <br />
          Esta acción no se puede deshacer.
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

export default EliminarProductoModal;