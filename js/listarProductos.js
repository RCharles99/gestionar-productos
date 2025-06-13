// /js/listarProductos.js

import { db, collection, getDocs } from "../DB/firebaseConfig.js";
import { cargarYFiltrarProductos } from "./buscarProductos.js";

// Referencia a la colección
const productosRef = collection(db, "productos");
const tabla = document.getElementById("tabla-productos");
const mensaje = document.getElementById("mensaje");

// Mostrar los productos en tabla
async function mostrarProductos() {
  tabla.innerHTML = ""; // Limpiar la tabla

  try {
    const snapshot = await getDocs(productosRef);

    if (snapshot.empty) {
      mensaje.textContent = "No hay productos registrados.";
      return;
    }

    snapshot.forEach(doc => {
      const producto = doc.data();
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td><img src="${producto.imageUrl}" alt="${producto.name}" width="60" height="60" /></td>
        <td>${producto.name}</td>
        <td>${producto.category}</td>
        <td>$${producto.price}</td>
        <td>⭐ ${producto.rating}</td>
        <td>${producto.stock}</td>
        <td>
          <button class="btn-ver" onclick="verProducto('${doc.id}')">Ver</button>
        </td>
      `;

      tabla.appendChild(fila);
    });

  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    mensaje.textContent = "❌ Error al cargar productos.";
  }
}

mostrarProductos();

// Función global para usar con el botón
window.verProducto = function(id) {
  window.location.href = `../html/detalleProducto.html?id=${id}`;
};

// Ejecutar filtro después de cargar productos
cargarYFiltrarProductos();