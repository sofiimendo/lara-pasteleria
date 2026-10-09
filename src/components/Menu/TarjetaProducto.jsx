import { useState } from 'react'
import './TarjetaProducto.css'

function TarjetaProducto({ producto }) {
  const [abierta, setAbierta] = useState(false)
  const [enHover, setEnHover] = useState(false)
  const mostrarDescripcion = abierta || enHover
  const descripcionId = `descripcion-${producto.id}`

  function cerrarDescripcion(event) {
    if (event.key === 'Escape') {
      setAbierta(false)
      setEnHover(false)
    }
  }

  return (
    <article className="tarjeta-producto">
      <button
        type="button"
        className={`tarjeta-producto__foto ${mostrarDescripcion ? 'tarjeta-producto__foto--abierta' : ''}`}
        aria-label={`Ver detalles de ${producto.nombre}`}
        aria-expanded={mostrarDescripcion}
        aria-controls={descripcionId}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setEnHover(true)
        }}
        onPointerLeave={() => setEnHover(false)}
        onClick={() => setAbierta(!abierta)}
        onBlur={() => setAbierta(false)}
        onKeyDown={cerrarDescripcion}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={producto.encuadre === 'contain' ? 'tarjeta-producto__imagen--recorte' : ''}
          loading="lazy"
          decoding="async"
          width="600"
          height="600"
        />
        <span
          id={descripcionId}
          className="tarjeta-producto__descripcion"
          hidden={!mostrarDescripcion}
        >
          <strong>{producto.nombre}</strong>
          <span>{producto.descripcion || 'Consultá los ingredientes y la disponibilidad con Lara.'}</span>
        </span>
      </button>

      <h4 className="tarjeta-producto__nombre">{producto.nombre}</h4>
      {producto.precio !== null && (
        <p className="tarjeta-producto__precio">
          {producto.precio.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          })}
        </p>
      )}
    </article>
  )
}

export default TarjetaProducto