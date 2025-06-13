// /js/buscarProductos.js

import { db, collection, getDocs } from "../DB/firebaseConfig.js";
import { paginar } from "./paginador.js";

const tabla = document.getElementById("tabla-productos");
const paginacion = document.getElementById("paginacion");
const filtroNombre = document.getElementById("filtro-nombre");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenAlfabetico = document.getElementById("orden-alfabetico");
const ordenPrecio = document.getElementById("orden-precio");
const precioMin = document.getElementById("precio-min");
const precioMax = document.getElementById("precio-max");
const btnRango = document.getElementById("aplicar-rango");
const btnLimpiar = document.getElementById("limpiar-filtros");

let todosLosProductos = [];
let filtroActivo = {
  categoria: "",
  nombre: "",
  orden: "",
  tipoOrden: "", // "alfabetico" o "precio" o "rango"
  rangoMin: null,
  rangoMax: null
};

// Cargar productos desde Firestore
export async function cargarYFiltrarProductos() {
  const snapshot = await getDocs(collection(db, "productos"));
  todosLosProductos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  cargarCategorias(todosLosProductos);
  aplicarFiltros();
}

function cargarCategorias(productos) {
  const categorias = [...new Set(productos.map(p => p.category))];
  filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>';
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filtroCategoria.appendChild(option);
  });
}

function aplicarFiltros() {
  let filtrados = [...todosLosProductos];

  if (filtroActivo.nombre) {
    filtrados = filtrados.filter(p => p.name.toLowerCase().includes(filtroActivo.nombre.toLowerCase()));
  }

  if (filtroActivo.categoria) {
    filtrados = filtrados.filter(p => p.category === filtroActivo.categoria);
  }

  if (filtroActivo.tipoOrden === "alfabetico") {
    filtrados.sort((a, b) => filtroActivo.orden === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name));
  } else if (filtroActivo.tipoOrden === "precio") {
    filtrados.sort((a, b) => filtroActivo.orden === "asc"
      ? a.price - b.price
      : b.price - a.price);
  } else if (filtroActivo.tipoOrden === "rango") {
    filtrados = filtrados.filter(p => p.price >= filtroActivo.rangoMin && p.price <= filtroActivo.rangoMax);
  }

  paginar(filtrados, renderProductos, paginacion);
}

function renderProductos(lista) {
  tabla.innerHTML = "";
  lista.forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td><img src="${p.imageUrl}" style="width: 80px; height: 80px; object-fit: cover;"></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.rating}</td>
        <td>${p.stock}</td>
        <td class="text-center">
          <a href="detalleProducto.html?id=${p.id}" class="btn btn-sm btn-primary">Ver</a>
        </td>
      </tr>
    `;
  });
}

// Eventos
filtroNombre.addEventListener("input", () => {
  filtroActivo.nombre = filtroNombre.value;
  aplicarFiltros();
});

filtroCategoria.addEventListener("change", () => {
  filtroActivo.categoria = filtroCategoria.value;
  aplicarFiltros();
});

ordenAlfabetico.addEventListener("change", () => {
  filtroActivo.tipoOrden = "alfabetico";
  filtroActivo.orden = ordenAlfabetico.value;
  ordenPrecio.value = "";
  filtroActivo.rangoMin = null;
  filtroActivo.rangoMax = null;
  aplicarFiltros();
});

ordenPrecio.addEventListener("change", () => {
  filtroActivo.tipoOrden = "precio";
  filtroActivo.orden = ordenPrecio.value;
  ordenAlfabetico.value = "";
  filtroActivo.rangoMin = null;
  filtroActivo.rangoMax = null;
  aplicarFiltros();
});

btnRango.addEventListener("click", () => {
  const min = parseFloat(precioMin.value);
  const max = parseFloat(precioMax.value);
  if (!isNaN(min) && !isNaN(max)) {
    filtroActivo.tipoOrden = "rango";
    filtroActivo.rangoMin = min;
    filtroActivo.rangoMax = max;
    ordenAlfabetico.value = "";
    ordenPrecio.value = "";
    aplicarFiltros();
  }
});

btnLimpiar.addEventListener("click", () => {
  filtroNombre.value = "";
  filtroCategoria.value = "";
  ordenAlfabetico.value = "";
  ordenPrecio.value = "";
  precioMin.value = "";
  precioMax.value = "";

  filtroActivo = {
    categoria: "",
    nombre: "",
    orden: "",
    tipoOrden: "",
    rangoMin: null,
    rangoMax: null
  };

  aplicarFiltros();
});