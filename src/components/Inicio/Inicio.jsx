import { useEffect, useRef, useState } from 'react'
import productos from './productos'
import tazita from '../../assets/elementos/tazita.png'
import medialunaVerde from '../../assets/elementos/medialunaverde.png'
import ovaloMobile from '../../assets/elementos/mobileOvalo.svg'
import './Inicio.css'

function Inicio() {
  const seccionRef = useRef(null)

  const [angulo, setAngulo] = useState(0)
  const [productoHover, setProductoHover] = useState(null)
  const [productoFoco, setProductoFoco] = useState(null)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [pausaManual, setPausaManual] = useState(false)
  const [indiceMobile, setIndiceMobile] = useState(0)

  const [esMobile, setEsMobile] = useState(
    () => window.matchMedia('(max-width: 600px)').matches
  )

  const [movimientoReducido, setMovimientoReducido] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const productoActual = productos[indiceMobile]

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
      elementoActivo?.matches('.inicio__producto, .inicio__mobile-producto')
    ) {
      elementoActivo.blur()
    }
  }

  function cambiarProducto(direccion) {
    cerrarDescripcion()

    setIndiceMobile((actual) =>
      (actual + direccion + productos.length) % productos.length
    )
  }

  useEffect(() => {
    const consultaMobile = window.matchMedia('(max-width: 600px)')
    const consultaMovimiento = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    function actualizarMobile(evento) {
      setEsMobile(evento.matches)
      setProductoSeleccionado(null)
      setProductoHover(null)
      setProductoFoco(null)
    }

    function actualizarMovimiento(evento) {
      setMovimientoReducido(evento.matches)
    }

    consultaMobile.addEventListener('change', actualizarMobile)
    consultaMovimiento.addEventListener('change', actualizarMovimiento)

    return () => {
      consultaMobile.removeEventListener('change', actualizarMobile)
      consultaMovimiento.removeEventListener('change', actualizarMovimiento)
    }
  }, [])

  useEffect(() => {
    function manejarToqueFuera(evento) {
      const producto = evento.target.closest?.(
        '.inicio__producto, .inicio__mobile-producto'
      )

      if (producto && seccionRef.current?.contains(producto)) {
        return
      }

      setProductoSeleccionado(null)
      setProductoHover(null)
      setProductoFoco(null)
    }

    document.addEventListener('pointerdown', manejarToqueFuera)

    return () => {
      document.removeEventListener('pointerdown', manejarToqueFuera)
    }
  }, [])

  useEffect(() => {
    if (pausada || movimientoReducido || productos.length === 0) return

    if (esMobile) {
      const intervalo = setInterval(() => {
        setIndiceMobile((actual) => (actual + 1) % productos.length)
      }, 4000)

      return () => clearInterval(intervalo)
    }

    const intervalo = setInterval(() => {
      setAngulo((actual) => (actual + 0.2) % 360)
    }, 40)

    return () => clearInterval(intervalo)
  }, [pausada, esMobile, movimientoReducido])

  function seleccionarProducto(id, boton) {
    if (productoSeleccionado === id) {
      cerrarDescripcion()
      boton.blur()
    } else {
      setProductoSeleccionado(id)
    }
  }

  return (
    <section
      ref={seccionRef}
      id="inicio"
      className="inicio"
      aria-labelledby="inicio-titulo"
    >
      <div className="inicio__contenido">
        <h1 id="inicio-titulo" className="inicio__titulo">
          El equilibrio perfecto entre lo clásico y lo saludable.
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
              aria-controls={`inicio-descripcion-${producto.id}`}
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
                id={`inicio-descripcion-${producto.id}`}
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

      <div className="inicio__mobile">
        <div className="inicio__mobile-escenario">
          <img
            src={ovaloMobile}
            alt=""
            className="inicio__mobile-ovalo"
            aria-hidden="true"
          />

          <button
            type="button"
            className="inicio__mobile-producto"
            aria-label={`Conocer ${productoActual.nombre}`}
            aria-expanded={productoSeleccionado === productoActual.id}
            aria-controls="inicio-mobile-descripcion"
            onClick={(evento) => {
              seleccionarProducto(productoActual.id, evento.currentTarget)
            }}
            onKeyDown={(evento) => {
              if (evento.key === 'Escape') {
                cerrarDescripcion()
              }
            }}
          >
            <img
              key={productoActual.id}
              src={productoActual.imagen}
              alt=""
              className="inicio__mobile-imagen"
            />
          </button>
        </div>

        <p className="inicio__mobile-nombre">
          {productoActual.nombre}
        </p>

        <p
          id="inicio-mobile-descripcion"
          className="inicio__mobile-descripcion"
          hidden={productoSeleccionado !== productoActual.id}
        >
          {productoActual.descripcion}
        </p>

        <div className="inicio__mobile-navegacion">
          <button
            type="button"
            className="inicio__mobile-flecha"
            onClick={() => cambiarProducto(-1)}
            aria-label="Ver producto anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m15 18-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="inicio__mobile-contador">
            {indiceMobile + 1} / {productos.length}
          </span>

          <button
            type="button"
            className="inicio__mobile-flecha"
            onClick={() => cambiarProducto(1)}
            aria-label="Ver producto siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m9 18 6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <p className="inicio__mobile-ayuda">
          Tocá el producto para conocerlo
        </p>
      </div>

      <div className="inicio__acciones">
        <a href="#menu" className="inicio__enlace-menu">
          Ver productos / Menú
        </a>

        <button
          type="button"
          className="inicio__control"
          aria-pressed={pausaManual}
          onClick={() => setPausaManual((actual) => !actual)}
        >
          {pausaManual ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
      </div>

      <img
        src={tazita}
        alt=""
        className="inicio__adorno inicio__adorno--taza"
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