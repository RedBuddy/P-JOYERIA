let opcionesCompra = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let divPanel = document.querySelector('.panel');
let opcionCompraSeleccionada;
let tipoTabla;
let accionTabla;
let productosComprasAcumuladas = [];
let objetoForm;
let cantidadMinimaPagar;
let limiteCredito = [];
let elementoEncontrado;

//Verificacion de permiso para el subsistema
import { verificar_permiso_subsistema, verificar_permiso_modulo, contenido_denegado } from "./loggin.js";
let nombreHtml = window.location.pathname.split("/").pop();
const nivel_acceso = localStorage.getItem('nivel_acceso');

if (!verificar_permiso_subsistema(nivel_acceso, nombreHtml.split('.')[0])) {
    contenido_denegado();
}
//

opcionesCompra.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        cambiarColor(e);
        limpiarHMTL();
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('registrar_compra')) {
            opcionCompraSeleccionada = 'registrar_compra';
            accionTabla = 'agregar';
            tipoTabla = 'materia_prima';
        } else if (opcionSeleccionada.contains('historial_compra')) {
            opcionCompraSeleccionada = 'historial_compra';
            tipoTabla = 'compra';
            accionTabla = 'consultar';
        } else if (opcionSeleccionada.contains('registrar_abono')) {
            opcionCompraSeleccionada = 'registrar_abono';
            tipoTabla = 'compra';
            accionTabla = 'agregar';
        }else if (opcionSeleccionada.contains('detalle_compra')) {
            console.log('hola');
            opcionCompraSeleccionada = 'detalle_compra';
            tipoTabla = 'detalle_compra';
            accionTabla = 'consultar';
          }
        pintarHtml();
    });
});

function pintarHtml() {
    limpiarHMTL();
    objetoForm = {};
    let campos, thTabla;
    let divDatos = document.createElement('div');
    if (opcionCompraSeleccionada === 'registrar_compra') {
        campos = ["Id_proveedor"];
        productosComprasAcumuladas = [];
        API(divDatos, campos);
    } else if (opcionCompraSeleccionada === 'historial_compra') {
        campos = ["Tipo_compra"];
        thTabla = ["ID", "FECHA", "MONTO_TOTAL", "MONTO_PAGADO", "ESTATUS", "NUMERO_MENSUALIDADES", "MONTO_MENSUALIDAD", "FECHA_PROXIMO_PAGO"]
        API(divDatos, campos, thTabla);
    } else if (opcionCompraSeleccionada === 'registrar_abono') {
        campos = ["Id"];
        API(divDatos, campos, thTabla);
    }else if(opcionCompraSeleccionada === 'detalle_compra'){
        console.log('hola');
        thTabla = ["ID_COMPRA","ID_MATERIA_PRIMA","CANTIDAD"];
        API(divDatos, campos,  thTabla);
      }
}

async function API(divDatos, campos, thTabla) {
    console.log(thTabla);
    if (accionTabla === 'agregar' && opcionCompraSeleccionada === 'registrar_compra') {
        let div = document.createElement('div');
        div.classList.add('form-datos');
        div.innerHTML = await crearFormularioNav(campos);
        divPanel.append(div);
        let btnRegistrar = document.querySelector('.form-datos form input[type="submit"]');
        btnRegistrar.addEventListener('click', async (e) => {
            e.preventDefault();
            let formularioCorrecto = validarFormularioInput('nav');
            if (formularioCorrecto) {
                let valor = document.querySelector('.form-datos form select').value;
                objetoForm = {};
                objetoForm["Id_proveedor"] = valor;
                console.log(valor);
                limpiarHMTL();
                campos = ["Id_materia_prima"];
                console.log(campos);
                let div = document.createElement('div');
                div.classList.add('form-datos');
                console.log(await crearFormularioNav(campos));
                div.innerHTML = await crearFormularioNavCurioso(campos);
                if (opcionCompraSeleccionada === 'registrar_compra') {
                    div.innerHTML += `<ul id="product"></ul> `;
                }
                let prod = await obtenerDatos('materia_prima');

                
                elementoEncontrado = limiteCredito.filter(item => item.ID === parseInt(valor));
                
                let productos = prod.filter(item => item.ID_PROVEEDOR === parseInt(valor));

                
                divPanel.append(div);//aqui yo tengo eso

                

                const divDatosVenta = document.createElement('div');

                divDatosVenta.classList.add('tablas');
                divPanel.append(construirTabla(divDatosVenta, productosComprasAcumuladas, ["ID", "NOMBRE", "PRECIO", "UNIDAD", "CANTIDAD", " + ", " - "]));
                //aqui
                campos = ["Tipo_compra", "Monto_total"];
                construirFormVenta(campos);

                let input = document.querySelector('.panel form input[type="text"]');
                input.addEventListener('input', (e) => {
                    autocompletarProductos(productos);
                });

                let btnEnviar = document.querySelector('.panel form input[type="submit"]');

                btnEnviar.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (input.value > 0) {
                        let objetoEncontrado = productos.find(objeto => objeto.ID === parseInt(input.value));
                        if(objetoEncontrado === undefined || objetoEncontrado === null){
                            swal("El producto no se encuentra en el almacen",'','error');
                        }
                        agregarProductoAcumulado(objetoEncontrado);
                        let tabla = construirTabla(divDatosVenta, productosComprasAcumuladas, ["ID", "NOMBRE", "PRECIO", "UNIDAD", "CANTIDAD", " + ", " - "], productos);
                        divPanel.append(tabla);
                        colocarTotal();
                    } else {
                        swal("Oops", "Por favor, llena el campo correctamente", "error");
                    }})
        

            } else {
                swal("Algo salio mal", "Elige al proveedor", "error");
            }
        })



    } else if(accionTabla === 'consultar' && opcionCompraSeleccionada === 'detalle_compra'){
        let datos = await obtenerDatos(tipoTabla);
        divPanel.append(divDatos);
        divPanel.append(construirTablas(datos, thTabla));
        $('.tabla').DataTable({
            lengthChange: false,
            info: false,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }, "pageLength": 7
        });
  }else if (accionTabla === 'consultar') {
        let div = document.createElement('div');
        div.classList.add('form-datos');
        div.innerHTML = await crearFormularioNav(campos);
        divPanel.append(div)
        divDatos.classList.add('tablas');
        let datos = await obtenerDatos(tipoTabla);
        let btnRegistrar = document.querySelector('.form-datos form input[type="submit"]');
        btnRegistrar.addEventListener('click', async (e) => {
            e.preventDefault();
            let formularioCorrecto = validarFormularioInput('nav');
            if (formularioCorrecto) {
                let valor = document.querySelector('.form-datos form select').value;
                if (valor === 'Contado') {
                    thTabla = ["ID", "FECHA", "MONTO_TOTAL"];
                } else {
                    thTabla = ["ID", "MONTO_TOTAL", "MONTO_PAGADO", "ESTATUS","FECHA" , "FECHA_PROXIMO_PAGO"]
                }
                //REMOVER EL ELEMENTO
                let quitarTabla = document.querySelector('.panel .tablas .no-footer');
                if (quitarTabla) {
                    quitarTabla.remove();
                }

                divPanel.append(divDatos);
                divPanel.append(await construirTabla(divDatos, datos, thTabla, null, valor));
                console.log(datos);
                $('.tabla').DataTable({
                    lengthChange: false,
                    info: false,
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                    }, "pageLength": 7,
                    "autoWidth": true
                });
            } else {
                swal("Algo salio mal", "Elige el tipo de compra correctamente", "error");
            }
        })

    } else if (accionTabla === 'agregar' && opcionCompraSeleccionada === 'registrar_abono') {
        let div = document.createElement('div');
        div.classList.add('form-datos');
        div.innerHTML = await crearFormularioNav(campos);
        divPanel.append(div);

        let input = document.querySelector('.panel .form-datos input');

        let btnBuscar = document.querySelector('.panel .form-datos input[type="submit"]');
        btnBuscar.addEventListener('click', async (e) => {
            e.preventDefault();
            let formularioCorrecto = validarFormularioInput('nav');
            if (formularioCorrecto) {
                limpiarHMTL();
                let datosVenta = await obtenerDatos('compra', input.value);
                console.log(datosVenta);
                campos = ["Monto_total", "Monto_pagado", "Fecha_proximo_pago", "Monto_mensualidad"];

                let divDatos = document.createElement('div');
                divDatos.classList.add('tablas');
                divPanel.append(divDatos);

                construirFormVenta(campos, datosVenta, input.value);
            } else {
                swal('Algo salio mal', 'Llena el campo correspondiente', "error");
            }
        })
    }
}

function construirTablas(datos, thTabla) {
    let quitarTabla = document.querySelector('.panel .tablas .tabla');
    if (quitarTabla) {
        quitarTabla.remove();
    }else{
        console.log('hola');
    }
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
                if (columna === 'FECHA') {
                    if (fila[columna]) {
                        let fechaAPI = fila[columna];
                        // Obtener solo la parte de la fecha con slice
                        let fechaFormateada = fechaAPI.slice(0, 10);
                        td.textContent = fechaFormateada;
                    }
                }else{
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

function colocarTotal() {
    let inputTotal = document.querySelector('.panel .tablas .formulario #formulario-registro #Monto_total');
    let sumaTotal = 0;


    productosComprasAcumuladas.forEach(producto => {
        if ((producto.UNIDAD_MEDIDA === 'Gramos' || producto.UNIDAD_MEDIDA === 'GRAMOS' || producto.UNIDAD_MEDIDA === 'Centimetros' )) {
            sumaTotal += parseInt(producto.PRECIO) * (parseInt(producto.CANTIDAD) / 100);
        } else {
            sumaTotal += parseInt(producto.PRECIO) * parseInt(producto.CANTIDAD);
        }
    })
    inputTotal.value = sumaTotal;
}

function construirFormVenta(campos, datosVenta, id) {
    if (opcionCompraSeleccionada === 'registrar_compra') {
        tipoTabla = 'proveedor';
    } else {
        productosComprasAcumuladas = datosVenta;
    }
    crearFormularioLlenado(campos, productosComprasAcumuladas, id)
        .then(formularioHTML => {
            let divPane = document.querySelector('.panel .tablas');
            let divDatos = document.createElement('div');

            divDatos.classList.add('formulario');
            divDatos.innerHTML += formularioHTML;
            divPane.append(divDatos);

            let btnRegistrar = document.querySelector('.formulario #formulario-registro #registrar');
            btnRegistrar.addEventListener('click', (e) => {
                e.preventDefault();
                let form = document.getElementById('formulario-registro');
                if (opcionCompraSeleccionada === 'registrar_compra') {
                    validarFormulario(form);
                } else {
                    let montoAbonado = document.getElementById('Monto_mensualidad').value;
                    const fecha = new Date();
                    const formatoFecha = fecha.toISOString().slice(0, 10);
                    objetoForm["Id_compra_credito"] = id;
                    objetoForm["Monto_abono"] = montoAbonado;
                    objetoForm["Fecha_abono"] = formatoFecha;
                    let formularioCorrecto = validarFormularioInput('formulario-compra');
                    if (formularioCorrecto) {
                        console.log(montoAbonado, cantidadMinimaPagar);
                        if (parseInt(montoAbonado) < parseInt(cantidadMinimaPagar)) {
                            swal('Algo salio mal', 'La cantidad de monto abonado es incorrecta', 'error');
                        } else {
                            swal('Abono registrado correctamente', 'El abono ha sido registrado', 'success');
                            ponerDatos();
                        }
                    } else {
                        swal('Algo salio mal', 'Llena correctamente la cantidad de monto abonado', 'error');

                    }
                }

            })
        })
        .catch(error => {
            console.error('Error al crear el formulario:', error);
        });
}

function construirTabla(div, datos, thTabla, productosAVender, tipoVenta) {
    let quitarTabla = document.querySelector('.panel .tablas .tabla');
    if (quitarTabla) {
        quitarTabla.remove();
    }
    console.log(tipoVenta);
    if (tipoVenta === 'Contado') {
        datos = datos.filter(function (objeto) {
            return objeto.TIPO_COMPRA === "Contado";
        });
    } else if (tipoVenta === 'Credito') {
        datos = datos.filter(function (objeto) {
            return objeto.TIPO_COMPRA === "Credito";
        });
    }
    const tabla = document.createElement('table');
    tabla.classList.add('tabla');

    // Encabezado de la tabla
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    console.log(thTabla);
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

    if (datos && Array.isArray(datos) && datos.length > 0) {
        datos.forEach(objeto => {
            const tr = document.createElement('tr');
            thTabla.forEach((columna) => {
                console.log(objeto);
                const td = document.createElement('td');
                if (columna === 'FECHA' || columna === 'FECHA_PROXIMO_PAGO') {

                    if (objeto[columna]) {
                        console.log(objeto[columna]);
                        let fechaAPI = objeto[columna];
                        // Obtener solo la parte de la fecha con slice
                        let fechaFormateada = fechaAPI.slice(0, 10);
                        td.textContent = fechaFormateada;
                    }
                } else if (columna === 'UNIDAD') {
                    td.textContent = objeto.UNIDAD_MEDIDA;
                } else {
                    td.textContent = objeto[columna];
                }
                if (columna === ' - ') {
                    td.classList.add('eliminar');
                } else if (columna === ' + ') {
                    td.classList.add('agregar');
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

    div.insertBefore(tabla, div.firstChild);

    console.log(productosAVender);

    tabla.addEventListener('click', (e) => {
        aumentarEliminar(e, productosAVender);
    })

    // Limpiar y añadir la tabla al contenedor
    return div;
}

function aumentarEliminar(e, productosAVender) {

    let divDatosVenta = document.querySelector('.panel .tablas')

    if (e.target.classList.contains('agregar') || e.target.classList.contains('eliminar')) {
        let idSeleccionado = parseInt(e.target.parentElement.firstChild.textContent);

        // Buscar el producto en productosComprasAcumuladas
        let productoEncontrado = productosComprasAcumuladas.find(producto => producto.ID === idSeleccionado);
        if (productoEncontrado) {
            // Si el producto ya existe, incrementar la cantidad
            if (e.target.classList.contains('agregar')) {
                if (productoEncontrado.UNIDAD_MEDIDA === 'GRAMOS' || productoEncontrado.UNIDAD_MEDIDA === 'Gramos' || productoEncontrado.UNIDAD_MEDIDA === 'Centimetros') {
                    productoEncontrado.CANTIDAD += 100;
                } else {
                    productoEncontrado.CANTIDAD++;
                }
            } else if (e.target.classList.contains('eliminar')) {
                if (productoEncontrado.UNIDAD_MEDIDA === 'GRAMOS' || productoEncontrado.UNIDAD_MEDIDA === 'Gramos' || productoEncontrado.UNIDAD_MEDIDA === 'Centimetros') {
                    productoEncontrado.CANTIDAD -= 100;
                } else {
                    productoEncontrado.CANTIDAD--;
                }
            }
        }
        if (productoEncontrado.CANTIDAD === 0) {
            //quitarEsaFila
            productosComprasAcumuladas = productosComprasAcumuladas.filter(producto => producto.ID !== idSeleccionado);
            divPanel.append(construirTabla(divDatosVenta, productosComprasAcumuladas, ["ID", "NOMBRE", "PRECIO", "UNIDAD", "CANTIDAD", " + ", " - "]));
        }
        e.target.parentElement.children[4].textContent = productoEncontrado.CANTIDAD;
    }
    colocarTotal();
}

async function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form" name="nav" autocomplete="off">';

    for (const campo of campos) {
        let titulo = formatText(campo);
        let input = `<input type="number" name="${campo}" id="${campo}" class=""></input>`;

        if (campo === 'Tipo_compra') {
            const opciones = [['Contado', 'Contado'], ['Credito', 'Credito']];
            input = generateSelectField(campo, opciones);
        } else if (campo === 'Id_proveedor') {
            let tabla = 'proveedor';

            try {
                const datosSelect = await obtenerDatos(tabla);
                console.log(datosSelect);
                input = generateSelectField(campo, datosSelect);
                console.log(input);
            } catch (error) {
                // Manejo de errores aquí
                console.error(error);
            }
        }

        formulario += `
          <label>${titulo}</label>
          ${input}
          <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    }

    formulario += '</form>';
    return formulario;
}

async function crearFormularioNavCurioso(campos) {
    let formulario = '<form action="" class="form" name="nav" autocomplete="off">';

    for (const campo of campos) {
        let titulo = formatText(campo);
        let input = `<input type="text" name="${campo}" id="${campo}" class=""></input>`;

        if (campo === 'Tipo_compra') {
            const opciones = [['Contado', 'Contado'], ['Credito', 'Credito']];
            input = generateSelectField(campo, opciones);
        } else if (campo === 'Id_proveedor') {
            let tabla = 'proveedor';

            try {
                const datosSelect = await obtenerDatos(tabla);
                console.log(datosSelect);
                input = generateSelectField(campo, datosSelect);
                console.log(input);
            } catch (error) {
                // Manejo de errores aquí
                console.error(error);
            }
        }

        formulario += `
          <label>${titulo}</label>
          ${input}
          <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    }

    formulario += '</form>';
    return formulario;
}


function formatText(text) {
    // Paso 1: Reemplazar guiones bajos con espacios
    let formattedText = text.replace(/_/g, ' ');

    // Paso 2: Capitalizar la primera letra
    formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

    return formattedText;
}

function obtenerDatos(tipoTabla, id) {
    return new Promise((resolve, reject) => {
        const arregloDatos = [];

        if (id) {
            tipoTabla = `${tipoTabla}/${id}`;
        }
        console.log(tipoTabla)
        console.log(`Enviando solicitud a http://localhost:3000/${tipoTabla}`);

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
                if (id) {
                    resolve(data);
                } else {
                    data.forEach(item => {
                        if (tipoTabla === 'proveedor') {
                            const cadena = `${item.NOMBRE}`;
                            arregloDatos.push([item.ID, cadena, item.LIMITE_DE_CREDITO]);
                        } else {

                            arregloDatos.push(item);
                        }
                    });
                    if(tipoTabla === 'proveedor'){
                        limiteCredito = data;
                    }
                    resolve(arregloDatos);
                }
            })
            .catch(error => {
                // Rechazar la promesa en caso de error
                reject(error);
            });
    });
}

function agregarProductoAcumulado(producto) {
    // Verificar si el producto ya está en el array acumulado
    const productoExistenteIndex = productosComprasAcumuladas.findIndex(p => p.ID === producto.ID);



    if (productoExistenteIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        productosComprasAcumuladas[productoExistenteIndex].CANTIDAD++;
    } else {
        console.log(producto.ID);
        
        const productoAcumulado = {
            ID: producto.ID,
            NOMBRE: producto.NOMBRE,
            PRECIO: producto.PRECIO_DE_COMPRA,
            UNIDAD_MEDIDA: producto.UNIDAD_DE_MEDIDA
        };

        if (producto.UNIDAD_DE_MEDIDA === 'Gramos' || producto.UNIDAD_DE_MEDIDA === 'GRAMOS' || producto.UNIDAD_DE_MEDIDA === 'Centimetros') {
            productoAcumulado.CANTIDAD = 100;
        } else {
            productoAcumulado.CANTIDAD = 1;
        }

        console.log(productoAcumulado);

        productosComprasAcumuladas.push(productoAcumulado);
    }

    // Actualizar la tabla con los productos acumulados
    console.log(productosComprasAcumuladas);
}


//REFERENTE SELECT
async function autocompletarProductos(datos) {
    // Obtén el valor del input de búsqueda
    let searchInput = document.getElementById("Id_materia_prima");
    let term = searchInput.value.toLowerCase(); // Suponemos que la búsqueda es sensible a mayúsculas/minúsculas

    let productos = []

    datos.forEach(producto => {
        console.log(producto)
        productos.push({ id: producto.ID.toString(), nombre: producto.NOMBRE, categoria: producto.ID_CATEGORIA.toString() });
    })

    // Aquí podrías realizar una solicitud al servidor para obtener los productos
    // En este ejemplo, utilizamos un array simulado de productos


    // Filtra los productos por coincidencia en el nombre o categoría
    let productosFiltrados = productos.filter(function (producto) {
        return producto.nombre.toLowerCase().includes(term) || producto.categoria.toLowerCase().includes(term) || producto.id.toLowerCase().includes(term);
    });

    // Muestra los productos en la lista
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(productos) {
    let lista = document.getElementById("product");
    lista.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

    productos.forEach(function (producto) {
        let item = document.createElement("li");
        item.textContent = producto.nombre;
        item.setAttribute("data-id", producto.id); // Agrega el ID del producto como atributo de datos
        item.addEventListener("click", seleccionarProducto);
        lista.appendChild(item);
    });

    // Muestra la lista debajo del input
    lista.style.display = productos.length > 0 ? "block" : "none";


}

function seleccionarProducto(event) {
    let selectedProductId = event.currentTarget.getAttribute("data-id");
    // Haz lo que necesites con el ID del producto seleccionado
    let input = document.querySelector('.panel form input[type="text"]');
    input.value = selectedProductId;
    document.getElementById("product").style.display = "none";
}

// Oculta la lista si se hace clic fuera del input y la lista
document.addEventListener("click", function (event) {
    let productListRegistrarVenta = document.getElementById("product");
    if (productListRegistrarVenta && event.target !== productListRegistrarVenta && event.target !== document.getElementById("Id_materia_prima")) {
        productListRegistrarVenta.style.display = "none";
    }
});

function limpiarHMTL() {
    let opciones = ['form-datos', 'almacen-mp', 'form', 'tabla', 'tablas', 'no-footer'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}


//CREAR FORMULARIO
async function crearFormularioLlenado(campos, datos) {
    let formulario = `<form id="formulario-registro" name="formulario-compra" autocomplete="off">`;

    console.log(datos)
    for (const campo of campos) {
        const textoLabel = formatText(campo);

        formulario += `<label for="${campo}">${textoLabel}</label>`;

        let posicion = campo.toUpperCase();
        let fechaFormateada;
        if (campo === 'Fecha' || campo === 'Fecha_proximo_pago') {
            let fechaAPI = datos[posicion];
            // Obtener solo la parte de la fecha con slice
            fechaFormateada = fechaAPI.slice(0, 10);
        }

        if (campo === 'Id_proveedor') {
            let tabla = 'proveedor';

            try {
                const datosSelect = await obtenerDatos(tabla);
                const selectHTML = generateSelectField(campo, datosSelect, datos[posicion]);
                formulario += selectHTML;
            } catch (error) {
                console.error(`Error al obtener datos de ${tabla}:`, error);
            }
        } else if (campo === 'Tipo_compra') {
            const opciones = [['Contado', 'Contado'], ['Credito', 'Credito']];
            formulario += generateSelectField(campo, opciones);
        } else if (campo === 'Monto_total') {
            formulario += `<input type="text" name="${campo}" id="${campo}"  value="${datos[posicion] || ''}" disabled>`;
        } else if (campo === 'Fecha_de_venta' || campo === 'Fecha_proximo_pago') {
            formulario += `<input type="date" name="${campo}" id="${campo}" value="${fechaFormateada || ''}" disabled >`
        } else if (campo === 'Monto_pagado') {
            formulario += `<input  type="number" name="${campo}" id="${campo}" value="${datos[posicion]}" disabled>`;
        } else if (campo === 'Monto_mensualidad') {
            cantidadMinimaPagar = datos[posicion];
            formulario += `<input type="number" name="${campo}" id="${campo}" placeholder="La cantidad minima a pagar es de ${datos[posicion]}" min="${datos[posicion]}">`;
        }
        else {
            formulario += `<input  type="text" name="${campo}" id="${campo}" value="${datos[posicion] || ''}" >`;
        }
    }

    formulario += '<button type="submit" id="registrar">Registrar</button></form>';
    return formulario;
}

function generateSelectField(fieldName, options, selectedValue) {
    let selectHTML = `<select id="${fieldName}" name="${fieldName}">
      <option value="" disabled selected>Selecciona uno</option>`;


   

    for (const option of options) {
        selectHTML += `<option value="${option[0]}" ${selectedValue === option[0] ? 'selected' : ''}>${option[1]}</option>`;
    }

    selectHTML += '</select>';


    return selectHTML;
}

function validarFormulario(form) {
    let objetoParaApi = constructorObjetoProducto();
    objetoForm["DetallesCompraJSON"] = objetoParaApi;
    objetoForm = objetosForm(form, objetoForm);
    const fecha = new Date();
    const formatoFecha = fecha.toISOString().slice(0, 10);
    objetoForm.Fecha_de_compra = formatoFecha;
    console.log(objetoForm);
    let tipoElegido = document.getElementById('Tipo_compra').value;


    if (tipoElegido === 'Credito') {
        objetoForm["Monto_pagado"] = 0.00;
        objetoForm["Estatus"] = 'No pagado';
        objetoForm["Mensualidades_pagadas"] = 0;
        agregarModal();
    } else {
        let formularioCorrecto = validarFormularioInput('formulario-compra');
        if (formularioCorrecto) {
            ponerDatos();
            swal("Compra registrada", ``, "success");
        } else {
            swal('Oops', 'Llena los datos de la compra correctamente', 'error');
        }
    }
}

function agregarModal() {
    // Crear el modal
    const modal = document.createElement('div');
    modal.classList.add('modal', 'formulario');
    modal.innerHTML = `
  <div class="modal-content-ya">
    <form class="formulario-registro" name="formulario-compra-credito" autocomplete="off">
      <label for="plazoOptions">Plazo de Crédito:</label>
      <select id="Numero_mensualidades" name="Numero_mensualidades">
        <option value="">Selecciona uno</option>
        <option value="3">3 meses</option>
        <option value="4">4 meses</option>
        <option value="5">5 meses</option>
        <option value="6">6 meses</option>
        <option value="7">7 meses</option>
        <option value="8">8 meses</option>
        <option value="9">9 meses</option>
        <option value="10">10 meses</option>
        <option value="11">11 meses</option>
        <option value="12">12 meses</option>
      </select>

      

      <!-- Agregar campo de fecha -->
      <label for="fechaInicioPago">Fecha de inicio de pago:</label>
      <input type="date" id="Fecha_proximo_pago" name="Fecha_proximo_pago">

      
      <label for="mensualidad">Mensualidad:</label>
      <input id="Monto_mensualidad" name="Monto_mensualidad" type="text"> 
      <button type="button" onclick="cerrarModal()" id="cerrar">Cerrar</button>
      <button type="button" id="registrarCompra"> Registrar </button>
    </form>
  </div>
`;
    // Agregar el modal al cuerpo del documento
    document.body.appendChild(modal);



    // Manejar el evento para cerrar el modal
    const closeModalBtn = document.getElementById('cerrar');
    closeModalBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });


    const btnRegistrar = document.getElementById('registrarCompra');
    console.log(btnRegistrar)
    btnRegistrar.addEventListener('click', () => {
        let formularioCorrecto = validarFormularioInput('formulario-compra-credito');
        if (formularioCorrecto) {
            ventaCredito();
            if(parseInt(objetoForm["Monto_total"]) < elementoEncontrado[0].LIMITE_DE_CREDITO){

                ponerDatos();
                swal("Compra registrada", ``, "success");
            }else{
                swal("El credito que te ofrece el proveedor es menor al solicitado",'','error');
            }
        } else {
            swal('Oops', 'Llena correctamente todos los campos', 'error');
        }
    })
}


function ventaCredito() {
    let form = document.querySelector('.formulario-registro');
    console.log(form);
    objetoForm = objetosForm(form);
}

function constructorObjetoProducto() {
    const productosTransformados = productosComprasAcumuladas.map(producto => {
        return {
            "IdMateria": producto.ID,
            "Cantidad": producto.CANTIDAD
        };
    });
    return JSON.stringify(productosTransformados);
}

function objetosForm(form) {
    const elements = form.elements;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Solo considerar elementos con name (inputs y selects)
        if (element.name) {
            objetoForm[element.name] = element.value;
        }
    }

    return objetoForm;
}

async function ponerDatos() {
    console.log(objetoForm);
    if (opcionCompraSeleccionada === 'registrar_compra') {
        tipoTabla = 'RegistrarCompraConDetalles';
    } else if (opcionCompraSeleccionada === 'registrar_abono') {
        tipoTabla = 'registrar_abono_compra';
    }
    console.log(`Enviando solicitud a http://localhost:3000/${tipoTabla}`);


    fetch(`http://localhost:3000/${tipoTabla}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objetoForm)
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
            swal('El credito con el proveedor se ve excedido', '', 'error');
            console.error(error); // Agregar esta línea para ver el error en la consola
        });
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
