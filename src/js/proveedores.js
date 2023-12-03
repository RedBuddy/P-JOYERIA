let opcionesProveedores = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelProveedores = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionProveedoresSeleccionada;
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

opcionesProveedores.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelProveedores)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('registrar_proveedor')) {
            opcionProveedoresSeleccionada = 'registrar_proveedor';
            accionTabla = 'agregar';
        } else if (opcionSeleccionada.contains('editar_proveedor')) {
            opcionProveedoresSeleccionada = 'editar_proveedor';
            accionTabla = 'editar';
        } else if (opcionSeleccionada.contains('consultar_proveedor')) {
            opcionProveedoresSeleccionada = 'consultar_proveedor';
            accionTabla = 'consultar';
        } else if (opcionSeleccionada.contains('eliminar_proveedor')) {
            opcionProveedoresSeleccionada = 'eliminar_proveedor';
            accionTabla = 'eliminar';
        }
        tipoTabla = 'proveedor';
        pintarHtml();
    });
});

function pintarHtml() {
    let campos, thTabla;
    let divDatos = document.createElement('div');

    if (opcionProveedoresSeleccionada === 'registrar_proveedor' || opcionProveedoresSeleccionada === 'editar_proveedor') {
        campos = ["Nombre", "Representante", "RFC", "Correo_electronico", "Celular", "Numero_exterior", "Codigo_postal", "Ciudad", "Estado", "Limite_de_credito", "Dias_de_credito", "Domicilio"];
    } else if (opcionProveedoresSeleccionada === 'consultar_proveedor') {
        thTabla = ["ID", "NOMBRE", "REPRESENTANTE", "CORREO_ELECTRONICO", "CELULAR", "LIMITE_DE_CREDITO", "DIAS_DE_CREDITO"];
    }

    API(divDatos, campos, thTabla);

}

function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form">';
    campos.forEach(campo => {
        let titulo = formatText(campo);
        formulario += `
        <label for="${campo}">${titulo}</label>
        <input type="text" name="${campo}" id="${campo}" class=""></input>
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
            const id = document.querySelector('.form input[type="text"]');
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
        console.log(campos)
        let div = document.createElement('div');
        div.classList.add('form-datos');
        let camposAux = ["Id_" + tipoTabla];
        div.innerHTML = crearFormularioNav(camposAux);
        divPanel.append(div);
        let btnRegistrar = document.querySelector('.form input[type="submit"]');
        btnRegistrar.addEventListener('click', (e) => {
            const id = document.querySelector('.form input[type="text"]');
            limpiarHtml();
            edicionDatos(e, campos, id.value);
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
    let hola = ponerDatos(form, tipoTabla);
}

async function crearFormulario(campos) {
    let formulario = `<form id="formulario-registro">`;

    for (let campo of campos) {
        const textoLabel = formatText(campo);


        formulario += `<label for="${campo}">${textoLabel}</label>`;

        if (campo === 'fecha') {
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
    const div = document.createElement('div');
    div.classList.add('tablas');
    const tabla = document.createElement('table');
    tabla.classList.add('tabla');
    // Encabezado de la tabla
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    thTabla.forEach((thText) => {
        const th = document.createElement('th');
        th.textContent = thText;
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
                td.textContent = fila[columna];  // Utilizar directamente la columna como clave
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
