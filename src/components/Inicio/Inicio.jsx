import { useEffect, useRef, useState } from 'react'
import productos from './productos'
import flores from '../../assets/elementos/flores.png'
import medialunaVerde from '../../assets/elementos/medialunaverde.png'
import './Inicio.css'

function Inicio() {
  const seccionRef = useRef(null)

  const [angulo, setAngulo] = useState(0)
  const [productoHover, setProductoHover] = useState(null)
  const [productoFoco, setProductoFoco] = useState(null)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [pausaManual, setPausaManual] = useState(false)

  const pausada =
    pausaManual ||
    productoHover !== null ||
    productoFoco !== null ||
    productoSeleccionado !== null

  function cerrarDescripcion() {
    setProductoSeleccionado(null)
    setProductoHover(null)
    setProductoFoco(null)

    const elementoActivo = document.activeElement

    if (
      seccionRef.current?.contains(elementoActivo) &&
      elementoActivo?.matches('.inicio__producto')
    ) {
      elementoActivo.blur()
    }
  }

  useEffect(() => {
    function manejarToqueFuera(evento) {
      const producto = evento.target.closest?.('.inicio__producto')

      if (producto && seccionRef.current?.contains(producto)) {
        return
      }

      cerrarDescripcion()
    }

    document.addEventListener('pointerdown', manejarToqueFuera)

    return () => {
      document.removeEventListener('pointerdown', manejarToqueFuera)
    }
  }, [])

  useEffect(() => {
    const preferencia = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    if (pausada || preferencia.matches) return

    const intervalo = setInterval(() => {
      setAngulo((actual) => (actual + 0.2) % 360)
    }, 40)

    return () => clearInterval(intervalo)
  }, [pausada])

  function seleccionarProducto(id, boton) {
    if (productoSeleccionado === id) {
      cerrarDescripcion()
      boton.blur()
    } else {
      setProductoSeleccionado(id)
    }
  }

  return (
    <section ref={seccionRef} id="inicio" className="inicio">
      <div className="inicio__contenido">
        <h1 className="inicio__titulo">
          Opciones saludables, clásicas & cafecitos
        </h1>

        {productos.map((producto) => {
          const radianes =
            ((producto.anguloInicial + angulo) * Math.PI) / 180

          const izquierda = 50 + 48 * Math.cos(radianes)
          const arriba = 50 + 42 * Math.sin(radianes)
          const estaAbajo = arriba > 50

          const activo =
            productoHover === producto.id ||
            productoFoco === producto.id ||
            productoSeleccionado === producto.id

          const estiloDescripcion = {
            top: estaAbajo ? 'calc(100% + 10px)' : 'auto',
            bottom: estaAbajo ? 'auto' : 'calc(100% + 10px)',
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
          }

          if (izquierda < 25) {
            estiloDescripcion.left = '0'
            estiloDescripcion.transform = 'none'
          } else if (izquierda > 75) {
            estiloDescripcion.left = 'auto'
            estiloDescripcion.right = '0'
            estiloDescripcion.transform = 'none'
          }

          return (
            <button
              key={producto.id}
              type="button"
              className={`inicio__producto inicio__producto--${producto.id}`}
              style={{
                left: `${izquierda}%`,
                top: `${arriba}%`,
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={producto.nombre}
              aria-expanded={activo}
              aria-controls={`descripcion-${producto.id}`}
              onPointerEnter={(evento) => {
                if (evento.pointerType === 'mouse') {
                  setProductoHover(producto.id)
                }
              }}
              onPointerLeave={() => setProductoHover(null)}
              onFocus={() => setProductoFoco(producto.id)}
              onBlur={() => setProductoFoco(null)}
              onClick={(evento) => {
                seleccionarProducto(producto.id, evento.currentTarget)
              }}
              onKeyDown={(evento) => {
                if (evento.key === 'Escape') {
                  cerrarDescripcion()
                }
              }}
            >
              <img src={producto.imagen} alt="" />

              <span
                id={`descripcion-${producto.id}`}
                className="inicio__descripcion"
                style={estiloDescripcion}
                hidden={!activo}
              >
                {producto.descripcion}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="inicio__control"
        aria-pressed={pausaManual}
        onClick={() => setPausaManual((actual) => !actual)}
      >
        {pausaManual ? 'Reanudar movimiento' : 'Pausar movimiento'}
      </button>

      <img
        src={flores}
        alt=""
        className="inicio__adorno inicio__adorno--flores"
      />

      <img
        src={medialunaVerde}
        alt=""
        className="inicio__adorno inicio__adorno--medialuna"
      />
    </section>
  )
}

export default Inicio