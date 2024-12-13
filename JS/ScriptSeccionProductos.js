// Variables globales
let paginaActual = 1;
let peticionEnCurso = false;
let Cantidad = 0;
let ul = document.createElement("ul");
let productos = [];
let carrito = [];
let total = 0;

window.onload = () => {
    
    //Declaración de variables
    const SeccionProductos = document.getElementById("SeccionProductos");
    const SeccionDetalle = document.getElementById("SeccionDetalle");
    const SeccionCarrito = document.getElementById("SeccionCarrito");
    SeccionProductos.appendChild(ul);
    document.getElementById("Buscar").addEventListener("click",BuscarProducto)

    //PROGRAMA
    CargarCategorias();
    cargar10productos();
    document.getElementById("BotonCarrito").addEventListener("click",VerCarrito);
    //Scroll infinito
    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight * 0.8;
        if (endOfPage && !peticionEnCurso) {
            peticionEnCurso = true;
            cargarMasProductos();
        }
    });
};

//FUNCIONES
function cargar10productos() {
    peticionAJAX(`https://api.escuelajs.co/api/v1/products?offset=0&limit=10`)
        .then(datos => {
            for (let producto of datos) {
                agregarProducto(producto);
                console.log(producto);
            }
        })
        .catch(err => console.error("Error al cargar productos:", err));
}

function peticionAJAX(url) {
    return fetch(url).then(res => res.json());
}

function agregarProducto(producto) { 
    let li = document.createElement("li");
    let img = document.createElement("img");
    let descripcion = document.createElement("span");
    let precio = document.createElement("span");

    descripcion.innerHTML = producto.title || 'Producto desconocido';
    precio.innerHTML = producto.price +  "€"|| 'Precio desconocido';
    img.src = producto.images[0];
    let urlDefault = "https://www.distincion.eu/wp-content/uploads/2020/02/CAMISA-OXFORD-HOMBRE-CELESTE-VELILLA-DISTINCION.jpg";
    img.addEventListener("error",(e)=>
    {
        e.target.src = urlDefault;
    });
    li.addEventListener("click",() =>
    {
        if (SeccionProductos.style.display === "none") 
        {
            SeccionProductos.style.display = "flex"; 
            SeccionDetalle.style.display = "none";
        } 
        else 
        {
            SeccionProductos.style.display = "none"; 
            SeccionDetalle.style.display = "flex"; 
            DetalleProducto(producto.id);
        }
    });
    li.appendChild(img);
    li.appendChild(descripcion);
    li.appendChild(precio);
    ul.appendChild(li);
}

function cargarMasProductos() {
    const offset = paginaActual * 10;
    const imgCarga = document.createElement("img");
    imgCarga.src = "https://i.gifer.com/g0R5.gif";
    imgCarga.id = "GifCarga";
    imgCarga.style.display = "block";
    imgCarga.style.margin = "10px auto";
    document.body.appendChild(imgCarga);
    peticionAJAX(`https://api.escuelajs.co/api/v1/products?` + `offset=` + offset + `&limit=10`)
        .then(datos => {
            if (datos.length)
            {
                console.log(datos);
                for (let producto of datos) {
                    agregarProducto(producto);
                }
                paginaActual++; 
                peticionEnCurso = false;
            }
            else
            {
                console.log("Error")
            }
           
        })
        .catch(err => {
            console.error("Error al cargar más productos:", err);
            peticionEnCurso = false;
        })
        .finally(() => {
            document.body.removeChild(imgCarga);
        });
}
function CargarCategorias()
{
    CargarCategorias = document.getElementById("CargaCategorias")
    MensajeEspera = document.getElementById("MensajeEspera");
    peticionAJAX(`https://api.escuelajs.co/api/v1/categories`)
    .then(categorias => {
        if (categorias.length)
        {
            for(let categoria of categorias)
            {
                let option = document.createElement("option");
                option.value = categoria.id;
                option.textContent = categoria.name;
                CargarCategorias.appendChild(option);
                if(categoria.id = 1)
                {
                    MensajeEspera.value = "Seleccione una categoria";
                    MensajeEspera.textContent = "Seleccione una categoria";
                }
            }
        }
        else
        {
            console.log("Error")
        }
    })
    .catch(err => {
        console.error("Error al cargar categoria:", err);
        peticionEnCurso = false;
    })
}
function DetalleProducto(idProducto)
{
    let VolverAtras = document.getElementById("VolverAtras");
    console.log("La id es " + idProducto);
    if (!VolverAtras.dataset.eventAdded) 
    {
        VolverAtras.addEventListener("click", () => 
        {
            if (SeccionDetalle.style.display === "flex") 
            {
                SeccionDetalle.style.display = "none";
                SeccionProductos.style.display = "flex";
            }
        });
        VolverAtras.dataset.eventAdded = "true";
    }
    setInterval(() => 
    {
        VolverAtras.style.animation = 'none'; 
        void VolverAtras.offsetWidth; 
        VolverAtras.style.animation = 'Resaltar2 1s ease forwards'; 
    }, 5000);
    let ImagenProducto = document.getElementById("ImagenProducto");
    peticionAJAX('https://api.escuelajs.co/api/v1/products/'+idProducto)
    .then(datosRecibidos => 
    {
        console.log("Datos recibidos de la API:", datosRecibidos);
        ImagenProducto.innerHTML = "";
        let img = document.createElement("img");
        img.src = datosRecibidos.images;
        let urlDefault = "https://www.distincion.eu/wp-content/uploads/2020/02/CAMISA-OXFORD-HOMBRE-CELESTE-VELILLA-DISTINCION.jpg";
        img.addEventListener("error",(e)=>
        {
            e.target.src = urlDefault;
        });
        ImagenProducto.appendChild(img);
        let Titulo = document.createElement("b");
        document.getElementById("Titulo").innerHTML = "<b>Titulo:</b> " + datosRecibidos.title;
        document.getElementById("Categoria").innerHTML = "<b>Categoria:</b> " + (datosRecibidos.category.name !== "N/A" ? datosRecibidos.category.name : "No disponible");
        document.getElementById("Descripcion").innerHTML = datosRecibidos.description;
        document.getElementById("Precio").innerHTML = "<b>Precio:</b> " + (datosRecibidos.price !== "N/A" ? datosRecibidos.price + "€" : "No disponible");
        document.getElementById("Comprar").onclick = () => agregarAlCarrito(datosRecibidos);
    })
    .catch((err) => console.log("Error".error));
}
function BuscarProducto() //mejorar --Fallo al buscar producto en base al nombre y realizar busqueda con enter
{
    const categoriaSeleccionada = document.getElementById("CargaCategorias").value;

    // Construir la URL de búsqueda
    let urlBusqueda = `https://api.escuelajs.co/api/v1/products?offset=0&limit=50`;

    if (categoriaSeleccionada && categoriaSeleccionada !== "MensajeEspera") {
        urlBusqueda += `&categoryId=${categoriaSeleccionada}`;
    }
    limpiarProductos();
    peticionAJAX(urlBusqueda)
    .then(datos => {
        if (datos.length > 0) {
            for (let producto of datos) {
                agregarProducto(producto);
            }
        } else {
            alert("No se encontraron productos.");
        }
    })
    .catch(err => console.error("Error al buscar productos", err));
}

// Función para limpiar productos actuales
function limpiarProductos() {
    ul.innerHTML = "";
}
function VolverAtras() {
    let ListaProductos = document.getElementById("SeccionProductos");
    let SeccionDetalle = document.getElementById("SeccionDetalle");

    if (SeccionDetalle.style.display === "flex") {
        SeccionDetalle.style.display = "none";
        SeccionProductos.style.display = "flex";
    } else {
        SeccionDetalle.style.display = "flex";
        SeccionProductos.style.display = "none";
    }
}
function agregarAlCarrito(producto)
{
    carrito.push(producto);
    total += producto.price;
    CantidadProductos = document.getElementById("CantidadProductos").innerHTML = carrito.length;
    document.getElementById("Confirmacion").innerText = "se ha añadido un producto al carrito";
    setInterval(() => 
    {
        document.getElementById("Confirmacion").innerText = "";
    }, 5000);
}
function VerCarrito()
{
    if (SeccionCarrito.style.display === "none" ||SeccionCarrito.style.display === "") 
    {
        SeccionCarrito.style.display = "flex"; 
        SeccionProductos.style.display = "none";
    } 
    else 
    {
        SeccionCarrito.style.display = "none"; 
        SeccionProductos.style.display = "flex"; 
    }

    let VolverAtras2 = document.getElementById("VolverAtras2");
    if (!VolverAtras2.dataset.eventAdded) 
    {
        VolverAtras2.addEventListener("click", () => 
        {
            if (SeccionCarrito.style.display === "flex") 
            {
                SeccionCarrito.style.display = "none";
                SeccionProductos.style.display = "flex";
            }
        });
        VolverAtras2.dataset.eventAdded = "true";
    }
    setInterval(() => 
    {
        VolverAtras2.style.animation = 'none'; 
        void VolverAtras2.offsetWidth; 
        VolverAtras2.style.animation = 'Resaltar2 1s ease forwards'; 
    }, 5000);
    document.getElementById("ContenidoCarrito").innerHTML = "";
    carrito.forEach(item =>
    {
        const li = document.createElement("li");
        li.innerText = item.title + " " + item.price + "€";
        const eliminarBtn = document.createElement("button");
        eliminarBtn.innerText = "Eliminar";     

        // Evento para eliminar producto
        eliminarBtn.addEventListener("click", () => {
            eliminarProducto(item, li);
        });

        li.appendChild(eliminarBtn);
        ContenidoCarrito.appendChild(li);
        document.getElementById("ContenidoCarrito").appendChild(li);
    });
    document.getElementById("TotalCarrito").innerHTML = "<b>TOTAL: </b>" + total;
    document.getElementById("RealizarCompra").addEventListener("click",() =>
    {
        const estadoCompra = document.getElementById("EstadoCompra");
        if(carrito.length === 0)
        {
            estadoCompra.innerText = "El carrito esta vacio";
        }
        else
        {
            estadoCompra.innerText = "¡Compra realizada con éxito! Su producto llegara pronto. El carrito se reiniciara";
        }
        setTimeout(() => {
            resetCarrito();
        }, 5000);   
    });
}
function eliminarProducto(item, elementoLi) {
    const index = carrito.indexOf(item);
    if (index > -1) {
        total -= carrito[index].price;
        carrito.splice(index, 1);
        elementoLi.remove();
        document.getElementById("CantidadProductos").innerText = carrito.length;
        document.getElementById("TotalCarrito").innerHTML = "<b>TOTAL: </b>" + total + "€";
    } else {
        console.error("El producto no se encuentra en el carrito");
    }
}
function resetCarrito() {
    carrito = [];
    total = 0;
    Cantidad = 0;

    document.getElementById("CantidadProductos").innerText = 0;
    const ContenidoCarrito = document.getElementById("ContenidoCarrito");
    const TotalCarrito = document.getElementById("TotalCarrito");
    const estadoCompra = document.getElementById("EstadoCompra");

    ContenidoCarrito.innerHTML = "";
    TotalCarrito.innerHTML = "<b>TOTAL: </b>0€";
    estadoCompra.innerText = "";
}
