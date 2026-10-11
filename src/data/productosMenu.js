
import imagen0 from '../assets/menu/carrot.webp'
import imagen1 from '../assets/menu/energy-balls.webp'
import imagen2 from '../assets/menu/granola.webp'
import imagen3 from '../assets/menu/manzana-canela.webp'
import imagen4 from '../assets/menu/ricota.webp'
import imagen5 from '../assets/menu/chocolate.webp'
import imagen6 from '../assets/menu/frutilla.webp'
import imagen7 from '../assets/menu/key-lime.webp'
import imagen8 from '../assets/menu/cookie.webp'
import imagen9 from '../assets/menu/ricota-frutos-rojos.webp'
import imagen10 from '../assets/menu/torta-nuez.jpeg'
import imagen11 from '../assets/menu/medialuna.jpeg'
import imagen12 from '../assets/menu/danesa.webp'
import imagen13 from '../assets/menu/cafe-frio.jpeg'
import imagen14 from '../assets/menu/cortado.webp'
import imagen15 from '../assets/menu/licuado.webp'
import imagen16 from '../assets/menu/cortado-medialuna.webp'

import { catalogoLara } from './catalogoLara'

export const categoriasMenu = [
  { id: 'healthy', nombre: 'Healthy / Fit' },
  { id: 'clasicos', nombre: 'Clásicos de pastelería' },
  { id: 'cafeteria', nombre: 'Cafetería & bebidas' },
]

const productosBase = [
  {
    id: 'carrot',
    nombre: 'Carrot cake',
    categoria: 'healthy',
    descripcion: '',
    imagen: imagen0,
  },
  {
    id: 'energy-balls',
    nombre: 'Energy balls',
    categoria: 'healthy',
    descripcion: 'Dátil protein + nueces bañadas en chocolate.',
    imagen: imagen1,
  },
  {
    id: 'granola',
    nombre: 'Granola',
    categoria: 'healthy',
    descripcion: '',
    imagen: imagen2,
  },
  {
    id: 'manzana-canela',
    nombre: 'Manzana y canela',
    categoria: 'healthy',
    descripcion: '',
    imagen: imagen3,
  },
  {
    id: 'ricota',
    catalogoId: 'tarta-ricota-proteica',
    categoria: 'healthy',
    imagen: imagen4,
  },
  {
    id: 'chocolate',
    nombre: 'Chocolate',
    categoria: 'healthy',
    descripcion: '',
    imagen: imagen5,
  },
  {
    id: 'frutilla',
    catalogoId: 'tarta-frutillas-yogur',
    categoria: 'healthy',
    imagen: imagen6,
  },
  {
    id: 'key-lime',
    catalogoId: 'tarta-lima',
    categoria: 'healthy',
    imagen: imagen7,
  },
  {
    id: 'cookie',
    nombre: 'Cookie',
    categoria: 'healthy',
    descripcion: '',
    imagen: imagen8,
  },
  {
    id: 'ricota-frutos-rojos',
    catalogoId: 'ricota-frutos-rojos',
    categoria: 'healthy',
    imagen: imagen9,
  },
  {
    id: 'torta-nuez',
    catalogoId: 'torta-nuez',
    categoria: 'healthy',
    imagen: imagen10,
  },
  {
    id: 'cookie-proteica',
    catalogoId: 'cookie-proteica',
    categoria: 'healthy',
    imagen: null,
  },
  {
    id: 'cookie-mani',
    catalogoId: 'cookie-mani',
    categoria: 'healthy',
    imagen: null,
  },
  {
    id: 'cookie-manzana-almendras',
    catalogoId: 'cookie-manzana-almendras',
    categoria: 'healthy',
    imagen: null,
  },
  {
    id: 'medialuna',
    catalogoId: 'medialuna-manteca',
    categoria: 'clasicos',
    imagen: imagen11,
  },
  {
    id: 'danesa',
    nombre: 'Danesa',
    categoria: 'clasicos',
    descripcion: 'Masa de hojaldre laminada con manteca, con frutas de estación.',
    imagen: imagen12,
  },
  {
    id: 'buttercake-grande',
    catalogoId: 'buttercake-grande',
    categoria: 'clasicos',
    imagen: null,
  },
  {
    id: 'cafe-frio',
    nombre: 'Café frío',
    categoria: 'cafeteria',
    descripcion: '',
    imagen: imagen13,
  },
  {
    id: 'cortado',
    nombre: 'Cortado',
    categoria: 'cafeteria',
    descripcion: '',
    imagen: imagen14,
  },
  {
    id: 'licuado',
    catalogoId: 'licuado-frutal',
    categoria: 'cafeteria',
    imagen: imagen15,
  },
  {
    id: 'licuado-proteico',
    catalogoId: 'licuado-proteico',
    categoria: 'cafeteria',
    imagen: null,
  },
  {
    id: 'cortado-medialuna',
    nombre: 'Cortado con medialuna',
    categoria: 'cafeteria',
    descripcion: '',
    imagen: imagen16,
  },
]

export const productosMenu = productosBase.map((producto) => {
  const datosCatalogo = catalogoLara.find(
    (item) => item.id === producto.catalogoId
  )

  return {
    ...datosCatalogo,
    ...producto,
    nombre: datosCatalogo?.nombre || producto.nombre,
    descripcion: datosCatalogo?.descripcion || producto.descripcion,
    presentaciones: datosCatalogo?.presentaciones || [],
    anticipacionDias: datosCatalogo?.anticipacionDias,
    requiereSena: datosCatalogo?.requiereSena || false,
  }
})