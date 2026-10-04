import estrellaFrase from '../../assets/elementos/estrellaFrase.png'
import './Separador.css'

function Separador() {
  return (
    <div className="separador">
      <div className="separador__contenido">
        <img
          src={estrellaFrase}
          alt=""
          className="separador__estrella"
        />

        <p className="separador__frase">
          El café que te activa, el snack que te recupera
        </p>

        <img
          src={estrellaFrase}
          alt=""
          className="separador__estrella"
        />
      </div>
    </div>
  )
}

export default Separador