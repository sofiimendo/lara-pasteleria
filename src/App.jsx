import Header from './components/Header/Header'
import Inicio from './components/Inicio/Inicio'
import Separador from './components/Separador/Separador'
import Pedidos from './components/Pedidos/Pedidos'

function App() {
  return (
    <>
      <Header />

      <main>
        <Inicio />
        <Separador />
        <Pedidos />
      </main>
    </>
  )
}

export default App