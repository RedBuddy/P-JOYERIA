let opcionesInformes = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelInformes = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionInformeSeleccionada;
let tipoTabla;
let accionTabla;
let apiResult;

//Verificacion de permiso para el subsistema
import { verificar_permiso_subsistema, verificar_permiso_modulo, contenido_denegado } from "./loggin.js";
let nombreHtml = window.location.pathname.split("/").pop();
const nivel_acceso = localStorage.getItem('nivel_acceso');

if (!verificar_permiso_subsistema(nivel_acceso, nombreHtml.split('.')[0])) {
    contenido_denegado();
}
//

opcionesInformes.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelInformes)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('productos_top')) {
            opcionInformeSeleccionada = 'productos_top';
        } else if (opcionSeleccionada.contains('ventas_fecha')) {
            opcionInformeSeleccionada = 'ventas_fecha';
        } else if (opcionSeleccionada.contains('clientes_frecuentes')) {
            opcionInformeSeleccionada = 'clientes_frecuentes';
        } else if (opcionSeleccionada.contains('factura')) {
            opcionInformeSeleccionada = 'factura';
        }
        pintarHtml();
    });
});

async function pintarHtml() {
    let campos, thTabla;
    let divDatos = document.createElement('div');

    if (opcionInformeSeleccionada === 'productos_top') {
        let productosMasVendidos = await ponerDatosA('obtenerProductosMasVendidos');
        construirGrafica(divDatos, productosMasVendidos);
    } else if (opcionInformeSeleccionada === 'clientes_frecuentes') {
        let clientes = await ponerDatosA('obtenerClientesFrecuentes');
        construirGrafica(divDatos, clientes);
    } else if (opcionInformeSeleccionada === 'ventas_fecha') {
        campos = ["Fecha_inicio", "Fecha_fin"];
        crearFormulario(campos).then(formularioHTML => {
            divDatos.innerHTML = formularioHTML;
            divDatos.classList.add('formulario');

            // Agregar un manejador de eventos al formulario solo si hay un formulario HTML
            let btnRegistrar = divDatos.querySelector('#formulario-registro button');
            if (btnRegistrar) {
                btnRegistrar.addEventListener('click', (e) => {
                    e.preventDefault();
                    tomarDatos(e);
                });
            }
            divPanel.append(divDatos);
        })
            .catch(error => {
                console.error('Error al crear el formulario:', error);
            });
    } else if (opcionInformeSeleccionada === 'factura') {
        campos = ["Id_venta"];
        API(divDatos, campos);
    }
}

async function API(divCampos, campos) {
    let div = document.createElement('div');
    div.classList.add('form-datos');
    div.innerHTML = await crearFormularioNav(campos);
    divPanel.append(div);
    let btnRegistrar = document.querySelector('.form-datos form input[type="submit"]');
    btnRegistrar.addEventListener('click', async (e) => {
        e.preventDefault();
        let formularioCorrecto = validarFormularioInput('nav');
        if (formularioCorrecto) {
            let form = document.querySelector('.form-datos form');
            console.log(form);
            apiResult = await ponerDatos(form, 'obtenerDetalleVenta');
            let idCliente = apiResult[0].ID_CLIENTE;
            let cliente = await obtenerDatosId('clientes', idCliente);
            let fecha_venta = (apiResult[0].FECHA_DE_VENTA).slice(0, 10);
            let idVenta = apiResult[0].ID_VENTA;
            pdfalvo(cliente, fecha_venta, idVenta);
        }
    });
}

async function crearFormularioNav(campos) {
    let formulario = '<form action="" class="form" name="nav" autocomplete="off">';

    for (const campo of campos) {
        let titulo = formatText(campo);
        let input = `<input type="number" name="${campo}" id="${campo}" class=""></input>`;

        formulario += `
          <label>${titulo}</label>
          ${input}
          <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    }

    formulario += '</form>';
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

async function crearFormulario(campos) {
    let formulario = `<form id="formulario-registro" name="formulario-registro">`;

    for (let campo of campos) {
        let textoLabel = formatText(campo);

        formulario += `<label for="${campo}">${textoLabel}</label>`;

        if (campo === 'Fecha_inicio' || campo === "Fecha_fin") {
            formulario += `<input type="date" name="${campo}" id="${campo}">`;
        }
    }

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}


function construirGrafica(divDatos, contenido) {
    divDatos.classList.add('tablas');
    divDatos.innerHTML = `<div id="chartContainer" style="width: 800px; height: 800px;"></div>`;
    divPanel.append(divDatos);
    if (opcionInformeSeleccionada === 'productos_top') {
        activarGrafica(contenido);
    } else {
        clientes_frecuentes(contenido);
    }
}

function activarGrafica(productos) {
    const datasets = productos.map((producto) => {
        let colorAleatorio = generarColorAleatorio();
        console.log(colorAleatorio);

        return {
            label: producto.NombreProducto,
            backgroundColor: `${colorAleatorio}`,
            borderColor: `${colorAleatorio}`,
            borderWidth: 1,
            data: [producto.CantidadTotalVendida],
        };
    });

    const salesData = {
        labels: ["Total Vendido"], // O puedes ajustar esto según tus necesidades
        datasets: datasets,
    };

    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    document.getElementById('chartContainer').appendChild(canvas);

    // Configurar el contexto y dibujar el gráfico
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: salesData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

function clientes_frecuentes(datosClientes) {
    console.log(datosClientes);
    const clientesUnicos = Array.from(new Set(datosClientes.map((cliente) => cliente.NombreCliente)));

    // Crear datasets dinámicos
    const datasets = clientesUnicos.map((cliente) => {
        const colorAleatorio = generarColorAleatorio();

        // Filtrar datos para el cliente actual
        const datosCliente = datosClientes.filter((dato) => dato.NombreCliente === cliente);

        // Calcular la cantidad total de compras y dinero gastado por el cliente
        const cantidadTotalCompras = datosCliente.reduce((total, dato) => total + dato.CantidadCompras, 0);
        const cantidadTotalGastado = datosCliente.reduce((total, dato) => total + dato.TotalGastado, 0);

        return {
            label: cliente,
            backgroundColor: `${colorAleatorio}`,
            borderColor: `${colorAleatorio}`,
            borderWidth: 1,
            data: [cantidadTotalGastado, cantidadTotalCompras],
        };
    });

    // Crear el objeto de datos para el gráfico
    const salesData = {
        labels: ["Total Gastado"],
        datasets: datasets,
    };

    // Crear un elemento canvas y agregarlo al contenedor
    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    document.getElementById('chartContainer').appendChild(canvas);

    // Configurar el contexto y dibujar el gráfico
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: salesData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

async function tomarDatos(e) {
    e.preventDefault();
    let formularioCorrecto = validarFormularioInput('formulario-registro');
    if (formularioCorrecto) {
        const form = document.querySelector("#formulario-registro");
        let datosVenta = await ponerDatos(form, 'obtenerVentasTotales');
        let datosCompra = await ponerDatos(form, 'obtenerComprasTotales');
        console.log(datosCompra, datosVenta);
        limpiarHtml();
        console.log('hola');
        let div = document.createElement('div');
        div.classList.add('tablas');
        div.innerHTML = `<div id="chartContainer" style="width: 600px; height: 400px;"></div>`;
        divPanel.append(div);
        construirGraficaE(datosVenta, datosCompra);
    } else {
        swal('Algo salio mal', 'Llena todos los campos', 'error');
    }
}

function construirGraficaE(datosVenta, datosCompra) {
    var salesData = {
        labels: [""],
        datasets: [
            {
                label: 'Ventas',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [datosVenta.totalVentas],
            },
            {
                label: 'Compras',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: [datosCompra.totalCompras],
            },
        ],
    };

    // Crear un elemento canvas y agregarlo al contenedor
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    document.getElementById('chartContainer').appendChild(canvas);

    // Configurar el contexto y dibujar el gráfico
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: salesData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

async function ponerDatos(form, tipoTabla) {
    const form_data = new FormData(form);
    const data = new URLSearchParams(form_data);

    try {
        const res = await fetch(`http://localhost:3000/${tipoTabla}`, {
            method: 'POST',
            body: data
        });
        if (!res.ok) {
            throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}



function limpiarHtml() {
    let opciones = ['tablas', 'formulario', 'form-datos'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}

async function ponerDatosA(tipoTabla) {
    try {
        const response = await fetch(`http://localhost:3000/${tipoTabla}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error; // Propagar el error para que pueda ser manejado externamente si es necesario
    }
}

function generarColorAleatorio() {
    const tono = Math.floor(Math.random() * 4); // 0: azul, 1: verde, 2: naranja, 3: amarillo

    let r, g, b;

    switch (tono) {
        case 0: // Azul
            r = Math.floor(Math.random() * 51); // Rango entre 0 y 50
            g = Math.floor(Math.random() * 102); // Rango entre 0 y 100
            b = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
            break;
        case 1: // Verde
            r = Math.floor(Math.random() * 102); // Rango entre 0 y 100
            g = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
            b = Math.floor(Math.random() * 51); // Rango entre 0 y 50
            break;
        case 2: // Naranja
            r = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
            g = Math.floor(Math.random() * 102); // Rango entre 0 y 100
            b = Math.floor(Math.random() * 51); // Rango entre 0 y 50
            break;
        case 3: // Amarillo
            r = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
            g = Math.floor(Math.random() * 204) + 51; // Rango entre 51 y 255
            b = Math.floor(Math.random() * 51); // Rango entre 0 y 50
            break;
        default:
            break;
    }

    return `rgb(${r}, ${g}, ${b})`;
}

function formatText(text) {
    // Paso 1: Reemplazar guiones bajos con espacios
    let formattedText = text.replace(/_/g, ' ');

    // Paso 2: Capitalizar la primera letra
    formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

    return formattedText;
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

function generateInvoiceData(invoiceNumber, paymentDate, items) {
    return {
        label: "Factura #: ",
        num: invoiceNumber,
        invDate: "Fecha de venta: " + paymentDate,
        invGenDate: "Fecha de factura: " + getCurrentDate(),
        headerBorder: false,
        tableBodyBorder: false,
        header: [
            { title: "#", style: { width: 10 } },
            { title: "Nombre", style: { width: 30 } },
            { title: "Precio" },
            { title: "Cantidad" },
            { title: "Total" },
        ],
        table: items.map((item, index) => [
            index + 1,
            item.NOMBRE_PRODUCTO || item.title, // Use appropriate property for title
            item.PRECIO_VENTA || item.price,
            item.CANTIDAD || item.quantity,
            item.TOTAL || item.total,
        ]),
        additionalRows: [{
            col1: 'Total:',
            col2: `${items[0].totalVenta}`,
            col3: 'ALL',
            style: {
                fontSize: 14 //optional, default 12
            }
        }]
    };
}

// Example data for the invoice

// Generate dynamic invoice data

// Generate dynamic invoice data


// Assuming you have a function to get the current date
function getCurrentDate() {
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    return formattedDate;
}


// Merge with the rest of your props



function pdfalvo(cliente, fecha_venta, idVenta) {
    let invoiceNumber = idVenta;
    let paymentDate = `${fecha_venta}`;

    // Transform the array of objects to match the expected structure
    let items = apiResult.map((resultItem) => ({
        title: resultItem.NOMBRE_PRODUCTO,
        price: resultItem.PRECIO_VENTA,
        quantity: resultItem.CANTIDAD,
        total: resultItem.TOTAL_PRODUCTO,
        totalVenta : resultItem.TOTAL_VENTA
    }));

    console.log(items)
    let dynamicInvoice = generateInvoiceData(invoiceNumber, paymentDate, items);

    let props = {
        outputType: jsPDFInvoiceTemplate.OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: "Facutra 2023",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "../src/img/logo.jpg",
            type: 'JPG', //optional, when src= data:uri (nodejs case)
            width: 53.33, //aspect ratio = width/height
            height: 26.66,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        stamp: {
            inAllPages: true, //by default = false, just in the last page
            src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
            type: 'JPG', //optional, when src= data:uri (nodejs case)
            width: 20, //aspect ratio = width/height
            height: 20,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "Zhoe Parodi",
            address: "Fraccionamiento Estrella",
            phone: "6681930210",
            email: "zhoeparodi@gmail.com",
        },
        contact: {
            label: "Factura para:",//todo esta seran los campos del cliente
            name: `${cliente.NOMBRE}`,
            address: `${cliente.DIRECCION}`,
            phone: `${cliente.TELEFONO}`,
            email: `${cliente.CORREO}`,
        },
        invoice: dynamicInvoice,
        footer: {
            text: `El total de la venta fue de ${items[0].totalVenta}`,
        },
        pageEnable: true,
        pageLabel: "Page ",
    };

console.log(cliente)

    generatePDF(props);
}

function generatePDF(props) {

    //or in browser
    var pdfObject = jsPDFInvoiceTemplate.default(props);
  }