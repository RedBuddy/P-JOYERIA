let opcionesCompras = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelCompras = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionComprasSeleccionada;


opcionesCompras.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelCompras)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('registrar-compra')) {
            opcionComprasSeleccionada = 'registrar-compras';
        } else if (opcionSeleccionada.contains('consultar-compra')) {
            opcionComprasSeleccionada = 'consultar-compras';
        } else if (opcionSeleccionada.contains('historial-compra')) {
            opcionComprasSeleccionada = 'historial-compras';
        }
        pintarHtml();
    });
});

function limpiarHtml() {
    let opciones = ['tablas', 'registrar-compras', 'form-datos'];
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
    if (opcionComprasSeleccionada === 'consultar-compras') {
        campos = ['id-compra'];
        divDatos.classList.add('form-datos');
        divDatos.innerHTML = crearFormulario(campos);
        divPanel.appendChild(divDatos);
        let tablas = document.createElement('div');
        tablas.classList.add('tablas');
        let tabla = document.createElement('table');
        tabla.classList.add('tabla');
        tabla.innerHTML = ` <tbody>
        <tr>
            <th>ID</th>
            <th>FECHA</th>
            <th>ID_PROVEEDOR</th>
            <th>NUMERO_FACTURA</th>
            <th>TOTAL_COMPRA</th>
            <th>FECHA_MAXIMA</th>
            <th>ESTADO</th>
        </tr>
    </tbody>
`;
        tablas.appendChild(tabla);
        divPanel.appendChild(tablas);
    } else if (opcionComprasSeleccionada === 'registrar-compras') {
        divDatos.classList.add('registrar-compras', 'formulario');
        divDatos.innerHTML = `
        <form id="formulario-registro">

                <label for="proveedor">Proveedor:</label>
                <input type="text" id="proveedor" name="proveedor">
        
                <label for="factura">Numero de factura:</label>
                <input type="text" id="factura" name="factura">
        
                <label for="tipo-pago">Tipo de pago:</label>
                <input type="number" id="tipo-pago" name="tipo-pago">
        
                <label for="fecha">Fecha de Adquisición:</label>
                <input type="date" id="fecha" name="fecha">
        
                <label for="total-compra">Total compra:</label>
                <input type="number" id="total-compra" name="total-compra">
        

                <button type="submit" class="registrar">Registrar</button>
            </form>
        `;

        divPanel.appendChild(divDatos);

        let btnRegistrar = document.querySelector('.registrar-compras #formulario-registro .registrar');
        btnRegistrar.addEventListener('click', (e) => {
            obtenerDatos(e,opcionComprasSeleccionada)
        });
    }else if (opcionComprasSeleccionada === 'historial-compras') {
        campos = ['proveedor'];
        divDatos.classList.add('form-datos');
        divDatos.innerHTML = crearFormulario(campos);
        divPanel.appendChild(divDatos);
        let tablas = document.createElement('div');
        tablas.classList.add('tablas');
        tablas.innerHTML = `
        <table class="tabla">
        <tr>
        <th>ID</th>
        <th>FECHA</th>
        <th>ID_PROVEEDOR</th>
        <th>NUMERO_FACTURA</th>
        <th>TOTAL_COMPRA</th>
        <th>FECHA_MAXIMA</th>
        <th>ESTADO</th>
    </tr>
      </table>
      `;
        divPanel.appendChild(tablas);
    }
}


function crearFormulario(campos) {
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

function obtenerDatos(e, tipoCompra) {
    e.preventDefault();
    let compra = {

    };

    if (tipoCompra === 'registrar-compras') {
        compra = {
            proveedor: document.querySelector('#proveedor').value,
            factura: document.querySelector('#factura').value,
            tipoPago: document.querySelector('#tipo-pago').value,
            fecha: document.querySelector('#fecha').value,
            totalCompra: document.querySelector('#total-compra').value
        };
        console.log(compra)
    }else if(tipoCompra === 'consultar-compras'){

    }

}