const direccion = 'Panamá 7928, Martín Coronado, Buenos Aires, Argentina'
const busquedaMapa = encodeURIComponent(direccion)

export const configuracion = {
  whatsapp: '5491176788339',
  instagram: 'https://www.instagram.com/larapasteleriaa/',
  direccion,
  referencia: 'Entre Montanelli y Av. Márquez, dentro de Europa Boxing.',
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${busquedaMapa}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${busquedaMapa}&output=embed`,
  horarios: [
    {
      dias: 'Lunes a viernes',
      turnos: ['8:00 a 11:00', '15:00 a 20:00'],
    },
    {
      dias: 'Sábados',
      turnos: ['9:00 a 13:00'],
    },
  ],
}