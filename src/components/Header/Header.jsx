import logoLara from '../../assets/logo-lara.png'
import flores from '../../assets/elementos/flores.png'
import tazita from '../../assets/elementos/tazita.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Navegación principal">
        <a href="#inicio">INICIO</a>

        <a href="#sobre-mi" className="header__sobre-mi">
          SOBRE MÍ
          <img
            src={flores}
            alt=""
            className="header__adorno header__adorno--flores"
          />
        </a>

        <a href="#inicio" className="header__logo">
          <img src={logoLara} alt="Lara Pastelería — Inicio" />
        </a>

        <a href="#pedidos" className="header__pedidos">
          PEDIDOS
          <img
            src={tazita}
            alt=""
            className="header__adorno header__adorno--taza"
          />
        </a>

        <a href="#contacto">CONTACTO</a>
      </nav>
    </header>
  )
}

export default Header