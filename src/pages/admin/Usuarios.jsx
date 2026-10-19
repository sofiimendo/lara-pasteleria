import { useState } from "react";
import "./Usuarios.css";

function Usuarios() {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="admin-usuarios">
      <div className="admin-usuarios-heading">
        <div>
          <h1>Usuarios</h1>
          <p>Administrá las cuentas que pueden acceder al panel.</p>
        </div>

        <button type="button" className="admin-usuarios-add">
          + Agregar usuario
        </button>
      </div>

      <div className="admin-usuarios-toolbar">
        <input
          type="search"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
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
            <tr>
              <td colSpan="5" className="admin-usuarios-empty">
                Todavía no hay usuarios para mostrar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usuarios;