// ventasRealizadas.js

import {
  db,
  collection,
  getDocs,
  query,
  orderBy
} from "../DB/firebaseConfig.js";

import { paginar } from "./paginador.js"; // ✅ función personalizada

const cuerpoTabla = document.getElementById("tabla-ventas");
const paginacion = document.getElementById("paginacion-ventas");

async function cargarVentas() {
  try {
    const ventasRef = collection(db, "ventas");
    const q = query(ventasRef, orderBy("fecha", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      cuerpoTabla.innerHTML = `<tr><td colspan="8">No hay ventas registradas.</td></tr>`;
      return;
    }

    const ventas = snapshot.docs.map(doc => {
      const v = doc.data();
      return {
        folio: v.folio || "-",
        producto: v.producto,
        categoria: v.categoria,
        vendidoPor: v.vendidoPor,
        fecha: v.fecha?.toDate().toLocaleString() || "Sin fecha",
        cantidad: v.cantidad,
        precioUnidad: v.precioUnidad,
        total: v.total
      };
    });

    paginar(
      ventas,
      renderPagina,
      paginacion,
      10
    );

  } catch (error) {
    console.error("Error al cargar ventas:", error);
    cuerpoTabla.innerHTML = `<tr><td colspan="8">Error al cargar ventas.</td></tr>`;
  }
}

function renderPagina(paginaVentas) {
  cuerpoTabla.innerHTML = "";
  paginaVentas.forEach(venta => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${venta.folio}</td>
      <td>${venta.producto}</td>
      <td>${venta.categoria}</td>
      <td>${venta.vendidoPor}</td>
      <td>${venta.fecha}</td>
      <td>${venta.cantidad}</td>
      <td>$${venta.precioUnidad.toFixed(2)}</td>
      <td><strong>$${venta.total.toFixed(2)}</strong></td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

cargarVentas();