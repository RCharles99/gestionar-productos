// /js/agregarProducto.js
 

import {
  db,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
  addDoc,
  serverTimestamp
} from "../DB/firebaseConfig.js";

// Referencias a Firestore y Storage
const productosRef = collection(db, "productos");
const storage = getStorage();

// Referencias al formulario y elementos
const formulario = document.getElementById("form-producto");
const inputImagen = document.getElementById("imagen");
const preview = document.getElementById("preview");
const mensaje = document.getElementById("mensaje");

// Mostrar vista previa de la imagen
inputImagen.addEventListener("change", () => {
  const archivo = inputImagen.files[0];
  if (archivo) {
    const urlTemporal = URL.createObjectURL(archivo);
    preview.src = urlTemporal;
    preview.style.display = "block";
  }
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener valores
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const rating = parseFloat(document.getElementById("rating").value);
  const stock = parseInt(document.getElementById("stock").value);
  const imagen = inputImagen.files[0];

  if (!name || !category || isNaN(price) || isNaN(rating) || isNaN(stock) || !imagen) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos correctamente.",
    });
    return;
  }

  try {
    // Subir imagen a Firebase Storage
    const imagenRef = ref(storage, `imagenes/${Date.now()}-${imagen.name}`);
    await uploadBytes(imagenRef, imagen);
    const imagenURL = await getDownloadURL(imagenRef);

    // Guardar datos del producto con URL de imagen
    await addDoc(productosRef, {
      name,
      category,
      price,
      rating,
      stock,
      imageUrl: imagenURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Mostrar alerta de éxito con recarga automática
    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: "El producto se registró correctamente.",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });

  } catch (error) {
    console.error("❌ Error al guardar producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: "Ocurrió un error al guardar el producto. Intenta nuevamente.",
    });
  }
});