import { useState } from 'react'
import { mostrarPrecio } from '../../data/catalogoLara'
import './TarjetaProducto.css'

const whatsappLara = '5491176788339'

function TarjetaProducto({
  producto,
  descripcionControlada,
  onDescripcionChange,
}) {
  const [abierta, setAbierta] = useState(false)
  const [enHover, setEnHover] = useState(false)

  const esControlada = typeof onDescripcionChange === 'function'

  const mostrarDescripcion = esControlada
    ? descripcionControlada
    : abierta || enHover

  const descripcionId = `descripcion-${producto.id}-${
    esControlada ? 'mobile' : 'desktop'
  }`

  function cambiarDescripcion(valor) {
    if (esControlada) {
      onDescripcionChange(valor)
    } else {
      setAbierta(valor)
    }
  }

  function manejarClick(evento) {
    if (evento.detail === 0) {
      cambiarDescripcion(!mostrarDescripcion)
      return
    }

    if (
      window.matchMedia('(hover: none)').matches ||
      evento.nativeEvent.pointerType === 'touch'
    ) {
      cambiarDescripcion(!mostrarDescripcion)
    }
  }

  function cerrarDescripcion(evento) {
    if (evento.key === 'Escape') {
      cambiarDescripcion(false)
      setEnHover(false)
    }
  }

  function enlaceConsulta(presentacion) {
    const detalle = presentacion
      ? ` (${presentacion.nombre})`
      : ''

    const mensaje = `¡Hola, Lara! Quería consultar el precio de ${producto.nombre}${detalle}. ¡Gracias!`

    return `https://wa.me/${whatsappLara}?text=${encodeURIComponent(mensaje)}`
  }

  function mostrarPresentacion(presentacion) {
    if (presentacion.precio === null) {
      return (
        <p
          key={presentacion.nombre}
          className="tarjeta-producto__precio"
        >
          {presentacion.nombre}:{' '}
          <a
            href={enlaceConsulta(presentacion)}
            className="tarjeta-producto__consultar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar precio de ${producto.nombre}, ${presentacion.nombre}, por WhatsApp`}
          >
            Consultar precio
          </a>
        </p>
      )
    }

    return (
      <p
        key={presentacion.nombre}
        className="tarjeta-producto__precio"
      >
        {presentacion.nombre}: {mostrarPrecio(presentacion)}
      </p>
    )
  }

  return (
    <article className="tarjeta-producto">
      <button
        type="button"
        className={`tarjeta-producto__foto ${
          mostrarDescripcion
            ? 'tarjeta-producto__foto--abierta'
            : ''
        }`}
        aria-label={`Ver detalles de ${producto.nombre}`}
        aria-expanded={mostrarDescripcion}
        aria-controls={descripcionId}
        onPointerEnter={(evento) => {
          if (
            !esControlada &&
            evento.pointerType === 'mouse'
          ) {
            setEnHover(true)
          }
        }}
        onPointerLeave={() => setEnHover(false)}
        onClick={manejarClick}
        onBlur={() => {
          if (!esControlada) {
            setAbierta(false)
          }
        }}
        onKeyDown={cerrarDescripcion}
      >
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            decoding="async"
            width="600"
            height="600"
          />
        ) : (
          <span className="tarjeta-producto__sin-imagen">
            {producto.nombre}
          </span>
        )}

        <span
          id={descripcionId}
          className="tarjeta-producto__descripcion"
          hidden={!mostrarDescripcion}
        >
          <strong>{producto.nombre}</strong>

          <span>
            {producto.descripcion ||
              'Consultá los ingredientes y la disponibilidad con Lara.'}
          </span>

          {producto.anticipacionDias === 5 && (
            <span>Mínimo 5 días de anticipación</span>
          )}

          {producto.requiereSena && (
            <span>
              Seña del 50 % del presupuesto final confirmado
            </span>
          )}
        </span>
      </button>

      <h4 className="tarjeta-producto__nombre">
        {producto.nombre}
      </h4>

      {producto.presentaciones.length > 0 ? (
        <div className="tarjeta-producto__precios">
          {producto.presentaciones.map(mostrarPresentacion)}
        </div>
      ) : (
        <p className="tarjeta-producto__precio">
          <a
            href={enlaceConsulta()}
            className="tarjeta-producto__consultar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar precio de ${producto.nombre} por WhatsApp`}
          >
            Consultar precio
          </a>
        </p>
      )}
    </article>
  )
}

export default TarjetaProducto