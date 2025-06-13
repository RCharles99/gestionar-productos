//graficosInventario.js

import { db, getDocs, collection } from "../DB/firebaseConfig.js";

let productos = [];
let inventarioFiltrado = [];
let chartBarras;
let chartDona;

const selectCategoria = document.getElementById("filtro-categoria");
const selectOrden = document.getElementById("filtro-orden");
const selectFormato = document.getElementById("filtro-formato");
const btnLimpiar = document.getElementById("btn-limpiar-filtros");

async function obtenerProductos() {
  const snapshot = await getDocs(collection(db, "productos"));
  productos = [];
  snapshot.forEach(doc => productos.push(doc.data()));
  cargarCategorias();
  renderizarGraficos();
}

function cargarCategorias() {
  const categoriasUnicas = [...new Set(productos.map(p => p.category))];
  selectCategoria.innerHTML = `<option value="todas">Todas</option>`;
  categoriasUnicas.forEach(cat => {
    const op = document.createElement("option");
    op.value = cat;
    op.textContent = cat;
    selectCategoria.appendChild(op);
  });
}

function agruparPorCategoria(data) {
  const conteo = {};
  data.forEach(p => {
    const categoria = p.category || "Sin categoría";
    conteo[categoria] = (conteo[categoria] || 0) + 1;
  });
  return conteo;
}

function ordenarPorCantidad(labels, valores, asc) {
  const combinado = labels.map((l, i) => ({ label: l, valor: valores[i] }));
  combinado.sort((a, b) => asc ? a.valor - b.valor : b.valor - a.valor);
  return [
    combinado.map(e => e.label),
    combinado.map(e => e.valor)
  ];
}

function renderizarGraficos() {
  const categoria = selectCategoria.value;
  const orden = selectOrden.value;
  const formato = selectFormato.value;

  let etiquetas = [];
  let valores = [];

  // FILTRO POR CATEGORÍA
  if (categoria === "todas") {
    const agrupados = agruparPorCategoria(productos);
    etiquetas = Object.keys(agrupados);
    valores = Object.values(agrupados);
    inventarioFiltrado = etiquetas.map((cat, i) => ({
      name: `Productos en ${cat}`,
      category: cat,
      stock: valores[i]
    }));
  } else {
    const filtrados = productos.filter(p => p.category === categoria);
    etiquetas = filtrados.map(p => p.name || "Sin nombre");
    valores = filtrados.map(p => p.stock || 0);
    inventarioFiltrado = [...filtrados];
  }

  // FORMATO PORCENTAJE
  if (formato === "porcentaje") {
    const total = valores.reduce((acc, v) => acc + v, 0);
    valores = valores.map(v => parseFloat(((v / total) * 100).toFixed(2)));
  }

  // ORDENAMIENTO
  const ascendente = orden === "asc";
  [etiquetas, valores] = ordenarPorCantidad(etiquetas, valores, ascendente);

  const colores = etiquetas.map((_, i) =>
    `hsl(${(i * 360) / etiquetas.length}, 60%, 60%)`
  );

  const data = {
    labels: etiquetas,
    datasets: [{
      label: formato === "porcentaje" ? "% del total" : "Cantidad de productos",
      data: valores,
      backgroundColor: colores
    }]
  };

  if (chartBarras) chartBarras.destroy();
  if (chartDona) chartDona.destroy();

  chartBarras = new Chart(document.getElementById("graficoBarras"), {
    type: "bar",
    data,
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });

  chartDona = new Chart(document.getElementById("graficoDona"), {
    type: "doughnut",
    data,
    options: { responsive: true }
  });
}

// Eventos
[selectCategoria, selectOrden, selectFormato].forEach(sel =>
  sel.addEventListener("change", renderizarGraficos)
);

// Botón limpiar filtros
btnLimpiar.addEventListener("click", () => {
  selectCategoria.value = "todas";
  selectOrden.value = "desc";
  selectFormato.value = "cantidad";
  renderizarGraficos();
});

// Inicial
obtenerProductos();

// Exportar como imagen PDF
document.getElementById("exportar-imagen").addEventListener("click", async () => {
  const grafica1 = document.getElementById("graficoBarras");
  const grafica2 = document.getElementById("graficoDona");

  if (!grafica1 || !grafica2) {
    Swal.fire("Error", "No se encontraron las gráficas en la página", "error");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado con logo
  const imgLogo = new Image();
  imgLogo.src = "../assets/img/logo.png";

  imgLogo.onload = () => {
    doc.setFontSize(18);
    doc.text("Reporte de Inventario", 105, 15, { align: "center" });
    doc.addImage(imgLogo, "PNG", 90, 18, 20, 20); // Centrado

    doc.text("Gráfica de Barras", 14, 45);
    doc.addImage(grafica1.toDataURL("image/png"), "PNG", 10, 50, 180, 80);

    doc.addPage();
    doc.setFontSize(18);
    doc.text("Reporte de Inventario", 105, 15, { align: "center" });
    doc.addImage(imgLogo, "PNG", 90, 18, 20, 20);
    doc.text("Gráfica de Dona", 14, 45);
    doc.addImage(grafica2.toDataURL("image/png"), "PNG", 10, 50, 180, 80);

    doc.save("graficas_inventario.pdf");
  };
});

// Exportar como tabla PDF
document.getElementById("exportar-tabla").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const imgLogo = new Image();
  imgLogo.src = "../assets/img/logo.png";

  imgLogo.onload = () => {
    doc.setFontSize(18);
    doc.text("Reporte de Inventario", 105, 15, { align: "center" });
    doc.addImage(imgLogo, "PNG", 90, 18, 20, 20);

    const startY = 45;

    doc.autoTable({
      head: [["Producto", "Categoría", "Stock"]],
      body: inventarioFiltrado.map(item => [
        item.name,
        item.category,
        item.stock
      ]),
      startY,
      styles: { fontSize: 10 },
      theme: 'grid',
      headStyles: { fillColor: [100, 116, 139] }
    });

    doc.save("inventario_tabla.pdf");
  };
});