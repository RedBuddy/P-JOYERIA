let opcionesCompras = document.querySelectorAll('.panel-compras .nav-sup .nav-sup-link');
let panelCompras = document.querySelector('.panel-compras .nav-sup');
let divPanel = document.querySelector('.panel-compras');
let opcionComprasSeleccionada;

opcionesCompras.forEach((opcion) => {
    opcion.addEventListener('click', e => {
    e.preventDefault();
    limpiarHtml(panelCompras)
    let opcionSeleccionada = e.target.classList;
    if(opcionSeleccionada.contains('registrar-compra')){
        opcionComprasSeleccionada = 'registrar-compras';
    }else if(opcionSeleccionada.contains('consultar-compra')){
        opcionComprasSeleccionada = 'consultar-compras';
    }else if(opcionSeleccionada.contains('historial-compra')){
        opcionComprasSeleccionada = 'historial-compras';
    }
    pintarHtml();
    });
});

function limpiarHtml(){
    let opciones = ['tablas','registrar-compras','datos-compras'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);
  
    elementos.forEach(elemento => {
      elemento.remove();
    });  
}



function pintarHtml(){
    let campos;
    let divDatos = document.createElement('div');
    limpiarHtml();
    if(opcionComprasSeleccionada === 'consultar-compras'){
        campos = ['id-compra'];
        divDatos.classList.add('datos-compras');
        divDatos.innerHTML = crearFormulario(campos);
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
    }else if(opcionComprasSeleccionada === 'registrar-compras'){
        divDatos.classList.add('registrar-compras','formulario');
        divDatos.innerHTML = `
        <form id="formulario-registro">
        
                <label for="nombre">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre">
        
                <label for="cantidad">Cantidad comprada:</label>
                <input type="number" id="cantidad" name="cantidad">
        
                <label for="costo">Precio de venta:</label>
                <input type="number" id="costo" name="costo">
        
                <label for="fecha">Fecha de Adquisición:</label>
                <input type="date" id="fecha" name="fecha">
        
                <button type="submit">Registrar</button>
            </form>
        `;
        divPanel.appendChild(divDatos);
    }else if(opcionComprasSeleccionada === 'salida-mp'){
        divDatos.classList.add('salida-materia','formulario');
        divDatos.innerHTML = `<form id="formulario-registro">
        <label for="id">ID de la Materia Prima:</label>
        <input type="text" id="id" name="id">

        <label for="nombre">Nombre de la Materia Prima:</label>
        <input type="text" id="nombre" name="nombre">

        <label for="cantidad">Cantidad Saliente:</label>
        <input type="number" id="cantidad" name="cantidad">

        <label for="razon">Razón de la Salida:</label>
        <input type="text" id="razon" name="razon">

        <label for="fecha">Fecha de la Salida:</label>
        <input type="date" id="fecha" name="fecha">

        <button type="submit">Registrar</button>
    </form>
`;  
        divPanel.appendChild(divDatos);
    }else if(opcionComprasSeleccionada === 'historial-compras'){
        campos = ['compra','proveedor'];
        divDatos.classList.add('datos-compras');
        divDatos.innerHTML = crearFormulario(campos);
        divPanel.appendChild(divDatos);
        let tablas = document.createElement('div');
        tablas.classList.add('tablas');
        tablas.innerHTML = `
        <table class="tabla">
        <tr>
          <th>ID de Venta</th>
          <th>Fecha de Venta</th>
          <th>ID del Cliente</th>
          <th>Nombre del Cliente</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Total</th>
          <th>Método de Pago</th>
        </tr>
        <tr>
          <td>001</td>
          <td>01/11/2023</td>
          <td>C001</td>
          <td>Juan Pérez</td>
          <td>Anillo</td>
          <td>2</td>
          <td>$1500</td>
          <td>$3000</td>
          <td>Tarjeta de Crédito</td>
        </tr>
        <!-- Agrega más filas según sea necesario -->
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