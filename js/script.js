
const contenedorCards = document.querySelector(".cards");
const botonesCategorias = document.querySelectorAll(".menu__boton");

let productos = [];
let carrito = [];

// Obtener los productos del JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch("json/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el JSON");
        }

        productos = await respuesta.json();
        mostrarProductos(productos);

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Generar las tarjetas
function mostrarProductos(listaProductos) {
    contenedorCards.innerHTML = "";

    listaProductos.forEach(producto => {
        const card = document.createElement("section");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">

            <div class="card__contenido">
                <div class="card__contenido--titulo">
                    <h3>${producto.nombre}</h3>
                    <button type="button" class="boton card__contenido--titulo-icono" data-id="${producto.id}"
                    aria-label="Agregar ${producto.nombre} al carrito">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        >
                        <path d="M4.929 4.929a10 10 0 1 1 14.141 14.141a10 10 0 0 1 -14.14 -14.14zm8.071 4.071a1 1 0 1 0 -2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0 -2h-2v-2z" />
                        </svg>
                    </button>
                </div>
                <p class="negrita">${producto.categoria}</p>
                <p><span class="negrita">Precio base:</span> <span class="card__contenido--precio">$${producto.precio}</span></p>
                <p>${producto.descripcion}</p>
            </div>
        `;

        contenedorCards.appendChild(card);
    });
}

// Filtrar al presionar una categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", () => {
        const categoria = boton.dataset.categoria;

        const productosFiltrados = categoria === "todos"
            ? productos
            : productos.filter(producto => producto.categoria === categoria);

        mostrarProductos(productosFiltrados);
    });
});

cargarProductos();

// Seleccionamos los elementos del HTML
const botonExplorar = document.querySelector(".contenido-hero .boton");
const menuCategorias = document.querySelector(".menu");

// Escuchamos el clic del botón
botonExplorar.addEventListener("click", () => {
    menuCategorias.hidden = !menuCategorias.hidden;
});
