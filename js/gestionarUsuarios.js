//gestionarusuarios.js

import {
  db,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "../DB/firebaseConfig.js";
import { verificarPermisoEdicion } from "./verificarRol.js";

const cuerpoTabla = document.getElementById("tabla-usuarios");

async function cargarUsuarios() {
  cuerpoTabla.innerHTML = ""; // Limpiar tabla

  try {
    const usuariosRef = collection(db, "usuarios");
    const snapshot = await getDocs(usuariosRef);

    if (snapshot.empty) {
      cuerpoTabla.innerHTML = `<tr><td colspan="6" class="text-center">No hay usuarios registrados.</td></tr>`;
      return;
    }

    snapshot.forEach(docSnap => {
      const usuario = docSnap.data();
      const id = docSnap.id;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${usuario.nombreCompleto || "-"}</td>
        <td>${usuario.usuario || "-"}</td>
        <td>${usuario.correo || "-"}</td>
        <td>${usuario.estado || "-"}</td>
        <td>${usuario.rol || "-"}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary" data-id="${id}">Editar</button>
        </td>
      `;

      fila.querySelector("button").addEventListener("click", async () => {
        const permitido = await verificarPermisoEdicion();
        if (permitido) editarUsuario(id, usuario);
      });
      cuerpoTabla.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    cuerpoTabla.innerHTML = `<tr><td colspan="6" class="text-danger">Error al cargar los usuarios.</td></tr>`;
  }
}

async function editarUsuario(id, usuario) {
  const { isConfirmed, isDenied, value: formValues } = await Swal.fire({
    title: `Editar Usuario`,
    html: `
      <label class="form-label">Estado:</label>
      <select id="estado" class="swal2-select">
        <option value="Activo" ${usuario.estado === "Activo" ? "selected" : ""}>Activo</option>
        <option value="Inactivo" ${usuario.estado === "Inactivo" ? "selected" : ""}>Inactivo</option>
      </select><br><br>

      <label class="form-label">Rol:</label>
      <select id="rol" class="swal2-select">
        <option value="Nuevo Empleado" ${usuario.rol === "Nuevo Empleado" ? "selected" : ""}>Nuevo Empleado</option>
        <option value="Vendedor" ${usuario.rol === "Vendedor" ? "selected" : ""}>Vendedor</option>
        <option value="Encargado" ${usuario.rol === "Encargado" ? "selected" : ""}>Encargado</option>
        <option value="Administrador Principal" ${usuario.rol === "Administrador Principal" ? "selected" : ""}>Administrador Principal</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar Cambios",
    denyButtonText: "Eliminar Usuario",
    showDenyButton: true,
    preConfirm: () => {
      const nuevoEstado = document.getElementById("estado").value;
      const nuevoRol = document.getElementById("rol").value;
      return { nuevoEstado, nuevoRol };
    }
  });

  // 🗑 Eliminar usuario
  if (isDenied) {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirmacion.isConfirmed) {
      try {
        await deleteDoc(doc(db, "usuarios", id));
        Swal.fire("Usuario eliminado", "", "success");
        cargarUsuarios(); // Recargar tabla
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        Swal.fire("Error al eliminar", "", "error");
      }
    }
    return;
  }

  // ✅ Guardar cambios
  if (isConfirmed && formValues) {
    const nuevoEstado = formValues.nuevoEstado;
    const nuevoRol = formValues.nuevoRol;

    try {
      const ref = doc(db, "usuarios", id);
      await updateDoc(ref, {
        estado: nuevoEstado,
        rol: nuevoRol
      });

      Swal.fire("Cambios guardados", "", "success");
      cargarUsuarios();
    } catch (err) {
      console.error("Error al actualizar:", err);
      Swal.fire("Error al guardar cambios", "", "error");
    }
  }
}

cargarUsuarios();