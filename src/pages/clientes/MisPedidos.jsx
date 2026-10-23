import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./MisPedidos.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).trim().replace(/\/+$/, "");

const estados = {
  nuevo: "Nuevo",
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function formatearFecha(fecha) {
  if (typeof fecha !== "string") return "Sin fecha";

  const partes = fecha.split("-");

  if (partes.length !== 3) return "Sin fecha";

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function MisPedidos() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("lara_cliente_token");
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!token) return;

    const controlador = new AbortController();

    async function cargarPedidos() {
      setCargando(true);
      setMensaje("");
      setPedidos([]);

      try {
        const respuesta = await fetch(
          `${API_URL}/api/pedidos/mis-pedidos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controlador.signal,
          }
        );

        if (controlador.signal.aborted) return;

        if (respuesta.status === 401) {
          sessionStorage.removeItem("lara_cliente_token");
          sessionStorage.removeItem("lara_cliente");
          navigate("/login", { replace: true });
          return;
        }

        const resultado = await respuesta.json().catch(() => ({}));

        if (controlador.signal.aborted) return;

        if (!respuesta.ok) {
          setMensaje(
            resultado.message || "No pudimos consultar tus pedidos."
          );
          return;
        }

        if (!Array.isArray(resultado.pedidos)) {
          setMensaje("La respuesta del servidor no es válida.");
          return;
        }

        setPedidos(resultado.pedidos);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMensaje(
            "No pudimos conectar con el servidor. Intentá nuevamente."
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarPedidos();

    return () => controlador.abort();
  }, [token, intento, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mis-pedidos">
      <section
        className="mis-pedidos__contenedor"
        aria-labelledby="mis-pedidos-titulo"
      >
        <Link to="/" className="mis-pedidos__volver">
          ← Volver al inicio
        </Link>

        <h1 id="mis-pedidos-titulo">Mis pedidos</h1>

        <p className="mis-pedidos__descripcion">
          Consultá tus encargos y su estado. El envío de una consulta no
          confirma el pedido: Lara te informará disponibilidad y presupuesto.
        </p>

        {cargando ? (
          <p role="status">Cargando tus pedidos...</p>
        ) : mensaje ? (
          <div className="mis-pedidos__error">
            <p role="alert">{mensaje}</p>
            <button
              type="button"
              className="mis-pedidos__boton"
              onClick={() => setIntento((actual) => actual + 1)}
            >
              Reintentar
            </button>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="mis-pedidos__vacio">
            <p>Todavía no enviaste consultas de pedidos con esta cuenta.</p>
            <Link to="/#pedidos" className="mis-pedidos__boton">
              Hacer una consulta
            </Link>
          </div>
        ) : (
          <ul className="mis-pedidos__lista">
            {pedidos.map((pedido) => (
              <li key={pedido._id} className="mis-pedidos__tarjeta">
                <div className="mis-pedidos__encabezado">
                  <h2>{pedido.pedido}</h2>
                  <span className="mis-pedidos__estado">
                    {estados[pedido.estado] || "Estado a consultar"}
                  </span>
                </div>

                <dl className="mis-pedidos__datos">
                  <div>
                    <dt>Fecha solicitada</dt>
                    <dd>{formatearFecha(pedido.fecha)}</dd>
                  </div>
                  <div>
                    <dt>Personas</dt>
                    <dd>{pedido.cantidadPersonas}</dd>
                  </div>
                  {pedido.tipoEvento && (
                    <div>
                      <dt>Evento</dt>
                      <dd>{pedido.tipoEvento}</dd>
                    </div>
                  )}
                </dl>

                {pedido.detalles && (
                  <div className="mis-pedidos__detalles">
                    <h3>Tu consulta</h3>
                    <p>{pedido.detalles}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}