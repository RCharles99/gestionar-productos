// verificarSesion.js

import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged
} from "../DB/firebaseConfig.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const usuarioRef = doc(db, "usuarios", user.uid);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      window.location.href = "../index.html";
      return;
    }

    const datos = usuarioSnap.data();

    if (datos.estado !== "Activo") {
      window.location.href = "../index.html";
    }
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    window.location.href = "../index.html";
  }
});