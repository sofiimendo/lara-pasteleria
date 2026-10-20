import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePedidoStore from '../../store/usePedidoStore'
import medialuna from '../../assets/elementos/medialunaterracota.png'
import taza from '../../assets/elementos/tazapedidos.png'
import info from '../../assets/elementos/info.png'
import './Pedidos.css'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000'
).trim().replace(/\/+$/, '')

const opcionesPedido = [
  'Torta',
  'Medialunas',
  'Desayuno',
  'Panes',
  'Mesa dulce',
  'Comida saludable',
  'Otro pedido',
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

  if (pedido === 'Torta' || pedido === 'Medialunas') {
    fecha.setDate(fecha.getDate() + 5)
  }

  return fechaLocal(fecha)
}

function MensajeError({ mensaje, id }) {
  if (!mensaje) return null

  return (
    <p id={id} className="pedidos__error" role="alert">
      {mensaje}
    </p>
  )
}

function Pedidos() {
  const datos = usePedidoStore((estado) => estado.datos)
  const actualizarCampo = usePedidoStore(
    (estado) => estado.actualizarCampo
  )
  const reiniciarPedido = usePedidoStore(
    (estado) => estado.reiniciarPedido
  )

  const [errores, setErrores] = useState({})
  const [mensajeFormulario, setMensajeFormulario] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cantidadPersonas =
    Number.isSafeInteger(Number(datos.cantidadPersonas)) &&
    Number(datos.cantidadPersonas) >= 1
      ? Number(datos.cantidadPersonas)
      : 1

  const fechaMinima = obtenerFechaMinima(datos.pedido)

  function manejarCambio(evento) {
    const { name, value } = evento.target

    actualizarCampo(name, value)
    setMensajeFormulario('')

    setErrores((actuales) => ({
      ...actuales,
      [name]: '',
      ...(name === 'pedido' ? { fecha: '' } : {}),
    }))
  }

  function cambiarCantidad(cambio) {
    const nuevaCantidad = Math.max(1, cantidadPersonas + cambio)

    actualizarCampo('cantidadPersonas', String(nuevaCantidad))
    setMensajeFormulario('')

    setErrores((actuales) => ({
      ...actuales,
      cantidadPersonas: '',
    }))
  }

  function validarPedido() {
    const nuevosErrores = {}

    if (
      datos.nombre.trim().length < 2 ||
      datos.nombre.trim().length > 80
    ) {
      nuevosErrores.nombre =
        'Ingresá tu nombre y apellido (entre 2 y 80 caracteres).'
    }

    const email = datos.email.trim()

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nuevosErrores.email = 'Ingresá un correo electrónico válido.'
    }

    if (!opcionesPedido.includes(datos.pedido)) {
      nuevosErrores.pedido = 'Seleccioná qué querés pedir.'
    }

    const fecha = new Date(`${datos.fecha}T12:00:00`)

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha) ||
      Number.isNaN(fecha.getTime()) ||
      fechaLocal(fecha) !== datos.fecha
    ) {
      nuevosErrores.fecha = 'Seleccioná una fecha válida.'
    } else if (datos.fecha < fechaMinima) {
      nuevosErrores.fecha =
        datos.pedido === 'Torta' || datos.pedido === 'Medialunas'
          ? 'Las tortas y medialunas requieren al menos 5 días de anticipación.'
          : 'La fecha no puede ser anterior a hoy.'
    }

    if (
      !Number.isSafeInteger(Number(datos.cantidadPersonas)) ||
      Number(datos.cantidadPersonas) < 1
    ) {
      nuevosErrores.cantidadPersonas =
        'Ingresá una cantidad válida de personas.'
    }

    if (datos.detalles.length > 1000) {
      nuevosErrores.detalles =
        'Los detalles pueden tener hasta 1000 caracteres.'
    }

    setErrores(nuevosErrores)

    return Object.keys(nuevosErrores).length === 0
  }

  async function enviarConsulta(evento) {
    evento.preventDefault()

    if (enviando) return

    setMensajeFormulario('')

    if (!validarPedido()) {
      setMensajeFormulario(
        'Revisá los campos marcados antes de continuar.'
      )
      return
    }

    const token = sessionStorage.getItem('lara_cliente_token')

    if (!token) {
      setMensajeFormulario(
        'Para enviar tu consulta, primero iniciá sesión o registrate. Los datos que completaste se conservan.'
      )
      return
    }

    setEnviando(true)

    try {
      const respuesta = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          email: datos.email.trim(),
          fecha: datos.fecha,
          tipoEvento: datos.tipoEvento,
          pedido: datos.pedido,
          cantidadPersonas,
          detalles: datos.detalles.trim(),
        }),
      })

      const resultado = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        if (respuesta.status === 401 || respuesta.status === 403) {
          setMensajeFormulario(
            'Tu sesión venció o no es válida. Iniciá sesión nuevamente para enviar tu consulta.'
          )
        } else {
          setMensajeFormulario(
            resultado.message ||
              'No pudimos enviar tu consulta. Intentá nuevamente.'
          )
        }
        return
      }

      if (respuesta.status !== 201 || !resultado.pedido?.id) {
        setMensajeFormulario(
          'No pudimos confirmar la recepción de tu consulta. Verificá tus pedidos antes de volver a enviarla.'
        )
        return
      }

      reiniciarPedido()
      setErrores({})
      setMensajeFormulario(
        resultado.message ||
          '¡Consulta recibida! Lara confirmará disponibilidad y presupuesto.'
      )
    } catch {
      setMensajeFormulario(
        'No pudimos conectar con Lara. Intentá nuevamente en unos momentos.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section
      id="pedidos"
      className="pedidos"
      aria-labelledby="pedidos-titulo"
    >
      <div className="pedidos__contenido">
        <div className="pedidos__presentacion">
          <img
            src={medialuna}
            alt=""
            className="pedidos__medialuna"
          />

          <h2 id="pedidos-titulo">Eventos & encargos</h2>

          <h3 className="pedidos__subtitulo">
            Lara Pastelería
            <span>¡te acompaña en tus eventos!</span>
          </h3>

          <p>
            ¿Tenés un evento especial? En Lara preparamos tortas,
            desayunos, panes, mesas dulces y opciones saludables
            para compartir.
          </p>

          <p className="pedidos__destacado">
            Las tortas y medialunas se piden con un mínimo de
            5 días de anticipación.
          </p>

          <p>
            Para comida saludable podés consultar sin ese mínimo.
            Lara te confirmará la disponibilidad y el tiempo de
            preparación de cada pedido.
          </p>

          <p>
            Completá el formulario para contarnos qué necesitás.
            Para enviar tu consulta, registrate o iniciá sesión
            en Lara Pastelería.
          </p>

          <p className="pedidos__destacado">
            Queremos ser parte de tus momentos y darte lo mejor
            en cada ocasión.
          </p>

          <img
            src={taza}
            alt=""
            className="pedidos__taza"
          />
        </div>

        <div className="pedidos__columna">
          <form
            className="pedidos__formulario"
            onSubmit={enviarConsulta}
            noValidate
            aria-labelledby="pedido-formulario-titulo"
          >
            <h3 id="pedido-formulario-titulo">
              ¡Hacé tu pedido!
            </h3>

            <div className="pedidos__campo">
              <label htmlFor="pedido-nombre">
                Nombre y apellido <span>*</span>
              </label>

              <input
                id="pedido-nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="Ingresá tu nombre y apellido"
                value={datos.nombre}
                onChange={manejarCambio}
                aria-invalid={Boolean(errores.nombre)}
              />

              <MensajeError
                id="error-nombre"
                mensaje={errores.nombre}
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-email">
                Correo electrónico <span>*</span>
              </label>

              <input
                id="pedido-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="ejemplo@correo.com"
                value={datos.email}
                onChange={manejarCambio}
                aria-invalid={Boolean(errores.email)}
              />

              <MensajeError
                id="error-email"
                mensaje={errores.email}
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-fecha">
                Fecha del evento o entrega <span>*</span>
              </label>

              <input
                id="pedido-fecha"
                name="fecha"
                type="date"
                required
                min={fechaMinima}
                value={datos.fecha}
                onChange={manejarCambio}
                aria-invalid={Boolean(errores.fecha)}
              />

              <p className="pedidos__ayuda">
                {datos.pedido === 'Torta' ||
                datos.pedido === 'Medialunas'
                  ? 'Elegí una fecha con al menos 5 días de anticipación.'
                  : 'La fecha queda sujeta a disponibilidad.'}
              </p>

              <MensajeError
                id="error-fecha"
                mensaje={errores.fecha}
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-evento">
                Tipo de evento (opcional)
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
                ¿Qué querés pedir? <span>*</span>
              </label>

              <select
                id="pedido-producto"
                name="pedido"
                required
                value={datos.pedido}
                onChange={manejarCambio}
                aria-invalid={Boolean(errores.pedido)}
              >
                <option value="">Seleccioná una opción</option>

                {opcionesPedido.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>

              <MensajeError
                id="error-pedido"
                mensaje={errores.pedido}
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-personas">
                Cantidad aproximada de personas (opcional)
              </label>

              <div className="pedidos__cantidad">
                <button
                  type="button"
                  aria-label="Restar una persona"
                  disabled={cantidadPersonas <= 1 || enviando}
                  onClick={() => cambiarCantidad(-1)}
                >
                  −
                </button>

                <input
                  id="pedido-personas"
                  name="cantidadPersonas"
                  type="number"
                  min="1"
                  step="1"
                  value={datos.cantidadPersonas}
                  onChange={manejarCambio}
                  aria-invalid={Boolean(errores.cantidadPersonas)}
                />

                <button
                  type="button"
                  aria-label="Sumar una persona"
                  disabled={enviando}
                  onClick={() => cambiarCantidad(1)}
                >
                  +
                </button>
              </div>

              <MensajeError
                id="error-personas"
                mensaje={errores.cantidadPersonas}
              />
            </div>

            <div className="pedidos__campo">
              <label htmlFor="pedido-detalles">
                Detalles del pedido (opcional)
              </label>

              <textarea
                id="pedido-detalles"
                name="detalles"
                rows={3}
                maxLength={1000}
                placeholder="Contanos sabores, cantidades o cualquier detalle de tu pedido."
                value={datos.detalles}
                onChange={manejarCambio}
                aria-invalid={Boolean(errores.detalles)}
              />

              <MensajeError
                id="error-detalles"
                mensaje={errores.detalles}
              />
            </div>

            <button
              type="submit"
              className="pedidos__boton"
              disabled={enviando}
            >
              {enviando ? 'ENVIANDO CONSULTA...' : 'ENVIAR CONSULTA →'}
            </button>

            {mensajeFormulario && (
              <p className="pedidos__error" role="status">
                {mensajeFormulario}
              </p>
            )}
          </form>

          <div className="pedidos__aclaracion">
            <img
              src={info}
              alt=""
              className="pedidos__info-imagen"
            />

            <p>
              Para enviar una consulta es necesario{' '}
              <Link to="/registro">registrarse</Link> o{' '}
              <Link to="/login">iniciar sesión</Link> en
              Lara Pastelería. Completar el formulario no
              confirma el pedido; Lara te informará
              disponibilidad y presupuesto.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pedidos