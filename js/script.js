
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
//Para ir agregando al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(producto => producto.id === id);

    if (!producto) return;

    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    console.log("Carrito actual:", carrito);
    if (!overlayCarrito.hidden) {
        renderizarCarrito();
    }
    actualizarContadorCarrito();
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
        const botonAgregar = card.querySelector(".card__contenido--titulo-icono");

        botonAgregar.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });
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
 

const botonCarrito = document.querySelector("#boton-carrito");
const overlayCarrito = document.querySelector("#carrito-overlay");
const cerrarCarrito = document.querySelector("#cerrar-carrito");
const contenedorCarrito = document.querySelector("#carrito-productos");
const totalCarrito = document.querySelector("#carrito-total");

//Para verificar
/*
console.log("Botón carrito:", botonCarrito);
console.log("Panel carrito:", overlayCarrito);
console.log("Botón cerrar:", cerrarCarrito);
console.log("Productos carrito:", contenedorCarrito);
console.log("Total carrito:", totalCarrito);
*/

// Abrir el carrito
botonCarrito.addEventListener("click", () => {
    renderizarCarrito();
    overlayCarrito.hidden = false;
    document.body.classList.add("carrito-abierto");
});

// Cerrar el carrito
function ocultarCarrito() {
    overlayCarrito.hidden = true;
    document.body.classList.remove("carrito-abierto");
}

cerrarCarrito.addEventListener("click", ocultarCarrito);

// Cerrar al presionar fuera del panel
overlayCarrito.addEventListener("click", (evento) => {
    if (evento.target === overlayCarrito) {
        ocultarCarrito();
    }
});

// Mostrar los productos y calcular el total
function renderizarCarrito() {
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    }

    carrito.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("carrito-item");

        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">

            <div class="carrito-item-info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
                <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>

                <div class="carrito-controles">
                    <button type="button" data-accion="restar" data-id="${producto.id}">−</button>
                    <span>${producto.cantidad}</span>
                    <button type="button" data-accion="sumar" data-id="${producto.id}">+</button>
                    <button type="button" class="carrito-eliminar"
                        data-accion="eliminar" data-id="${producto.id}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        contenedorCarrito.appendChild(item);
    });

    const total = carrito.reduce((acumulado, producto) => {
        return acumulado + producto.precio * producto.cantidad;
    }, 0);

    totalCarrito.textContent = `$${total.toFixed(2)}`;
}

// Escuchar los botones de cantidad y eliminar
contenedorCarrito.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;
    const producto = carrito.find(item => item.id === id);

    if (!producto) return;

    if (accion === "sumar") {
        producto.cantidad++;
    }

    if (accion === "restar") {
        producto.cantidad--;

        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
    }

    if (accion === "eliminar") {
        carrito = carrito.filter(item => item.id !== id);
    }

    actualizarContadorCarrito();
    renderizarCarrito();
    renderizarCarrito();
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !overlayCarrito.hidden) {
        ocultarCarrito();
    }
});

const contadorCarrito = document.querySelector("#contador-carrito");

function actualizarContadorCarrito() {
    const cantidadTotal = carrito.reduce((total, producto) => {
        return total + producto.cantidad;
    }, 0);

    contadorCarrito.textContent = cantidadTotal;
    contadorCarrito.hidden = cantidadTotal === 0;
}
const botonBuscar = document.querySelector("#boton-buscar");
const buscador = document.querySelector("#buscador");
const inputBuscar = document.querySelector("#input-buscar");
const cerrarBuscador = document.querySelector("#cerrar-buscador");

// Abrir y cerrar el buscador
botonBuscar.addEventListener("click", () => {
    buscador.hidden = !buscador.hidden;

    if (!buscador.hidden) {
        inputBuscar.focus();
    }
});

// Buscar productos mientras escribimos
inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.toLowerCase().trim();

    const resultados = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(texto) ||
               producto.descripcion.toLowerCase().includes(texto);
    });

    mostrarProductos(resultados);
});

// Cerrar el buscador
cerrarBuscador.addEventListener("click", () => {
    buscador.hidden = true;
    inputBuscar.value = "";
    mostrarProductos(productos);
});