import Header from './components/Header/Header'
import Inicio from './components/Inicio/Inicio'
import Separador from './components/Separador/Separador'
import SobreMi from './components/SobreMi/SobreMi'
import Galeria from './components/Galeria/Galeria'
import Pedidos from './components/Pedidos/Pedidos'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <>
      <Header />

      <main>
        <Inicio />
        <Separador />
        <SobreMi />
        <Galeria />
        <Pedidos />
      </main>
<Footer />
    </>
  )
}

export default App