import flor from '../../assets/elementos/sobremiflor.png'
import estrella from '../../assets/elementos/estrellaPedidos.png'
import './SobreMi.css'

function SobreMi() {
  return (
    <section id="sobre-mi" className="sobre-mi" aria-labelledby="sobre-mi-titulo">
      <div className="sobre-mi__contenido">
        <div className="sobre-mi__encabezado">
          <h2 id="sobre-mi-titulo" className="sobre-mi__titulo">Sobre mí</h2>
          <img src={flor} alt="" className="sobre-mi__flor" />
        </div>

        <div className="sobre-mi__saludo">
          <img src={estrella} alt="" />
          <p>¡Hola, soy Lara!</p>
          <img src={estrella} alt="" />
        </div>

        <div className="sobre-mi__historia">
          <p>
            Mi historia con la cocina empezó cuando tenía apenas 5 o 6 años.
            Lo que comenzó como un hobby y una forma de compartir algo rico
            con mi familia, con los años se convirtió en mi profesión.
          </p>
          <p>
            Estudié <strong>Profesional Gastronómico en el IAG</strong> y,
            después de comenzar mi propio taller en casa, nació la oportunidad
            de crear un espacio dentro del gimnasio de mi familia. Así empezó
            a tomar forma <strong>Lara Pastelería</strong>.
          </p>
          <p>
            Rodeada de personas que buscan cuidarse, descubrí que la pastelería
            también puede encontrar un equilibrio entre lo saludable y lo
            delicioso. Por eso, en mi cocina conviven opciones más equilibradas
            con clásicos como medialunas, rolls de canela y laminados.
          </p>
          <p>
            Mi objetivo es simple: <strong>que cada bocado te sorprenda</strong>
            {' '}y demostrarte que comer rico y buscar el equilibrio pueden ir
            perfectamente de la mano.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SobreMi