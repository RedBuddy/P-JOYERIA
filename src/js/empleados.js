let opcionesEmpleados = document.querySelectorAll('.panel-empleados .nav-sup .nav-sup-link');
let panelEmpleados = document.querySelector('.panel-proveedores .nav-sup');
let divPanel = document.querySelector('.panel-empleados');
let opcionEmpleadosSeleccionada;

opcionesEmpleados.forEach((opcion) => {
    opcion.addEventListener('click', e => {
    e.preventDefault();
    limpiarHtml(panelEmpleados)
    let opcionSeleccionada = e.target.classList;
    if(opcionSeleccionada.contains('registrar-empleado')){
        opcionEmpleadosSeleccionada = 'registrar-empleados';
    }else if(opcionSeleccionada.contains('informacion-laboral')){
        opcionEmpleadosSeleccionada = 'informacion-laborales';
    }else if(opcionSeleccionada.contains('eliminar-empleado')){
        opcionEmpleadosSeleccionada = 'eliminar-empleados';
    }
    pintarHtml();
    });
});

function limpiarHtml(){
    let opciones = ['tablas','registrar-empleados','datos-empleados','informacion-labolares','eliminar-empleados'];
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
    if(opcionEmpleadosSeleccionada === 'registrar-empleados'){
        campos = ["nombre","direccion","celular","email","rfc","fecha-nacimiento","fecha-ingreso","puesto-trabajo","horario-trabajo","tipo-contrato","salario-hora"];
        divDatos.classList.add('formulario','registrar-empleados');
        divDatos.innerHTML = crearFormulario(campos,"formulario-registro");
        divPanel.appendChild(divDatos);
    }else{
        console.log(opcionEmpleadosSeleccionada)
        let aux = `<div class="btn">
        Editar
    </div>`;
        if(opcionEmpleadosSeleccionada === 'eliminar-empleados'){
            aux = `<div class="btn">
            Eliminar
        </div>`;
        }
        campos = ['nombre-empleado'];
        divDatos.classList.add('datos-empleados');
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