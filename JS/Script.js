window.onload = () =>
{
    //DECLARACIÓN DE VARIABLES
    //Variable Carousell
    const carrousel = document.querySelector(".carousel");
    const arrowIcons = document.querySelectorAll(".wrapper i");
    const PrimeraImagen = document.querySelectorAll("img")[0];
    let PrimeraImagenAncho = PrimeraImagen.clientWidth + 14;

    //Variables menu
    const nav = document.getElementById("nav");
    const abrir = document.getElementById("Abrir-menu");
    const cerrar = document.getElementById("Cerrar-menu");

    //Mostrar menu
    abrir.addEventListener("click", () => 
    {
        nav.classList.add("visible");
        console.log("Menú abierto");
    });
    cerrar.addEventListener("click", () => 
    {
        nav.classList.remove("visible");
    });

    //Menú cerrado al hacer click fuera
    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && !abrir.contains(event.target)) 
            {
            nav.classList.remove("visible");
        }
    });

    //Carousell
    const showHideIcons = () => {
        let scrollWidth = carrousel.scrollWidth - carrousel.clientWidth;
        arrowIcons[0].style.display = carrousel.scrollLeft === 0 ? "none" : "block";
        arrowIcons[1].style.display = carrousel.scrollLeft >= scrollWidth ? "none" : "block";
    };

    // Ajustar evento de clic para flechas
    arrowIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
            const direction = icon.id === "izquieda" ? -1 : 1;
            carrousel.scrollLeft += direction * PrimeraImagenAncho;
            setTimeout(() => showHideIcons(), 60);
            restartAutoScroll();
        });
    });

    // Variables para el arrastre
    let isDragStart = false, prevPageX, prevScrollLeft;

    // Iniciar el arrastre
    const DragStart = (e) => {
        isDragStart = true;
        prevPageX = e.pageX;
        prevScrollLeft = carrousel.scrollLeft;
        restartAutoScroll();
    };

    // Arrastrar
    const dragging = (e) => {
        if (!isDragStart) return;
        e.preventDefault();
        carrousel.classList.add("dragging");
        let positionDiff = e.pageX - prevPageX;
        carrousel.scrollLeft = prevScrollLeft - positionDiff;
    };

    // Detener el arrastre
    const DragStop = () => {
        isDragStart = false;
        carrousel.classList.remove("dragging");
    };

    // Agregar eventos al carrusel
    carrousel.addEventListener("mousedown", DragStart);
    carrousel.addEventListener("mousemove", dragging);
    carrousel.addEventListener("mouseup", DragStop);
    carrousel.addEventListener("mouseleave", DragStop);

    // Detectar clic derecho para moverse hacia la izquierda
    carrousel.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        carrousel.scrollLeft -= PrimeraImagenAncho;
        restartAutoScroll();
    });

    // Auto-scroll infinito
    let autoScrollInterval;
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            let scrollWidth = carrousel.scrollWidth - carrousel.clientWidth;
            if (carrousel.scrollLeft + carrousel.clientWidth >= carrousel.scrollWidth) {
                carrousel.scrollLeft = 0;
            } else {
                carrousel.scrollLeft = Math.min(carrousel.scrollLeft + PrimeraImagenAncho, scrollWidth);
            }
        }, 2000);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    const restartAutoScroll = () => {
        stopAutoScroll();
        setTimeout(startAutoScroll, 10000);
    };

    startAutoScroll();
}