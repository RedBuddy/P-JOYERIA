let opcionesVenta = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let divPanel = document.querySelector('.panel');
let opcionVentaSeleccionada;
let tipoTabla;
let accionTabla;

let productosVentasAcumuladas = [];

opcionesVenta.forEach((opcion) => {
  opcion.addEventListener('click', e => {
    e.preventDefault();
    limpiarHMTL();
    let opcionSeleccionada = e.target.classList;
    if (opcionSeleccionada.contains('registrar_venta')) {
      opcionVentaSeleccionada = 'registrar_venta';
      accionTabla = 'agregar';
      tipoTabla = 'producto_terminado';
    } else if (opcionSeleccionada.contains('registrar_abono')) {
      opcionVentaSeleccionada = 'registrar_abono';
      accionTabla = 'consultar';//primero consultar para mostrar la tabla, y despues agregar, para el abono
    } else if (opcionSeleccionada.contains('historial_venta')) {
      opcionVentaSeleccionada = 'historial_venta';
      accionTabla = 'consultar';
    }
    pintarHtml();
  });
});

function pintarHtml() {
  limpiarHMTL();
  let divDatos = document.createElement('div');
  if (opcionVentaSeleccionada === 'registrar_venta') {
    campos = ["Id_producto_terminado"];
    productosVentasAcumuladas = [];
    API(divDatos, campos)
  }
}

async function API(divDatos, campos, thTabla) {
  if (accionTabla === 'agregar') {
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
    divPanel.append(construirTabla(divDatosVenta,productosVentasAcumuladas, ["ID", "NOMBRE", "PRECIO", "CANTIDAD", " + ", " - "]));
    //aqui
    campos = ["Id_cliente", "Tipo_venta", "Monto_total"]
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
        let tabla = construirTabla(divDatosVenta,productosVentasAcumuladas, ["ID", "NOMBRE", "PRECIO", "CANTIDAD", " + ", " - "], productosAVender);
        divPanel.append(tabla);
        console.log(productosVentasAcumuladas)
        colocarTotal();
      }
    })

    

  }
}

function colocarTotal(){
  let inputTotal = document.querySelector('.panel .tablas .formulario #formulario-registro #Monto_total');
  let sumaTotal = 0;

  productosVentasAcumuladas.forEach(producto => {
    sumaTotal += parseInt(producto.PRECIO) * parseInt(producto.CANTIDAD);
  })
  inputTotal.value = sumaTotal;
}

function construirFormVenta(campos) {
  tipoTabla = 'clientes';
  crearFormularioLlenado(campos, productosVentasAcumuladas)
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
        validarFormulario(form);
      })
    })
    .catch(error => {
      console.error('Error al crear el formulario:', error);
    });
}

function construirTabla(div,datos, thTabla, productosAVender) {
  let quitarTabla = document.querySelector('.panel .tablas .tabla');
  if (quitarTabla) {
    quitarTabla.remove();
  }
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

  if (datos && Array.isArray(datos) && datos.length > 0) {
    datos.forEach(objeto => {
      const tr = document.createElement('tr');
      thTabla.forEach((columna) => {
        const td = document.createElement('td');
        td.textContent = objeto[columna];
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

function aumentarEliminar(e,productosAVender) {

  let divDatosVenta = document.querySelector('.panel .tablas')

  if (e.target.classList.contains('agregar') || e.target.classList.contains('eliminar')) {
    let idSeleccionado = parseInt(e.target.parentElement.firstChild.textContent);

    // Buscar el producto en productosVentasAcumuladas
    let productoEncontrado = productosVentasAcumuladas.find(producto => producto.ID === idSeleccionado);
    let productoSiSePuede = productosAVender.find(producto => producto.ID === idSeleccionado);

    if (productoEncontrado) {
      // Si el producto ya existe, incrementar la cantidad
      if (e.target.classList.contains('agregar')) {
        if(productoEncontrado.CANTIDAD < productoSiSePuede.CANTIDAD){
          productoEncontrado.CANTIDAD++;
        }else{
          alert(`Ya no hay mas ${productoEncontrado.NOMBRE} en el almacen`);
        }
      } else if (e.target.classList.contains('eliminar')) {
        productoEncontrado.CANTIDAD--;
      }
      if (productoEncontrado.CANTIDAD === 0) {
        //quitarEsaFila
        productosVentasAcumuladas = productosVentasAcumuladas.filter(producto => producto.ID !== idSeleccionado);
        divPanel.append(construirTabla(divDatosVenta,productosVentasAcumuladas, ["ID", "NOMBRE", "PRECIO", "CANTIDAD", " + ", " - "]));
      }
      e.target.parentElement.children[3].textContent = productoEncontrado.CANTIDAD;
    }
    colocarTotal();
  }
}

function crearFormularioNav(campos) {
  let formulario = '<form action="" class="form">';
  campos.forEach(campo => {
    let titulo = formatText(campo);
    let input = `<input type="text" name="${campo}" id="${campo}" class=""></input>`
    formulario += `
      <label>${titulo}</label>
      ${input}
      <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
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
          if (tipoTabla === 'clientes') {
            const cadena = `${item.NOMBRE}`;
            arregloDatos.push([item.ID, cadena]);
          } else {

            arregloDatos.push(item);
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
  var searchInput = document.getElementById("Id_producto_terminado");
  var term = searchInput.value.toLowerCase(); // Suponemos que la búsqueda es sensible a mayúsculas/minúsculas
  console.log(tipoTabla);

  let productos = []

  datos.forEach(producto => {
    console.log(producto)
    productos.push({ id: producto.ID.toString(), nombre: producto.NOMBRE, categoria: producto.ID_CATEGORIA.toString() });
  })

  // Aquí podrías realizar una solicitud al servidor para obtener los productos
  // En este ejemplo, utilizamos un array simulado de productos


  // Filtra los productos por coincidencia en el nombre o categoría
  var productosFiltrados = productos.filter(function (producto) {
    return producto.nombre.toLowerCase().includes(term) || producto.categoria.toLowerCase().includes(term) || producto.id.toLowerCase().includes(term);
  });

  // Muestra los productos en la lista
  mostrarProductos(productosFiltrados);
}

function mostrarProductos(productos) {
  var lista = document.getElementById("productList");
  lista.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

  productos.forEach(function (producto) {
    var item = document.createElement("li");
    item.textContent = producto.nombre;
    item.setAttribute("data-id", producto.id); // Agrega el ID del producto como atributo de datos
    item.addEventListener("click", seleccionarProducto);
    lista.appendChild(item);
  });

  // Muestra la lista debajo del input
  lista.style.display = productos.length > 0 ? "block" : "none";


}

function seleccionarProducto(event) {
  var selectedProductId = event.currentTarget.getAttribute("data-id");
  // Haz lo que necesites con el ID del producto seleccionado
  let input = document.querySelector('.panel form input[type="text"]');
  input.value = selectedProductId;
  document.getElementById("productList").style.display = "none";
}

// Oculta la lista si se hace clic fuera del input y la lista
document.addEventListener("click", function (event) {
  var productListRegistrarVenta = document.getElementById("productList");
  if (productListRegistrarVenta && event.target !== productListRegistrarVenta && event.target !== document.getElementById("Id_producto_terminado")) {
    productListRegistrarVenta.style.display = "none";
  }
});

function limpiarHMTL() {
  let opciones = ['form-datos', 'almacen-mp', 'form', 'tabla','tablas'];
  let selector = opciones.map(opc => '.' + opc).join(', ');
  let elementos = divPanel.querySelectorAll(selector);

  elementos.forEach(elemento => {
    elemento.remove();
  });
}


//CREAR FORMULARIO
async function crearFormularioLlenado(campos, datos) {
  let formulario = `<form id="formulario-registro">`;


  for (const campo of campos) {
    const textoLabel = formatText(campo);

    formulario += `<label for="${campo}">${textoLabel}</label>`;

    let posicion = campo.toUpperCase();


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
    }else if(campo === 'Tipo_venta'){
        const opciones = [['Contado', 'Contado'], ['Credito', 'Credito']];
        formulario += generateSelectField(campo, opciones);
    }else if(campo === 'Monto_total'){
      formulario += `<input type="text" name="${campo}" id="${campo}"  disabled>`;
    } else {
      formulario += `<input  type="text" name="${campo}" id="${campo}" value="${datos[posicion] || ''}" >`;
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

function validarFormulario(form) {
  let objetoParaApi = constructorObjetoProducto();
  console.log(objetoParaApi);
  let objetoForm = {};
  objetoForm["DetallesVentaJSON"] = objetoParaApi;
  objetoForm = objetosForm(form, objetoForm);
  objetoForm.Fecha_de_venta = '2023-11-27';
  console.log(objetoForm);
  let tipoElegido = document.getElementById('Tipo_venta').value;

  ponerDatos(objetoForm);

  if(tipoElegido === 'Credito'){
    agregarModal();
  }
}

function agregarModal() {
  // Crear el modal
  const modal = document.createElement('div');
  modal.classList.add('modal','formulario');
  modal.innerHTML = `
  <div class="modal-content">
    <form class="formulario-registro">
      <label for="plazoOptions">Plazo de Crédito: (SIN INTERESES)</label>
      <select id="plazoOptions">
        <option value="3meses">3 meses</option>
        <option value="6meses">6 meses</option>
        <option value="9meses">9 meses</option>
      </select>

      

      <!-- Agregar campo de fecha -->
      <label for="fechaInicioPago">Fecha de inicio de pago:</label>
      <input type="date" id="fechaInicioPago" disabled>

      <!-- Mostrar el monto de la mensualidad -->
      <div id="mensualidadContainer">
        <label for="mensualidad">Mensualidad:</label>
        <span id="mensualidad"></span>
      </div>
      <button type="button" onclick="cerrarModal()">Cerrar</button>
    </form>
  </div>
`;
  // Agregar el modal al cuerpo del documento
  document.body.appendChild(modal);

  
  ventaCredito();

  // Manejar el evento para cerrar el modal
  const closeModalBtn = modal.querySelector('button');
  closeModalBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
  });
}


function ventaCredito(){
  var plazoOptions = document.getElementById('plazoOptions');
  var mensualidadContainer = document.getElementById('mensualidad');
  var fechaInicioPagoInput = document.getElementById('fechaInicioPago');
  console.log(plazoOptions, mensualidadContainer);
  // Agregar un evento para calcular y mostrar la mensualidad cuando cambie el plazo
  plazoOptions.addEventListener('change', function() {
      // Obtener el valor seleccionado
      var plazoSeleccionado = plazoOptions.value;

      // Obtener el monto total de la venta (reemplázalo con el valor real)
      let totalElement = document.querySelector('.panel .tablas .formulario #formulario-registro #Total');
      var total = parseFloat(totalElement.value);

      // Calcular la mensualidad (asumiremos un interés del 0% para simplificar)
      var plazos = {
          '3meses': 3,
          '6meses': 6,
          '9meses': 9
      };

      var mesesParaInicioPago = plazos[plazoSeleccionado] / 3; // Puedes ajustar esto según tus reglas

        var fechaInicioPago = new Date();
        fechaInicioPago.setMonth(fechaInicioPago.getMonth() + mesesParaInicioPago);

        // Actualizar el valor del campo de fecha
        fechaInicioPagoInput.valueAsDate = fechaInicioPago;

      var mensualidad = parseInt(total) / parseInt(plazos[plazoSeleccionado]);

      // Mostrar la mensualidad en el contenedor
      mensualidadContainer.textContent = '$' + mensualidad.toFixed(2);
  });
}

function constructorObjetoProducto(){
  const productosTransformados = productosVentasAcumuladas.map(producto => {
    return {
      "IdProducto": producto.ID,
      "Cantidad": producto.CANTIDAD
    };
  });
  return JSON.stringify(productosTransformados);
}

function objetosForm(form, objetoForm){
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

async function ponerDatos(objeto) {
  let tipoTabla = 'RegistrarVentaConDetalles';
  console.log(`Enviando solicitud a http://localhost:3000/${tipoTabla}`);

  console.log(JSON.stringify(objeto));

  try {
    const response = await fetch(`http://localhost:3000/${tipoTabla}`, {
      method: 'POST',
      body: JSON.stringify(objeto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msj || 'Error en la solicitud');
    }

    console.log(data);
    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}