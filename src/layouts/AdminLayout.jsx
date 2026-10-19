import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const opciones = [
  { ruta: "/admin", nombre: "Inicio", icono: "⌂" },
  { ruta: "/admin/productos", nombre: "Productos", icono: "♧" },
  { ruta: "/admin/pedidos", nombre: "Pedidos", icono: "▤" },
  { ruta: "/admin/usuarios", nombre: "Usuarios", icono: "♙" },
];

function AdminLayout() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    navigate("/admin/login");
  };

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h1>LARA</h1>
          <span>PASTELERÍA</span>
        </div>

        <nav className="admin-sidebar-nav">
          {opciones.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.ruta === "/admin"}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-sidebar-icon">{opcion.icono}</span>
              {opcion.nombre}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={cerrarSesion}
        >
          ↪ Cerrar sesión
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-user">
            <div className="admin-avatar">L</div>
            <div>
              <strong>Lara</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <section className="admin-page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;