// /js/primerUsuario.js

import {
  db,
  auth,
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  createUserWithEmailAndPassword
} from "../DB/firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("crear-admin");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      const usuariosRef = collection(db, "usuarios");
      const snapshot = await getDocs(usuariosRef);

      if (!snapshot.empty) {
        return Swal.fire("Ya existen usuarios", "El sistema ya tiene usuarios registrados.", "info");
      }

      const email = "admin@demo.com";
      const password = "123456";

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nombreCompleto: "Administrador de Prueba",
        usuario: "admin",
        correo: email,
        estado: "Activo",
        rol: "Administrador Principal",
        creadoEn: serverTimestamp()
      });

      Swal.fire({
        title: "✅ Primer usuario creado",
        html: `
          <p>Correo: <strong>${email}</strong></p>
          <p>Contraseña: <strong>${password}</strong></p>
          <p>Ya puedes iniciar sesión como Administrador.</p>
        `,
        icon: "success"
      });

    } catch (error) {
      console.error("Error al crear primer usuario:", error);
      Swal.fire("❌ Error", "No se pudo crear el usuario. Verifica las reglas de Firebase.", "error");
    }
  });
});