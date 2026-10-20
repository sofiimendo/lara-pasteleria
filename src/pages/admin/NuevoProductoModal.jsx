import { useEffect, useState } from "react";
import "./NuevoProductoModal.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).trim().replace(/\/+$/, "");

const CATEGORIAS = [
  "Healthy / Fit",
  "Clásicos de Pastelería",
  "Cafetería & Bebidas",
];

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "",
  imagen: "",
  disponible: true,
};

function NuevoProductoModal({
  productoEditar = null,
  onCerrar,
  onProductoCreado,
  onProductoActualizado,
}) {
  const esEdicion = Boolean(productoEditar?._id);

  const [formulario, setFormulario] = useState(() =>
    productoEditar
      ? {
          nombre: productoEditar.nombre || "",
          descripcion: productoEditar.descripcion || "",
          precio: String(productoEditar.precio ?? ""),
          categoria: productoEditar.categoria || "",
          imagen: productoEditar.imagen || "",
          disponible: productoEditar.disponible ?? true,
        }
      : { ...formularioInicial }
  );

  const [archivoImagen, setArchivoImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(
    productoEditar?.imagen || ""
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (vistaPrevia.startsWith("blob:")) {
        URL.revokeObjectURL(vistaPrevia);
      }
    };
  }, [vistaPrevia]);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function seleccionarImagen(evento) {
    const archivo = evento.target.files?.[0];

    if (!archivo) return;

    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
      setError("Seleccioná una imagen JPG, PNG o WebP.");
      evento.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      evento.target.value = "";
      return;
    }

    setArchivoImagen(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
    setError("");
    evento.target.value = "";
  }

  function quitarImagen() {
    setArchivoImagen(null);
    setVistaPrevia("");
    setFormulario((anterior) => ({
      ...anterior,
      imagen: "",
    }));
  }

  async function subirImagen(token) {
    const datosImagen = new FormData();
    datosImagen.append("imagen", archivoImagen);

    const respuesta = await fetch(
      `${API_URL}/api/productos/imagen`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: datosImagen,
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.message || "No se pudo subir la imagen."
      );
    }

    if (!datos.imagen?.url) {
      throw new Error(
        "El servidor no devolvió la URL de la imagen."
      );
    }

    return datos.imagen.url;
  }

  async function guardarProducto(evento) {
    evento.preventDefault();

    if (guardando) return;

    setError("");

    const nombre = formulario.nombre.trim();
    const categoria = formulario.categoria;
    const precio = Number(formulario.precio);

    if (!nombre) {
      setError("Ingresá el nombre del producto.");
      return;
    }

    if (!CATEGORIAS.includes(categoria)) {
      setError("Seleccioná una categoría válida.");
      return;
    }

    if (
      formulario.precio.trim() === "" ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      setError(
        "Ingresá un precio válido, igual o mayor a cero."
      );
      return;
    }

    const token = sessionStorage.getItem("lara_admin_token");

    if (!token) {
      setError("Tu sesión venció. Volvé a iniciar sesión.");
      return;
    }

    try {
      setGuardando(true);

      let urlImagen = formulario.imagen.trim();

      if (archivoImagen) {
        urlImagen = await subirImagen(token);
      }

      const datosProducto = {
        nombre,
        descripcion: formulario.descripcion.trim(),
        precio,
        categoria,
        imagen: urlImagen,
        disponible: formulario.disponible,
      };

      const respuesta = await fetch(
        esEdicion
          ? `${API_URL}/api/productos/${productoEditar._id}`
          : `${API_URL}/api/productos`,
        {
          method: esEdicion ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosProducto),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message ||
            (esEdicion
              ? "No se pudo actualizar el producto."
              : "No se pudo crear el producto.")
        );
      }

      if (!datos.producto?._id) {
        throw new Error(
          "El servidor no devolvió los datos del producto. Recargá la lista para comprobar los cambios."
        );
      }

      if (esEdicion) {
        onProductoActualizado?.(datos.producto);
      } else {
        onProductoCreado?.(datos.producto);
      }

      onCerrar();
    } catch (err) {
      setError(
        err.message || "Ocurrió un error al guardar el producto."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div
      className="nuevo-producto-overlay"
      role="presentation"
      onMouseDown={(evento) => {
        if (
          evento.target === evento.currentTarget &&
          !guardando
        ) {
          onCerrar();
        }
      }}
    >
      <section
        className="nuevo-producto-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nuevo-producto-titulo"
      >
        <div className="nuevo-producto-heading">
          <div>
            <h2 id="nuevo-producto-titulo">
              {esEdicion ? "Editar producto" : "Agregar producto"}
            </h2>

            <p>
              {esEdicion
                ? "Modificá los datos del producto."
                : "Completá los datos del nuevo producto."}
            </p>
          </div>

          <button
            type="button"
            className="nuevo-producto-cerrar"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>

        <form onSubmit={guardarProducto}>
          <div className="nuevo-producto-grid">
            <label>
              Nombre del producto *
              <input
                name="nombre"
                type="text"
                value={formulario.nombre}
                onChange={actualizarCampo}
                maxLength={100}
                placeholder="Ej: Medialunas de manteca"
                required
                disabled={guardando}
              />
            </label>

            <label>
              Categoría *
              <select
                name="categoria"
                value={formulario.categoria}
                onChange={actualizarCampo}
                required
                disabled={guardando}
              >
                <option value="" disabled>
                  Seleccioná una categoría
                </option>

                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Precio *
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={actualizarCampo}
                placeholder="Ej: 2500"
                required
                disabled={guardando}
              />
            </label>

            <label>
              Estado
              <select
                name="disponible"
                value={String(formulario.disponible)}
                onChange={(evento) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    disponible: evento.target.value === "true",
                  }))
                }
                disabled={guardando}
              >
                <option value="true">Disponible</option>
                <option value="false">No disponible</option>
              </select>
            </label>

            <label className="nuevo-producto-completo">
              Descripción
              <textarea
                name="descripcion"
                rows={4}
                value={formulario.descripcion}
                onChange={actualizarCampo}
                maxLength={1000}
                placeholder="Contá qué tiene de especial este producto..."
                disabled={guardando}
              />
            </label>

            <div className="nuevo-producto-completo nuevo-producto-imagen">
              <label htmlFor="nuevo-producto-archivo">
                Foto del producto
              </label>

              <input
                id="nuevo-producto-archivo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={seleccionarImagen}
                disabled={guardando}
              />

              <span className="nuevo-producto-ayuda">
                Elegí una foto desde tu celular o computadora.
                Formatos JPG, PNG o WebP. Máximo 5 MB.
              </span>

              {vistaPrevia && (
                <div className="nuevo-producto-preview">
                  <img
                    src={vistaPrevia}
                    alt="Vista previa del producto"
                  />

                  <button
                    type="button"
                    onClick={quitarImagen}
                    disabled={guardando}
                  >
                    Quitar imagen
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="nuevo-producto-error" role="alert">
              {error}
            </p>
          )}

          <div className="nuevo-producto-acciones">
            <button
              type="button"
              className="nuevo-producto-cancelar"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="nuevo-producto-guardar"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : esEdicion
                  ? "Guardar cambios"
                  : "Guardar producto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NuevoProductoModal;