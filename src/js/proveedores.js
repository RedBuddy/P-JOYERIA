let opcionesProveedores = document.querySelectorAll('.panel-proveedores .nav-sup .nav-sup-link');
let panelProveedores = document.querySelector('.panel-proveedores .nav-sup');
let divPanel = document.querySelector('.panel-proveedores');
let opcionProveedoresSeleccionada;

opcionesProveedores.forEach((opcion) => {
    opcion.addEventListener('click', e => {
    e.preventDefault();
    limpiarHtml(panelProveedores)
    let opcionSeleccionada = e.target.classList;
    if(opcionSeleccionada.contains('registrar-proveedor')){
        opcionProveedoresSeleccionada = 'registrar-proveedores';
    }else if(opcionSeleccionada.contains('editar-proveedor')){
        opcionProveedoresSeleccionada = 'editar-proveedores';
    }else if(opcionSeleccionada.contains('historial-proveedor')){
        opcionProveedoresSeleccionada = 'historial-proveedores';
    }else if(opcionSeleccionada.contains('eliminar-proveedor')){
        opcionProveedoresSeleccionada = 'eliminar-proveedores';
    }
    pintarHtml();
    });
});

function limpiarHtml(){
    let opciones = ['tablas','registrar-proveedores','datos-proveedores','editar-proveedores','eliminar-proveedores','historial-proveedores'];
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
    if(opcionProveedoresSeleccionada === 'registrar-proveedores'){
        campos = ["representante","nombre","rfc","correo-electronico","telefono","celular","domicilio","numero-exterior","codigo-postal","colonia","ciudad","estado","limite-credito","dias-credito"];
        divDatos.classList.add('formulario','registrar-proveedores');
        divDatos.innerHTML = crearFormulario(campos,"formulario-registro");
        divPanel.appendChild(divDatos);
    }else{
        let aux = `<div class="btn">
        Editar
    </div>`;
        if(opcionProveedoresSeleccionada === 'historial-proveedores'){
            aux = ``;
        }
        campos = ['nombre-proveedor'];
        divDatos.classList.add('datos-proveedores');
        divDatos.innerHTML = crearFormulario(campos,"");
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
    ${aux}
    
`;
        tablas.appendChild(tabla);
        divPanel.appendChild(tablas);
    }
}


function crearFormulario(campos,clase) {
    if(clase === ''){
        clase = 'form';
    }
    let formulario = `<form action="" class="${clase}">`;
    
    campos.forEach(campo => {
      formulario += `
        <label for="${campo}">${campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
        <input type="text" name="${campo}" id="${campo}" class="">`;
        if(clase === 'form'){
            formulario+= `<input type="submit"  name="${campo}" id="${campo}" value="Buscar">`;
        }
    });
  
    formulario += '</form>';
    return formulario;
  }