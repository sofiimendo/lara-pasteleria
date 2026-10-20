import { createPortal } from "react-dom";

const productos = [
  "Torta",
  "Medialunas",
  "Desayuno",
  "Panes",
  "Mesa dulce",
  "Comida saludable",
  "Otro pedido",
];

export default function NuevoPedidoModal({
  formulario,
  actualizarCampo,
  crearPedido,
  cerrarFormulario,
  guardando,
  anticipacionCorta,
  confirmarAnticipacion,
  setConfirmarAnticipacion,
  errorFormulario,
  fechaMinima,
}) {
  return createPortal(
    <div className="admin-pedidos-overlay">
      <section
        className="admin-pedidos-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-nuevo-pedido"
      >
        <div className="admin-pedidos-modal-heading">
          <div>
            <h2 id="titulo-nuevo-pedido">Nuevo pedido</h2>
            <p>Cargá un encargo recibido en el local.</p>
          </div>

          <button
            type="button"
            className="admin-pedidos-close"
            onClick={cerrarFormulario}
            disabled={guardando}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>

        <form onSubmit={crearPedido}>
          <div className="admin-pedidos-form-grid">
            <label>
              Nombre del cliente *
              <input
                name="nombre"
                value={formulario.nombre}
                onChange={actualizarCampo}
                required
                maxLength={120}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={formulario.email}
                onChange={actualizarCampo}
                placeholder="cliente@email.com"
              />
            </label>

            <label>
              Teléfono
              <input
                name="telefono"
                type="tel"
                value={formulario.telefono}
                onChange={actualizarCampo}
                placeholder="11 1234 5678"
              />
            </label>

            <label>
              Fecha de entrega *
              <input
                name="fecha"
                type="date"
                min={fechaMinima}
                value={formulario.fecha}
                onChange={actualizarCampo}
                required
              />
            </label>

            <label>
              Producto *
              <select
                name="pedido"
                value={formulario.pedido}
                onChange={actualizarCampo}
                required
              >
                <option value="">Seleccionar producto</option>
                {productos.map((producto) => (
                  <option key={producto} value={producto}>
                    {producto}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Tipo de evento
              <select
                name="tipoEvento"
                value={formulario.tipoEvento}
                onChange={actualizarCampo}
              >
                <option value="">Sin especificar</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Reunión">Reunión</option>
                <option value="Otro">Otro</option>
              </select>
            </label>

            <label>
              Cantidad de personas
              <input
                name="cantidadPersonas"
                type="number"
                min="1"
                step="1"
                value={formulario.cantidadPersonas}
                onChange={actualizarCampo}
              />
            </label>

            <label className="admin-pedidos-full">
              Detalles del pedido
              <textarea
                name="detalles"
                rows="3"
                value={formulario.detalles}
                onChange={actualizarCampo}
                placeholder="Sabores, decoración, indicaciones..."
              />
            </label>
          </div>

          <p className="admin-pedidos-contact-note">
            * Campos obligatorios. Ingresá al menos un contacto:
            email o teléfono.
          </p>

          {anticipacionCorta && (
            <label className="admin-pedidos-confirmacion">
              <input
                type="checkbox"
                checked={confirmarAnticipacion}
                onChange={(evento) =>
                  setConfirmarAnticipacion(evento.target.checked)
                }
              />
              Confirmo que Lara acepta este pedido con menos de
              cinco días de anticipación.
            </label>
          )}

          {errorFormulario && (
            <p className="admin-pedidos-form-error" role="alert">
              {errorFormulario}
            </p>
          )}

          <div className="admin-pedidos-modal-actions">
            <button
              type="button"
              className="admin-pedidos-secondary"
              onClick={cerrarFormulario}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="admin-pedidos-add"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar pedido"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}