import torta from '../../assets/imagenes/torta.png'
import medialuna from '../../assets/imagenes/medialuna.png'
import cafe from '../../assets/imagenes/cafe.png'
import waffle from '../../assets/imagenes/waffle.png'

const productos = [
  {
    id: 'torta',
    nombre: 'Torta de nuez',
    imagen: torta,
    descripcion: 'Torta de nuez sin azúcar con ddl y crema de queso',
    anguloInicial: 180,
  },
  {
    id: 'medialuna',
    nombre: 'Medialuna de manteca',
    imagen: medialuna,
    descripcion: 'Medialuna de manteca',
    anguloInicial: 270,
  },
  {
    id: 'cafe',
    nombre: 'Latte',
    imagen: cafe,
    descripcion: 'Latte: tazón con doble shot de espresso y leche',
    anguloInicial: 0,
  },
  {
    id: 'waffle',
    nombre: 'Waffle proteico con frutas',
    imagen: waffle,
    descripcion:
      'Waffle proteico: de avena y whey protein de vainilla. Terminado con fruta de estación, miel y mantequilla de maní.',
    anguloInicial: 90,
  },
]

export default productos