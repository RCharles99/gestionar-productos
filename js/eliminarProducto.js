// /js/eliminarProducto.js

import {
  db,
  doc,
  getDoc,
  deleteDoc,
  getStorage,
  ref,
  deleteObject
} from "../DB/firebaseConfig.js";


// Obtener ID de la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

window.addEventListener("eliminar-producto", () => {
  eliminarProducto(); // Tu función de eliminación
});

async function eliminarProducto() {
  const confirmacion = await Swal.fire({
    title: "¿Eliminar producto?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const docRef = doc(db, "productos", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const producto = snapshot.data();
      const imageUrl = producto.imageUrl;

      if (imageUrl) {
        const path = imageUrl.split("/o/")[1].split("?")[0];
        const refImagen = ref(getStorage(), decodeURIComponent(path));
        await deleteObject(refImagen);
      }
    }

    await deleteDoc(doc(db, "productos", id));

    await Swal.fire({
      title: "¡Eliminado!",
      text: "El producto ha sido eliminado correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });

    window.location.href = "../html/listarProductos.html";

  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    Swal.fire("Error", "No se pudo eliminar el producto.", "error");
  }
}