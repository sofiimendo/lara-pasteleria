import torta from '../../assets/imagenes/torta.png'
import medialuna from '../../assets/imagenes/medialuna.png'
import cafe from '../../assets/imagenes/cafe.png'
import waffle from '../../assets/imagenes/waffle.png'
import flores from '../../assets/elementos/flores.png'
import estrella from '../../assets/elementos/estrellaLara.png'
import './Inicio.css'

function Inicio() {
  return (
    <section id="inicio" className="inicio">
      <div className="inicio__contenido">
        <h1 className="inicio__titulo">
          Opciones saludables, clásicas & cafecitos
        </h1>

        <img
          src={torta}
          alt="Torta de Lara Pastelería"
          className="inicio__imagen inicio__imagen--torta"
        />

        <img
          src={medialuna}
          alt="Medialuna"
          className="inicio__imagen inicio__imagen--medialuna"
        />

        <img
          src={cafe}
          alt="Café con leche"
          className="inicio__imagen inicio__imagen--cafe"
        />

        <img
          src={waffle}
          alt="Waffle con frutas"
          className="inicio__imagen inicio__imagen--waffle"
        />
        
        <img
  src={flores}
  alt=""
  className="inicio__adorno inicio__adorno--flores"
/>

<img
  src={estrella}
  alt=""
  className="inicio__adorno inicio__adorno--estrella"
/>
      </div>
    </section>
  )
}

export default Inicio