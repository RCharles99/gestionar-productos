// /js/editarProducto.js

import {
  db,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "../DB/firebaseConfig.js";


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const form = document.getElementById("form-editar");
const mensaje = document.getElementById("mensaje");
const imagenActual = document.getElementById("imagen-actual");
const nuevaImagen = document.getElementById("nueva-imagen");
const preview = document.getElementById("preview-nueva");

let imagenUrlActual = ""; // URL actual de Firebase Storage

// Mostrar vista previa si se selecciona una nueva imagen
nuevaImagen.addEventListener("change", () => {
  const archivo = nuevaImagen.files[0];
  if (archivo) {
    const urlTemporal = URL.createObjectURL(archivo);
    preview.src = urlTemporal;
    preview.style.display = "block";
  }
});

async function cargarProducto() {
  if (!id) {
    mensaje.textContent = "❌ ID de producto no proporcionado.";
    return;
  }

  const docRef = doc(db, "productos", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    mensaje.textContent = "❌ Producto no encontrado.";
    return;
  }

  const p = snapshot.data();
  document.getElementById("name").value = p.name;
  document.getElementById("category").value = p.category;
  document.getElementById("price").value = p.price;
  document.getElementById("rating").value = p.rating;
  document.getElementById("stock").value = p.stock;

  imagenUrlActual = p.imageUrl || "";
  imagenActual.src = imagenUrlActual;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const rating = parseFloat(document.getElementById("rating").value);
  const stock = parseInt(document.getElementById("stock").value);

  let nuevaUrlImagen = imagenUrlActual;
  const imagenFile = nuevaImagen.files[0];

  if (imagenFile) {
    const storage = getStorage();

    // 🔥 Intentar eliminar la imagen anterior
    if (imagenUrlActual) {
      try {
        const path = imagenUrlActual.split("/o/")[1].split("?")[0];
        const refAntigua = ref(storage, decodeURIComponent(path));
        await deleteObject(refAntigua);
      } catch (error) {
        console.warn("⚠️ No se pudo eliminar la imagen anterior:", error);
      }
    }

    // 📤 Subir la nueva imagen
    const nuevaRef = ref(storage, `imagenes/${Date.now()}-${imagenFile.name}`);
    await uploadBytes(nuevaRef, imagenFile);
    nuevaUrlImagen = await getDownloadURL(nuevaRef);
  }

  try {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, {
    name,
    category,
    price,
    rating,
    stock,
    imageUrl: nuevaUrlImagen,
    updatedAt: serverTimestamp()
  });

  Swal.fire({
    icon: "success",
    title: "Producto actualizado",
    text: "El producto se actualizó correctamente.",
    confirmButtonText: "Ver producto",
    confirmButtonColor: "#3085d6"
  }).then(() => {
    window.location.href = `../html/detalleProducto.html?id=${id}`;
  });

} catch (error) {
  console.error("❌ Error al actualizar:", error);
  Swal.fire({
    icon: "error",
    title: "Error al actualizar",
    text: "Hubo un problema al guardar los cambios.",
    confirmButtonText: "Aceptar"
  });
}

});

cargarProducto();