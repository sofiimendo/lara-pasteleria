import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoLara from '../../assets/logo-lara-transparente.png'
import './Header.css'

function obtenerCliente() {
  try {
    const token = sessionStorage.getItem('lara_cliente_token')
    const clienteGuardado = sessionStorage.getItem('lara_cliente')

    if (!token || !clienteGuardado) {
      return null
    }

    const cliente = JSON.parse(clienteGuardado)

    if (
      cliente?.rol !== 'cliente' ||
      typeof cliente.nombre !== 'string' ||
      !cliente.nombre.trim()
    ) {
      return null
    }

    return cliente
  } catch {
    return null
  }
}

function IconoCerrarSesion() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

function Header() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [cliente, setCliente] = useState(obtenerCliente)
  const botonMenuRef = useRef(null)

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  function cerrarSesion() {
    sessionStorage.removeItem('lara_cliente_token')
    sessionStorage.removeItem('lara_cliente')

    setCliente(null)
    cerrarMenu()
    navigate('/')
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

          <a href="#menu" onClick={cerrarMenu}>
            MENÚ & PRODUCTOS
          </a>

          <a href="#pedidos" onClick={cerrarMenu}>
            EVENTOS & ENCARGOS
          </a>

          <a href="#ubicacion" onClick={cerrarMenu}>
            UBICACIÓN
          </a>

          {cliente && (
            <Link to="/mis-pedidos" onClick={cerrarMenu}>
              MIS PEDIDOS
            </Link>
          )}

          {cliente ? (
            <div className="header__sesion">
              <span className="header__cliente">
                Hola, {cliente.nombre.trim().split(/\s+/)[0]}
              </span>

              <button
                type="button"
                className="header__cerrar-sesion"
                onClick={cerrarSesion}
              >
                <IconoCerrarSesion />
                <span>Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="header__login"
              onClick={cerrarMenu}
            >
              <span aria-hidden="true">♙</span>
              LOGIN
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header