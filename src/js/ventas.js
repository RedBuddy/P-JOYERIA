let opcionesVenta = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let divPanel = document.querySelector('.panel');
let opcionVentaSeleccionada;
let tipoTabla;
let accionTabla;

// ///
// const registrar_cliente = document.createElement('div');
// registrar_cliente.classList.add('registrar-cliente');
// registrar_cliente.innerHTML = `<h1>${nivel_acceso}</h1>`;


// divPanel.appendChild(registrar_cliente);
// ///

let productosVentasAcumuladas = [];

opcionesVenta.forEach((opcion) => {
  opcion.addEventListener('click', e => {
    e.preventDefault();
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
  let divDatos = document.createElement('div');
  if (opcionVentaSeleccionada === 'registrar_venta') {
    campos = ["Id_producto_terminado"];

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

    console.log(tipoTabla)
    let datos = await obtenerDatos(tipoTabla);
    console.log(datos)

    divPanel.append(div);//aqui yo tengo eso
    let input = document.querySelector('.panel form input[type="text"]');
    input.addEventListener('input', (e) => {
      autocompletarProductos(datos)
    });

    let btnEnviar = document.querySelector('.panel form input[type="submit"]');

    btnEnviar.addEventListener('click', (e) => {
      e.preventDefault();
      if (input.value > 0) {
        console.log(input.value);
        let objetoEncontrado = datos.find(objeto => objeto.ID === parseInt(input.value));
        console.log(objetoEncontrado);
      }
    })
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
          arregloDatos.push(item);
        });
        resolve(arregloDatos);
      })
      .catch(error => {
        // Rechazar la promesa en caso de error
        reject(error);
      });
  });
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

  console.log(productos)

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

// En otro módulo HTML
const nivel_acceso = localStorage.getItem('nivel_acceso');

// Utilizar el nivel de acceso como sea necesario
console.log("Nivel de acceso:", nivel_acceso);