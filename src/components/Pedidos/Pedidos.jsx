import { useEffect, useRef, useState } from 'react'
import usePedidoStore from '../../store/usePedidoStore'
import { configuracion } from '../../data/configuracion'
import estrella from '../../assets/elementos/estrellaPedidos.png'
import './Pedidos.css'

const opcionesPedido = [
  'Torta', 'Desayuno', 'Panes', 'Mesa dulce',
  'Comida saludable', 'Otro pedido',
]

function fechaLocal(fecha) {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0'),
  ].join('-')
}

function obtenerFechaMinima(pedido) {
  const fecha = new Date()
  if (pedido === 'Torta') fecha.setDate(fecha.getDate() + 5)
  return fechaLocal(fecha)
}

function mostrarFecha(fecha) {
  return fecha.split('-').reverse().join('/')
}

function MensajeError({ mensaje, id }) {
  if (!mensaje) return null
  return <p id={id} className="pedidos__error" role="alert">{mensaje}</p>
}

function Pedidos() {
  const datos = usePedidoStore((estado) => estado.datos)
  const actualizarCampo = usePedidoStore((estado) => estado.actualizarCampo)
  const [mostrarResumen, setMostrarResumen] = useState(false)
  const [errores, setErrores] = useState({})
  const formularioRef = useRef(null)
  const resumenRef = useRef(null)
  const fechaMinima = obtenerFechaMinima(datos.pedido)

  useEffect(() => {
    if (mostrarResumen) resumenRef.current?.focus()
  }, [mostrarResumen])

  function manejarCambio(evento) {
    const { name, value } = evento.target
    actualizarCampo(name, value)
    setMostrarResumen(false)
    setErrores((actuales) => ({
      ...actuales,
      [name]: '',
      ...(name === 'pedido' ? { fecha: '' } : {}),
    }))
  }

  function cambiarCantidad(cambio) {
    const numero = Number(datos.cantidadPersonas)
    const cantidad = Number.isSafeInteger(numero) && numero > 0 ? numero : 0
    actualizarCampo('cantidadPersonas', String(Math.max(1, cantidad + cambio)))
    setMostrarResumen(false)
    setErrores((actuales) => ({ ...actuales, cantidadPersonas: '' }))
  }

  function validarPedido() {
    const nuevosErrores = {}
    const nombre = datos.nombre.trim()
    const telefono = datos.whatsapp.trim()
    const digitos = telefono.replace(/\D/g, '')
    const fecha = new Date(`${datos.fecha}T12:00:00`)

    if (nombre.length < 2 || nombre.length > 80) {
      nuevosErrores.nombre = 'Ingresá tu nombre: entre 2 y 80 caracteres.'
    }
    if (!/^\+?[0-9\s()-]+$/.test(telefono) || digitos.length < 8 || digitos.length > 15) {
      nuevosErrores.whatsapp = 'Ingresá un WhatsApp válido, con código de área.'
    }
    if (!opcionesPedido.includes(datos.pedido)) {
      nuevosErrores.pedido = 'Seleccioná qué querés pedir.'
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha) ||
        Number.isNaN(fecha.getTime()) || fechaLocal(fecha) !== datos.fecha) {
      nuevosErrores.fecha = 'Seleccioná una fecha válida.'
    } else if (datos.fecha < obtenerFechaMinima(datos.pedido)) {
      nuevosErrores.fecha = datos.pedido === 'Torta'
        ? 'Las tortas requieren al menos 5 días de anticipación.'
        : 'La fecha no puede ser anterior a hoy.'
    }
    if (datos.cantidadPersonas !== '' &&
        (!Number.isSafeInteger(Number(datos.cantidadPersonas)) || Number(datos.cantidadPersonas) < 1)) {
      nuevosErrores.cantidadPersonas = 'Ingresá una cantidad entera mayor a cero o dejá el campo vacío.'
    }
    if (datos.detalles.length > 1000) {
      nuevosErrores.detalles = 'Los detalles pueden tener hasta 1000 caracteres.'
    }

    setErrores(nuevosErrores)
    const primerCampo = Object.keys(nuevosErrores)[0]
    if (primerCampo) {
      formularioRef.current?.elements.namedItem(primerCampo)?.focus()
      return false
    }
    return true
  }

  function revisarPedido(evento) {
    evento.preventDefault()
    setMostrarResumen(validarPedido())
  }

  function editarConsulta() {
    setMostrarResumen(false)
    formularioRef.current?.elements.namedItem('nombre')?.focus()
  }

  function comprobarAntesDeAbrir(evento) {
    if (!validarPedido()) {
      evento.preventDefault()
      setMostrarResumen(false)
    }
  }

  const mensaje = [
    '¡Hola Lara! Quiero consultar por un pedido.',
    '',
    `Nombre: ${datos.nombre.trim()}`,
    `WhatsApp: ${datos.whatsapp.trim()}`,
    `Pedido: ${datos.pedido}`,
    `Fecha: ${mostrarFecha(datos.fecha)}`,
    `Evento: ${datos.tipoEvento || 'Sin especificar'}`,
    `Personas: ${datos.cantidadPersonas || 'Sin especificar'}`,
    `Detalles: ${datos.detalles.trim() || 'Sin especificar'}`,
    '',
    '¿Podés confirmarme disponibilidad y presupuesto?',
  ].join('\n')
  const enlaceWhatsApp = `https://wa.me/${configuracion.whatsapp}?text=${encodeURIComponent(mensaje)}`

  return (
    <section id="pedidos" className="pedidos" aria-labelledby="pedidos-titulo">
      <div className="pedidos__contenido">
        <div className="pedidos__presentacion">
          <img src={estrella} alt="" className="pedidos__estrella" />
          <h2 id="pedidos-titulo">Eventos & encargos</h2>
          <p>Tortas, desayunos, panes, mesas dulces y opciones saludables para compartir.</p>
          <p className="pedidos__destacado">Las tortas se piden con un mínimo de 5 días de anticipación.</p>
          <p>Para comida saludable podés consultar sin ese mínimo. Lara te confirmará la disponibilidad y el tiempo de preparación de cada pedido.</p>
          <p>Contanos qué necesitás, revisá el resumen y continuá por WhatsApp para coordinar con Lara.</p>
          <p>Los pedidos se retiran en el local. La reserva se confirma con Lara y una seña del 50 %.</p>
        </div>

        <div className="pedidos__columna">
          <form ref={formularioRef} className="pedidos__formulario" onSubmit={revisarPedido} noValidate aria-labelledby="pedido-formulario-titulo">
            <h3 id="pedido-formulario-titulo">¡Hacé tu pedido!</h3>

            <div className="pedidos__campo">
              <label htmlFor="pedido-nombre">Nombre <span>*</span></label>
              <input id="pedido-nombre" name="nombre" type="text" autoComplete="name" required minLength={2} maxLength={80}
                value={datos.nombre} onChange={manejarCambio} aria-invalid={Boolean(errores.nombre)}
                aria-describedby={errores.nombre ? 'error-nombre' : undefined} />
              <MensajeError id="error-nombre" mensaje={errores.nombre} />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-whatsapp">WhatsApp <span>*</span></label>
              <input id="pedido-whatsapp" name="whatsapp" type="tel" autoComplete="tel" required maxLength={25} placeholder="Ej.: 11 1234 5678"
                value={datos.whatsapp} onChange={manejarCambio} aria-invalid={Boolean(errores.whatsapp)}
                aria-describedby={errores.whatsapp ? 'error-whatsapp' : undefined} />
              <MensajeError id="error-whatsapp" mensaje={errores.whatsapp} />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-producto">¿Qué querés pedir? <span>*</span></label>
              <select id="pedido-producto" name="pedido" required value={datos.pedido} onChange={manejarCambio}
                aria-invalid={Boolean(errores.pedido)} aria-describedby={errores.pedido ? 'error-pedido' : undefined}>
                <option value="">Seleccioná una opción</option>
                {opcionesPedido.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
              </select>
              <MensajeError id="error-pedido" mensaje={errores.pedido} />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-fecha">¿Para qué fecha? <span>*</span></label>
              <input id="pedido-fecha" name="fecha" type="date" required min={fechaMinima} value={datos.fecha} onChange={manejarCambio}
                aria-invalid={Boolean(errores.fecha)} aria-describedby={`pedido-anticipacion${errores.fecha ? ' error-fecha' : ''}`} />
              <p id="pedido-anticipacion" className="pedidos__ayuda">
                {datos.pedido === 'Torta' ? 'Elegí una fecha con al menos 5 días de anticipación.' : 'La fecha queda sujeta a disponibilidad y al tiempo de preparación que confirme Lara.'}
              </p>
              <MensajeError id="error-fecha" mensaje={errores.fecha} />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-evento">Tipo de evento (opcional)</label>
              <select id="pedido-evento" name="tipoEvento" value={datos.tipoEvento} onChange={manejarCambio}>
                <option value="">Seleccioná una opción</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Reunión">Reunión</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-personas">Cantidad aproximada de personas (opcional)</label>
              <div className="pedidos__cantidad">
                <button type="button" aria-label="Restar una persona" disabled={(Number(datos.cantidadPersonas) || 0) <= 1} onClick={() => cambiarCantidad(-1)}>−</button>
                <input id="pedido-personas" name="cantidadPersonas" type="number" min="1" step="1" placeholder="—"
                  value={datos.cantidadPersonas} onChange={manejarCambio} aria-invalid={Boolean(errores.cantidadPersonas)}
                  aria-describedby={errores.cantidadPersonas ? 'error-personas' : undefined} />
                <button type="button" aria-label="Sumar una persona" onClick={() => cambiarCantidad(1)}>+</button>
              </div>
              <MensajeError id="error-personas" mensaje={errores.cantidadPersonas} />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-detalles">Detalles del pedido (opcional)</label>
              <textarea id="pedido-detalles" name="detalles" rows={4} maxLength={1000} placeholder="Contanos sabores, cantidades o cualquier detalle que quieras consultar."
                value={datos.detalles} onChange={manejarCambio} aria-invalid={Boolean(errores.detalles)}
                aria-describedby={errores.detalles ? 'error-detalles' : undefined} />
              <MensajeError id="error-detalles" mensaje={errores.detalles} />
            </div>

            <button type="submit" className="pedidos__boton">Revisar consulta →</button>
          </form>

          <p className="pedidos__aclaracion">Completar este formulario no confirma una reserva. Lara te responderá por WhatsApp para coordinar disponibilidad, presupuesto y seña.</p>

          {mostrarResumen && (
            <div ref={resumenRef} className="pedidos__resumen" tabIndex={-1} role="region" aria-labelledby="pedido-resumen-titulo">
              <h3 id="pedido-resumen-titulo">Revisá tu consulta</h3>
              <p><strong>Nombre:</strong> {datos.nombre.trim()}</p>
              <p><strong>WhatsApp:</strong> {datos.whatsapp.trim()}</p>
              <p><strong>Pedido:</strong> {datos.pedido}</p>
              <p><strong>Fecha:</strong> {mostrarFecha(datos.fecha)}</p>
              <p><strong>Evento:</strong> {datos.tipoEvento || 'Sin especificar'}</p>
              <p><strong>Personas:</strong> {datos.cantidadPersonas || 'Sin especificar'}</p>
              {datos.detalles.trim() && <p><strong>Detalles:</strong> {datos.detalles.trim()}</p>}
              <p>La consulta todavía no fue enviada. Abrí WhatsApp y tocá Enviar para que Lara la reciba.</p>
              <div className="pedidos__acciones">
                <a className="pedidos__boton" href={enlaceWhatsApp} target="_blank" rel="noopener noreferrer" onClick={comprobarAntesDeAbrir}>Continuar en WhatsApp ↗</a>
                <button type="button" className="pedidos__editar" onClick={editarConsulta}>Editar consulta</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Pedidos
