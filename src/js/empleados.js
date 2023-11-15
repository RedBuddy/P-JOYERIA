let opcionesEmpleados = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelEmpleados = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
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
    let opciones = ['tablas','registrar-empleados','form-datos','informacion-labolares','eliminar-empleados'];
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
        divDatos.classList.add('form-datos');
        divDatos.innerHTML = crearFormulario(campos,"");
        divPanel.appendChild(divDatos);
        let tablas = document.createElement('div');
        tablas.classList.add('tablas');
        let tabla = document.createElement('table');
        tabla.classList.add('tabla');
        tabla.innerHTML = ` <tbody>
        <tr>
            <th>ID EMPLEADO</th>
            <th>EMPLEADO</th>
            <th>RFC</th>
            <th>CELULAR</th>
            <th>CORREO</th>
            <th>DIRECCION</th>
            <th>PUESTO</th>
            <th>ACTIVO</th>
        </tr>
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