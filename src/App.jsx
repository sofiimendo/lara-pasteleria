import Header from "./components/Header/Header";
import Inicio from "./components/Inicio/Inicio";
import Separador from "./components/Separador/Separador";
import Menu from "./components/Menu/Menu";
import Pedidos from "./components/Pedidos/Pedidos";
import Ubicacion from "./components/Ubicacion/Ubicacion";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Header />

      <main>
        <Inicio />
        <Separador />
        <Menu />
        <Pedidos />
        <Ubicacion />
      </main>

      <Footer />
    </>
  );
}

export default App;