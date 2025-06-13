//graficoVentas.js

import { db, getDocs, collection } from "../DB/firebaseConfig.js";

let ventas = [];
let grafico;

// Elementos del DOM
const canvas = document.getElementById("graficoVentas");
const selectCategoria = document.getElementById("venta-filtro-categoria");
const selectMetrica = document.getElementById("venta-filtro-metrica");
const selectFormato = document.getElementById("venta-filtro-formato");
const btnLimpiar = document.getElementById("venta-limpiar-filtros");

// Obtener datos de Firebase
async function obtenerVentas() {
  const snapshot = await getDocs(collection(db, "ventas"));
  ventas = [];

  snapshot.forEach(doc => {
    ventas.push(doc.data());
  });

  cargarCategorias();
  renderizarGrafico();
}

// Llenar categorías únicas
function cargarCategorias() {
  const categorias = [...new Set(ventas.map(v => v.categoria))];
  selectCategoria.innerHTML = `<option value="todas">Todas</option>`;
  categorias.forEach(cat => {
    const op = document.createElement("option");
    op.value = cat;
    op.textContent = cat;
    selectCategoria.appendChild(op);
  });
}

// Renderizar gráfico de ventas
function renderizarGrafico() {
  const categoria = selectCategoria.value;
  const metrica = selectMetrica.value; // 'cantidad' o 'total'
  const formato = selectFormato.value; // 'cantidad' o 'porcentaje'

  let datosFiltrados = [...ventas];

  if (categoria !== "todas") {
    datosFiltrados = datosFiltrados.filter(v => v.categoria === categoria);
  }

  const agrupado = {};

  datosFiltrados.forEach(v => {
    const producto = v.producto || "Sin nombre";
    if (!agrupado[producto]) {
      agrupado[producto] = { cantidad: 0, total: 0 };
    }
    agrupado[producto].cantidad += v.cantidad;
    agrupado[producto].total += v.total;
  });

  let etiquetas = Object.keys(agrupado);
  let valores = etiquetas.map(p => agrupado[p][metrica]);

  // Formato en porcentaje
  if (formato === "porcentaje") {
    const total = valores.reduce((acc, v) => acc + v, 0);
    valores = valores.map(v => parseFloat(((v / total) * 100).toFixed(2)));
  }

  // Colores
  const colores = etiquetas.map((_, i) =>
    `hsl(${(i * 360) / etiquetas.length}, 60%, 60%)`
  );

  // Destruir gráfico anterior
  if (grafico) grafico.destroy();

  grafico = new Chart(canvas, {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [{
        label:
          metrica === "cantidad"
            ? (formato === "porcentaje" ? "% Cantidad Vendida" : "Cantidad Vendida")
            : (formato === "porcentaje" ? "% Total de Ventas" : "Total de Venta ($)"),
        data: valores,
        backgroundColor: colores
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Eventos
[selectCategoria, selectMetrica, selectFormato].forEach(el =>
  el.addEventListener("change", renderizarGrafico)
);

// Limpiar filtros
btnLimpiar.addEventListener("click", () => {
  selectCategoria.value = "todas";
  selectMetrica.value = "cantidad";
  selectFormato.value = "cantidad";
  renderizarGrafico();
});

// Iniciar
obtenerVentas();

document.getElementById("exportar-ventas-tabla").addEventListener("click", () => {
  const categoria = selectCategoria.value;
  const metrica = selectMetrica.value;
  const formato = selectFormato.value;

  let datosFiltrados = [...ventas];

  if (categoria !== "todas") {
    datosFiltrados = datosFiltrados.filter(v => v.categoria === categoria);
  }

  const agrupado = {};

  datosFiltrados.forEach(v => {
    const producto = v.producto || "Sin nombre";
    if (!agrupado[producto]) {
      agrupado[producto] = { cantidad: 0, total: 0 };
    }
    agrupado[producto].cantidad += v.cantidad;
    agrupado[producto].total += v.total;
  });

  let tabla = Object.entries(agrupado).map(([producto, datos]) => {
    return [
      producto,
      categoria === "todas" ? "Varias" : categoria,
      metrica === "cantidad" ? datos.cantidad : `$${datos.total.toFixed(2)}`
    ];
  });

  if (formato === "porcentaje") {
    const suma = tabla.reduce((acc, fila) => acc + parseFloat(fila[2].toString().replace("$", "")), 0);
    tabla = tabla.map(fila => {
      const valor = parseFloat(fila[2].toString().replace("$", ""));
      const porcentaje = ((valor / suma) * 100).toFixed(2) + "%";
      return [fila[0], fila[1], porcentaje];
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado
  const img = new Image();
  img.src = "../assets/img/logo.png"; // Ajusta según la ruta real
  doc.addImage(img, "PNG", 95, 5, 20, 20);
  doc.setFontSize(16);
  doc.text("REPORTE DE VENTAS", 105, 55, null, null, "center");

  doc.autoTable({
    head: [["Producto", "Categoría", formato === "porcentaje" ? "Porcentaje" : (metrica === "cantidad" ? "Cantidad Vendida" : "Total de Venta")]],
    body: tabla,
    startY: 65,
    styles: { fontSize: 10 },
    theme: "grid"
  });

  doc.save("ventas_tabla.pdf");
});