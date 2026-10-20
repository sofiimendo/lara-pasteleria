import { useEffect, useMemo, useState } from "react";
import NuevoPedidoModal from "./NuevoPedidoModal";
import DetallePedidoModal from "./DetallePedidoModal";
import lupaIcono from "../../assets/admin/lupabuscador.svg";
import flechaIcono from "../../assets/admin/flecha-filtros.svg";
import ojoIcono from "../../assets/admin/ojoabierto.svg";
import masIcono from "../../assets/admin/signomas.svg";
import "./Pedidos.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const estados = {
  nuevo: "Nuevo",
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const formularioInicial = {
  nombre: "",
  email: "",
  telefono: "",
  fecha: "",
  tipoEvento: "",
  pedido: "",
  cantidadPersonas: "",
  detalles: "",
};

function obtenerIniciales(nombre = "") {
  const partes = String(nombre).trim().split(/\s+/).filter(Boolean);

  if (!partes.length) return "?";

  return partes
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

function mostrarFecha(fecha) {
  if (!fecha) return "—";

  const partes = String(fecha).slice(0, 10).split("-");

  if (partes.length !== 3) return String(fecha);

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function fechaArgentina(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(fecha);

  const valor = (tipo) =>
    partes.find((parte) => parte.type === tipo)?.value || "";

  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

function diasHasta(fecha) {
  if (!fecha) return null;

  const hoy = fechaArgentina();
  const inicio = Date.parse(`${hoy}T00:00:00Z`);
  const destino = Date.parse(`${fecha}T00:00:00Z`);

  if (Number.isNaN(destino)) return null;

  return Math.round((destino - inicio) / 86400000);
}

function coincideFecha(fechaPedido, filtro) {
  if (filtro === "todas") return true;
  if (!fechaPedido) return false;

  const hoy = fechaArgentina();
  const fecha = String(fechaPedido).slice(0, 10);

  if (filtro === "hoy") return fecha === hoy;

  if (filtro === "mes") {
    return fecha.slice(0, 7) === hoy.slice(0, 7);
  }

  if (filtro === "semana") {
    const [anio, mes, dia] = hoy.split("-").map(Number);
    const fechaHoy = new Date(Date.UTC(anio, mes - 1, dia));
    const diaSemana = (fechaHoy.getUTCDay() + 6) % 7;

    const inicio = new Date(fechaHoy);
    inicio.setUTCDate(inicio.getUTCDate() - diaSemana);

    const fin = new Date(inicio);
    fin.setUTCDate(fin.getUTCDate() + 6);

    const formato = (valor) => valor.toISOString().slice(0, 10);

    return fecha >= formato(inicio) && fecha <= formato(fin);
  }

  return true;
}

function mensajeDeError(resultado, mensajeAlternativo) {
  if (Array.isArray(resultado?.errors)) {
    const mensajes = resultado.errors
      .map((error) => error.message || error.msg)
      .filter(Boolean);

    if (mensajes.length) return mensajes.join(". ");
  }

  if (resultado?.errors && typeof resultado.errors === "object") {
    const mensajes = Object.entries(resultado.errors).flatMap(
      ([campo, valor]) => {
        if (Array.isArray(valor)) {
          return valor.map((item) =>
            typeof item === "string"
              ? `${campo}: ${item}`
              : `${campo}: ${item.message || item.msg || "Dato inválido"}`
          );
        }

        return [
          `${campo}: ${
            typeof valor === "string"
              ? valor
              : valor?.message || "Dato inválido"
          }`,
        ];
      }
    );

    if (mensajes.length) return mensajes.join(". ");
  }

  return resultado?.message || mensajeAlternativo;
}

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const [fecha, setFecha] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [confirmarAnticipacion, setConfirmarAnticipacion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [estadoEditado, setEstadoEditado] = useState("nuevo");
  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarPedidos() {
      const token = sessionStorage.getItem("lara_admin_token");

      if (!token) {
        setError("Tu sesión no está disponible. Volvé a iniciar sesión.");
        setCargando(false);
        return;
      }

      try {
        const respuesta = await fetch(`${API_URL}/api/pedidos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controlador.signal,
        });

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
          throw new Error(
            respuesta.status === 401 || respuesta.status === 403
              ? "Tu sesión venció o no tiene permisos. Volvé a iniciar sesión."
              : mensajeDeError(resultado, "No pudimos cargar los pedidos.")
          );
        }

        if (!Array.isArray(resultado.pedidos)) {
          throw new Error("El servidor devolvió un formato inesperado.");
        }

        setPedidos(resultado.pedidos);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "No pudimos conectar con el servidor.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarPedidos();

    return () => controlador.abort();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const coincideBusqueda =
        !texto ||
        [
          pedido.nombre,
          pedido.email,
          pedido.telefono,
          pedido.pedido,
        ].some((valor) =>
          String(valor || "").toLowerCase().includes(texto)
        );

      const coincideEstado =
        estado === "todos" || pedido.estado === estado;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideFecha(pedido.fecha, fecha)
      );
    });
  }, [pedidos, busqueda, estado, fecha]);

  const diasAnticipacion = diasHasta(formulario.fecha);

  const anticipacionCorta =
    ["Torta", "Medialunas"].includes(formulario.pedido) &&
    diasAnticipacion !== null &&
    diasAnticipacion >= 0 &&
    diasAnticipacion < 5;

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    if (name === "fecha" || name === "pedido") {
      setConfirmarAnticipacion(false);
    }

    setErrorFormulario("");
  }

  function abrirFormulario() {
    setFormulario(formularioInicial);
    setConfirmarAnticipacion(false);
    setErrorFormulario("");
    setMensaje("");
    setMostrarFormulario(true);
  }

  function cerrarFormulario() {
    if (guardando) return;

    setMostrarFormulario(false);
  }

  async function crearPedido(evento) {
    evento.preventDefault();

    setErrorFormulario("");
    setMensaje("");

    if (
      !formulario.nombre.trim() ||
      !formulario.fecha ||
      !formulario.pedido
    ) {
      setErrorFormulario("Completá nombre, fecha y producto.");
      return;
    }

    if (!formulario.email.trim() && !formulario.telefono.trim()) {
      setErrorFormulario(
        "Ingresá al menos un contacto: email o teléfono."
      );
      return;
    }

    const dias = diasHasta(formulario.fecha);

    if (dias === null || dias < 0) {
      setErrorFormulario("La fecha de entrega no puede ser pasada.");
      return;
    }

    if (anticipacionCorta && !confirmarAnticipacion) {
      setErrorFormulario(
        "Confirmá que Lara acepta el pedido con menos de cinco días de anticipación."
      );
      return;
    }

    const token = sessionStorage.getItem("lara_admin_token");

    if (!token) {
      setErrorFormulario("Volvé a iniciar sesión como administrador.");
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      fecha: formulario.fecha,
      pedido: formulario.pedido,
    };

    if (formulario.email.trim()) {
      datos.email = formulario.email.trim();
    }

    if (formulario.telefono.trim()) {
      datos.telefono = formulario.telefono.trim();
    }

    if (formulario.tipoEvento) {
      datos.tipoEvento = formulario.tipoEvento;
    }

    if (formulario.cantidadPersonas) {
      datos.cantidadPersonas = Number(formulario.cantidadPersonas);
    }

    if (formulario.detalles.trim()) {
      datos.detalles = formulario.detalles.trim();
    }

    if (anticipacionCorta && confirmarAnticipacion) {
      datos.confirmarAnticipacion = true;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/pedidos/admin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          mensajeDeError(resultado, "No pudimos crear el pedido.")
        );
      }

      if (!resultado.pedido?._id) {
        throw new Error(
          "El servidor respondió sin los datos del pedido. Revisá el listado antes de volver a enviarlo."
        );
      }

      setPedidos((actuales) => [resultado.pedido, ...actuales]);
      setBusqueda("");
      setEstado("todos");
      setFecha("todas");
      setMostrarFormulario(false);
      setMensaje("Pedido presencial creado correctamente.");
    } catch (err) {
      setErrorFormulario(err.message || "No pudimos guardar el pedido.");
    } finally {
      setGuardando(false);
    }
  }

  function abrirDetalle(pedido) {
    setPedidoSeleccionado(pedido);
    setEstadoEditado(pedido.estado || "nuevo");
    setErrorDetalle("");
  }

  function cerrarDetalle() {
    if (guardandoEstado) return;

    setPedidoSeleccionado(null);
  }

  async function guardarEstado() {
    if (!pedidoSeleccionado) return;

    const token = sessionStorage.getItem("lara_admin_token");

    if (!token) {
      setErrorDetalle("Volvé a iniciar sesión como administrador.");
      return;
    }

    setGuardandoEstado(true);
    setErrorDetalle("");

    try {
      const respuesta = await fetch(
        `${API_URL}/api/pedidos/${pedidoSeleccionado._id}/estado`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: estadoEditado }),
        }
      );

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          mensajeDeError(resultado, "No pudimos actualizar el estado.")
        );
      }

      setPedidos((actuales) =>
        actuales.map((pedido) =>
          pedido._id === pedidoSeleccionado._id
            ? { ...pedido, estado: estadoEditado }
            : pedido
        )
      );

      setPedidoSeleccionado(null);
      setMensaje("Estado del pedido actualizado correctamente.");
    } catch (err) {
      setErrorDetalle(err.message || "No pudimos guardar el estado.");
    } finally {
      setGuardandoEstado(false);
    }
  }

  return (
    <div className="admin-pedidos">
      <div className="admin-pedidos-heading">
        <h1>Pedidos</h1>
        <p>Gestioná las consultas y encargos de tu pastelería.</p>
      </div>

      <div className="admin-pedidos-toolbar">
        <div className="admin-pedidos-search">
          <img src={lupaIcono} alt="" aria-hidden="true" />

          <input
            type="search"
            placeholder="Buscar por nombre, producto o email"
            aria-label="Buscar pedidos"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </div>

        <div className="admin-pedidos-select">
          <select
            value={fecha}
            aria-label="Filtrar por fecha de entrega"
            onChange={(evento) => setFecha(evento.target.value)}
          >
            <option value="todas">Todas las fechas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>

          <img src={flechaIcono} alt="" aria-hidden="true" />
        </div>

        <div className="admin-pedidos-select">
          <select
            value={estado}
            aria-label="Filtrar por estado"
            onChange={(evento) => setEstado(evento.target.value)}
          >
            <option value="todos">Todos los estados</option>

            {Object.entries(estados).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>

          <img src={flechaIcono} alt="" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="admin-pedidos-add"
          onClick={abrirFormulario}
        >
          <img src={masIcono} alt="" aria-hidden="true" />
          Nuevo pedido
        </button>
      </div>

      {mensaje && (
        <p className="admin-pedidos-message" role="status">
          {mensaje}
        </p>
      )}

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
            {cargando ? (
              <tr>
                <td colSpan="7" className="admin-pedidos-empty">
                  Cargando pedidos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="7"
                  className="admin-pedidos-empty"
                  role="alert"
                >
                  {error}
                </td>
              </tr>
            ) : pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-pedidos-empty">
                  {pedidos.length === 0
                    ? "Todavía no hay pedidos para mostrar."
                    : "No encontramos pedidos con esos filtros."}
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido._id || pedido.id}>
                  <td>
                    <span className="admin-pedidos-iniciales">
                      {obtenerIniciales(pedido.nombre)}
                    </span>
                    {pedido.nombre}
                  </td>

                  <td>{pedido.email || "—"}</td>

                  <td>{mostrarFecha(pedido.fecha)}</td>

                  <td>{pedido.pedido}</td>

                  <td>{pedido.cantidadPersonas ?? "—"}</td>

                  <td>
                    <span
                      className={`admin-pedidos-status ${
                        pedido.estado || "nuevo"
                      }`}
                    >
                      {estados[pedido.estado] || "Nuevo"}
                    </span>
                  </td>

                  <td className="admin-pedidos-actions">
                    <button
                      type="button"
                      onClick={() => abrirDetalle(pedido)}
                      aria-label={`Ver pedido de ${pedido.nombre}`}
                      title="Ver detalles"
                    >
                      <img src={ojoIcono} alt="" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <NuevoPedidoModal
          formulario={formulario}
          actualizarCampo={actualizarCampo}
          crearPedido={crearPedido}
          cerrarFormulario={cerrarFormulario}
          guardando={guardando}
          anticipacionCorta={anticipacionCorta}
          confirmarAnticipacion={confirmarAnticipacion}
          setConfirmarAnticipacion={setConfirmarAnticipacion}
          errorFormulario={errorFormulario}
          fechaMinima={fechaArgentina()}
        />
      )}

      {pedidoSeleccionado && (
        <DetallePedidoModal
          pedidoSeleccionado={pedidoSeleccionado}
          cerrarDetalle={cerrarDetalle}
          estadoEditado={estadoEditado}
          setEstadoEditado={setEstadoEditado}
          guardarEstado={guardarEstado}
          guardandoEstado={guardandoEstado}
          errorDetalle={errorDetalle}
        />
      )}
    </div>
  );
}

export default Pedidos;