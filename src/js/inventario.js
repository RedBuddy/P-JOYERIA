let opcionesInventario = document.querySelectorAll('.panel-inventario .nav-sup .nav-sup-link');
let panelInventario = document.querySelector('.panel-inventario .nav-sup');
let divPanel = document.querySelector('.panel-inventario');
let opcionInventarioSeleccionada;

opcionesInventario.forEach((opcion) => {
    opcion.addEventListener('click', e => {
    e.preventDefault();
    limpiarHtml(panelInventario)
    let opcionSeleccionada = e.target.classList;
    if(opcionSeleccionada.contains('almacen-mp')){
        opcionInventarioSeleccionada = 'almacen-mp';
    }else if(opcionSeleccionada.contains('almacen-pt')){
        opcionInventarioSeleccionada = 'almacen-pt';
    }
    pintarNav(opcionInventarioSeleccionada);
    });
});

function limpiarHtml(){
    let opciones = ['datos-inventario','entrada-materia','tablas','salida-materia','entrada-producto','salida-producto'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);
  
    elementos.forEach(elemento => {
      elemento.remove();
    });
  }

function generarNav(opcion) {
    let imgSrc = '';
    let texto = '';
    if(opcion === 'almacen-mp'){
        texto = "mp";
    } else if(opcion === 'almacen-pt'){
        texto = "pt"
    }

    return `
        <a class="nav-sup-link consultar-${texto}" href="#"><img src="../src/img/almacen-mp.png" alt="" class="consultar-${texto}">Consultar almacen</a>
        <a class="nav-sup-link entrada-${texto}" href="#"><img src="../src/img/entrada.png" alt="" class="entrada-${texto}">Registrar entrada</a>
        <a class="nav-sup-link devoluciones" href="#"><img src="../src/img/salida.png" alt="" class="salida-${texto}">Registrar salida</a>`;
}


function pintarNav(){
    if(opcionInventarioSeleccionada === 'almacen-mp' || opcionInventarioSeleccionada === 'almacen-pt'){
        panelInventario.innerHTML = generarNav(opcionInventarioSeleccionada); 
        agregarEventListeners(); 
    }
}

function agregarEventListeners() {
    let opcionesInventario = document.querySelectorAll('.panel-inventario .nav-sup .nav-sup-link');

    opcionesInventario.forEach((opcion) => {
        opcion.addEventListener('click', e => {
            e.preventDefault();
            limpiarHtml(divPanel)
            let opcionSeleccionada = e.target.classList;
            if(opcionSeleccionada.contains('consultar-mp')){
                opcionInventarioSeleccionada = 'consultar-mp';
            }else if(opcionSeleccionada.contains('entrada-mp')){
                opcionInventarioSeleccionada = 'entrada-mp';
            }else if(opcionSeleccionada.contains('salida-mp')){
                opcionInventarioSeleccionada = 'salida-mp';
            }else if(opcionSeleccionada.contains('consultar-pt')){
                opcionInventarioSeleccionada = 'consultar-pt';
            }else if(opcionSeleccionada.contains('entrada-pt')){
                opcionInventarioSeleccionada = 'entrada-pt';
            }else if(opcionSeleccionada.contains('salida-pt')){
                opcionInventarioSeleccionada = 'salida-pt';
            }
            pintarHtml();
        });
    });
}

function pintarHtml(){
    let campos;
    let divDatos = document.createElement('div');
  
    if(opcionInventarioSeleccionada === 'consultar-mp'){
        campos = ['materia-prima'];
        divDatos.classList.add('datos-inventario');
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
    }else if(opcionInventarioSeleccionada === 'entrada-mp'){
        divDatos.classList.add('entrada-materia','formulario');
        divDatos.innerHTML = `
        <form id="formulario-registro">
        
                <label for="nombre">Nombre de la Materia Prima:</label>
                <input type="text" id="nombre" name="nombre">
        
                <label for="cantidad">Cantidad Entrante:</label>
                <input type="number" id="cantidad" name="cantidad">
        
                <label for="costo">Costo por Unidad:</label>
                <input type="number" id="costo" name="costo">
        
                <label for="proveedor">Proveedor:</label>
                <input type="text" id="proveedor" name="proveedor">
        
                <label for="fecha">Fecha de Adquisición:</label>
                <input type="date" id="fecha" name="fecha">
        
                <button type="submit">Registrar</button>
            </form>
        `;
        divPanel.appendChild(divDatos);
    }else if(opcionInventarioSeleccionada === 'salida-mp'){
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
    }else if(opcionInventarioSeleccionada === 'consultar-pt'){
        campos = ['producto-terminado'];
        divDatos.classList.add('datos-inventario');
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
    }else if(opcionInventarioSeleccionada === 'entrada-pt'){
        divDatos.classList.add('entrada-producto','formulario');
        divDatos.innerHTML = `
        <form id="formulario-registro">
        
                <label for="nombre">Nombre del Producto:</label>
                <input type="text" id="nombre" name="nombre">
        
                <label for="cantidad">Cantidad Entrante:</label>
                <input type="number" id="cantidad" name="cantidad">
        
                <label for="costo">Costo de venta:</label>
                <input type="number" id="costo" name="costo">
        
                <label for="fecha">Fecha de Produccion:</label>
                <input type="date" id="fecha" name="fecha">
        
                <button type="submit">Registrar</button>
            </form>
        `;
        divPanel.appendChild(divDatos);
    }else if(opcionInventarioSeleccionada === 'salida-pt'){
        divDatos.classList.add('salida-producto','formulario');
        divDatos.innerHTML = `<form id="formulario-registro">

        <label for="nombre">Nombre del producto:</label>
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