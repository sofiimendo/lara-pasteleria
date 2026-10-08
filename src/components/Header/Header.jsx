import { useRef, useState } from 'react'
import logoLara from '../../assets/logo-lara-transparente.png'
import flores from '../../assets/elementos/flores.png'
import tazita from '../../assets/elementos/tazita.png'
import './Header.css'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const botonMenuRef = useRef(null)

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  function manejarTeclado(evento) {
    if (evento.key === 'Escape' && menuAbierto) {
      cerrarMenu()
      botonMenuRef.current?.focus()
    }
  }

  return (
    <header className="header" onKeyDown={manejarTeclado}>
      <div className="header__contenido">
        <a
          href="#inicio"
          className="header__logo"
          onClick={cerrarMenu}
        >
          <img src={logoLara} alt="Lara Pastelería — Inicio" />
        </a>

        <button
          ref={botonMenuRef}
          type="button"
          className={`header__hamburguesa ${
            menuAbierto ? 'header__hamburguesa--abierta' : ''
          }`}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="header-enlaces"
          onClick={() => setMenuAbierto((actual) => !actual)}
        >
          <span className="header__icono" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="header-enlaces"
          className={`header__nav ${
            menuAbierto ? 'header__nav--abierta' : ''
          }`}
          aria-label="Navegación principal"
        >
          <a href="#inicio" onClick={cerrarMenu}>
            INICIO
          </a>

          <a
            href="#menu"
            className="header__sobre-mi"
            onClick={cerrarMenu}
          >
            MENÚ & PRODUCTOS
            <img
              src={flores}
              alt=""
              className="header__adorno header__adorno--flores"
            />
          </a>

          <a
            href="#pedidos"
            className="header__pedidos"
            onClick={cerrarMenu}
          >
            EVENTOS & ENCARGOS
            <img
              src={tazita}
              alt=""
              className="header__adorno header__adorno--taza"
            />
          </a>

          <a href="#ubicacion" onClick={cerrarMenu}>
            UBICACIÓN
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header