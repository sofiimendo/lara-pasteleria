import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import pedidosIcono from "../../assets/admin/pedidos.svg";
import relojIcono from "../../assets/admin/reloj.svg";
import productosIcono from "../../assets/admin/productos.svg";
import flechaVerTodos from "../../assets/admin/flecha-vertodos.svg";
import medialunaDestacada from "../../assets/admin/medialuna-destacada.png";

import GraficoPedidos from "./GraficoPedidos";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const estados = {
  nuevo: "Nuevo",
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function mostrarFecha(fecha) {
  if (!fecha) return "—";

  const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

function obtenerIniciales(nombre = "") {
  const partes = String(nombre).trim().split(/\s+/).filter(Boolean);

  if (!partes.length) return "?";

  return partes
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

function Dashboard() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState("");
  const [errorProductos, setErrorProductos] = useState("");

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarDatos() {
      const token = sessionStorage.getItem("lara_admin_token");

      if (!token) {
        setErrorPedidos(
          "Tu sesión no está disponible. Volvé a iniciar sesión."
        );
        setCargandoPedidos(false);
      } else {
        try {
          const respuesta = await fetch(`${API_URL}/api/pedidos`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controlador.signal,
          });

          if (!respuesta.ok) {
            throw new Error("No pudimos cargar los pedidos.");
          }

          const resultado = await respuesta.json();

          if (!Array.isArray(resultado.pedidos)) {
            throw new Error(
              "El servidor devolvió un formato inesperado."
            );
          }

          setPedidos(resultado.pedidos);
          setErrorPedidos("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setErrorPedidos(
              err.message || "Error al conectar con el servidor."
            );
          }
        } finally {
          if (!controlador.signal.aborted) {
            setCargandoPedidos(false);
          }
        }
      }

      try {
        const respuesta = await fetch(`${API_URL}/api/productos`, {
          signal: controlador.signal,
        });

        if (!respuesta.ok) {
          throw new Error("No pudimos cargar los productos.");
        }

        const resultado = await respuesta.json();

        if (!Array.isArray(resultado.productos)) {
          throw new Error(
            "El servidor devolvió un formato inesperado."
          );
        }

        setProductos(resultado.productos);
        setErrorProductos("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorProductos(
            err.message || "Error al conectar con el servidor."
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoProductos(false);
        }
      }
    }

    cargarDatos();

    return () => controlador.abort();
  }, []);

  const nuevos = pedidos.filter(
    (pedido) => pedido.estado === "nuevo"
  ).length;

  const pendientes = pedidos.filter(
    (pedido) => pedido.estado === "pendiente"
  ).length;

  const productosActivos = productos.filter(
    (producto) => producto.activo !== false
  ).length;

  const pedidosRecientes = [...pedidos]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const totalCategorias = new Set(
    productos
      .filter((producto) => producto.activo !== false)
      .map((producto) => producto.categoria)
      .filter(Boolean)
  ).size;

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

            <Link
              to="/admin/pedidos"
              className="dashboard-ver-todos"
            >
              Ver todos
              <img src={flechaVerTodos} alt="" />
            </Link>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha de entrega</th>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th aria-label="Acciones"></th>
                </tr>
              </thead>

              <tbody>
                {cargandoPedidos ||
                errorPedidos ||
                pedidosRecientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="dashboard-empty">
                      {cargandoPedidos
                        ? "Cargando pedidos..."
                        : errorPedidos ||
                          "Todavía no hay pedidos para mostrar."}
                    </td>
                  </tr>
                ) : (
                  pedidosRecientes.map((pedido) => (
                    <tr key={pedido._id || pedido.id}>
                      <td>
                        <div className="dashboard-client">
                          <span className="dashboard-client-avatar">
                            {obtenerIniciales(pedido.nombre)}
                          </span>
                          <span>{pedido.nombre}</span>
                        </div>
                      </td>

                      <td>{mostrarFecha(pedido.fecha)}</td>
                      <td>{pedido.pedido}</td>

                      <td>
                        <span
                          className={`dashboard-status ${
                            pedido.estado || "nuevo"
                          }`}
                        >
                          {estados[pedido.estado] || "Nuevo"}
                        </span>
                      </td>

                      <td className="dashboard-actions">
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/admin/pedidos")
                          }
                          aria-label={`Ir a pedidos para ver el pedido de ${pedido.nombre}`}
                          title="Ir a pedidos"
                        >
                          •••
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dashboard-stats">
          <article className="dashboard-stat dashboard-stat-new">
            <img
              src={pedidosIcono}
              alt=""
              className="dashboard-stat-icon"
            />

            <div className="dashboard-stat-content">
              <strong>
                {cargandoPedidos || errorPedidos ? "—" : nuevos}
              </strong>
              <p>Pedidos nuevos</p>
            </div>
          </article>

          <article className="dashboard-stat dashboard-stat-pending">
            <img
              src={relojIcono}
              alt=""
              className="dashboard-stat-icon"
            />

            <div className="dashboard-stat-content">
              <strong>
                {cargandoPedidos || errorPedidos ? "—" : pendientes}
              </strong>
              <p>Pedidos pendientes</p>
            </div>
          </article>

          <article className="dashboard-stat dashboard-stat-products">
            <img
              src={productosIcono}
              alt=""
              className="dashboard-stat-icon"
            />

            <div className="dashboard-stat-content">
              <strong>
                {cargandoProductos || errorProductos
                  ? "—"
                  : productosActivos}
              </strong>

              <p>Productos activos</p>

              <span className="dashboard-stat-detail">
                {cargandoProductos
                  ? "Cargando productos..."
                  : errorProductos ||
                    `${totalCategorias} ${
                      totalCategorias === 1
                        ? "categoría"
                        : "categorías"
                    }`}
              </span>
            </div>
          </article>
        </div>

        <section className="dashboard-card dashboard-chart">
          <h2>Pedidos de esta semana</h2>

          {cargandoPedidos ? (
            <p>Cargando gráfico...</p>
          ) : errorPedidos ? (
            <p role="alert">{errorPedidos}</p>
          ) : (
            <GraficoPedidos pedidos={pedidos} />
          )}
        </section>

        <section className="dashboard-card dashboard-featured">
          <h2>Producto destacado</h2>

          <div className="dashboard-featured-content">
            <img
              src={medialunaDestacada}
              alt="Medialunas de Lara Pastelería"
              className="dashboard-featured-image"
            />

            <div className="dashboard-featured-info">
              <h3>Medialunas de manteca</h3>
              <p>Una de nuestras especialidades</p>
            </div>
          </div>

          <Link
            to="/admin/productos"
            className="dashboard-featured-link"
          >
            Ver productos
            <img src={flechaVerTodos} alt="" />
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;