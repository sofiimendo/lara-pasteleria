import { useEffect, useMemo, useState } from "react";
import lupaIcono from "../../assets/admin/lupabuscador.svg";
import agregarIcono from "../../assets/admin/signomas.svg";
import lapizIcono from "../../assets/admin/lapiz.svg";
import basureroIcono from "../../assets/admin/basurero.svg";
import NuevoUsuarioModal from "./NuevoUsuarioModal";
import EditarUsuarioModal from "./EditarUsuarioModal";
import EliminarUsuarioModal from "./EliminarUsuarioModal";
import "./Usuarios.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

function obtenerIniciales(nombre = "") {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);

  if (palabras.length === 0) return "?";

  return palabras
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0))
    .join("")
    .toUpperCase();
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarNuevoUsuario, setMostrarNuevoUsuario] =
    useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarUsuarios() {
      try {
        setCargando(true);
        setError("");

        const token = sessionStorage.getItem("lara_admin_token");

        if (!token) {
          throw new Error(
            "Tu sesión no está disponible. Volvé a iniciar sesión."
          );
        }

        const respuesta = await fetch(
          `${API_URL}/api/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.message || "No se pudieron cargar los usuarios."
          );
        }

        setUsuarios(
          Array.isArray(datos.usuarios) ? datos.usuarios : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Ocurrió un error al cargar los usuarios."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarUsuarios();

    return () => controller.abort();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es");

    return usuarios.filter((usuario) => {
      const nombre = (usuario.nombre || "").toLocaleLowerCase("es");
      const email = (usuario.email || "").toLocaleLowerCase("es");

      return nombre.includes(texto) || email.includes(texto);
    });
  }, [usuarios, busqueda]);

  function usuarioCreado(usuario) {
    setUsuarios((anteriores) => [
      usuario,
      ...anteriores.filter(
        (existente) => existente._id !== usuario._id
      ),
    ]);
  }

  function usuarioActualizado(usuario) {
    setUsuarios((anteriores) =>
      anteriores.map((existente) =>
        existente._id === usuario._id ? usuario : existente
      )
    );
  }

  function usuarioEliminado(id) {
    setUsuarios((anteriores) =>
      anteriores.filter((usuario) => usuario._id !== id)
    );
  }

  return (
    <div className="admin-usuarios">
      <div className="admin-usuarios-heading">
        <h1>Usuarios</h1>
        <p>
          Administrá las cuentas que pueden acceder al panel.
        </p>
      </div>

      <div className="admin-usuarios-toolbar">
        <div className="admin-usuarios-search">
          <img src={lupaIcono} alt="" />

          <input
            type="search"
            aria-label="Buscar usuarios"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="admin-usuarios-add"
          onClick={() => setMostrarNuevoUsuario(true)}
        >
          <img src={agregarIcono} alt="" />
          Agregar usuario
        </button>
      </div>

      <div className="admin-usuarios-table-wrapper">
        <table className="admin-usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={5} className="admin-usuarios-empty">
                  Cargando usuarios...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="admin-usuarios-empty"
                  role="alert"
                >
                  {error}
                </td>
              </tr>
            ) : usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-usuarios-empty">
                  {busqueda.trim()
                    ? "No se encontraron usuarios con esa búsqueda."
                    : "Todavía no hay usuarios para mostrar."}
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario._id}>
                  <td>
                    <div className="admin-usuarios-nombre">
                      <span className="admin-usuarios-iniciales">
                        {obtenerIniciales(usuario.nombre)}
                      </span>
                      <span>{usuario.nombre}</span>
                    </div>
                  </td>

                  <td>{usuario.email}</td>

                  <td>
                    <span className="admin-usuarios-role">
                      {usuario.rol === "admin"
                        ? "Administrador"
                        : usuario.rol || "Sin rol"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-usuarios-status ${
                        usuario.activo === false
                          ? "inactivo"
                          : "activo"
                      }`}
                    >
                      {usuario.activo === false
                        ? "Inactivo"
                        : "Activo"}
                    </span>
                  </td>

                  <td className="admin-usuarios-action-cell">
                    <div className="admin-usuarios-actions">
                      <button
                        type="button"
                        onClick={() => setUsuarioEditar(usuario)}
                        aria-label={`Editar ${usuario.nombre}`}
                        title="Editar usuario"
                      >
                        <img src={lapizIcono} alt="" />
                      </button>

                      <button
                        type="button"
                        className="admin-usuarios-delete"
                        onClick={() => setUsuarioEliminar(usuario)}
                        aria-label={`Eliminar ${usuario.nombre}`}
                        title="Eliminar usuario"
                      >
                        <img src={basureroIcono} alt="" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarNuevoUsuario && (
        <NuevoUsuarioModal
          onCerrar={() => setMostrarNuevoUsuario(false)}
          onUsuarioCreado={usuarioCreado}
        />
      )}

      {usuarioEditar && (
        <EditarUsuarioModal
          usuario={usuarioEditar}
          onCerrar={() => setUsuarioEditar(null)}
          onUsuarioActualizado={usuarioActualizado}
        />
      )}

      {usuarioEliminar && (
        <EliminarUsuarioModal
          usuario={usuarioEliminar}
          onCerrar={() => setUsuarioEliminar(null)}
          onUsuarioEliminado={usuarioEliminado}
        />
      )}
    </div>
  );
}

export default Usuarios;