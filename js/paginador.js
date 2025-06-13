// /js/paginador.js

/**
 * Aplica paginación a una lista de elementos y los renderiza por página.
 * @param {Array} data - Lista de productos u objetos a paginar.
 * @param {Function} renderCallback - Función que recibe una página de datos y la dibuja.
 * @param {HTMLElement} contenedorPaginacion - Elemento DOM donde se colocarán los botones de paginación.
 * @param {number} porPagina - Número de elementos por página (default: 10).
 */
export function paginar(data, renderCallback, contenedorPaginacion, porPagina = 10) {
  let paginaActual = 1;
  const totalPaginas = Math.ceil(data.length / porPagina);

  function mostrarPagina(pagina) {
    paginaActual = pagina;
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    renderCallback(data.slice(inicio, fin));
    renderControles();
  }

  function renderControles() {
    contenedorPaginacion.innerHTML = "";

    if (totalPaginas <= 1) return; // No mostrar paginación si no hay suficientes datos

    const ul = document.createElement("ul");
    ul.className = "pagination justify-content-center mt-4";

    // Botón anterior
    const btnAnterior = document.createElement("li");
    btnAnterior.className = `page-item ${paginaActual === 1 ? "disabled" : ""}`;
    btnAnterior.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
    btnAnterior.onclick = () => {
      if (paginaActual > 1) mostrarPagina(paginaActual - 1);
    };
    ul.appendChild(btnAnterior);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${paginaActual === i ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.onclick = () => mostrarPagina(i);
      ul.appendChild(li);
    }

    // Botón siguiente
    const btnSiguiente = document.createElement("li");
    btnSiguiente.className = `page-item ${paginaActual === totalPaginas ? "disabled" : ""}`;
    btnSiguiente.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
    btnSiguiente.onclick = () => {
      if (paginaActual < totalPaginas) mostrarPagina(paginaActual + 1);
    };
    ul.appendChild(btnSiguiente);

    contenedorPaginacion.appendChild(ul);
  }

  // Inicializar
  mostrarPagina(1);
}