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

export const categoriasMenu = [
  { id: 'healthy', nombre: 'Healthy / Fit' },
  { id: 'clasicos', nombre: 'Clásicos de pastelería' },
  { id: 'cafeteria', nombre: 'Cafetería & bebidas' },
]

// Completar descripciones y precios con la información confirmada por Lara.
// precio: null evita mostrar importes inventados; completar con un número en pesos.
export const productosMenu = [
  {
    id: "carrot",
    nombre: "Carrot cake",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen0,
    precio: null,
  },
  {
    id: "energy-balls",
    nombre: "Energy balls",
    categoria: "healthy",
    descripcion: "Dátil protein + nueces bañadas en chocolate.",
    imagen: imagen1,
    precio: null,
  },
  {
    id: "granola",
    nombre: "Granola",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen2,
    precio: null,
  },
  {
    id: "manzana-canela",
    nombre: "Manzana y canela",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen3,
    precio: null,
  },
  {
    id: "ricota",
    nombre: "Tarta de ricota",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen4,
    precio: null,
  },
  {
    id: "chocolate",
    nombre: "Chocolate",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen5,
    precio: null,
  },
  {
    id: "frutilla",
    nombre: "Tarta de frutilla",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen6,
    precio: null,
  },
  {
    id: "key-lime",
    nombre: "Key lime",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen7,
    precio: null,
  },
  {
    id: "cookie",
    nombre: "Cookie",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen8,
    precio: null,
  },
  {
    id: "ricota-frutos-rojos",
    nombre: "Ricota y frutos rojos",
    categoria: "healthy",
    descripcion: "",
    imagen: imagen9,
    precio: null,
  },
  {
    id: "torta-nuez",
    nombre: "Torta de nuez",
    categoria: "healthy",
    descripcion: "Sin azúcar, con dulce de leche y crema de queso.",
    imagen: imagen10,
    precio: null,
    encuadre: 'contain',
  },
  {
    id: "medialuna",
    nombre: "Medialuna de manteca",
    categoria: "clasicos",
    descripcion: "Medialuna de manteca.",
    imagen: imagen11,
    precio: null,
    encuadre: 'contain',
  },
  {
    id: "danesa",
    nombre: "Danesa",
    categoria: "clasicos",
    descripcion: "Masa de hojaldre laminada con manteca, con frutas de estación.",
    imagen: imagen12,
    precio: null,
  },
  {
    id: "cafe-frio",
    nombre: "Café frío",
    categoria: "cafeteria",
    descripcion: "",
    imagen: imagen13,
    precio: null,
  },
  {
    id: "cortado",
    nombre: "Cortado",
    categoria: "cafeteria",
    descripcion: "",
    imagen: imagen14,
    precio: null,
  },
  {
    id: "licuado",
    nombre: "Licuado",
    categoria: "cafeteria",
    descripcion: "",
    imagen: imagen15,
    precio: null,
  },
  {
    id: "cortado-medialuna",
    nombre: "Cortado con medialuna",
    categoria: "cafeteria",
    descripcion: "",
    imagen: imagen16,
    precio: null,
  },
]