let opcionesGarantias = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelGarantias = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionGarantiasSeleccionada;

opcionesGarantias.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelGarantias)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('registrar-garantia')) {
            opcionGarantiasSeleccionada = 'registrar-garantias';
        } else if (opcionSeleccionada.contains('consultar-garantia')) {
            opcionGarantiasSeleccionada = 'consultar-garantias';
        } else if (opcionSeleccionada.contains('registrar-devolucion-cliente')) {
            opcionGarantiasSeleccionada = 'registrar-devolucion-clientes';
        }else if (opcionSeleccionada.contains('registrar-devolucion-proveedor')) {
            opcionGarantiasSeleccionada = 'registrar-devolucion-proveedores';
        }
        pintarHtml();
    });
});

function limpiarHtml() {
    let opciones = ['tablas', 'registrar-garantias', 'form-datos', 'registrar-devolucion-clientes', 'eliminar-empleados'];
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
    if (opcionGarantiasSeleccionada === 'registrar-garantias') {
        campos = ["id-venta", "nombre-cliente", "fecha-garantia", "tipo-garantia"];
        divDatos.classList.add('formulario', 'registrar-garantias');
        divDatos.innerHTML = crearFormulario(campos, "formulario-registro");
        divPanel.appendChild(divDatos);
    } else if (opcionGarantiasSeleccionada === 'consultar-garantias') {
        campos = ['id-garantia'];
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
    }else if(opcionGarantiasSeleccionada === 'registrar-devolucion-clientes'){
        campos = ["id-garantia", "motivo-devolucion", "estado-producto", "acciones-tomar","fecha-devolucion"];
        divDatos.classList.add('formulario', 'registrar-devolucion-clientes');
        divDatos.innerHTML = crearFormulario(campos, "formulario-registro");
        divPanel.appendChild(divDatos);
    }else if(opcionGarantiasSeleccionada === 'registrar-devolucion-proveedores'){
        campos = ["fecha-devolucion", "proveedor", "id-compra","productos","motivo-devolucion","estado-producto","acciones-tomar","responsable-devolucion","costo-devolucion"];
        divDatos.classList.add('formulario', 'registrar-devolucion-clientes');
        divDatos.innerHTML = crearFormulario(campos, "formulario-registro");
        divPanel.appendChild(divDatos);
    }
}


function crearFormulario(campos, clase) {
    if (clase === '') {
        clase = 'form';
    }
    let formulario = `<form action="" class="${clase}">`;

    campos.forEach(campo => {
        formulario += `
        <label for="${campo}">${campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
        <input type="text" name="${campo}" id="${campo}" class="">`;
        if (clase === 'form') {
            formulario += `<input type="submit"  name="${campo}" id="${campo}" value="Buscar">`;
        }
    });
    formulario += '</form>';
    return formulario;
}