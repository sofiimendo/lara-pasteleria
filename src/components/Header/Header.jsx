import logoLara from '../../assets/logo-lara.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Navegación principal">
        <a href="#inicio">INICIO</a>
        <a href="#sobre-mi">SOBRE MÍ</a>

        <a href="#inicio" className="header__logo">
          <img src={logoLara} alt="Lara Pastelería — Inicio" />
        </a>

        <a href="#pedidos">PEDIDOS</a>
        <a href="#contacto">CONTACTO</a>
      </nav>
    </header>
  )
}

export default Header