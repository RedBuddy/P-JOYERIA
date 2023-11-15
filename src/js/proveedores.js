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
        campos = ["representante", "nombre", "RFC", "correo_electronico", "telefono", "celular", "domicilio", "numero_exterior", "codigo_postal", "colonia", "ciudad", "estado", "limite_de_credito", "dias_de_credito"];
        divDatos.classList.add('formulario', 'registrar-proveedores');
        divDatos.innerHTML = crearFormulario(campos, "formulario-registro");
        divPanel.appendChild(divDatos);
    } else {
        let aux = document.createElement('div');
        if (opcionProveedoresSeleccionada === 'historial-proveedores') {

        }
        campos = ['nombre-proveedor'];
        divDatos.classList.add('form-datos');
        divDatos.innerHTML = crearFormulario(campos, "");
        divPanel.appendChild(divDatos);
        let tablas = document.createElement('div');
        tablas.classList.add('tablas');
        let tabla = document.createElement('table');
        tabla.classList.add('tabla');
        tabla.innerHTML = ` <tbody>
        <tr>
            <th>ID del Producto</th>
            <th>Nombre del Producto</th>
            <th>Descripción del Producto</th>
            <th>Cantidad en Stock</th>
            <th>Precio de Venta</th>
        </tr>
        <tr>
            <td>001</td>
            <td>01/11/2023</td>
            <td>C001</td>
            <td>Juan Pérez</td>
            <td>Anillo</td>
        </tr>
        <!-- Agrega más filas según sea necesario -->
    </tbody>
    
`;
        tablas.appendChild(tabla);
        divPanel.appendChild(tablas);
        divPanel.appendChild(aux);
    }
}


function crearFormulario(campos, clase) {
    let formulario = `<form action="" class="${clase}">`;

    campos.forEach(campo => {

        let textoLabel = campo.replace(/_/g, ' ');
        formulario += `
        <div class="campo">
            <label for="${campo}">${textoLabel.charAt(0).toUpperCase() + textoLabel.slice(1)}</label>
            <input type="text" name="${campo}" id="${campo}">
        </div>`;
    });

    formulario += '</form>';
    return formulario;
}