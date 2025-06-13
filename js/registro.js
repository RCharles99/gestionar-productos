// /js/registro.js

import {
  db,
  doc,
  setDoc,
  getSecondaryAuth,
  createUserWithEmailAndPassword
} from "../DB/firebaseConfig.js";

const form = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const rol = document.getElementById("rol").value;
  const estado = document.getElementById("estado").value;

  if (!nombre || !usuario || !correo || !contrasena || !rol || !estado) {
    mensaje.textContent = "Por favor completa todos los campos.";
    mensaje.style.color = "red";
    return;
  }

  try {
    const secondaryAuth = getSecondaryAuth();
    const credenciales = await createUserWithEmailAndPassword(secondaryAuth, correo, contrasena);
    const uid = credenciales.user.uid;

    await setDoc(doc(db, "usuarios", uid), {
      nombreCompleto: nombre,
      usuario: usuario,
      correo: correo,
      rol: rol,
      estado: estado,
      creadoEn: new Date()
    });

    // Cierra sesión de app secundaria para no interferir con la sesión principal
    await secondaryAuth.signOut();

    form.reset();

    await Swal.fire({
      icon: 'success',
      title: 'Usuario registrado correctamente',
      text: 'El registro se completó exitosamente.',
      timer: 2000,
      showConfirmButton: false
    });

    // No se recarga, para no perder sesión
  } catch (error) {
    console.error("Error al registrar:", error);
    Swal.fire("Error", error.message || "No se pudo registrar el usuario.", "error");
  }
});