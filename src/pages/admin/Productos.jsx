import { useEffect, useMemo, useState } from "react";
import lupaIcono from "../../assets/admin/lupabuscador.svg";
import flechaFiltros from "../../assets/admin/flecha-filtros.svg";
import agregarIcono from "../../assets/admin/signomas.svg";
import lapizIcono from "../../assets/admin/lapiz.svg";
import basureroIcono from "../../assets/admin/basurero.svg";
import NuevoProductoModal from "./NuevoProductoModal";
import EliminarProductoModal from "./EliminarProductoModal";
import "./Productos.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).trim().replace(/\/+$/, "");

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarNuevoProducto, setMostrarNuevoProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarProductos() {
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
          `${API_URL}/api/productos/admin`,
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
            datos.message || "No se pudieron cargar los productos."
          );
        }

        setProductos(
          Array.isArray(datos.productos) ? datos.productos : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Ocurrió un error al cargar los productos."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarProductos();

    return () => controller.abort();
  }, []);

  const categorias = useMemo(() => {
    const valores = productos.map(
      (producto) => producto.categoria || "Sin categoría"
    );

    return [...new Set(valores)].sort((a, b) =>
      a.localeCompare(b, "es")
    );
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es");

    return productos.filter((producto) => {
      const nombre = (producto.nombre || "").toLocaleLowerCase("es");
      const descripcion = (
        producto.descripcion || ""
      ).toLocaleLowerCase("es");

      const categoriaProducto =
        producto.categoria || "Sin categoría";

      return (
        (nombre.includes(texto) || descripcion.includes(texto)) &&
        (categoria === "todas" || categoriaProducto === categoria)
      );
    });
  }, [productos, busqueda, categoria]);

  function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(precio ?? 0);
  }

  function productoCreado(producto) {
    if (!producto?._id) {
      setError(
        "El producto se guardó, pero no pudimos actualizar la lista. Recargá la página."
      );
      return;
    }

    setProductos((anteriores) => [
      producto,
      ...anteriores.filter((item) => item._id !== producto._id),
    ]);

    setError("");
    setBusqueda("");
    setCategoria("todas");
  }

  function productoActualizado(producto) {
    if (!producto?._id) {
      setError(
        "El producto se actualizó, pero no pudimos refrescar la lista. Recargá la página."
      );
      return;
    }

    setProductos((anteriores) =>
      anteriores.map((item) =>
        item._id === producto._id ? producto : item
      )
    );

    setError("");
    setBusqueda("");
    setCategoria("todas");
  }

  function productoEliminado(id) {
    setProductos((anteriores) =>
      anteriores.filter((producto) => producto._id !== id)
    );

    setError("");
    setProductoEliminar(null);
  }

  function cerrarModal() {
    setMostrarNuevoProducto(false);
    setProductoEditar(null);
  }

  function abrirEditar(producto) {
    setProductoEditar(producto);
    setMostrarNuevoProducto(false);
  }

  function abrirEliminar(producto) {
    setProductoEliminar(producto);
  }

  const mensaje = cargando
    ? "Cargando productos..."
    : error
      ? error
      : productos.length === 0
        ? "Todavía no hay productos cargados."
        : "No encontramos productos con esos filtros.";

  return (
    <main className="admin-productos">
      <div className="admin-productos-heading">
        <h1>Productos</h1>
        <p>Administrá tu catálogo de productos.</p>
      </div>

      <div className="admin-productos-toolbar">
        <div className="admin-productos-search">
          <img src={lupaIcono} alt="" aria-hidden="true" />

          <input
            type="search"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="admin-productos-select">
          <select
            value={categoria}
            aria-label="Filtrar por categoría"
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>

            {categorias.map((nombreCategoria) => (
              <option key={nombreCategoria} value={nombreCategoria}>
                {nombreCategoria}
              </option>
            ))}
          </select>

          <img src={flechaFiltros} alt="" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="admin-productos-add"
          onClick={() => {
            setProductoEditar(null);
            setMostrarNuevoProducto(true);
          }}
        >
          <img src={agregarIcono} alt="" aria-hidden="true" />
          Agregar productos
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
            {cargando || error || productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-productos-empty">
                  {mensaje}
                </td>
              </tr>
            ) : (
              productosFiltrados.map((producto) => (
                <tr key={producto._id}>
                  <td>
                    {producto.imagen ? (
                      <img
                        className="admin-productos-imagen"
                        src={producto.imagen}
                        alt={producto.nombre}
                        loading="lazy"
                      />
                    ) : (
                      <div className="admin-productos-sin-imagen">
                        Sin foto
                      </div>
                    )}
                  </td>

                  <td>
                    <span className="admin-productos-nombre">
                      {producto.nombre}
                    </span>
                  </td>

                  <td>
                    {producto.categoria || "Sin categoría"}
                  </td>

                  <td className="admin-productos-precio">
                    {formatearPrecio(producto.precio)}
                  </td>

                  <td>
                    <span
                      className={`admin-productos-status ${
                        producto.disponible
                          ? "disponible"
                          : "no-disponible"
                      }`}
                    >
                      {producto.disponible
                        ? "Activo"
                        : "No disponible"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-productos-actions">
                      <button
                        type="button"
                        onClick={() => abrirEditar(producto)}
                        aria-label={`Editar ${producto.nombre}`}
                        title="Editar producto"
                      >
                        <img src={lapizIcono} alt="" />
                      </button>

                      <button
                        type="button"
                        className="admin-productos-delete"
                        onClick={() => abrirEliminar(producto)}
                        aria-label={`Eliminar ${producto.nombre}`}
                        title="Eliminar producto"
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

        {!cargando && !error && productosFiltrados.length > 0 && (
          <div className="admin-productos-mobile">
            {productosFiltrados.map((producto) => (
              <article
                className="admin-productos-card"
                key={producto._id}
              >
                <div className="admin-productos-card-top">
                  {producto.imagen ? (
                    <img
                      className="admin-productos-imagen"
                      src={producto.imagen}
                      alt={producto.nombre}
                      loading="lazy"
                    />
                  ) : (
                    <div className="admin-productos-sin-imagen">
                      Sin foto
                    </div>
                  )}

                  <div className="admin-productos-card-info">
                    <h2>{producto.nombre}</h2>

                    <p>
                      {producto.categoria || "Sin categoría"}
                    </p>

                    <strong>
                      {formatearPrecio(producto.precio)}
                    </strong>
                  </div>
                </div>

                {producto.descripcion && (
                  <p className="admin-productos-card-descripcion">
                    {producto.descripcion}
                  </p>
                )}

                <div className="admin-productos-card-bottom">
                  <span
                    className={`admin-productos-status ${
                      producto.disponible
                        ? "disponible"
                        : "no-disponible"
                    }`}
                  >
                    {producto.disponible
                      ? "Activo"
                      : "No disponible"}
                  </span>

                  <div className="admin-productos-actions">
                    <button
                      type="button"
                      onClick={() => abrirEditar(producto)}
                      aria-label={`Editar ${producto.nombre}`}
                      title="Editar producto"
                    >
                      <img src={lapizIcono} alt="" />
                    </button>

                    <button
                      type="button"
                      className="admin-productos-delete"
                      onClick={() => abrirEliminar(producto)}
                      aria-label={`Eliminar ${producto.nombre}`}
                      title="Eliminar producto"
                    >
                      <img src={basureroIcono} alt="" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {(mostrarNuevoProducto || productoEditar) && (
        <NuevoProductoModal
          key={productoEditar?._id || "nuevo"}
          productoEditar={productoEditar}
          onCerrar={cerrarModal}
          onProductoCreado={productoCreado}
          onProductoActualizado={productoActualizado}
        />
      )}

      {productoEliminar && (
        <EliminarProductoModal
          producto={productoEliminar}
          onCerrar={() => setProductoEliminar(null)}
          onProductoEliminado={productoEliminado}
        />
      )}
    </main>
  );
}

export default Productos;