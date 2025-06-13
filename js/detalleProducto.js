// /js/detalleProducto.js

import {
  db,
  doc,
  getDoc
} from "../DB/firebaseConfig.js";

import {
  puedeActualizarProducto,
  puedeBorrarProducto,
  puedeVenderProducto
} from "../js/verificarRol.js";

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("contenido-producto");

async function cargarProducto() {
  if (!id) {
    contenedor.innerHTML = "<p class='text-danger'>No se proporcionó un ID de producto.</p>";
    return;
  }

  const refProducto = doc(db, "productos", id);
  const snapshot = await getDoc(refProducto);

  if (!snapshot.exists()) {
    contenedor.innerHTML = "<p class='text-danger'>Producto no encontrado.</p>";
    return;
  }

  const p = snapshot.data();

  const estado = obtenerEstado(p.stock);
  const fechaRegistro = p.createdAt?.toDate().toLocaleString() || "No disponible";
  const fechaActualizacion = p.updatedAt?.toDate().toLocaleString() || "No disponible";

  contenedor.innerHTML = `
    <img src="${p.imageUrl}" alt="${p.name}" class="img-producto img-fluid rounded mb-3" />

    <p class="estado-stock ${estado.clase}">${estado.texto}</p>

    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Nombre:</strong> ${p.name}</p>
    <p><strong>Categoría:</strong> ${p.category}</p>
    <p><strong>Precio:</strong> $${p.price}</p>
    <p><strong>Calificación:</strong> ${p.rating} ⭐</p>
    <p><strong>Stock:</strong> ${p.stock}</p>
    <p><strong>Fecha de registro:</strong> ${fechaRegistro}</p>
    <p><strong>Última actualización:</strong> ${fechaActualizacion}</p>

    <div class="d-flex justify-content-between mt-4">
      <button id="btn-actualizar" class="btn btn-primary">Actualizar</button>
      <button id="btn-eliminar" class="btn btn-danger">Borrar</button>
      <button id="btn-vender" class="btn btn-success">Vender</button>
    </div>
  `;

  // Agregar eventos con verificación de permisos
  document.getElementById("btn-actualizar").addEventListener("click", async () => {
    const permitido = await puedeActualizarProducto();
    if (!permitido) {
      Swal.fire("Acción no permitida", "No tienes permiso para actualizar productos.", "warning");
      return;
    }
    window.location.href = `../html/editarProducto.html?id=${id}`;
  });

  document.getElementById("btn-eliminar").addEventListener("click", async () => {
    const permitido = await puedeBorrarProducto();
    if (!permitido) {
      await Swal.fire("Acción no permitida", "Solo un Administrador Principal puede borrar productos.", "warning");
      return;
    }

    // ✅ Si tiene permiso, lanzar el evento personalizado
    window.dispatchEvent(new CustomEvent("eliminar-producto"));
  });

  document.getElementById("btn-vender").addEventListener("click", async () => {
    const permitido = await puedeVenderProducto();
    if (!permitido) {
      Swal.fire("Acción no permitida", "No tienes permiso para registrar ventas.", "warning");
      return;
    }
    // Ejecutar la venta
    const evento = new CustomEvent("realizar-venta");
    window.dispatchEvent(evento);
  });
}

function obtenerEstado(stock) {
  if (stock === 0) return { texto: "Sin Existencias", clase: "rojo" };
  if (stock < 10) return { texto: "Hay Pocas Existencias", clase: "naranja" };
  return { texto: "Suficiente Stock", clase: "verde" };
}

cargarProducto();