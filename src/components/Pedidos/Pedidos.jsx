import { useState } from 'react'
import usePedidoStore from '../../store/usePedidoStore'
import estrella from '../../assets/elementos/estrellaPedidos.png'
import './Pedidos.css'

function Pedidos() {
  const datos = usePedidoStore((estado) => estado.datos)
  const actualizarCampo = usePedidoStore(
    (estado) => estado.actualizarCampo
  )
  const [mostrarResumen, setMostrarResumen] = useState(false)

  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 5)

  const fechaMinima = [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0'),
  ].join('-')

  function manejarCambio(evento) {
    const { name, value } = evento.target
    actualizarCampo(name, value)
    setMostrarResumen(false)
  }

  function cambiarCantidad(cambio) {
    const cantidad = Number(datos.cantidadPersonas) || 1
    actualizarCampo(
      'cantidadPersonas',
      String(Math.max(1, cantidad + cambio))
    )
    setMostrarResumen(false)
  }

  function revisarPedido(evento) {
    evento.preventDefault()
    setMostrarResumen(true)
  }

  return (
    <section id="pedidos" className="pedidos">
      <div className="pedidos__contenido">
        <div className="pedidos__presentacion">
          <img
            src={estrella}
            alt=""
            className="pedidos__estrella"
          />

          <h2>
            Lara Pastelería
            <br />
            te acompaña en tus eventos!
          </h2>

          <p>
            ¿Tenés un evento especial?
            <br />
            En Lara Pasteleria preparamos cada pedido con dedicación para
            que puedas disfrutar de algo rico, hecho especialmente
            para vos.
          </p>

          <p className="pedidos__destacado">
            Realizamos pedidos personalizados con un mínimo
            de 5 días de anticipación.
          </p>

          <p>
            Completá el formulario y contanos qué necesitás.
            <br />
            También podés escribirnos directamente por WhatsApp.
          </p>

          <p className="pedidos__destacado">
            Queremos ser parte de tus momentos y darte lo mejor
            en cada ocasión.
          </p>
        </div>

        <div className="pedidos__columna">
          <form
            className="pedidos__formulario"
            onSubmit={revisarPedido}
            aria-labelledby="formulario-pedido-titulo"
          >
            <h3 id="formulario-pedido-titulo">
              ¡Hacé tu pedido!
            </h3>

            <div className="pedidos__campo">
              <label htmlFor="pedido-nombre">
                Nombre <span>*</span>
              </label>
              <input
                id="pedido-nombre"
                name="nombre"
                autoComplete="name"
                placeholder="Ingresá tu nombre"
                value={datos.nombre}
                onChange={manejarCambio}
                required
                minLength={2}
                maxLength={80}
                pattern=".*\S.*"
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-whatsapp">
                WhatsApp <span>*</span>
              </label>
              <input
                id="pedido-whatsapp"
                name="whatsapp"
                type="tel"
                autoComplete="tel"
                placeholder="Incluí el código de área"
                value={datos.whatsapp}
                onChange={manejarCambio}
                required
                pattern="\+?[0-9 ()-]{8,25}"
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-fecha">
                Fecha del evento <span>*</span>
              </label>
              <input
                id="pedido-fecha"
                name="fecha"
                type="date"
                min={fechaMinima}
                value={datos.fecha}
                onChange={manejarCambio}
                aria-describedby="pedido-anticipacion"
                required
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-evento">
                Tipo de evento
              </label>
              <select
                id="pedido-evento"
                name="tipoEvento"
                value={datos.tipoEvento}
                onChange={manejarCambio}
              >
                <option value="">Seleccioná una opción</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Reunión">Reunión</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-producto">
                ¿Qué te gustaría pedir? <span>*</span>
              </label>
              <select
                id="pedido-producto"
                name="pedido"
                value={datos.pedido}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccioná una opción</option>
                <option value="Torta">Torta</option>
                <option value="Mesa dulce">Mesa dulce</option>
                <option value="Otro pedido">Otro pedido</option>
              </select>
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-personas">
                Cantidad de personas (aprox.)
              </label>

              <div className="pedidos__cantidad">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(-1)}
                  aria-label="Restar una persona"
                  disabled={
                    (Number(datos.cantidadPersonas) || 1) <= 1
                  }
                >
                  −
                </button>

                <input
                  id="pedido-personas"
                  name="cantidadPersonas"
                  type="number"
                  min={1}
                  step={1}
                  value={datos.cantidadPersonas || '1'}
                  onChange={manejarCambio}
                  required
                />

                <button
                  type="button"
                  onClick={() => cambiarCantidad(1)}
                  aria-label="Sumar una persona"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-detalles">
                Contanos un poco más sobre tu pedido
              </label>
              <textarea
                id="pedido-detalles"
                name="detalles"
                rows={4}
                maxLength={1000}
                placeholder="Escribí todos los detalles que consideres importantes..."
                value={datos.detalles}
                onChange={manejarCambio}
              />
            </div>

            <button className="pedidos__boton" type="submit">
              Revisar consulta →
            </button>
          </form>

          <p
            id="pedido-anticipacion"
            className="pedidos__aclaracion"
          >
            Los pedidos se realizan con un mínimo de 5 días de
            anticipación. Te contactaremos por WhatsApp para
            confirmar disponibilidad y detalles.
          </p>

          {mostrarResumen && (
            <div className="pedidos__resumen" role="status">
              <h3>Resumen de tu consulta</h3>
              <p><strong>Nombre:</strong> {datos.nombre}</p>
              <p><strong>WhatsApp:</strong> {datos.whatsapp}</p>
              <p><strong>Fecha:</strong> {datos.fecha}</p>
              <p>
                <strong>Evento:</strong>{' '}
                {datos.tipoEvento || 'Sin especificar'}
              </p>
              <p><strong>Pedido:</strong> {datos.pedido}</p>
              <p>
                <strong>Personas:</strong>{' '}
                {datos.cantidadPersonas || '1'}
              </p>
              {datos.detalles && (
                <p><strong>Detalles:</strong> {datos.detalles}</p>
              )}
              <p>Tu consulta todavía no fue enviada.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Pedidos