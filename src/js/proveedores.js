let opcionesProveedores = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelProveedores = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionProveedoresSeleccionada;

opcionesProveedores.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelProveedores)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('registrar-proveedor')) {
            opcionProveedoresSeleccionada = 'registrar-proveedores';
        } else if (opcionSeleccionada.contains('editar-proveedor')) {
            opcionProveedoresSeleccionada = 'editar-proveedores';
        } else if (opcionSeleccionada.contains('historial-proveedor')) {
            opcionProveedoresSeleccionada = 'historial-proveedores';
        } else if (opcionSeleccionada.contains('eliminar-proveedor')) {
            opcionProveedoresSeleccionada = 'eliminar-proveedores';
        }
        pintarHtml();
    });
});

function limpiarHtml() {
    let opciones = ['tablas', 'registrar-proveedores', 'form-datos', 'editar-proveedores', 'eliminar-proveedores', 'historial-proveedores'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}



function pintarHtml() {
    let campos;
    let divDatos = document.createElement('div');
    limpiarHtml();
    if (opcionProveedoresSeleccionada === 'registrar-proveedores') {
        campos = ["Nombre","Representante", "RFC", "Correo_electronico", "Celular", "Numero_exterior", "Codigo_postal", "Ciudad", "Estado", "Limite_de_credito", "Dias_de_credito", "Domicilio"];
        divDatos.classList.add('formulario', 'registrar-proveedores');
        divDatos.innerHTML = crearFormulario(campos, "formulario-registro");
        divPanel.appendChild(divDatos);
    }


    let btnRegistrar = document.querySelector('#formulario-registro button');
    console.log(btnRegistrar);
    btnRegistrar.addEventListener('click', (e) => {
        tomarDatos(e);
    });

}

function tomarDatos(e) {
    e.preventDefault();
    const form = document.querySelector("#formulario-registro");

    const form_data = new FormData(form);
    const data = new URLSearchParams(form_data);

    form_data.forEach((valor, clave) => {
        console.log(`${clave}: ${valor}`);
    });


    fetch(`http://localhost:3000/proveedor`, {
        method: 'POST',
        body: data
    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));

}



function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form">';

    campos.forEach(campo => {
        formulario += `
        <label for="${campo}">${campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
        <input type="text" name="${campo}" id="${campo}" class="">
        <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    });

    formulario += '</form>';
    return formulario;
}

function crearFormulario(campos) {
    let formulario = '<form action="" id="formulario-registro">';

    campos.forEach(campo => {
        let textoLabel = campo.replace(/_/g, ' ');
        formulario += `
        <label for="${campo}">${textoLabel.charAt(0).toUpperCase() + textoLabel.slice(1)}</label>`;
        if (campo === 'Limite_de_credito' || campo === 'Dias_de_credito') {
            formulario += `<input type="number" name="${campo}" id="${campo}">`;
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}">`;
        }

    });

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}