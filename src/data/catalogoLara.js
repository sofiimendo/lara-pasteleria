// Precio en pesos argentinos. null = Lara no confirmó ese importe.
// "desde" indica que los extras cambian el precio final.
export const catalogoLara = [
  {
    id: 'cookie-proteica',
    nombre: 'Cookie proteica',
    categoria: 'Cookies',
    descripcion: 'Cookie con proteína de vainilla y frutos secos, terminada con hilos de chocolate blanco.',
    presentaciones: [{ nombre: 'Unidad', precio: 3000 }],
    imagen: null,
  },
  {
    id: 'cookie-mani',
    nombre: 'Cookie integral de pasta de maní',
    categoria: 'Cookies',
    descripcion: 'Cookie integral de mantequilla de maní, con trozos de chocolate y maní.',
    presentaciones: [{ nombre: 'Unidad', precio: 3000 }],
    imagen: null,
  },
  {
    id: 'cookie-manzana-almendras',
    nombre: 'Cookie integral de manzana y almendras',
    categoria: 'Cookies',
    descripcion: 'Cookie integral húmeda, con pedacitos de manzana y almendras.',
    presentaciones: [{ nombre: 'Unidad', precio: 3000 }],
    imagen: null,
  },
  {
    id: 'medialuna-manteca',
    nombre: 'Medialuna de manteca',
    categoria: 'Medialunas',
    descripcion: 'Elaborada a mano durante tres días y terminada con almíbar de limón.',
    presentaciones: [{ nombre: 'Unidad', precio: 2500 }],
    anticipacionDias: 5,
    imagen: null,
  },
  {
    id: 'tarta-ricota-proteica',
    nombre: 'Tarta de ricota proteica',
    categoria: 'Tortas y tartas',
    descripcion: 'Base sablé integral con relleno cremoso de ricota, proteína y un toque de limón.',
    presentaciones: [
      { nombre: 'Porción', precio: null },
      { nombre: 'Entera · 6 porciones grandes u 8 chicas', precio: null },
    ],
    anticipacionDias: 5,
    requiereSena: true,
    imagen: null,
  },
  {
    id: 'ricota-frutos-rojos',
    nombre: 'Tarta de ricota con frutos rojos',
    categoria: 'Tortas y tartas',
    descripcion: 'Base sablé integral, relleno cremoso de ricota y proteína con marmolado de frutos rojos, terminado con una reducción de frutos rojos.',
    presentaciones: [
      { nombre: 'Porción', precio: null },
      { nombre: 'Entera · 6 porciones grandes u 8 chicas', precio: null },
    ],
    anticipacionDias: 5,
    requiereSena: true,
    imagen: null,
  },
  {
    id: 'torta-nuez',
    nombre: 'Torta de nuez sin azúcar ni harina',
    categoria: 'Tortas y tartas',
    descripcion: 'Torta húmeda de nuez sin harina, cubierta con dulce de leche sin azúcar y crema de queso sin azúcar.',
    presentaciones: [
      { nombre: 'Porción', precio: null },
      { nombre: 'Entera · 6 porciones grandes u 8 chicas', precio: null },
    ],
    anticipacionDias: 5,
    requiereSena: true,
    imagen: null,
  },
  {
    id: 'tarta-frutillas-yogur',
    nombre: 'Tarta de frutillas y yogur',
    categoria: 'Tortas y tartas',
    descripcion: 'Base sablé de harina integral con relleno cremoso de proteína, yogur y puré de frutillas, terminado con yogur griego y frutillas.',
    presentaciones: [
      { nombre: 'Porción', precio: null },
      { nombre: 'Entera · 6 porciones grandes u 8 chicas', precio: null },
    ],
    anticipacionDias: 5,
    requiereSena: true,
    imagen: null,
  },
  {
    id: 'tarta-lima',
    nombre: 'Tarta proteica de lima',
    categoria: 'Tortas y tartas',
    descripcion: 'Base sablé integral con relleno cremoso de lima, proteína, yogur y queso crema, terminado con yogur griego y lima.',
    presentaciones: [
      { nombre: 'Porción', precio: null },
      { nombre: 'Entera · 6 porciones grandes u 8 chicas', precio: null },
    ],
    anticipacionDias: 5,
    requiereSena: true,
    imagen: null,
  },
  {
    id: 'buttercake-grande',
    nombre: 'Buttercake Grande',
    categoria: 'Tortas y tartas',
    descripcion: '35 a 40 porciones. Tres capas de bizcochuelo de vainilla o chocolate y dos rellenos a elección. El precio base incluye decoración con buttercream, drip, chocolatines y sprinkles. Otros rellenos, agregados o decoraciones especiales pueden cambiar el precio: Lara confirma el presupuesto final.',
    presentaciones: [{ nombre: 'Grande · 35 a 40 porciones', precio: 95000, desde: true }],
    anticipacionDias: 5,
    requiereSena: true,
    imagen: null,
  },
  {
    id: 'licuado-frutal',
    nombre: 'Licuado frutal',
    categoria: 'Licuados',
    descripcion: 'Elegí banana, frutilla o frutos rojos; con agua o con leche.',
    presentaciones: [
      { nombre: 'Chico', precio: 5000 },
      { nombre: 'Grande', precio: 6500 },
    ],
    imagen: null,
  },
  {
    id: 'licuado-proteico',
    nombre: 'Licuado proteico',
    categoria: 'Licuados',
    descripcion: 'Con agua o leche y banana, frutilla o frutos rojos; también se puede pedir solo con proteína.',
    presentaciones: [
      { nombre: 'Chico', precio: 6500 },
      { nombre: 'Grande', precio: 7500 },
    ],
    imagen: null,
  },
]

const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function mostrarPrecio(presentacion) {
  if (presentacion.precio === null) return 'Consultar precio'
  const precio = pesos.format(presentacion.precio)
  return presentacion.desde ? `Desde ${precio}` : precio
}