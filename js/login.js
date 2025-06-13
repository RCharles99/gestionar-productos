// login.js

import {
  db,
  auth,
  signInWithEmailAndPassword,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "../DB/firebaseConfig.js";

const form = document.getElementById("form-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identificador = document.getElementById("identificador").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  try {
    let correo = identificador;

    // Si ingresó un usuario, buscar su correo en Firestore
    if (!identificador.includes("@")) {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("usuario", "==", identificador));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return Swal.fire("Error", "Usuario no encontrado", "error");
      }

      const data = querySnapshot.docs[0].data();
      correo = data.correo;
    }

    // Intentar login con el correo real
    const credenciales = await signInWithEmailAndPassword(auth, correo, contrasena);
    const uid = credenciales.user.uid;

    // Verificar estado del usuario
    const usuarioDoc = await getDoc(doc(db, "usuarios", uid));
    if (!usuarioDoc.exists()) {
      return Swal.fire("Error", "No se encontraron los datos del usuario", "error");
    }

    const usuario = usuarioDoc.data();

    if (usuario.estado !== "Activo") {
      return Swal.fire("Acceso Denegado", "Tu cuenta está inactiva. Contacta al administrador.", "warning");
    }

    // ✅ Login exitoso
    await Swal.fire({
      title: "Bienvenido",
      text: `Hola, ${usuario.nombreCompleto || "usuario"}`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });

    // Redireccionar a página principal
    window.location.href = "../html/menu.html";

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    Swal.fire("Error", "Correo/usuario o contraseña incorrectos", "error");
  }
});