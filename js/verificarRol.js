// verificarRol.js

import { auth, db, onAuthStateChanged, doc, getDoc } from "../DB/firebaseConfig.js";

// 🔒 Verificar acceso total a página (como gestionarUsuarios.html)
export function verificarAccesoPermitido(rolesPermitidos = []) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.href = "../index.html";
      return;
    }

    try {
      const usuarioSnap = await getDoc(doc(db, "usuarios", user.uid));
      if (!usuarioSnap.exists()) {
        window.location.href = "../index.html";
        return;
      }

      const usuario = usuarioSnap.data();
      const rol = usuario.rol || "";

      if (!rolesPermitidos.includes(rol)) {
        window.location.href = "../html/denegado.html";
      }
    } catch (error) {
      console.error("Error al verificar rol:", error);
      window.location.href = "../index.html";
    }
  });
}

export async function verificarPermisoEdicion() {
  const user = auth.currentUser;

  if (!user) {
    await Swal.fire("Acceso denegado", "Debes iniciar sesión.", "warning");
    return false;
  }

  try {
    const usuarioSnap = await getDoc(doc(db, "usuarios", user.uid));
    if (!usuarioSnap.exists()) {
      await Swal.fire("Acceso denegado", "Usuario no encontrado.", "warning");
      return false;
    }

    const rol = usuarioSnap.data().rol;
    if (rol !== "Administrador Principal") {
      await Swal.fire("Permiso denegado", "Solo un Administrador Principal puede editar usuarios.", "info");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al verificar permisos:", error);
    return false;
  }
}

export function ocultarRolAdministradorSiNoEsAdmin() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const usuarioSnap = await getDoc(doc(db, "usuarios", user.uid));
      if (usuarioSnap.exists()) {
        const rol = usuarioSnap.data().rol;

        if (rol !== "Administrador Principal") {
          const opcionAdmin = document.querySelector('#rol option[value="Administrador Principal"]');
          if (opcionAdmin) opcionAdmin.remove();
        }
      }
    } catch (error) {
      console.error("Error al ocultar opción de rol:", error);
    }
  });
}

// Función genérica para validar acción según rol
async function obtenerRolUsuarioActual() {
  const user = auth.currentUser;
  if (!user) return null;

  const usuarioSnap = await getDoc(doc(db, "usuarios", user.uid));
  if (!usuarioSnap.exists()) return null;

  return usuarioSnap.data().rol;
}

export async function puedeActualizarProducto() {
  const rol = await obtenerRolUsuarioActual();
  return ["Administrador Principal", "Encargado", "Vendedor", "Nuevo Empleado"].includes(rol);
}

export async function puedeBorrarProducto() {
  const rol = await obtenerRolUsuarioActual();
  return rol === "Administrador Principal";
}

export async function puedeVenderProducto() {
  const rol = await obtenerRolUsuarioActual();
  return ["Administrador Principal", "Encargado", "Vendedor"].includes(rol);
}