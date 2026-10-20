import "./GraficoPedidos.css";

const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function obtenerFechaArgentina() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const valor = (tipo) =>
    partes.find((parte) => parte.type === tipo)?.value || "";

  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

function obtenerSemanaActual() {
  const [anio, mes, dia] = obtenerFechaArgentina()
    .split("-")
    .map(Number);

  const hoy = new Date(Date.UTC(anio, mes - 1, dia));
  const diaSemana = (hoy.getUTCDay() + 6) % 7;

  const lunes = new Date(hoy);
  lunes.setUTCDate(hoy.getUTCDate() - diaSemana);

  return Array.from({ length: 7 }, (_, indice) => {
    const fecha = new Date(lunes);
    fecha.setUTCDate(lunes.getUTCDate() + indice);

    return fecha.toISOString().slice(0, 10);
  });
}

function GraficoPedidos({ pedidos = [] }) {
  const semana = obtenerSemanaActual();

  const datos = semana.map((fecha) => {
    const pedidosDelDia = pedidos.filter(
      (pedido) =>
        String(pedido.createdAt || "").slice(0, 10) === fecha
    );

    return {
      nuevos: pedidosDelDia.filter(
        (pedido) => pedido.estado === "nuevo"
      ).length,
      pendientes: pedidosDelDia.filter(
        (pedido) => pedido.estado === "pendiente"
      ).length,
      confirmados: pedidosDelDia.filter(
        (pedido) => pedido.estado === "confirmado"
      ).length,
    };
  });

  const maximo = Math.max(
    1,
    ...datos.map(
      (dia) => dia.nuevos + dia.pendientes + dia.confirmados
    )
  );

  const escala = Math.max(4, Math.ceil(maximo / 4) * 4);

  return (
    <div className="grafico-pedidos">
      <div className="grafico-pedidos-area">
        <div className="grafico-pedidos-eje">
          {[4, 3, 2, 1, 0].map((nivel) => (
            <span key={nivel}>
              {(escala / 4) * nivel}
            </span>
          ))}
        </div>

        <div className="grafico-pedidos-columnas">
          <div className="grafico-pedidos-lineas">
            {[0, 1, 2, 3, 4].map((linea) => (
              <span key={linea} />
            ))}
          </div>

          {datos.map((dia, indice) => {
            const alturaNuevos = (dia.nuevos / escala) * 100;
            const alturaPendientes = (dia.pendientes / escala) * 100;
            const alturaConfirmados = (dia.confirmados / escala) * 100;

            return (
              <div className="grafico-pedidos-columna" key={semana[indice]}>
                <div className="grafico-pedidos-barra">
                  <div
                    className="grafico-pedidos-segmento nuevos"
                    style={{ height: `${alturaNuevos}%` }}
                  />
                  <div
                    className="grafico-pedidos-segmento pendientes"
                    style={{ height: `${alturaPendientes}%` }}
                  />
                  <div
                    className="grafico-pedidos-segmento confirmados"
                    style={{ height: `${alturaConfirmados}%` }}
                  />
                </div>

                <span className="grafico-pedidos-dia">
                  {dias[indice]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grafico-pedidos-leyenda">
        <span>
          <i className="grafico-leyenda-nuevos" />
          Nuevos
        </span>
        <span>
          <i className="grafico-leyenda-pendientes" />
          Pendientes
        </span>
        <span>
          <i className="grafico-leyenda-confirmados" />
          Confirmados
        </span>
      </div>
    </div>
  );
}

export default GraficoPedidos;