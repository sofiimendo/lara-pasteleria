import { useState } from 'react'
import { categoriasMenu, productosMenu } from '../../data/productosMenu'
import TarjetaProducto from './TarjetaProducto'
import './Menu.css'

function Menu() {
  const [categoriasAbiertas, setCategoriasAbiertas] = useState([])

  function alternarCategoria(id) {
    setCategoriasAbiertas((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((categoria) => categoria !== id)
        : [...anteriores, id]
    )
  }

  return (
    <section id="menu" className="menu" aria-labelledby="menu-titulo">
      <div className="menu__marco">
        <h2 id="menu-titulo" className="menu__titulo">MENÚ & PRODUCTOS</h2>
        <p className="menu__introduccion">
          Opciones saludables, clásicos de pastelería y cafecitos para acompañar tu día.
        </p>
        <p className="menu__ayuda">Pasá el mouse o tocá una foto para ver sus detalles.</p>

        {categoriasMenu.map((categoria) => {
          const productos = productosMenu.filter((producto) => producto.categoria === categoria.id)
          const expandida = categoriasAbiertas.includes(categoria.id)
          const productosVisibles = expandida ? productos : productos.slice(0, 3)

          return (
            <div className="menu__categoria" key={categoria.id}>
              <h3 className="menu__categoria-titulo">{categoria.nombre}</h3>
              <div className="menu__fila">
                <div className="menu__productos" id={`productos-${categoria.id}`}>
                  {productosVisibles.map((producto) => (
                    <TarjetaProducto key={producto.id} producto={producto} />
                  ))}
                </div>

                {productos.length > 3 && (
                  <button
                    type="button"
                    className="menu__ampliar"
                    onClick={() => alternarCategoria(categoria.id)}
                    aria-expanded={expandida}
                    aria-controls={`productos-${categoria.id}`}
                    aria-label={`${expandida ? 'Ver menos' : 'Ver todos los productos de'} ${categoria.nombre}`}
                  >
                    <span aria-hidden="true">{expandida ? '−' : '+'}</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}

        <p className="menu__consulta">
          ¿Buscás algo para un evento? <a href="#pedidos">Consultanos por tu encargo.</a>
        </p>
      </div>
    </section>
  )
}

export default Menu