import { useState } from "react";
import "./Productos.css";

function Productos() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  return (
    <div className="admin-productos">
      <div className="admin-productos-heading">
        <h1>Productos</h1>
        <p>Administrá tu catálogo de productos.</p>
      </div>

      <div className="admin-productos-toolbar">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todas">Todas las categorías</option>
          <option value="clasicos">Clásicos</option>
          <option value="healthy">Healthy</option>
          <option value="cafeteria">Cafetería</option>
        </select>

        <button type="button" className="admin-productos-add">
          + Agregar producto
        </button>
      </div>

      <div className="admin-productos-table-wrapper">
        <table className="admin-productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="6" className="admin-productos-empty">
                Todavía no hay productos para mostrar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Productos;