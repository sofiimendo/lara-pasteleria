
import { configuracion } from '../../data/configuracion'
import './Ubicacion.css'

function Ubicacion() {
  return (
    <section
      id="ubicacion"
      className="ubicacion"
      aria-labelledby="ubicacion-titulo"
    >
      <div className="ubicacion__marco">
        <h2 id="ubicacion-titulo" className="ubicacion__titulo">
          HORARIOS Y UBICACIÓN
        </h2>

        <div className="ubicacion__contenido">
          <div className="ubicacion__informacion">
            <div className="ubicacion__intro">
              <p className="ubicacion__presentacion">
                Nos encontrás en Europa Boxing
              </p>
              <p className="ubicacion__aclaracion">
                ¡No necesitás ser socio del gimnasio para visitar nuestra pastelería!
              </p>
            </div>

            <div className="ubicacion__horarios">
              {configuracion.horarios.map((horario) => (
                <div className="ubicacion__horario" key={horario.dias}>
                  <h3>{horario.dias}</h3>
                  <div className="ubicacion__turnos">
                    {horario.turnos.map((turno) => (
                      <p key={turno}>{turno} hs</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="ubicacion__datos-direccion">
              <div className="ubicacion__icono-direccion" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>

              <address className="ubicacion__direccion">
                <strong>{configuracion.direccion}</strong>
                <span>{configuracion.referencia}</span>
              </address>
            </div>

            <p className="ubicacion__retiro">
              Pedidos por encargo con retiro en el local.
            </p>
          </div>

          <div className="ubicacion__mapa">
            <iframe
              src={configuracion.mapsEmbedUrl}
              title="Mapa de la dirección de Lara Pastelería"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            <a
              className="ubicacion__boton-mapa"
              href={configuracion.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar
              <span aria-hidden="true">↗</span>
              <span className="ubicacion__solo-lectores">
                (abre en otra pestaña)
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ubicacion