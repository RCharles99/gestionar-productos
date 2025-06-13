// realizarVenta.js

import {
  db,
  auth,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp
} from "../DB/firebaseConfig.js";

// ✅ Escuchar el evento personalizado
window.addEventListener("realizar-venta", () => {
  realizarVenta();
});

async function obtenerSiguienteFolio() {
  const ventasRef = collection(db, "ventas");
  const q = query(ventasRef, orderBy("fecha", "desc"), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return "V001";

  const ultimaVenta = snapshot.docs[0].data();
  const folioAnterior = ultimaVenta.folio || "V000";
  const numero = parseInt(folioAnterior.replace("V", "")) + 1;

  return "V" + numero.toString().padStart(3, "0");
}

async function realizarVenta() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return Swal.fire("Error", "ID de producto no válido", "error");

  const productoRef = doc(db, "productos", id);
  const productoSnap = await getDoc(productoRef);
  if (!productoSnap.exists()) return Swal.fire("Error", "Producto no encontrado", "error");

  const producto = productoSnap.data();

  if (producto.stock <= 0) {
    return Swal.fire("Sin existencias", "Este producto no tiene stock disponible.", "warning");
  }

  const { value: cantidad } = await Swal.fire({
    title: "Registrar Venta",
    html: `
      <p><strong>Producto:</strong> ${producto.name}</p>
      <p><strong>Categoría:</strong> ${producto.category}</p>
      <input type="number" id="cantidad-vendida" class="swal2-input" placeholder="Cantidad a vender" 
             min="1" max="${producto.stock}" value="1">
    `,
    confirmButtonText: "Vender",
    showCancelButton: true,
    preConfirm: () => {
      const input = document.getElementById("cantidad-vendida").value;
      const valor = parseInt(input);
      if (!valor || valor < 1 || valor > producto.stock) {
        Swal.showValidationMessage(`Cantidad inválida (Stock disponible: ${producto.stock})`);
      }
      return valor;
    }
  });

  if (!cantidad) return;

  const user = auth.currentUser;
  if (!user) return Swal.fire("Error", "Usuario no autenticado", "error");

  const usuarioRef = doc(db, "usuarios", user.uid);
  const usuarioSnap = await getDoc(usuarioRef);
  const usuario = usuarioSnap.exists() ? usuarioSnap.data() : { nombreCompleto: "Desconocido" };

  const total = cantidad * producto.price;
  const folio = await obtenerSiguienteFolio();

  await addDoc(collection(db, "ventas"), {
    folio,
    producto: producto.name,
    categoria: producto.category,
    vendidoPor: usuario.nombreCompleto || "Desconocido",
    cantidad,
    precioUnidad: producto.price,
    total,
    fecha: serverTimestamp(),
  });

  await updateDoc(productoRef, {
    stock: producto.stock - cantidad,
    updatedAt: serverTimestamp(),
  });

  Swal.fire({
    icon: "success",
    title: "✅ Venta registrada",
    text: `Se vendieron ${cantidad} unidades\nFolio: ${folio}`,
    timer: 2500,
    showConfirmButton: false
  }).then(() => {
    location.reload();
  });
}