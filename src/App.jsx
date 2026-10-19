import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Inicio from "./components/Inicio/Inicio";
import Separador from "./components/Separador/Separador";
import Menu from "./components/Menu/Menu";
import Pedidos from "./components/Pedidos/Pedidos";
import Ubicacion from "./components/Ubicacion/Ubicacion";
import Footer from "./components/Footer/Footer";
import Login from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductosAdmin from "./pages/admin/Productos";
import PedidosAdmin from "./pages/admin/Pedidos";
import UsuariosAdmin from "./pages/admin/Usuarios";

function Landing() {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/admin/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="pedidos" element={<PedidosAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;