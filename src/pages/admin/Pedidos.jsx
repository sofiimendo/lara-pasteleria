import { useState } from "react";
import "./Pedidos.css";

function Pedidos() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const [fecha, setFecha] = useState("todas");

  return (
    <div className="admin-pedidos">
      <div className="admin-pedidos-heading">
        <h1>Pedidos</h1>
        <p>Gestioná las consultas y encargos de tu pastelería.</p>
      </div>

      <div className="admin-pedidos-toolbar">
        <input
          type="search"
          placeholder="Buscar por nombre, producto o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        >
          <option value="todas">Todas las fechas</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
        </select>

        <button type="button" className="admin-pedidos-add">
          + Nuevo pedido
        </button>
      </div>

      <div className="admin-pedidos-table-wrapper">
        <table className="admin-pedidos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Fecha de entrega</th>
              <th>Producto</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="7" className="admin-pedidos-empty">
                Todavía no hay pedidos para mostrar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pedidos;