import { create } from 'zustand'

const datosIniciales = {
  nombre: '',
  email: '',
  fecha: '',
  tipoEvento: '',
  pedido: '',
  cantidadPersonas: '1',
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