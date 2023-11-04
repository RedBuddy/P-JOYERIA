
import { hola } from './clientes.js';

document.addEventListener('DOMContentLoaded', function () {
    hola();
    agregarcosa();
});
// Llama a la función exportada

function agregarcosa() {
    const nav = document.querySelector('.navegacion')

    const p = document.createElement('div');
    p.innerHTML = ``;

    nav.appendChild(p);

}


/*
document.addEventListener('DOMContentLoaded', function () {
    setgaleria();
    scrollnav();
    navegacionFija();
});

function navegacionFija() {
    const barra = document.querySelector('.header');
    const sobrefestival = document.querySelector('.sobre-festival');
    const body = document.querySelector('body');

    window.addEventListener('scroll', function () {

        if (sobrefestival.getBoundingClientRect().top < 0) {
            barra.classList.add('fijo');
            body.classList.add('body-scroll');
        } else {
            barra.classList.remove('fijo');
            body.classList.remove('body-scroll');
        }
    });

};

function scrollnav() {
    const enlaces = document.querySelectorAll('.navegacion-principal a');

    enlaces.forEach((enlace) => {
        enlace.addEventListener('click', function (e) {
            e.preventDefault();

            const hrefseccion = e.target.attributes.href.value;
            const seccion = document.querySelector(hrefseccion);

            seccion.scrollIntoView({ behavior: 'smooth' });

        });
    });
};

function setgaleria() {
    const galeria = document.querySelector(".galeria-imagenes");

    for (let i = 1; i <= 12; i++) {
        const imagen = document.createElement('PICTURE');
        imagen.innerHTML = `
        <source srcset="build/img/thumb/${i}.avif" type="image/avif">
        <source srcset="build/img/thumb/${i}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="build/img/thumb/${i}.jpg" alt="Imagen de galeria ${i}">`;

        imagen.onclick = function () {
            showimg(i);
        };

        galeria.appendChild(imagen);
    };


    //galeria.appendChild(p);
};


function showimg(id) {
    const imagen = document.createElement('PICTURE');
    imagen.innerHTML = `
        <source srcset="build/img/grande/${id}.avif" type="image/avif">
        <source srcset="build/img/grande/${id}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="build/img/grande/${id}.jpg" alt="Imagen de galeria ${id}">`;

    // Crear overlay
    const overlay = document.createElement('DIV');
    overlay.classList.add('overlay');
    overlay.appendChild(imagen);

    overlay.onclick = function () {
        overlay.remove();
        body.classList.remove('fijar-body');
    }

    // Boton para cerrar la ventana Modal
    const cerrarModal = document.createElement('P');
    cerrarModal.textContent = "X";
    cerrarModal.classList.add('btncerrar');

    cerrarModal.onclick = function () {
        overlay.remove();
        body.classList.remove('fijar-body');
    }

    overlay.appendChild(cerrarModal);

    // Añadir overlay al HTML
    const body = document.querySelector('body');
    body.appendChild(overlay);
    body.classList.add('fijar-body');
};

*/