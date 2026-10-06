import instagram from '../../assets/redes/social.png'
import whatsapp from '../../assets/redes/whatsapp.png'
import corazon from '../../assets/elementos/coraFooter.png'
import './Footer.css'

// Completar con el número real de Lara, solo dígitos y código de país.
// Mientras esté vacío, no se muestra un enlace de WhatsApp incorrecto.
const numeroWhatsApp = ''

function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footer__contenido">
        <div className="footer__contacto">
          <h2 className="footer__titulo">¿Querés saber más?</h2>
          <p className="footer__invitacion">Encontranos en...</p>

          <div className="footer__redes">
            <a
              href="https://www.instagram.com/larapasteleriaa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Lara Pastelería, abre en otra pestaña"
            >
              <img src={instagram} alt="" />
            </a>

            {numeroWhatsApp && (
              <a
                href={`https://wa.me/${numeroWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Lara Pastelería, abre en otra pestaña"
              >
                <img src={whatsapp} alt="" />
              </a>
            )}
          </div>
        </div>

        <img src={corazon} alt="" className="footer__corazon" />

        <div className="footer__marca">
          <p className="footer__nombre">Lara Pastelería</p>
          <p>Pastelería artesanal</p>
          <p>© {new Date().getFullYear()} Lara Pastelería</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer