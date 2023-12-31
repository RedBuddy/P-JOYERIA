let opcionesVenta = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let divPanel = document.querySelector('.panel');
let opcionVentaSeleccionada;
let tipoTabla;
let accionTabla;
let productosVentasAcumuladas = [];
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

opcionesVenta.forEach((opcion) => {
  opcion.addEventListener('click', e => {
    e.preventDefault();
    limpiarHMTL();
    cambiarColor(e);
    let opcionSeleccionada = e.target.classList;
    if (opcionSeleccionada.contains('registrar_venta')) {
      opcionVentaSeleccionada = 'registrar_venta';
      accionTabla = 'agregar';
      tipoTabla = 'producto_terminado';
    } else if (opcionSeleccionada.contains('historial_venta')) {
      opcionVentaSeleccionada = 'historial_venta';
      tipoTabla = 'venta';
      accionTabla = 'consultar';
    } else if (opcionSeleccionada.contains('registrar_abono')) {
      opcionVentaSeleccionada = 'registrar_abono';
      tipoTabla = 'venta';
      accionTabla = 'agregar';
    }else if (opcionSeleccionada.contains('detalle_venta')) {
      opcionVentaSeleccionada = 'detalle_venta';
      tipoTabla = 'detalle_venta';
      accionTabla = 'consultar';
    }
    pintarHtml();
  });
});

function pintarHtml() {
  limpiarHMTL();
  let campos, thTabla;
  let divDatos = document.createElement('div');
  if (opcionVentaSeleccionada === 'registrar_venta') {
    campos = ["Id_producto_terminado"];
    productosVentasAcumuladas = [];
    API(divDatos, campos)
  } else if (opcionVentaSeleccionada === 'historial_venta') {
    campos = ["Tipo_venta"];
    thTabla = ["ID", "FECHA_DE_VENTA", "MONTO_TOTAL", "MONTO_PAGADO", "ESTATUS", "NUMERO_MENSUALIDADES", "MONTO_MENSUALIDAD", "FECHA_PROXIMO_PAGO"]
    API(divDatos, campos, thTabla);
  } else if (opcionVentaSeleccionada === 'registrar_abono') {
    campos = ["Id"];
    API(divDatos, campos, thTabla);
  }else if(opcionVentaSeleccionada === 'detalle_venta'){
    thTabla = ["ID_VENTA","ID_PRODUCTO","CANTIDAD"];
    API(divDatos, campos,  thTabla);
  }
}

async function API(divDatos, campos, thTabla) {
  if (accionTabla === 'agregar' && opcionVentaSeleccionada === 'registrar_venta') {
    console.log('hola');
    let div = document.createElement('div');
    div.classList.add('form-datos');
    div.innerHTML = crearFormularioNav(campos);
    if (opcionVentaSeleccionada === 'registrar_venta') {
      div.innerHTML += `<ul id="productList"></ul> `;
    }

    let productosDisponibles = await obtenerDatos('almacen_pt');//aqui tengo todos los productos terminados, los que tengo en el almacen;

    let productos = await obtenerDatos('producto_terminado')

    const productosAVender = productosDisponibles.reduce((result, producto) => {
      const cantidadDisponible = producto.CANTIDAD;

      // Filtrar solo los productos con cantidad mayor a 0
      if (cantidadDisponible > 0) {
        const detalleProducto = productos.find(detalle => detalle.ID === producto.ID_PRODUCTO);

        if (detalleProducto) {
          result.push({
            ID: detalleProducto.ID,
            NOMBRE: detalleProducto.NOMBRE,
            PRECIO_VENTA: detalleProducto.PRECIO_VENTA,
            ID_CATEGORIA: detalleProducto.ID_CATEGORIA,
            CANTIDAD: cantidadDisponible
          });
        }
      }

      return result;
    }, []);

    console.log(productosAVender);

    console.log(productosDisponibles, productos);

    divPanel.append(div);//aqui yo tengo eso
    //INICIALIZO LA TABLA SIN NADA PARA PONER EL FORM

    const divDatosVenta = document.createElement('div');
    divDatosVenta.classList.add('tablas');
    divPanel.append(construirTabla(divDatosVenta, productosVentasAcumuladas, ["ID", "NOMBRE", "PRECIO", "CANTIDAD", " + ", " - "]));
    //aqui
    campos = ["Id_cliente", "Tipo_venta", "Monto_total"];
    construirFormVenta(campos);
    let input = document.querySelector('.panel form input[type="text"]');
    input.addEventListener('input', (e) => {
      autocompletarProductos(productosAVender)
    });

    let btnEnviar = document.querySelector('.panel form input[type="submit"]');

    btnEnviar.addEventListener('click', (e) => {
      e.preventDefault();
      if (input.value > 0) {
        let objetoEncontrado = productosAVender.find(objeto => objeto.ID === parseInt(input.value));
        agregarProductoAcumulado(objetoEncontrado);
        let tabla = construirTabla(divDatosVenta, productosVentasAcumuladas, ["ID", "NOMBRE", "PRECIO", "CANTIDAD", " + ", " - "], productosAVender);
        divPanel.append(tabla);
        colocarTotal();
      } else {
        swal("Oops", "Por favor, llena el campo correctamente", "error");
      }
    })


  } else if(accionTabla === 'consultar' && opcionVentaSeleccionada === 'detalle_venta'){
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
  }
  else if (accionTabla === 'consultar') {
    let div = document.createElement('div');
    div.classList.add('form-datos');
    div.innerHTML = crearFormularioNav(campos);
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
          thTabla = ["ID", "FECHA_DE_VENTA", "MONTO_TOTAL"];
        } else {
          thTabla = ["ID", "MONTO_TOTAL", "MONTO_PAGADO", "ESTATUS","FECHA_DE_VENTA", "FECHA_PROXIMO_PAGO"]
        }
        //REMOVER EL ELEMENTO
        let quitarTabla = document.querySelector('.panel .tablas .no-footer');
        if (quitarTabla) {
          quitarTabla.remove();
        }

        divPanel.append(divDatos);
        divPanel.append(await construirTabla(divDatos, datos, thTabla, null, valor));
        $('.tabla').DataTable({
          lengthChange: false,
          info: false,
          "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
          }, "pageLength": 7



        });
      } else {
        swal("Algo salio mal", "Elige el tipo de venta correctamente", "error");
      }
    })

  } else if (accionTabla === 'agregar' && opcionVentaSeleccionada === 'registrar_abono') {
    let div = document.createElement('div');
    div.classList.add('form-datos');
    div.innerHTML = crearFormularioNav(campos);
    divPanel.append(div);

    let input = document.querySelector('.panel .form-datos input');

    let btnBuscar = document.querySelector('.panel .form-datos input[type="submit"]');
    btnBuscar.addEventListener('click', async (e) => {
      e.preventDefault();
      let formularioCorrecto = validarFormularioInput('nav');
      if (formularioCorrecto) {
        limpiarHMTL();
        let datosVenta = await obtenerDatos('venta', input.value);
        campos = ["Monto_total", "Monto_pagado", "Fecha_proximo_pago", "Monto_mensualidad"];

        let divDatos = document.createElement('div');
        divDatos.classList.add('tablas');
        divPanel.append(divDatos);
        console.log('hola');
        construirFormVenta(campos, datosVenta, input.value);
      } else {
        swal('Algo salio mal', 'Llena el campo correspondiente', "error");
      }
    })
  }
}

function colocarTotal() {
  let inputTotal = document.querySelector('.panel .tablas .formulario #formulario-registro #Monto_total');
  let sumaTotal = 0;

  productosVentasAcumuladas.forEach(producto => {
    sumaTotal += parseInt(producto.PRECIO) * parseInt(producto.CANTIDAD);
  })
  inputTotal.value = sumaTotal;
}

function construirFormVenta(campos, datosVenta, id) {
  if (opcionVentaSeleccionada === 'registrar_venta') {
    tipoTabla = 'clientes';
  } else {
    productosVentasAcumuladas = datosVenta;
  }
  crearFormularioLlenado(campos, productosVentasAcumuladas, id)
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
        if (opcionVentaSeleccionada === 'registrar_venta') {
          validarFormulario(form);
        } else {
          let montoAbonado = document.getElementById('Monto_mensualidad').value;
          const fecha = new Date();
          const formatoFecha = fecha.toISOString().slice(0, 10);
          objetoForm = {};
          objetoForm["Id_venta_credito"] = id;
          objetoForm["Monto_abono"] = montoAbonado;
          console.log('hola');
          objetoForm["Fecha_abono"] = formatoFecha;
          let formularioCorrecto = validarFormularioInput('formulario-venta');
          if (formularioCorrecto) {
            console.log(montoAbonado, cantidadMinimaPagar);
            if (parseInt(montoAbonado) < parseInt(cantidadMinimaPagar)) {
              swal('Algo salio mal', 'La cantidad de monto abonado es incorrecta', 'error');
            } else if (montoAbonado >= cantidadMinimaPagar && montoAbonado % cantidadMinimaPagar === 0) {
              swal('Abono registrado correctamente', 'El abono ha sido registrado', 'success');
              ponerDatos();
            }else{
            swal('Algo salio mal', 'Verifica que la cantidad abonada tenga relacion con las mensualidades', 'error');
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


function construirTabla(div, datos, thTabla, productosAVender, tipoVenta) {
  let quitarTabla = document.querySelector('.panel .tablas .tabla');
  if (quitarTabla) {
    quitarTabla.remove();
  }
  if (tipoVenta === 'Contado') {
    datos = datos.filter(function (objeto) {
      return objeto.TIPO_VENTA === "Contado";
    });
  } else if (tipoVenta === 'Credito') {
    datos = datos.filter(function (objeto) {
      return objeto.TIPO_VENTA === "Credito";
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
        const td = document.createElement('td');
        if (columna === 'FECHA_DE_VENTA' || columna === 'FECHA_PROXIMO_PAGO') {

          if (objeto[columna]) {
            console.log(objeto[columna]);
            let fechaAPI = objeto[columna];
            // Obtener solo la parte de la fecha con slice
            let fechaFormateada = fechaAPI.slice(0, 10);
            td.textContent = fechaFormateada;
          }
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

    // Buscar el producto en productosVentasAcumuladas
    let productoEncontrado = productosVentasAcumuladas.find(producto => producto.ID === idSeleccionado);
    let productoSiSePuede = productosAVender.find(producto => producto.ID === idSeleccionado);

    if (productoEncontrado) {
      // Si el producto ya existe, incrementar la cantidad
      if (e.target.classList.contains('agregar')) {
        if (productoEncontrado.CANTIDAD < productoSiSePuede.CANTIDAD) {
          productoEncontrado.CANTIDAD++;
        } else {
        swal(`Ya no hay mas ${productoEncontrado.NOMBRE} en el almacen`,'','error');
        }
      } else if (e.target.classList.contains('eliminar')) {
        productoEncontrado.CANTIDAD--;
      }
      if (productoEncontrado.CANTIDAD === 0) {
        //quitarEsaFila
        productosVentasAcumuladas = productosVentasAcumuladas.filter(producto => producto.ID !== idSeleccionado);
        divPanel.append(construirTabla(divDatosVenta, productosVentasAcumuladas, ["ID", "NOMBRE", "PRECIO", "CANTIDAD", " + ", " - "]));
      }
      e.target.parentElement.children[3].textContent = productoEncontrado.CANTIDAD;
    }
    colocarTotal();
  }
}

function crearFormularioNav(campos) {
  let formulario = '<form action="" class="form" autocomplete="off" name="nav">';
  campos.forEach(campo => {
    let titulo = formatText(campo);
    let input = `<input type="text" name="${campo}" id="${campo}" class="" autocomplete="off"></input>`
    if (campo === 'Tipo_venta') {
      const opciones = [['Contado', 'Contado'], ['Credito', 'Credito']];
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
            if (tipoTabla === 'clientes') {
              const cadena = `${item.NOMBRE}`;
              arregloDatos.push([item.ID, cadena]);
            } else {

              arregloDatos.push(item);
            }
            if (tipoTabla === 'clientes') {
              limiteCredito = data;
            }
          });
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
  const productoExistenteIndex = productosVentasAcumuladas.findIndex(p => p.ID === producto.ID);

  if (productoExistenteIndex !== -1) {
    // Si el producto ya existe, incrementar la cantidad
    productosVentasAcumuladas[productoExistenteIndex].CANTIDAD++;
  } else {
    // Si el producto no existe, agregarlo al array acumulado con cantidad 1
    const productoAcumulado = {
      ID: producto.ID,
      NOMBRE: producto.NOMBRE,
      PRECIO: producto.PRECIO_VENTA,
      CANTIDAD: 1
    };
    productosVentasAcumuladas.push(productoAcumulado);
  }

  // Actualizar la tabla con los productos acumulados
  console.log(productosVentasAcumuladas);
}

//REFERENTE SELECT
async function autocompletarProductos(datos) {
  // Obtén el valor del input de búsqueda
  let searchInput = document.getElementById("Id_producto_terminado");
  let term = searchInput.value.toLowerCase(); // Suponemos que la búsqueda es sensible a mayúsculas/minúsculas
  console.log(tipoTabla);

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
  let lista = document.getElementById("productList");
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
  document.getElementById("productList").style.display = "none";
}

// Oculta la lista si se hace clic fuera del input y la lista
document.addEventListener("click", function (event) {
  let productListRegistrarVenta = document.getElementById("productList");
  if (productListRegistrarVenta && event.target !== productListRegistrarVenta && event.target !== document.getElementById("Id_producto_terminado")) {
    productListRegistrarVenta.style.display = "none";
  }
});

function limpiarHMTL() {
  console.log('hola limpiar');
  let opciones = ['form-datos', 'almacen-mp', 'form', 'tabla', 'tablas', 'no-footer'];
  let selector = opciones.map(opc => '.' + opc).join(', ');
  let elementos = divPanel.querySelectorAll(selector);

  elementos.forEach(elemento => {
    elemento.remove();
  });
}

//CREAR FORMULARIO
async function crearFormularioLlenado(campos, datos) {
  let formulario = `<form id="formulario-registro" autocomplete="off" name="formulario-venta">`;

  console.log(datos)
  for (const campo of campos) {
    let textoLabel = formatText(campo);

    if (campo === 'Id_cliente') {
      textoLabel = 'Cliente';
    }

    formulario += `<label for="${campo}">${textoLabel}</label>`;

    let posicion = campo.toUpperCase();
    let fechaFormateada;
    if (campo === 'Fecha_de_venta' || campo === 'Fecha_proximo_pago') {
      let fechaAPI = datos[posicion];
      // Obtener solo la parte de la fecha con slice
      fechaFormateada = fechaAPI.slice(0, 10);
    }

    if (campo === 'Id_cliente') {
      let tabla = 'clientes';

      try {
        const datosSelect = await obtenerDatos(tabla);
        console.log(datosSelect)
        const selectHTML = generateSelectField(campo, datosSelect, datos[posicion]);
        formulario += selectHTML;
      } catch (error) {
        console.error(`Error al obtener datos de ${tabla}:`, error);
      }
    } else if (campo === 'Tipo_venta') {
      const opciones = [['Contado', 'Contado'], ['Credito', 'Credito']];
      formulario += generateSelectField(campo, opciones);
    } else if (campo === 'Monto_total') {
      formulario += `<input type="text" name="${campo}" id="${campo}"  value="${datos[posicion] || ''}" disabled >`;
    } else if (campo === 'Fecha_de_venta' || campo === 'Fecha_proximo_pago') {
      formulario += `<input type="date" name="${campo}" id="${campo}" value="${fechaFormateada || ''}" disabled >`
    } else if (campo === 'Monto_pagado') {
      formulario += `<input  type="number" name="${campo}" id="${campo}" value="${datos[posicion]}" disabled>`;
    } else if (campo === 'Monto_mensualidad') {
      cantidadMinimaPagar = datos[posicion];
      formulario += `<input type="number" name="${campo}" id="${campo}" placeholder="La cantidad minima a pagar es de ${datos[posicion]}" min="${datos[posicion]}">`;
    }
    else {
      formulario += `<input  type="text" name="${campo}" id="${campo}" value="${datos[posicion] || ''}" autocomplete="off">`;
    }
  }

  formulario += '<button type="submit" id="registrar">Registrar</button></form>';
  return formulario;
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

async function validarFormulario(form) {
  let objetoParaApi = constructorObjetoProducto();
  console.log(objetoParaApi);
  objetoForm = {};
  objetoForm["DetallesVentaJSON"] = objetoParaApi;
  objetoForm = objetosForm(form, objetoForm);
  const fecha = new Date();
  const formatoFecha = fecha.toISOString().slice(0, 10);
  objetoForm.Fecha_de_venta = formatoFecha;
  console.log(objetoForm);
  let tipoElegido = document.getElementById('Tipo_venta').value;

  if (tipoElegido === 'Credito') {
    objetoForm["Monto_pagado"] = 0.00;
    objetoForm["Estatus"] = 'No pagado';
    objetoForm["Mensualidades_pagadas"] = 0;
    agregarModal();
  } else {
    let formularioCorrecto = validarFormularioInput('formulario-venta');
    if (formularioCorrecto) {
      ponerDatos();
      swal("Venta registrada", ``, "success");
    } else {
      swal('Oops', 'Llena los datos de la venta correctamente', 'error');
    }
  }
}

function agregarModal() {
  // Crear el modal
  const modal = document.createElement('div');
  modal.classList.add('modal', 'formulario');
  modal.innerHTML = `
  <div class="modal-content-ya">
    <form class="formulario-registro" name="formulario-venta-credito">
      <label for="plazoOptions">Plazo de Crédito:</label>
      <select id="Numero_mensualidades" name="Numero_mensualidades">
        <option value="">Selecciona uno</option>
        <option value="3">3 meses</option>
        <option value="6">6 meses</option>
        <option value="9">9 meses</option>
      </select>

      

      <!-- Agregar campo de fecha -->
      <label for="fechaInicioPago">Fecha de inicio de pago:</label>
      <input type="date" id="Fecha_proximo_pago" name="Fecha_proximo_pago" disabled>

      
      <label for="mensualidad">Mensualidad:</label>
      <input id="Monto_mensualidad" name="Monto_mensualidad" type="text" autocomplete="off" disabled> 
      <button type="button" id="cerrar">Cerrar</button>
      <button type="button" id="registrarVenta"> Registrar </button>
    </form>
  </div>
`;
  // Agregar el modal al cuerpo del documento
  document.body.appendChild(modal);

  let form = document.querySelector('.formulario-registro');
  console.log(form);

  ventaCredito(form);



  // Manejar el evento para cerrar el modal
  const closeModalBtn = document.getElementById('cerrar');
  closeModalBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  const btnRegistrar = document.getElementById('registrarVenta');
  console.log(btnRegistrar)
  btnRegistrar.addEventListener('click', () => {
    elementoEncontrado = limiteCredito.filter(item => item.ID === parseInt(objetoForm["Id_cliente"]));

    let formularioCorrecto = validarFormularioInput('formulario-venta-credito');
    if (formularioCorrecto) {
      if (parseInt(objetoForm["Monto_total"]) <= elementoEncontrado[0].CREDITO_MAXIMO) {
        ponerDatos();
        swal("Venta registrada correctamente", ``, "success");
      } else {
        swal("El credito que tiene el cliente es menor al solicitado", '', 'error');
      }
    } else {
      swal('Oops', 'Llena correctamente todos los campos', 'error');
    }
  })
}

function ventaCredito(form) {
  let plazoOptions = document.getElementById('Numero_mensualidades');
  let mensualidadContainer = document.getElementById('Monto_mensualidad');
  let fechaInicioPagoInput = document.getElementById('Fecha_proximo_pago');
  console.log(plazoOptions, mensualidadContainer);
  // Agregar un evento para calcular y mostrar la mensualidad cuando cambie el plazo
  plazoOptions.addEventListener('change', function () {
    // Obtener el valor seleccionado
    let plazoSeleccionado = plazoOptions.value;

    // Obtener el monto total de la venta (reemplázalo con el valor real)
    let totalElement = document.querySelector('.panel .tablas .formulario #formulario-registro #Monto_total');
    let total = parseFloat(totalElement.value);
    console.log(total);

    // Calcular la mensualidad (asumiremos un interés del 0% para simplificar)
    let plazos = {
      '3': 3,
      '6': 6,
      '9': 9
    };

    let mesesParaInicioPago = plazos[plazoSeleccionado] / 3; // Puedes ajustar esto según tus reglas

    let fechaInicioPago = new Date();
    fechaInicioPago.setMonth(fechaInicioPago.getMonth() + mesesParaInicioPago);

    // Actualizar el valor del campo de fecha
    fechaInicioPagoInput.valueAsDate = fechaInicioPago;

    console.log(plazos[plazoSeleccionado]);

    let mensualidad = parseInt(total) / parseInt(plazos[plazoSeleccionado]);

    // Mostrar la mensualidad en el contenedor
    mensualidadContainer.value = mensualidad.toFixed(2);

    objetoForm = objetosForm(form);

    console.log(objetoForm);
  });

}

function constructorObjetoProducto() {
  const productosTransformados = productosVentasAcumuladas.map(producto => {
    return {
      "IdProducto": producto.ID,
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
  if (opcionVentaSeleccionada === 'registrar_venta') {
    tipoTabla = 'RegistrarVentaConDetalles';
  } else if (opcionVentaSeleccionada === 'registrar_abono') {
    tipoTabla = 'registrar_abono_venta';
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