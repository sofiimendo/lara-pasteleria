import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h1>¡Hola Lara!</h1>
        <p>Acá podés ver el resumen de tu pastelería.</p>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-orders">
          <div className="dashboard-card-heading">
            <h2>Pedidos recientes</h2>
            <Link to="/admin/pedidos">Ver todos →</Link>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha de entrega</th>
                  <th>Producto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="dashboard-empty">
                    Todavía no hay pedidos para mostrar.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="dashboard-stats">
          <article className="dashboard-stat dashboard-stat-new">
            <span className="dashboard-stat-icon">✉</span>
            <div>
              <strong>0</strong>
              <p>Pedidos nuevos</p>
            </div>
          </article>

          <article className="dashboard-stat dashboard-stat-pending">
            <span className="dashboard-stat-icon">◷</span>
            <div>
              <strong>0</strong>
              <p>Pedidos pendientes</p>
            </div>
          </article>

          <article className="dashboard-stat dashboard-stat-products">
            <span className="dashboard-stat-icon">♧</span>
            <div>
              <strong>0</strong>
              <p>Productos activos</p>
            </div>
          </article>
        </div>

        <section className="dashboard-card dashboard-chart">
          <h2>Pedidos de esta semana</h2>
          <div className="dashboard-chart-placeholder">
            <p>Acá vamos a visualizar los pedidos de la semana.</p>
            <span>El gráfico se completará con los datos de la API.</span>
          </div>
        </section>

        <section className="dashboard-card dashboard-featured">
          <h2>Productos destacados</h2>
          <div className="dashboard-featured-placeholder">
            <span>♡</span>
            <p>Próximamente vas a ver tus productos destacados.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;