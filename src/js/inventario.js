let opcionesInventario = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelInventario = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let tipoTabla;
let accionTabla;
let opcionInventarioSeleccionada;

//Verificacion de permiso para el subsistema
import { verificar_permiso_subsistema, verificar_permiso_modulo, contenido_denegado } from "./loggin.js";
let nombreHtml = window.location.pathname.split("/").pop();
const nivel_acceso = localStorage.getItem('nivel_acceso');

if (!verificar_permiso_subsistema(nivel_acceso, nombreHtml.split('.')[0])) {
    contenido_denegado();
}
//

//AQUI LE DOY MOVILIDAD A MI NAVEGACION
opcionesInventario.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelInventario)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('almacen_mp')) {
            opcionInventarioSeleccionada = 'almacen_mp';
        } else if (opcionSeleccionada.contains('almacen_pt')) {
            opcionInventarioSeleccionada = 'almacen_pt';
        } else if (opcionSeleccionada.contains('categoria')) {
            opcionInventarioSeleccionada = 'categoria';
        } else if (opcionSeleccionada.contains('materia_prima')) {
            opcionInventarioSeleccionada = 'materia_prima';
        } else if (opcionSeleccionada.contains('producto_terminado')) {
            opcionInventarioSeleccionada = 'producto_terminado';
        }
        tipoTabla = opcionInventarioSeleccionada;
        //VUELVO A PINTAR EL NAV, PQ CADA OPCION TIENE SU NAVEGACION
        if (!verificar_permiso_modulo(nivel_acceso, opcionInventarioSeleccionada, nombreHtml.split('.')[0])) {
            contenido_denegado();
        } else {
            pintarNav(opcionInventarioSeleccionada);
        }

    });
});

//CADA QUE SE ACTUALICE , O SE OPRIME UNA NUEVA OPCION
function limpiarHtml() {
    let opciones = ['form-datos', 'entrada-materia', 'tablas', 'salida-materia', 'entrada-producto', 'salida-producto', 'formulario', 'almacen-mp', 'form'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}
//AQUI YO GENERO UN NUEVO NAV, PQ ESTE MODULO LO REQUIERE
function generarNav(opcion) {
    let titulo = '';
    let texto = '';
    if (opcion === 'almacen_mp' || opcion === 'almacen_pt') {
        return `
        <a class="nav-sup-link consultar_${opcion}" href="#"><img src="../src/img/almacen.png" alt="" class="consultar_${opcion}">Consultar almacen</a>
        <a class="nav-sup-link movimiento_${opcion}" href="#"><img src="../src/img/entrada.png" alt="" class="movimiento_${opcion}">Registrar movimiento</a>
        `;
    }
    titulo = formatText(opcion).toLowerCase();
    return `
        <a class="nav-sup-link agregar_${opcion}" href="#"><img src="../src/img/${titulo}.png" alt="" class="agregar_${opcion}">Agregar ${titulo}</a>
        <a class="nav-sup-link consultar_${opcion}" href="#"><img src="../src/img/consultar_${titulo}.png" alt="" class="consultar_${opcion}">Consultar ${titulo}</a>
        <a class="nav-sup-link editar_${opcion}" href="#"><img src="../src/img/editar.png" alt="" class="editar_${opcion}">Editar ${titulo}</a>
        <a class="nav-sup-link eliminar_${opcion}" href="#"><img src="../src/img/eliminar.png" alt="" class="eliminar_${opcion}">Eliminar ${titulo}</a>
        `;
}


function pintarNav() {
    panelInventario.innerHTML = generarNav(opcionInventarioSeleccionada);
    agregarEventListeners();
}


function agregarEventListeners() {
    let opcionesInventario = document.querySelectorAll('.panel .nav-sup .nav-sup-link');

    opcionesInventario.forEach((opcion) => {
        opcion.addEventListener('click', e => {
            e.preventDefault();
            limpiarHtml(divPanel)
            let opcionSeleccionada = e.target.classList;
            if (opcionSeleccionada.contains('consultar_almacen_mp')) {
                //ME VA INDICAR QUE SE VA HACER, PARA SABER LOS DATOS QUE TENDRAN LOS CAMPOS, Y LOS THTABLA
                opcionInventarioSeleccionada = 'consultar_almacen_mp';
                //ME INDICA QUE VA HACER LA API
                accionTabla = "consultar";
            } else if (opcionSeleccionada.contains('movimiento_almacen_mp')) {
                opcionInventarioSeleccionada = 'movimiento_almacen_mp';
                accionTabla = "agregar";
            } else if (opcionSeleccionada.contains('consultar_almacen_pt')) {
                opcionInventarioSeleccionada = 'consultar_almacen_pt';
                accionTabla = "consultar";
            } else if (opcionSeleccionada.contains('movimiento_almacen_pt')) {
                opcionInventarioSeleccionada = 'movimiento_almacen_pt';
                accionTabla = "agregar";
            } else if (opcionSeleccionada.contains('agregar_materia_prima')) {
                opcionInventarioSeleccionada = 'agregar_materia_prima';
                accionTabla = "agregar";
            } else if (opcionSeleccionada.contains('agregar_categoria')) {
                opcionInventarioSeleccionada = 'agregar_categoria';
                accionTabla = "agregar";
            } else if (opcionSeleccionada.contains('eliminar_categoria')) {
                opcionInventarioSeleccionada = 'eliminar_categoria';
                accionTabla = "eliminar";
            } else if (opcionSeleccionada.contains('editar_categoria')) {
                opcionInventarioSeleccionada = 'editar_categoria';
                accionTabla = "editar";
            } else if (opcionSeleccionada.contains('consultar_categoria')) {
                opcionInventarioSeleccionada = 'consultar_categoria';
                accionTabla = "consultar";
            } else if (opcionSeleccionada.contains('agregar_producto_terminado')) {
                opcionInventarioSeleccionada = 'agregar_producto_terminado';
                accionTabla = "agregar";
            } else if (opcionSeleccionada.contains('consultar_materia_prima')) {
                opcionInventarioSeleccionada = 'consultar_materia_prima';
                accionTabla = "consultar";
            } else if (opcionSeleccionada.contains('consultar_producto_terminado')) {
                opcionInventarioSeleccionada = 'consultar_producto_terminado';
                accionTabla = "consultar";
            } else if (opcionSeleccionada.contains('editar_materia_prima')) {
                opcionInventarioSeleccionada = 'editar_materia_prima';
                accionTabla = "editar";
            } else if (opcionSeleccionada.contains('editar_producto_terminado')) {
                opcionInventarioSeleccionada = 'editar_producto_terminado';
                accionTabla = "editar";
            } else if (opcionSeleccionada.contains('eliminar_materia_prima')) {
                opcionInventarioSeleccionada = 'eliminar_materia_prima';
                accionTabla = "eliminar";
            } else if (opcionSeleccionada.contains('eliminar_producto_terminado')) {
                opcionInventarioSeleccionada = 'eliminar_producto_terminado';
                accionTabla = "eliminar";
            }
            console.log(opcionInventarioSeleccionada);
            pintarHtml();
        });
    });
}

function pintarHtml() {
    //LA CATEGORIA ES EL UNICO SUBSISTEMA QUE CAMBIA 
    if (tipoTabla === 'categoria_mp' || tipoTabla === 'categoria_pt') {
        tipoTabla = 'categoria';
    }

    let divDatos = document.createElement('div');
    let campos, thTabla;
    //DEPENDIENDO QUE SUBSISTEMA ES
    if (tipoTabla === 'materia_prima') {
        // sePuede = true;
        if (opcionInventarioSeleccionada === "agregar_materia_prima" || opcionInventarioSeleccionada === "editar_materia_prima") {
            campos = ["Nombre", "Id_proveedor", "Id_categoria", "Unidad_de_medida", "Precio_de_compra"];
        }
        if (opcionInventarioSeleccionada === 'consultar_materia_prima') {
            thTabla = ["ID", "NOMBRE", "ID_PROVEEDOR", "PRECIO_DE_COMPRA", "ID_CATEGORIA", "UNIDAD_DE_MEDIDA"]
        }
        API(divDatos, campos, thTabla);
    }

    if (tipoTabla === 'almacen_mp') {
        if (opcionInventarioSeleccionada === 'movimiento_almacen_mp') {
            campos = ["Id_materia_prima", "Cantidad", "Tipo_movimiento", "Motivo"];
        } else if (opcionInventarioSeleccionada === "consultar_almacen_mp") {
            thTabla = ["ID_MATERIA_PRIMA", "CANTIDAD"];
        }
        API(divDatos, campos, thTabla);
    }

    if (tipoTabla === 'almacen_pt') {
        if (opcionInventarioSeleccionada === 'movimiento_almacen_pt') {
            campos = ["Id_producto", "Cantidad", "Tipo_movimiento", "Motivo"];
        } else if (opcionInventarioSeleccionada === "consultar_almacen_pt") {
            thTabla = ["ID_PRODUCTO", "CANTIDAD"];
        }
        API(divDatos, campos, thTabla);
    }

    if (tipoTabla === 'producto_terminado') {
        if (opcionInventarioSeleccionada === 'agregar_producto_terminado' || opcionInventarioSeleccionada === 'editar_producto_terminado') {
            campos = ["Nombre", "Id_categoria", "Precio_venta"];
        } else if (opcionInventarioSeleccionada === 'consultar_producto_terminado') {
            thTabla = ["ID", "NOMBRE", "ID_CATEGORIA", "PRECIO_VENTA"]
        }
        API(divDatos, campos, thTabla)
    }
    //CATEGORIA ES LO UNICO
    if (tipoTabla === 'categoria') {
        if (opcionInventarioSeleccionada === 'agregar_categoria') {
            campos = ["Nombre", "Tipo"];
            API(divDatos, campos, thTabla);
        }
        if (opcionInventarioSeleccionada === 'consultar_categoria') {
            thTabla = ["ID", "NOMBRE"];
        }
        if (opcionInventarioSeleccionada === 'editar_categoria' || opcionInventarioSeleccionada === 'consultar_categoria' || opcionInventarioSeleccionada === 'eliminar_categoria') {
            let div = document.createElement('div');
            div.classList.add('form-datos');
            let camposAux = ["Tipo_categoria"];
            div.innerHTML = crearFormularioNav(camposAux);
            divPanel.append(div);
            let btnRegistrar = document.querySelector('.form input[type="submit"]');
            if (opcionInventarioSeleccionada === 'editar_categoria') {
                campos = ["Nombre"];
                btnRegistrar.addEventListener('click', (e) => {
                    e.preventDefault();
                    let formularioCorrecto = validarFormularioInput('nav');
                    if (formularioCorrecto) {
                        const tipoCategoriaSelect = document.getElementById('Tipo_categoria');
                        tipoTabla += tipoCategoriaSelect.value;
                        limpiarHtml();
                        API(divDatos, campos, thTabla);
                    } else {
                        swal('Algo salio mal', 'Llena el campo correspondiente', 'error');
                    }
                })
            } else {
                btnRegistrar.addEventListener('click', (e) => {
                    e.preventDefault();
                    let formularioCorrecto = validarFormularioInput('nav');
                    if (formularioCorrecto) {
                        const tipoCategoriaSelect = document.getElementById('Tipo_categoria');
                        tipoTabla += tipoCategoriaSelect.value;
                        limpiarHtml();
                        API(divDatos, campos, thTabla);
                    } else {
                        swal('Algo salio mal', 'Llena el campo correspondiente', 'error');
                    }
                })
            }
        }
    }

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
            let formularioCorrecto = validarFormularioInput('nav');
            if (formularioCorrecto) {
                const id = document.querySelector('.form input[type="text"]');
                limpiarHtml();
                eliminarDatosId(tipoTabla, id.value);
                swal('Eliminado correctamente','','success');
            } else {
                swal('Algo salio mal', 'Llena el campo correspondiente', 'error');
            }
        })
    } else if (accionTabla === "consultar") {
        let datos = await obtenerDatos(tipoTabla);
        divPanel.append(divDatos);
        divPanel.append(await construirTabla(datos, thTabla));
        $('.tabla').DataTable({
            lengthChange: false,
            info: false,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }, "pageLength": 7
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
            console.log(formularioCorrecto);
            if(formularioCorrecto){
                const id = document.querySelector('.form input[type="text"]');
                limpiarHtml();
                edicionDatos(e, campos, id.value);
            }else{
                swal('Algo salio mal', 'Llena los campos correspondientes', 'error');
            }
            
        })
    } else {
        crearFormulario(campos)
            .then(formularioHTML => {
                console.log(divDatos);
                divDatos.innerHTML = formularioHTML;
                console.log(formularioHTML);
                divDatos.classList.add('formulario');

                // Agregar un manejador de eventos al formulario solo si hay un formulario HTML
                let btnRegistrar = divDatos.querySelector('#formulario-registro button');
                if (btnRegistrar) {
                    btnRegistrar.addEventListener('click', (e) => {
                        e.preventDefault();  // Prevenir el envío por defecto del formulario
                        
                        let mensaje = formatText(tipoTabla);
                        console.log(mensaje);
                        if(mensaje === 'Materia prima'){
                            mensaje = "La materia prima";
                        }else if(mensaje === 'Producto terminado'){
                            mensaje = "El producto terminado";
                        }else if(mensaje === 'Almacen mp'){
                            mensaje = "El movimiento del almacen de materia prima";
                        }else if(mensaje === 'Almacen pt'){
                            mensaje = "El movimiento del almacen de producto terminado";
                        }
                        tomarDatos(e, mensaje);
                    });
                }
                divPanel.append(divDatos);
            })
            .catch(error => {
                console.error('Error al crear el formulario:', error);
            });
    }
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
                let formularioCorrecto = validarFormularioInput('formulario-registro');
                if(formularioCorrecto){
                    let form = document.querySelector("#formulario-registro");
                    await actualizarDatos(form, tipoTabla, id);
                    swal('Datos actualizados correctamente','','success');
                }else{
                    swal('Algo salio mal','Llena los campos correspondientes','error');
                }
                
            });
        }

        divPanel.append(divDatos);
    } catch (error) {
        console.error('Error al llenar el formulario:', error);
    }
}



async function crearFormularioLlenado(campos, datos) {
    let formulario = `<form id="formulario-registro" name="formulario-registro">`;


    for (const campo of campos) {
        const textoLabel = formatText(campo);

        formulario += `<label for="${campo}">${textoLabel}</label>`;

        let posicion = campo.toUpperCase();


        if (campo === 'fecha') {
            formulario += `<input type="date" name="${campo}" id="${campo}" value="${datos[posicion] || ''}">`;
        } else if (campo === 'Tipo') {
            const opciones = [["_mp", "Materia prima"], ["_pt", "Producto terminado"]];

            formulario += generateSelectField(campo, opciones, tipoTabla);
        } else if (campo === 'Unidad_de_medida') {
            const opciones = [['Gramos', 'Gramos'], ['Pieza', 'Pieza']];
            formulario += generateSelectField(campo, opciones, datos[posicion]);
        } else if (campo === 'Id_proveedor' || campo === 'Id_categoria') {
            //AQUI ES CUANDO QUIERO CONSEGUIR LOS ELEMENTOS DEL SELECT DEPENDIENDO QUE TABLA SEA
            let tabla;
            if (campo === 'Id_proveedor') {
                tabla = 'proveedor';
            } else if (campo === 'Id_categoria') {
                tabla = opcionInventarioSeleccionada === 'editar_materia_prima' ? 'categoria_mp' : 'categoria_pt';
            }

            try {
                const datosSelect = await obtenerDatos(tabla);
                console.log(datosSelect)
                const selectHTML = generateSelectField(campo, datosSelect, datos[posicion]);
                formulario += selectHTML;
            } catch (error) {
                console.error(`Error al obtener datos de ${tabla}:`, error);
            }
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}" value="${datos[posicion] || ''}">`;
        }
    }

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}


async function tomarDatos(e, mensaje) {
    e.preventDefault();
    let formularioCorrecto = validarFormularioInput('formulario-registro');
    if(formularioCorrecto){
        const form = document.querySelector("#formulario-registro");
        console.log(tipoTabla);
        ponerDatos(form, tipoTabla);
        swal(`${mensaje} se ha guardado correctamente`, '', 'success');
    }else{
        swal('Algo salio mal', 'Llena todos los campos', 'error');
    }
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


function ponerDatos(form, tipoTabla) {
    const form_data = new FormData(form);
    const data = new URLSearchParams(form_data);

    console.log(data);

    if (tipoTabla === 'almacen_mp' && accionTabla === 'agregar') {
        tipoTabla = 'actualizar_almacen';
    } else if (tipoTabla === 'almacen_pt' && accionTabla === 'agregar') {
        tipoTabla = 'actualizar_almacen_pt';
    }

    const camposExcluidos = ['Tipo'];

    form_data.forEach((campo,tipo) => {
        if(tipo === 'Tipo'){
            tipoTabla = 'categoria'+campo;
        }
    })

    
    camposExcluidos.forEach((campo,valor) => {
        form_data.delete(campo);
    });

    console.log(tipoTabla);

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
            if(tipoTabla === 'actualizar_almacen' || tipoTabla === 'actualizar_almacen_pt'){
                swal('No hay suficiente cantidad en el almacen', '', 'error');
            }
            console.error(error); // Agregar esta línea para ver el error en la consola
        });
}


function agregarModal(id) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    console.log(id);
    modal.innerHTML = `
        <div class="modal-content">
            <p>Se han guardado correctamente los cambios<br>La materia prima tendra el ID ${id}</p>
            <button>Cerrar</button>
        </div>
    `;

    // Agregar el modal al cuerpo del documento
    document.body.appendChild(modal);

    // Manejar el evento para cerrar el modal
    const closeModalBtn = modal.querySelector('button');
    closeModalBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}



function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form" name="nav">';
    campos.forEach(campo => {
        let titulo = formatText(campo);
        let input = `<input type="text" name="${campo}" id="${campo}" class=""></input>`
        if (tipoTabla === 'categoria') {
            input = generateSelectField(campo, [['_mp', 'Materia prima'], ['_pt', 'Producto terminado']])
        }
        formulario += `
        <label for="${campo}">${titulo}</label>
        ${input}
        <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    });

    formulario += '</form>';
    return formulario;
}

async function crearFormulario(campos) {
    let formulario = `<form id="formulario-registro" name="formulario-registro">`;

    for (let campo of campos) {
        const textoLabel = formatText(campo);

        if (tipoTabla === 'almacen_mp' && campo === 'Id_materia_prima' && accionTabla === 'agregar') {
            campo = "ID_MP";
        } else if (tipoTabla === 'almacen_pt' && campo === 'Id_producto' && accionTabla === 'agregar') {
            campo = "ID_PT";
        }

        formulario += `<label for="${campo}">${textoLabel}</label>`;
        if(campo === 'Precio_de_compra' || campo === 'Precio_venta'){
            formulario += `<input type="number" name="${campo}" id="${campo}">`;
        }else if (campo === 'fecha') {
            formulario += `<input type="date" name="${campo}" id="${campo}">`;
        } else if (campo === 'Tipo') {
            formulario += generateSelectField(campo, [["_mp", "Materia prima"], ["_pt", "Producto terminado"]]);
        } else if (campo === 'Tipo_movimiento') {
            const opciones = [["ENTRADA", "Entrada"], ["SALIDA", "Salida"]];
            formulario += generateSelectField(campo, opciones, tipoTabla);
        } else if (campo === 'Unidad_de_medida') {
            formulario += generateSelectField(campo, [['Gramos', 'Gramos'], ['Pieza', 'Pieza']]);
        } else if (campo === 'Id_proveedor' || campo === 'Id_categoria' || campo === "ID_MP" || campo === 'Id_materia_prima' || campo === 'ID_PT' || campo === 'Id_producto') {
            let tabla;
            if (campo === 'Id_proveedor') {
                tabla = 'proveedor';
            } else if (campo === 'Id_categoria') {
                if (opcionInventarioSeleccionada === 'agregar_materia_prima') {
                    tabla = 'categoria_mp';
                } else {
                    tabla = 'categoria_pt';
                }
            } else if (campo === 'ID_MP') {
                tabla = 'materia_prima';
                campo = 'Id_materia_prima';
            } else if (campo === 'ID_PT') {
                tabla = 'producto_terminado';
                campo = 'Id_producto';
            }

            try {
                const datosSelect = await obtenerDatos(tabla);
                const selectHTML = generateSelectField(campo, datosSelect);
                formulario += selectHTML;
            } catch (error) {
                console.error(`Error al obtener datos de ${tabla}:`, error);
            }
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}">`;
        }
    }

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}




function formatText(text) {
    // Paso 1: Reemplazar guiones bajos con espacios
    let formattedText = text.replace(/_/g, ' ');

    // Paso 2: Capitalizar la primera letra
    formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

    return formattedText;
}

// Función para generar el HTML de un campo de selección
function generateSelectField(fieldName, options, selectedValue) {
    if (fieldName === 'Id_materia_prima' && tipoTabla === 'almacen_mp' && accionTabla === 'agregar') {
        fieldName = 'Id_mp';
    } else if (fieldName === 'Id_producto' && tipoTabla === 'almacen_pt' && accionTabla === 'agregar') {
        fieldName = 'Id_pt';
    }
    let selectHTML = `<select id="${fieldName}" name="${fieldName}">
        <option value="" disabled selected>Selecciona uno</option>`;

    if (selectedValue === 'categoria_mp') {
        selectedValue = "_mp";
    } else if (selectedValue === 'categoria_pt') {
        selectedValue = "_pt";
    }

    console.log(selectedValue)

    for (const option of options) {
        selectHTML += `<option value="${option[0]}" ${selectedValue === option[0] ? 'selected' : ''}>${option[1]}</option>`;
    }

    selectHTML += '</select>';
    return selectHTML;
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