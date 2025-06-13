import { 
  app,
  db,
  auth,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc
} from "../DB/firebaseConfig.js"; // ✅ Importa lo que necesitas

//const auth = getAuth(app);

// Cargar navbar
fetch("../html/componentes/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;

    // Mostrar el nombre del usuario autenticado (ya se validó sesión en verificarSesion.js)
    onAuthStateChanged(auth, async user => {
      if (user) {
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const data = snap.data();
            document.getElementById("nombre-usuario").textContent = data.nombreCompleto || "Usuario";
          }
        } catch (err) {
          console.error("Error al obtener datos del usuario:", err);
        }
      }
    });

    // Botón "Volver"
    const btnVolver = document.getElementById("btn-volver");
    if (btnVolver) {
      btnVolver.addEventListener("click", () => {
        window.history.length > 1 ? history.back() : window.location.href = "../html/menu.html";
      });
    }

    // Botón "Cerrar sesión"
    document.getElementById("cerrar-sesion").addEventListener("click", async () => {
      const confirmacion = await Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Estás seguro de que deseas salir del sistema?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar"
      });

      if (confirmacion.isConfirmed) {
        await signOut(auth);
        location.href = "../index.html";
      }
    });
  })
  .catch(err => {
    console.error("Error al cargar navbar:", err);
  });