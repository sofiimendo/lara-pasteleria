import { createPortal } from "react-dom";

const estados = {
  nuevo: "Nuevo",
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function mostrarFecha(fecha) {
  if (!fecha) return "—";

  const partes = String(fecha).slice(0, 10).split("-");

  if (partes.length !== 3) return String(fecha);

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function DetallePedidoModal({
  pedidoSeleccionado,
  cerrarDetalle,
  estadoEditado,
  setEstadoEditado,
  guardarEstado,
  guardandoEstado,
  errorDetalle,
}) {
  return createPortal(
    <div className="admin-pedidos-overlay">
      <section
        className="admin-pedidos-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle-pedido"
      >
        <div className="admin-pedidos-modal-heading">
          <div>
            <h2 id="titulo-detalle-pedido">Detalle del pedido</h2>
            <p>{pedidoSeleccionado.nombre}</p>
          </div>

          <button
            type="button"
            className="admin-pedidos-close"
            onClick={cerrarDetalle}
            disabled={guardandoEstado}
            aria-label="Cerrar detalle"
          >
            ×
          </button>
        </div>

        <div className="admin-pedidos-detail">
          <p>
            <strong>Cliente:</strong> {pedidoSeleccionado.nombre}
          </p>

          <p>
            <strong>Email:</strong> {pedidoSeleccionado.email || "—"}
          </p>

          <p>
            <strong>Teléfono:</strong> {pedidoSeleccionado.telefono || "—"}
          </p>

          <p>
            <strong>Origen:</strong>{" "}
            {pedidoSeleccionado.origen === "presencial"
              ? "Local físico"
              : pedidoSeleccionado.origen || "Web / sin especificar"}
          </p>

          <p>
            <strong>Fecha de entrega:</strong>{" "}
            {mostrarFecha(pedidoSeleccionado.fecha)}
          </p>

          <p>
            <strong>Producto:</strong> {pedidoSeleccionado.pedido}
          </p>

          <p>
            <strong>Evento:</strong> {pedidoSeleccionado.tipoEvento || "—"}
          </p>

          <p>
            <strong>Personas:</strong>{" "}
            {pedidoSeleccionado.cantidadPersonas ?? "—"}
          </p>

          <p>
            <strong>Detalles:</strong> {pedidoSeleccionado.detalles || "—"}
          </p>

          <label className="admin-pedidos-estado-label">
            Estado del pedido
            <select
              value={estadoEditado}
              onChange={(evento) => setEstadoEditado(evento.target.value)}
            >
              {Object.entries(estados).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </label>
        </div>

        {errorDetalle && (
          <p className="admin-pedidos-form-error" role="alert">
            {errorDetalle}
          </p>
        )}

        <div className="admin-pedidos-modal-actions">
          <button
            type="button"
            className="admin-pedidos-secondary"
            onClick={cerrarDetalle}
            disabled={guardandoEstado}
          >
            Cerrar
          </button>

          <button
            type="button"
            className="admin-pedidos-add"
            onClick={guardarEstado}
            disabled={
              guardandoEstado ||
              estadoEditado === (pedidoSeleccionado.estado || "nuevo")
            }
          >
            {guardandoEstado ? "Guardando..." : "Guardar estado"}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}