import { create } from 'zustand'

const datosIniciales = {
  nombre: '',
  whatsapp: '',
  fecha: '',
  tipoEvento: '',
  pedido: '',
  cantidadPersonas: '',
  detalles: '',
}

const usePedidoStore = create((set) => ({
  datos: { ...datosIniciales },

  actualizarCampo: (campo, valor) =>
    set((estado) => ({
      datos: {
        ...estado.datos,
        [campo]: valor,
      },
    })),

  reiniciarPedido: () =>
    set({
      datos: { ...datosIniciales },
    }),
}))

export default usePedidoStore