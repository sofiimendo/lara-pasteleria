import cafeForma from '../../assets/imagenes/cafeforma.png'
import brunch from '../../assets/imagenes/brunch.png'
import facturas from '../../assets/imagenes/factu.png'
import polaroid from '../../assets/imagenes/polaroid.png'
import logoFotos from '../../assets/imagenes/logoFotos.png'
import taza from '../../assets/elementos/tazaFotos.png'
import medialuna from '../../assets/elementos/medialunaFoto.png'
import './Galeria.css'

function Galeria() {
  return (
    <section className="galeria" aria-label="Fotos de Lara Pastelería">
      <div className="galeria__contenido">
        <div className="galeria__cafe">
          <img
            src={cafeForma}
            alt="Café frío servido en un vaso con hielo"
            className="galeria__foto-cafe"
            loading="lazy"
          />
          <img src={taza} alt="" className="galeria__taza" />
        </div>

        <img
          src={brunch}
          alt="Brunch con tostadas, frutas y café de Lara Pastelería"
          className="galeria__brunch"
          loading="lazy"
        />

        <div className="galeria__derecha">
          <img
            src={facturas}
            alt="Medialunas y facturas con frutas en una bandeja"
            className="galeria__facturas"
            loading="lazy"
          />
          <img src={medialuna} alt="" className="galeria__medialuna" />

          <div className="galeria__detalles">
            <img
              src={polaroid}
              alt="Foto enmarcada de una preparación con palta, huevo y tomates"
              className="galeria__polaroid"
              loading="lazy"
            />
            <img
              src={logoFotos}
              alt="Lara Pastelería"
              className="galeria__logo"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Galeria