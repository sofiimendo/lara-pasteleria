import { useEffect, useState } from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import logoLara from "../assets/logo-lara-transparente.png";
import inicioVerde from "../assets/admin/inicioverde.svg";
import inicioBeige from "../assets/admin/inicio-beige.svg";
import productosVerde from "../assets/admin/productos.svg";
import productosBeige from "../assets/admin/productos-beige.svg";
import pedidosVerde from "../assets/admin/pedidos.svg";
import pedidosBeige from "../assets/admin/pedidos-beige.svg";
import usuariosVerde from "../assets/admin/usuarios.svg";
import usuariosBeige from "../assets/admin/usuarios-beige.svg";
import flechaPerfil from "../assets/admin/flechaperfil.svg";

import "./AdminLayout.css";

const opciones = [
  {
    ruta: "/admin",
    nombre: "Inicio",
    iconoVerde: inicioVerde,
    iconoBeige: inicioBeige,
  },
  {
    ruta: "/admin/productos",
    nombre: "Productos",
    iconoVerde: productosVerde,
    iconoBeige: productosBeige,
  },
  {
    ruta: "/admin/pedidos",
    nombre: "Pedidos",
    iconoVerde: pedidosVerde,
    iconoBeige: pedidosBeige,
  },
  {
    ruta: "/admin/usuarios",
    nombre: "Usuarios",
    iconoVerde: usuariosVerde,
    iconoBeige: usuariosBeige,
  },
];

function IconoCerrarSesion() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function IconoCampana() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function IconoHamburguesa({ abierto }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {abierto ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

function obtenerAdministrador() {
  try {
    const token = sessionStorage.getItem("lara_admin_token");
    const guardado = sessionStorage.getItem("lara_admin_usuario");

    if (!token || !guardado) return null;

    const usuario = JSON.parse(guardado);

    if (usuario?.rol !== "admin") return null;

    const payload = JSON.parse(
      atob(
        token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    if (
      payload.aud !== "lara-admin" ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return usuario;
  } catch {
    return null;
  }
}

function AdminLayout() {
  const navigate = useNavigate();

  const [administrador] = useState(obtenerAdministrador);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (!menuAbierto && !perfilAbierto) return;

    function cerrarConEscape(evento) {
      if (evento.key === "Escape") {
        setMenuAbierto(false);
        setPerfilAbierto(false);
      }
    }

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [menuAbierto, perfilAbierto]);

  if (!administrador) {
    return <Navigate to="/admin/login" replace />;
  }

  function cerrarSesion() {
    setMenuAbierto(false);
    setPerfilAbierto(false);

    sessionStorage.removeItem("lara_admin_token");
    sessionStorage.removeItem("lara_admin_usuario");

    navigate("/admin/login", { replace: true });
  }

  function cerrarMenu() {
    setMenuAbierto(false);
    setPerfilAbierto(false);
  }

  function alternarMenu() {
    setPerfilAbierto(false);
    setMenuAbierto((actual) => !actual);
  }

  function alternarPerfil() {
    setMenuAbierto(false);
    setPerfilAbierto((actual) => !actual);
  }

  const nombre = administrador.nombre?.trim() || "Lara";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <NavLink
            to="/admin"
            className="admin-sidebar-logo"
            aria-label="Ir al inicio del panel"
            onClick={cerrarMenu}
          >
            <img src={logoLara} alt="Lara Pastelería" />
          </NavLink>

          <div className="admin-mobile-actions">
            <span
              className="admin-notificaciones-icono"
              title="Notificaciones: próximamente"
              aria-label="Notificaciones: próximamente"
              role="img"
            >
              <IconoCampana />
            </span>

            <div className="admin-mobile-perfil">
              <button
                type="button"
                className="admin-mobile-avatar"
                aria-label="Opciones de la cuenta"
                aria-expanded={perfilAbierto}
                onClick={alternarPerfil}
              >
                {inicial}
              </button>

              {perfilAbierto && (
                <div className="admin-perfil-menu">
                  <div className="admin-mobile-perfil-nombre">
                    <strong>{nombre}</strong>
                    <span>Admin</span>
                  </div>

                  <button
                    type="button"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="admin-menu-toggle"
              aria-label={
                menuAbierto ? "Cerrar menú" : "Abrir menú"
              }
              aria-expanded={menuAbierto}
              aria-controls="admin-navegacion"
              onClick={alternarMenu}
            >
              <IconoHamburguesa abierto={menuAbierto} />
            </button>
          </div>
        </div>

        <div
          id="admin-navegacion"
          className={`admin-sidebar-desplegable ${
            menuAbierto ? "admin-menu-abierto" : ""
          }`}
        >
          <nav
            className="admin-sidebar-nav"
            aria-label="Menú administrativo"
          >
            {opciones.map((opcion) => (
              <NavLink
                key={opcion.ruta}
                to={opcion.ruta}
                end={opcion.ruta === "/admin"}
                onClick={cerrarMenu}
                className={({ isActive }) =>
                  `admin-sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <img
                      className="admin-sidebar-icon"
                      src={
                        isActive
                          ? opcion.iconoBeige
                          : opcion.iconoVerde
                      }
                      alt=""
                      aria-hidden="true"
                    />
                    <span>{opcion.nombre}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={cerrarSesion}
          >
            <IconoCerrarSesion />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-notificaciones">
            <span
              className="admin-notificaciones-icono"
              title="Notificaciones: próximamente"
              aria-label="Notificaciones: próximamente"
              role="img"
            >
              <IconoCampana />
            </span>
          </div>

          <div className="admin-topbar-perfil">
            <div className="admin-avatar">{inicial}</div>

            <div className="admin-topbar-user">
              <strong>{nombre}</strong>
              <span>Admin</span>
            </div>

            <button
              type="button"
              className="admin-topbar-flecha"
              aria-label="Opciones de la cuenta"
              aria-expanded={perfilAbierto}
              onClick={alternarPerfil}
            >
              <img src={flechaPerfil} alt="" />
            </button>

            {perfilAbierto && (
              <div className="admin-perfil-menu">
                <button
                  type="button"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
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