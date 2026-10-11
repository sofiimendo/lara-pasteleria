import { useEffect, useState } from 'react'
import { categoriasMenu, productosMenu } from '../../data/productosMenu'
import TarjetaProducto from './TarjetaProducto'
import './Menu.css'

function CategoriaMobile({ categoria, productos }) {
  const [posicion, setPosicion] = useState(0)
  const [descripcionAbierta, setDescripcionAbierta] = useState(false)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (productos.length <= 1 || descripcionAbierta || pausado) return

    const intervalo = window.setInterval(() => {
      setPosicion((actual) => (actual + 1) % productos.length)
    }, 5000)

    return () => window.clearInterval(intervalo)
  }, [productos.length, descripcionAbierta, pausado])

  function mover(movimiento) {
    setPosicion((actual) =>
      (actual + movimiento + productos.length) % productos.length
    )
    setDescripcionAbierta(false)
    setPausado(true)
  }

  const producto = productos[posicion]

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
            {posicion + 1} / {productos.length}
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

function Menu() {
  const [posiciones, setPosiciones] = useState({})

  function moverCategoria(id, movimiento, total) {
    setPosiciones((anteriores) => {
      const actual = anteriores[id] || 0
      const maximo = Math.max(0, total - 3)

      return {
        ...anteriores,
        [id]: Math.max(0, Math.min(actual + movimiento, maximo)),
      }
    })
  }

  return (
    <section id="menu" className="menu" aria-labelledby="menu-titulo">
      <div className="menu__marco">
        <h2 id="menu-titulo" className="menu__titulo">
          MENÚ & PRODUCTOS
        </h2>

        {categoriasMenu.map((categoria) => {
          const productos = productosMenu.filter(
            (producto) => producto.categoria === categoria.id
          )

          if (!productos.length) return null

          const maximo = Math.max(0, productos.length - 3)
          const posicion = Math.min(posiciones[categoria.id] || 0, maximo)
          const productosVisibles = productos.slice(posicion, posicion + 3)

          return (
            <div className="menu__categoria" key={categoria.id}>
              <h3 className="menu__categoria-titulo">
                {categoria.nombre}
              </h3>

              <div className="menu__fila menu__fila--desktop">
                <div
                  className="menu__productos"
                  id={`productos-desktop-${categoria.id}`}
                >
                  {productosVisibles.map((producto) => (
                    <TarjetaProducto
                      key={producto.id}
                      producto={producto}
                    />
                  ))}
                </div>

                {productos.length > 3 && (
                  <div className="menu__controles">
                    <button
                      type="button"
                      className="menu__ampliar"
                      onClick={() =>
                        moverCategoria(categoria.id, 1, productos.length)
                      }
                      disabled={posicion >= maximo}
                      aria-label={`Siguiente producto de ${categoria.nombre}`}
                      aria-controls={`productos-desktop-${categoria.id}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>

                    <button
                      type="button"
                      className="menu__ampliar"
                      onClick={() =>
                        moverCategoria(categoria.id, -1, productos.length)
                      }
                      disabled={posicion === 0}
                      aria-label={`Producto anterior de ${categoria.nombre}`}
                      aria-controls={`productos-desktop-${categoria.id}`}
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                  </div>
                )}
              </div>

              <CategoriaMobile
                categoria={categoria}
                productos={productos}
              />
            </div>
          )
        })}

        <p className="menu__consulta">
          ¿Buscás algo para un evento?{' '}
          <a href="#pedidos">Consultanos por tu encargo.</a>
        </p>
      </div>
    </section>
  )
}

export default Menu