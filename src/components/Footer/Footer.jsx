import corazon from '../../assets/elementos/coraFooter.png'
import { configuracion } from '../../data/configuracion'
import './Footer.css'

const enlacesFooter = [
  { texto: 'Inicio', destino: '#inicio' },
  { texto: 'Productos', destino: '#menu' },
  { texto: 'Eventos & encargos', destino: '#pedidos' },
  { texto: 'Ubicación', destino: '#ubicacion' },
]

function IconoInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoWhatsApp() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.4 11.7a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.5-4.9a8.4 8.4 0 1 1 15.9-3.9Z" />
      <path d="M8.3 8.1c-.3.3-.7 1-.6 1.7.2 1.8 2.6 4.6 4.5 5.5 1.4.7 2.5.5 3.1.1l.8-1.2-2.3-1.1-1.1 1c-1.3-.5-2.3-1.5-2.9-2.7l.9-1.1-1-2.2Z" />
    </svg>
  )
}

function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footer__contenido">
        <div className="footer__marca">
          <div className="footer__bloque-superior">
            <div className="footer__encabezado">
              <p className="footer__nombre">Lara Pastelería</p>
              <img
                src={corazon}
                alt=""
                className="footer__corazon"
                width="30"
                height="30"
              />
            </div>

            <p className="footer__frase">
              Pastelería artesanal, hecha con amor.
            </p>
          </div>

          <div className="footer__bloque-inferior">
            <p className="footer__seguinos">
              Seguinos y descubrí nuestras novedades
            </p>

            <div className="footer__redes">
              <a
                href={configuracion.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Lara Pastelería, abre en otra pestaña"
              >
                <IconoInstagram />
              </a>

              <a
                href={`https://wa.me/${configuracion.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Lara Pastelería, abre en otra pestaña"
              >
                <IconoWhatsApp />
              </a>
            </div>
          </div>
        </div>

        <nav
          className="footer__navegacion"
          aria-label="Navegación del pie de página"
        >
          <h2 className="footer__titulo">Explorá</h2>

          <ul className="footer__enlaces">
            {enlacesFooter.map((enlace) => (
              <li key={enlace.destino}>
                <a href={enlace.destino}>{enlace.texto}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer__inferior">
        <p className="footer__creditos">
          © {new Date().getFullYear()} Lara Pastelería · Diseñado y desarrollado por Yamila Valdez Aguilar y Sofía Mendoza
        </p>
      </div>
    </footer>
  )
}

export default Footer