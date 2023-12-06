let opcionesEmpleados = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelEmpleados = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionEmpleadosSeleccionada;
let tipoTabla;
let accionTabla;
//Verificacion de permiso para el subsistema
import { verificar_permiso_subsistema, verificar_permiso_modulo, contenido_denegado } from "./loggin.js";
let nombreHtml = window.location.pathname.split("/").pop();
const nivel_acceso = localStorage.getItem('nivel_acceso');

if (!verificar_permiso_subsistema(nivel_acceso, nombreHtml.split('.')[0])) {
    contenido_denegado();
}
//

opcionesEmpleados.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        cambiarColor(e);
        limpiarHtml(panelEmpleados)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('agregar_empleado')) {
            opcionEmpleadosSeleccionada = 'agregar_empleado';
            accionTabla = 'agregar';
        } else if (opcionSeleccionada.contains('editar_empleado')) {
            opcionEmpleadosSeleccionada = 'editar_empleado';
            accionTabla = 'editar';
        } else if (opcionSeleccionada.contains('consultar_empleado')) {
            opcionEmpleadosSeleccionada = 'consultar_empleado';
            accionTabla = 'consultar';
        }
        tipoTabla = 'empleados';
        pintarHtml();
    });
});

function pintarHtml() {
    let campos, thTabla;
    let divDatos = document.createElement('div');

    if (opcionEmpleadosSeleccionada === 'agregar_empleado' || opcionEmpleadosSeleccionada === 'editar_empleado') {
        campos = ["Nombre", "Telefono", "Fecha_nacimiento", "Correo", "Direccion", "Fecha_ingreso", "RFC", "Turno", "Salario_hora", "Puesto", "Activo"];
    } else if (opcionEmpleadosSeleccionada === 'consultar_empleado') {
        thTabla = ["ID", "NOMBRE", "RFC", "PUESTO", "FECHA_INGRESO", "TURNO", "SALARIO_HORA", "ACTIVO"];
    }

    API(divDatos, campos, thTabla);

}

function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form" name="nav" autocomplete="off">';
    campos.forEach(campo => {
        let titulo = formatText(campo);
        formulario += `
        <label for="${campo}">${titulo}</label>
        <input type="number" name="${campo}" id="${campo}" class=""></input>
        <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    });

    formulario += '</form>';
    return formulario;
}

async function API(divDatos, campos, thTabla) {
    if (accionTabla === "eliminar") {
        let div = document.createElement('div');
        div.classList.add('form-datos');
        let camposAux = ["Id_" + tipoTabla];
        div.innerHTML = crearFormularioNav(camposAux);
        divPanel.append(div);
        let btnRegistrar = document.querySelector('.form input[type="submit"]');
        btnRegistrar.addEventListener('click', (e) => {
            e.preventDefault();
            const id = document.querySelector('.form input[type="number"]');
            limpiarHtml();
            eliminarDatosId(tipoTabla, id.value);
        })
    } else if (accionTabla === "consultar") {
        console.log('hola');
        let datos = await obtenerDatos(tipoTabla);
        divPanel.append(divDatos);
        console.log(thTabla);
        divPanel.append(await construirTabla(datos, thTabla));
        $('.tabla').DataTable({
            lengthChange: false,
            info: false,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }, "pageLength": 7,
        });
    } else if (accionTabla === "editar") {
        let div = document.createElement('div');
        div.classList.add('form-datos');
        let camposAux = ["Id_" + tipoTabla];
        div.innerHTML = crearFormularioNav(camposAux);
        divPanel.append(div);
        let btnRegistrar = document.querySelector('.form input[type="submit"]');
        btnRegistrar.addEventListener('click', (e) => {
            e.preventDefault();
            let formularioCorrecto = validarFormularioInput('nav');
            if (formularioCorrecto) {
                console.log('hola');
                const id = document.querySelector('.form input[type="number"]');
                limpiarHtml();
                edicionDatos(e, campos, id.value);
            } else {
                swal('Llena el campo correspondiente', '', 'error');
            }
        })
    } else {
        crearFormulario(campos)
            .then(formularioHTML => {
                divDatos.innerHTML = formularioHTML;
                console.log(formularioHTML);
                divDatos.classList.add('formulario');

                // Agregar un manejador de eventos al formulario solo si hay un formulario HTML
                let btnRegistrar = divDatos.querySelector('#formulario-registro button');
                if (btnRegistrar) {
                    btnRegistrar.addEventListener('click', (e) => {
                        e.preventDefault();  // Prevenir el envío por defecto del formulario
                        tomarDatos(e);
                    });
                }
                divPanel.append(divDatos);
            })
            .catch(error => {
                console.error('Error al crear el formulario:', error);
            });
    }
}

function obtenerDatos(tipoTabla) {
    return new Promise((resolve, reject) => {
        const arregloDatos = [];

        // Realizar una solicitud GET a la API
        fetch(`http://localhost:3000/${tipoTabla}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(item => {
                    if (accionTabla === 'consultar') {
                        arregloDatos.push(item);
                    } else {
                        const cadena = `${item.NOMBRE}`;
                        arregloDatos.push([item.ID, cadena]);
                    }
                });
                resolve(arregloDatos);
            })
            .catch(error => {
                // Rechazar la promesa en caso de error
                reject(error);
            });
    });
}

async function tomarDatos(e) {
    e.preventDefault();
    const form = document.querySelector("#formulario-registro");

    let formularioCorrecto = validarFormularioInput('formulario-registro');
    if (formularioCorrecto) {
        swal('Empleado añadido correctamente', '', 'success');
        let id = ponerDatos(form);
    }
}

async function crearFormulario(campos) {
    let formulario = `<form id="formulario-registro" name="formulario-registro" autocomplete="off">`;

    for (let campo of campos) {
        const textoLabel = formatText(campo);


        formulario += `<label for="${campo}">${textoLabel}</label>`;

        if (campo === 'Activo') {
            formulario += `<input type="text" name="${campo}" id="${campo}" value="S" disabled>`;
        } else if (campo === 'Fecha_ingreso' || campo === 'Fecha_nacimiento') {
            formulario += `<input type="date" name="${campo}" id="${campo}" autocomplete="off">`;
        } else if (campo === 'Puesto') {
            const opciones = [["Gerente", "Gerente"], ["Vendedor", "Vendedor"], ["Almacenista", "Almacenista"], ["Asistente de ventas", "Asistente de ventas"], ["Comprador", "Comprador"]];
            formulario += generateSelectField(campo, opciones, tipoTabla);
        } else if (campo === 'Turno') {
            formulario += generateSelectField(campo, [["Matutino", "Matutino"], ["Vespertino", "Vespertino"]]);
        } else if (campo === 'Salario_hora') {
            formulario += `<input type="number" name="${campo}" id="${campo}" autocomplete="off">`;
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}" autocomplete="off">`;
        }
    }

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}

function ponerDatos(form, id) {
    const form_data = new FormData(form);
    if (opcionEmpleadosSeleccionada === 'agregar_empleado') {
        const valorCampoDeshabilitado = document.getElementById('Activo').value; // Reemplaza 'idCampoDeshabilitado' con el ID de tu campo deshabilitado
        tipoTabla = 'crearUsuarioDesdeEmpleado';
        form_data.append('Activo', valorCampoDeshabilitado);
    }else if(opcionEmpleadosSeleccionada === 'editar_empleado'){
        tipoTabla = `editarUsuarioDesdeEmpleado/${id}`;
    }

    const data = new URLSearchParams(form_data);

    data.forEach((clave, valor) => {
        console.log(clave, valor);
    })

    fetch(`http://localhost:3000/${tipoTabla}`, {
        method: 'POST',
        body: data
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
            }
            console.log(res);
            return res.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error); // Agregar esta línea para ver el error en la consola
        });
}

function limpiarHtml() {
    let opciones = ['tablas', 'formulario', 'form-datos'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}

function formatText(text) {
    // Paso 1: Reemplazar guiones bajos con espacios
    let formattedText = text.replace(/_/g, ' ');

    // Paso 2: Capitalizar la primera letra
    formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

    return formattedText;
}

async function construirTabla(datos, thTabla) {
    const div = document.createElement('div');
    div.classList.add('tablas');
    const tabla = document.createElement('table');
    tabla.classList.add('tabla');
    // Encabezado de la tabla
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    thTabla.forEach((thText) => {
        const th = document.createElement('th');
        let titulo = formatText(thText);
        th.textContent = titulo;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    // Cuerpo de la tabla
    const tbody = document.createElement('tbody');

    if (datos && datos.length > 0) {
        datos.forEach((fila) => {
            const tr = document.createElement('tr');
            thTabla.forEach((columna) => {
                const td = document.createElement('td');
                if (columna === 'FECHA_INGRESO') {

                    if (fila[columna]) {
                        let fechaAPI = fila[columna];
                        // Obtener solo la parte de la fecha con slice
                        let fechaFormateada = fechaAPI.slice(0, 10);
                        td.textContent = fechaFormateada;
                    }
                } else {
                    td.textContent = fila[columna];
                }  // Utilizar directamente la columna como clave
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } else {
        // Crear una fila de "sin datos" si no hay datos
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Sin datos disponibles';
        td.colSpan = thTabla.length;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    tabla.appendChild(tbody);
    div.append(tabla);
    // Limpiar y añadir la tabla al contenedor
    return div;
}

async function edicionDatos(e, campos, id) {
    e.preventDefault();
    llenarFormulario(campos, id);
}

async function llenarFormulario(campos, id) {
    try {
        const datos = await obtenerDatosId(tipoTabla, id);
        console.log(datos);



        const formularioHTML = await crearFormularioLlenado(campos, datos);

        let divDatos = document.createElement('div');
        divDatos.innerHTML = formularioHTML;
        divDatos.classList.add('formulario');

        let btnRegistrar = divDatos.querySelector('#formulario-registro button');

        if (btnRegistrar) {
            btnRegistrar.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    // Maneja la promesa devuelta por actualizarDatos

                    const form = document.querySelector("#formulario-registro");
                    let formularioCorrecto = validarFormularioInput('formulario-registro');

                    if (formularioCorrecto) {
                        swal('Empleado editado correctamente', '', 'success');
                        ponerDatos(form, id);
                    }
                } catch (error) {
                    console.error('Error al actualizar datos:', error);
                }
            });
        }

        divPanel.append(divDatos);
    } catch (error) {
        console.error('Error al llenar el formulario:', error);
    }
}



async function crearFormularioLlenado(campos, datos) {
    let formulario = `<form id="formulario-registro" name="formulario-registro" autocomplete="off">`;


    for (const campo of campos) {
        const textoLabel = formatText(campo);

        formulario += `<label for="${campo}">${textoLabel}</label>`;

        let posicion = campo.toUpperCase();

        if (campo === 'Activo') {
            formulario += `<input type="text" name="${campo}" id="${campo}" autocomplete="off" value="${datos[posicion] || ''}">`;
        }
        else if (campo === 'Puesto') {
            const opciones = [["Gerente", "Gerente"], ["Vendedor", "Vendedor"], ["Almacenista", "Almacenista"], ["Asistente de ventas", "Asistente de ventas"], ["Comprador", "Comprador"]];
            formulario += generateSelectField(campo, opciones, datos[posicion]);
        } else if (campo === 'Turno') {
            const opciones = [["Matutino", "Matutino"], ["Vespertino", "Vespertino"]];
            formulario += generateSelectField(campo, opciones, datos[posicion]);
        }
        else if (campo === 'Fecha_ingreso' || campo === 'Fecha_nacimiento') {
            let fechaAPI = datos[posicion];
            // Obtener solo la parte de la fecha con slice
            let fechaFormateada = fechaAPI.slice(0, 10);
            formulario += `<input type="date" name="${campo}" autocomplete="off" id="${campo}" value="${fechaFormateada || ''}">`;
        } else {
            formulario += `<input type="text" name="${campo}" autocomplete="off" id="${campo}" value="${datos[posicion] || ''}">`;
        }
    }

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}

function obtenerDatosId(tipoTabla, id) {
    return new Promise((resolve, reject) => {
        // Realizar una solicitud GET a la API con el ID proporcionado
        fetch(`http://localhost:3000/${tipoTabla}/${id}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Resolver la promesa con los datos obtenidos
                console.log(data)
                resolve(data);
            })
            .catch(error => {
                swal("El empleado no fue encontrado", "", "error");
                reject(error);
            });
    });
}

function actualizarDatos(form, tipoTabla, id) {
    return new Promise((resolve, reject) => {

        console.log(form);

        const form_data = new FormData(form);
        const data = new URLSearchParams(form_data);

        form_data.forEach((valor, clave) => {
            console.log(`${clave}: ${valor}`);
        });

        fetch(`http://localhost:3000/${tipoTabla}/${id}`, {
            method: 'PUT',
            body: data,
        })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error en la solicitud: ${response.status} - ${JSON.stringify(errorData)}`);
                }
                return response.json();
            })
            .then(data => {
                // Resolver la promesa con los datos actualizados
                resolve(data);
            })
            .catch(error => {
                // Rechazar la promesa en caso de error
                reject(error);
            });
    });
}

function eliminarDatosId(tipoTabla, id) {
    console.log(tipoTabla)
    return new Promise((resolve, reject) => {
        // Realizar una solicitud DELETE a la API con el ID proporcionado
        fetch(`http://localhost:3000/${tipoTabla}/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                // La operación DELETE puede no devolver datos, pero puedes devolver un mensaje o algo relevante
                //return response.json();
            })
            .then(data => {
                // Resolver la promesa con los datos obtenidos (o mensaje)
                console.log(data);
                resolve(data);
            })
            .catch(error => {
                // Rechazar la promesa en caso de error
                reject(error);
            });
    });
}

function generateSelectField(fieldName, options, selectedValue) {
    let selectHTML = `<select id="${fieldName}" name="${fieldName}">
        <option value="" disabled selected>Selecciona uno</option>`;


    console.log(selectedValue)

    for (const option of options) {
        selectHTML += `<option value="${option[0]}" ${selectedValue === option[0] ? 'selected' : ''}>${option[1]}</option>`;
    }

    selectHTML += '</select>';
    return selectHTML;
}

function validarFormularioInput(name) {
    // Obtener todos los elementos del formulario
    var elementosFormulario = document.forms[name].elements;
    // Iterar sobre los elementos y verificar si están llenos
    for (var i = 0; i < elementosFormulario.length; i++) {
        // Verificar solo los elementos que son input, select o textarea
        if (elementosFormulario[i].type !== 'submit' && elementosFormulario[i].type !== 'reset' && elementosFormulario[i].type !== 'button') {
            if (elementosFormulario[i].value === '') {
                swal('Llena todos los campos correctamente', '', 'error');

                return false; // Evitar que el formulario se envíe
            }
        }
        if (elementosFormulario[i].id === 'RFC') {
            if (!validarRFC(elementosFormulario[i].value)) {
                swal('RFC incorrecto', 'El RFC es incorrecto', 'error');
                console.log('entro pero soy gay');
                return false;
            }
        }
        if (elementosFormulario[i].id === 'Telefono') {
            if (!validarNumeroCelular(elementosFormulario[i].value)) {
                swal('Telefono incorrecto', 'El telefono es incorrecto', 'error');
                console.log('entro pero soy gay');
                return false;
            }
        }
        if (elementosFormulario[i].id === 'Correo') {
            if (!validarCorreoElectronico(elementosFormulario[i].value)) {
                swal('Correo electronico incorrecto', 'Asegurate que el correo electronico sea correcto', 'error');
                console.log('entro pero soy gay');
                return false;
            }
        }
    }

    // Si todos los campos están llenos, permitir el envío del formulario
    return true;
}

function validarRFC(rfc) {
    const regexRFC = /^[A-Z]{4}\d{6}[A-Z\d]{3}$/;
    return regexRFC.test(rfc);
}

function validarNumeroCelular(numero) {
    // Asumiendo un formato común de 10 dígitos para números de teléfono en tu región
    const regexNumeroCelular = /^[0-9]{10}$/;
    return regexNumeroCelular.test(numero);
}

function validarCorreoElectronico(correo) {
    // Expresión regular básica para validar el formato de un correo electrónico
    const regexCorreoElectronico = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regexCorreoElectronico.test(correo);
}

const btn_logout = document.querySelector('.nav-link-logout');

btn_logout.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
    localStorage.setItem('nivel_acceso', sinlog);
})

function cambiarColor(event) {
    // Obtén el elemento clicado
    var elementoClicado = event.currentTarget;

    // Remueve la clase 'active' de todos los enlaces
    var enlaces = document.querySelectorAll('.nav-sup-link');
    enlaces.forEach(function (enlace) {
        enlace.classList.remove('active');
    });

    // Agrega la clase 'active' al enlace clicado
    elementoClicado.classList.add('active');

    // Puedes descomentar la siguiente línea si también quieres evitar la acción predeterminada del enlace
    // event.preventDefault();
}