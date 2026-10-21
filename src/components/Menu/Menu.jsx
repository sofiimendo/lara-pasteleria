import { useEffect, useState } from 'react'
import { categoriasMenu, productosMenu } from '../../data/productosMenu'
import TarjetaProducto from './TarjetaProducto'
import './Menu.css'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000'
).trim().replace(/\/+$/, '')

function CategoriaMobile({ categoria, productos }) {
  const [posicion, setPosicion] = useState(0)
  const [descripcionAbierta, setDescripcionAbierta] = useState(false)
  const [pausado, setPausado] = useState(false)

  const posicionActual = Math.min(posicion, productos.length - 1)

  useEffect(() => {
    if (productos.length <= 1 || descripcionAbierta || pausado) return

    const intervalo = window.setInterval(() => {
      setPosicion((actual) => (actual + 1) % productos.length)
    }, 5000)

    return () => window.clearInterval(intervalo)
  }, [productos.length, descripcionAbierta, pausado])

  function mover(movimiento) {
    setPosicion(
      (posicionActual + movimiento + productos.length) % productos.length
    )
    setDescripcionAbierta(false)
    setPausado(true)
  }

  const producto = productos[posicionActual]

  if (!producto) return null

  return (
    <div className="menu__fila menu__fila--mobile">
      <div
        className="menu__productos menu__productos--mobile"
        id={`productos-mobile-${categoria.id}`}
        aria-live="off"
      >
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          descripcionControlada={descripcionAbierta}
          onDescripcionChange={setDescripcionAbierta}
        />
      </div>

      {productos.length > 1 && (
        <div className="menu__controles menu__controles--mobile">
          <button
            type="button"
            className="menu__ampliar"
            onClick={() => mover(-1)}
            aria-label={`Producto anterior de ${categoria.nombre}`}
            aria-controls={`productos-mobile-${categoria.id}`}
          >
            <span aria-hidden="true">−</span>
          </button>

          <span className="menu__contador">
            {posicionActual + 1} / {productos.length}
          </span>

          <button
            type="button"
            className="menu__ampliar"
            onClick={() => mover(1)}
            aria-label={`Siguiente producto de ${categoria.nombre}`}
            aria-controls={`productos-mobile-${categoria.id}`}
          >
            <span aria-hidden="true">+</span>
          </button>

          {pausado && (
            <button
              type="button"
              className="menu__reanudar"
              onClick={() => setPausado(false)}
            >
              Reanudar animación
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function Categoria({ categoria, productos }) {
  const [posicion, setPosicion] = useState(0)

  const maximo = Math.max(0, productos.length - 3)
  const posicionActual = Math.min(posicion, maximo)
  const productosVisibles = productos.slice(
    posicionActual,
    posicionActual + 3
  )

  function mover(movimiento) {
    setPosicion(
      Math.max(0, Math.min(posicionActual + movimiento, maximo))
    )
  }

  if (!productos.length) return null

  return (
    <div className="menu__categoria">
      <h4 className="menu__categoria-titulo">{categoria.nombre}</h4>

      <div className="menu__fila menu__fila--desktop">
        <div
          className="menu__productos"
          id={`productos-desktop-${categoria.id}`}
        >
          {productosVisibles.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>

        {productos.length > 3 && (
          <div className="menu__controles">
            <button
              type="button"
              className="menu__ampliar"
              onClick={() => mover(1)}
              disabled={posicionActual >= maximo}
              aria-label={`Siguiente producto de ${categoria.nombre}`}
              aria-controls={`productos-desktop-${categoria.id}`}
            >
              <span aria-hidden="true">+</span>
            </button>

            <button
              type="button"
              className="menu__ampliar"
              onClick={() => mover(-1)}
              disabled={posicionActual === 0}
              aria-label={`Producto anterior de ${categoria.nombre}`}
              aria-controls={`productos-desktop-${categoria.id}`}
            >
              <span aria-hidden="true">−</span>
            </button>
          </div>
        )}
      </div>

      <CategoriaMobile categoria={categoria} productos={productos} />
    </div>
  )
}

function agruparProductos(productos) {
  const grupos = new Map()

  for (const producto of productos) {
    const nombreCategoria =
      producto.categoria?.trim() || 'Sin categoría'

    const clave = nombreCategoria
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')

    if (!grupos.has(clave)) {
      grupos.set(clave, {
        nombre: nombreCategoria,
        productos: [],
      })
    }

    grupos.get(clave).productos.push({
      id: `api-${producto._id}`,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      imagen: producto.imagen || null,
      presentaciones: [
        {
          nombre: 'Precio',
          precio: producto.precio,
        },
      ],
    })
  }

  return Array.from(grupos.values()).map((grupo, indice) => ({
    ...grupo,
    id: `local-${indice}`,
  }))
}

function Menu() {
  const [productosAPI, setProductosAPI] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()
    let activo = true

    const limite = window.setTimeout(() => {
      controlador.abort()
    }, 90000)

    async function cargarProductos() {
      try {
        const respuesta = await fetch(`${API_URL}/api/productos`, {
          signal: controlador.signal,
          cache: 'no-store',
        })

        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el menú')
        }

        const datos = await respuesta.json()

        if (
          !Array.isArray(datos.productos) ||
          !datos.productos.every(
            (producto) =>
              producto &&
              typeof producto._id === 'string' &&
              typeof producto.nombre === 'string' &&
              typeof producto.precio === 'number' &&
              Number.isFinite(producto.precio) &&
              producto.precio >= 0 &&
              (
                producto.categoria == null ||
                typeof producto.categoria === 'string'
              )
          )
        ) {
          throw new Error('La respuesta del menú no es válida')
        }

        if (activo) {
          setProductosAPI(
            datos.productos.filter(
              (producto) => producto.disponible === true
            )
          )
        }
      } catch {
        if (activo) {
          setError(
            'No pudimos cargar los productos del local. Intentá nuevamente en unos momentos.'
          )
        }
      } finally {
        window.clearTimeout(limite)

        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarProductos()

    return () => {
      activo = false
      window.clearTimeout(limite)
      controlador.abort()
    }
  }, [intento])

  function reintentar() {
    setError('')
    setCargando(true)
    setIntento((actual) => actual + 1)
  }

  const gruposAPI = agruparProductos(productosAPI)

  return (
    <section id="menu" className="menu" aria-labelledby="menu-titulo">
      <div className="menu__marco">
        <h2 id="menu-titulo" className="menu__titulo">
          MENÚ & PRODUCTOS
        </h2>

        <section
          className="menu__seccion"
          aria-labelledby="menu-local-titulo"
          aria-busy={cargando}
        >
          <h3 id="menu-local-titulo" className="menu__seccion-titulo">
            Productos del local
          </h3>

          {cargando && (
            <p className="menu__mensaje" role="status">
              Cargando productos del local…
            </p>
          )}

          {error && (
            <div className="menu__aviso">
              <p className="menu__mensaje" role="alert">
                {error}
              </p>

              <button
                type="button"
                className="menu__reintentar"
                onClick={reintentar}
              >
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !error && gruposAPI.length === 0 && (
            <p className="menu__mensaje" role="status">
              Por el momento no hay productos del local disponibles.
            </p>
          )}

          {!cargando && !error && gruposAPI.map((grupo) => (
            <Categoria
              key={grupo.id}
              categoria={grupo}
              productos={grupo.productos}
            />
          ))}
        </section>

        <section
          className="menu__seccion menu__seccion--catalogo"
          aria-labelledby="menu-catalogo-titulo"
        >
          <h3
            id="menu-catalogo-titulo"
            className="menu__seccion-titulo"
          >
            Catálogo original
          </h3>

          {categoriasMenu.map((categoria) => {
            const productos = productosMenu.filter(
              (producto) => producto.categoria === categoria.id
            )

            return (
              <Categoria
                key={categoria.id}
                categoria={{
                  ...categoria,
                  id: `catalogo-${categoria.id}`,
                }}
                productos={productos}
              />
            )
          })}
        </section>

        <p className="menu__consulta">
          ¿Buscás algo para un evento?{' '}
          <a href="#pedidos">Consultanos por tu encargo.</a>
        </p>
      </div>
    </section>
  )
}

export default Menu