let opcionesGarantias = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelGarantias = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionGarantiasSeleccionada;
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

opcionesGarantias.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelGarantias)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('consultar_garantia')) {
            opcionGarantiasSeleccionada = 'consultar_garantia';
            accionTabla = 'consultar';
        }else if(opcionSeleccionada.contains('registrar_devolucion_cliente')){
            opcionGarantiasSeleccionada = 'registrar_devolucion_cliente';
            accionTabla = 'agregar';
        }else if(opcionSeleccionada.contains('registrar_devolucion_proveedor')){
            opcionGarantiasSeleccionada = 'registrar_devolucion_proveedor';
            accionTabla = 'agregar';
        }
        pintarHtml();
    });
});

function pintarHtml() {
    limpiarHMTL();
    let campos, thTabla;
    let divDatos = document.createElement('div');

    if (opcionGarantiasSeleccionada === 'consultar_garantia') {
        campos = ["Tipo_garantia"];
    }else if(opcionGarantiasSeleccionada === 'registrar_devolucion_cliente'){
        campos = ["Id_venta","Motivo","Estado_producto","Fecha"];
    }else if(opcionGarantiasSeleccionada === 'registrar_devolucion_proveedor'){
        campos = ["Id_compra","Motivo","Estado_producto","Fecha"];
    }

    API(divDatos, campos, thTabla);

}

function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form" autocomplete="off" name="nav">';
    campos.forEach(campo => {
        let titulo = formatText(campo);
        let input = `<input type="text" name="${campo}" id="${campo}" class="" autocomplete="off"></input>`
        if (campo === 'Tipo_garantia') {
            const opciones = [['Cliente', 'Cliente'], ['Proveedor', 'Proveedor']];
            input = generateSelectField(campo, opciones);
        }
        formulario += `
      <label>${titulo}</label>
      ${input}
      <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto" autocomplete="off">`;
    });

    formulario += '</form>';
    return formulario;
}

async function API(divDatos, campos) {
    if (accionTabla === "consultar") {
        let div = document.createElement('div');
        div.classList.add('form-datos');
        div.innerHTML = crearFormularioNav(campos);
        divPanel.append(div);
        let btnRegistrar = document.querySelector('.form-datos form input[type="submit"]');
        btnRegistrar.addEventListener('click', async (e) => {
            e.preventDefault();
            let formularioCorrecto = validarFormularioInput('nav');
            if (formularioCorrecto) {
                let valor = document.querySelector('.form-datos form select').value;
                let thTabla;
                if (valor === 'Cliente') {
                    tipoTabla = 'ObtenerTodosLosRegistros';
                    thTabla = ["ID_VENTA", "ESTADO_GARANTIA", "FECHA_FIN_GARANTIA", "ID_CLIENTE"]
                } else {
                    thTabla = ["ID_COMPRA", "ESTADO_GARANTIA", "FECHA_FIN_GARANTIA", "ID_PROVEEDOR"]
                    tipoTabla = 'ObtenerTodosLosRegistrosProveedor';
                }
                let data = await garantia();
                let quitarTabla = document.querySelector('.panel .tablas');
                if (quitarTabla) {
                    quitarTabla.remove();
                }

                divPanel.append(await construirTabla(data, thTabla));

                $('.tabla').DataTable({
                    lengthChange: false,
                    info: false,
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                    }, "pageLength": 7
                });
            } else {
                swal('Oops', 'Llena los datos de la venta correctamente', 'error');
            }

        });
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
    let hola = ponerDatos(form, tipoTabla);
}

async function crearFormulario(campos) {
    let formulario = `<form id="formulario-registro" name="nav">`;

    for (let campo of campos) {
        const textoLabel = formatText(campo);


        formulario += `<label for="${campo}">${textoLabel}</label>`;

        if (campo === 'Fecha') {
            formulario += `<input type="date" name="${campo}" id="${campo}">`;
        } else if (campo === 'Tipo') {
            formulario += generateSelectField(campo, [["_mp", "Materia prima"], ["_pt", "Producto terminado"]]);
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}">`;
        }
    }

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}

function garantia() {
    return new Promise((resolve, reject) => {
        // Realizar una solicitud GET a la API con el ID proporcionado
        fetch(`http://localhost:3000/${tipoTabla}`, {
            method: 'POST',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Resolver la promesa con los datos obtenidos
                resolve(data);
            })
            .catch(error => {
                // Rechazar la promesa en caso de error
                reject(error);
            });
    });
}

function ponerDatos(form, tipoTabla) {
    const form_data = new FormData(form);
    const data = new URLSearchParams(form_data);


    form_data.forEach((clave, valor) => {
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
            return res.json();
        })
        .then(data => {
            console.log(data);
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
    let quitarTabla = document.querySelector('.panel .tablas .tabla');
  if (quitarTabla) {
    quitarTabla.remove();
  }
    const div = document.createElement('div');
    div.classList.add('tablas');
    const tabla = document.createElement('table');
    tabla.classList.add('tabla');
    console.log(datos);
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
                if (columna === "FECHA_FIN_GARANTIA") {
                    let fechaAPI = fila[columna];
                    // Obtener solo la parte de la fecha con slice
                    let fechaFormateada = fechaAPI.slice(0, 10);
                    td.textContent = fechaFormateada;
                } else {
                    td.textContent = fila[columna];  // Utilizar directamente la columna como clave
                }
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

                    let form = document.querySelector("#formulario-registro");
                    await actualizarDatos(form, tipoTabla, id);
                    console.log('Datos actualizados con éxito');
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
    let formulario = `<form id="formulario-registro">`;


    for (const campo of campos) {
        const textoLabel = formatText(campo);

        formulario += `<label for="${campo}">${textoLabel}</label>`;

        let posicion = campo.toUpperCase();


        if (campo === 'fecha') {
            formulario += `<input type="date" name="${campo}" id="${campo}" value="${datos[posicion] || ''}">`;
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}" value="${datos[posicion] || ''}">`;
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
                // Rechazar la promesa en caso de error
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

    console.log(options[0])

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
                console.log(elementosFormulario[i])
                return false; // Evitar que el formulario se envíe
            }
        }
    }

    // Si todos los campos están llenos, permitir el envío del formulario
    return true;
}

function limpiarHMTL() {
    let opciones = ['form-datos', 'almacen-mp', 'form', 'tabla', 'tablas', 'no-footer'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}