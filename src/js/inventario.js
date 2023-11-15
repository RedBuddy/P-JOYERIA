let opcionesInventario = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let panelInventario = document.querySelector('.panel .nav-sup');
let divPanel = document.querySelector('.panel');
let opcionInventarioSeleccionada;

opcionesInventario.forEach((opcion) => {
    opcion.addEventListener('click', e => {
        e.preventDefault();
        limpiarHtml(panelInventario)
        let opcionSeleccionada = e.target.classList;
        if (opcionSeleccionada.contains('almacen-mp')) {
            opcionInventarioSeleccionada = 'almacen-mp';
        } else if (opcionSeleccionada.contains('almacen-pt')) {
            opcionInventarioSeleccionada = 'almacen-pt';
        } else if (opcionSeleccionada.contains('categorias')) {
            opcionInventarioSeleccionada = 'categorias';
        }
        pintarNav(opcionInventarioSeleccionada);
    });
});

function limpiarHtml() {
    let opciones = ['form-datos', 'entrada-materia', 'tablas', 'salida-materia', 'entrada-producto', 'salida-producto', 'formulario'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}

function generarNav(opcion) {
    let titulo = '';
    let texto = '';
    if (opcion === 'almacen-mp') {
        texto = "mp";
        titulo = "materia prima";
    } else if (opcion === 'almacen-pt') {
        texto = "pt"
        titulo = "producto terminado";
    } else if (opcion === 'categorias') {
        return `
        <a class="nav-sup-link agregar-categoria" href="#"><img src="../src/img/agregar-categorias.png" alt="" class="agregar-categoria">Agregar categoria</a>
        <a class="nav-sup-link editar-categoria" href="#"><img src="../src/img/editar-categoria.png" alt="" class="editar-categoria">Editar categoria</a>
        <a class="nav-sup-link lista-categoria" href="#"><img src="../src/img/lista-categoria.png" alt="" class="lista-categoria">Lista de categorias</a>
        <a class="nav-sup-link eliminar-categoria" href="#"><img src="../src/img/eliminar-categoria.png" alt="" class="eliminar-categoria">Eliminar categoria</a>`;
    }

    return `
        <a class="nav-sup-link consultar-${texto}" href="#"><img src="../src/img/almacen-mp.png" alt="" class="consultar-${texto}">Consultar almacen</a>
        <a class="nav-sup-link entrada-${texto}" href="#"><img src="../src/img/entrada.png" alt="" class="entrada-${texto}">Registrar entrada</a>
        <a class="nav-sup-link devoluciones" href="#"><img src="../src/img/salida.png" alt="" class="salida-${texto}">Registrar salida</a>
        <a class="nav-sup-link agregar-${texto}" href="#"><img src="../src/img/${titulo}.png" alt="" class="agregar-${texto}">Agregar ${titulo}</a>`;
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
            if (opcionSeleccionada.contains('consultar-mp')) {
                opcionInventarioSeleccionada = 'consultar-mp';
            } else if (opcionSeleccionada.contains('entrada-mp')) {
                opcionInventarioSeleccionada = 'entrada-mp';
            } else if (opcionSeleccionada.contains('salida-mp')) {
                opcionInventarioSeleccionada = 'salida-mp';
            } else if (opcionSeleccionada.contains('consultar-pt')) {
                opcionInventarioSeleccionada = 'consultar-pt';
            } else if (opcionSeleccionada.contains('entrada-pt')) {
                opcionInventarioSeleccionada = 'entrada-pt';
            } else if (opcionSeleccionada.contains('salida-pt')) {
                opcionInventarioSeleccionada = 'salida-pt';
            } else if (opcionSeleccionada.contains('agregar-mp')) {
                opcionInventarioSeleccionada = 'agregar-mp';
            } else if (opcionSeleccionada.contains('agregar-categoria')) {
                opcionInventarioSeleccionada = 'agregar-categoria';
            } else if (opcionSeleccionada.contains('eliminar-categoria')) {
                opcionInventarioSeleccionada = 'eliminar-categoria';
            } else if (opcionSeleccionada.contains('editar-categoria')) {
                opcionInventarioSeleccionada = 'editar-categoria';
            } else if (opcionSeleccionada.contains('lista-categoria')) {
                opcionInventarioSeleccionada = 'lista-categoria';
            } else if (opcionSeleccionada.contains('agregar-pt')) {
                opcionInventarioSeleccionada = 'agregar-pt';
            }
            pintarHtml();
        });
    });
}

function pintarHtml() {
    // let campos;
    let divDatos = document.createElement('div');

    //     if (opcionInventarioSeleccionada === 'consultar-mp') {
    //         campos = ['materia-prima'];
    //         divDatos.classList.add('form-datos');
    //         divDatos.innerHTML = crearFormularioNav(campos);
    //         divPanel.appendChild(divDatos);
    //         let tablas = document.createElement('div');
    //         tablas.classList.add('tablas');
    //         let tabla = document.createElement('table');
    //         tabla.classList.add('tabla');
    //         tabla.innerHTML = ` <tbody>
    //         <tr>
    //             <th>ID Materia Prima</th>
    //             <th>Nombre</th>
    //             <th>Categoria</th>
    //             <th>Cantidad en Stock</th>
    //             <th>Precio de Compra</th>
    //         </tr>
    //     </tbody>
    // `;
    //         tablas.appendChild(tabla);
    //         divPanel.appendChild(tablas);
    //     } else if (opcionInventarioSeleccionada === 'entrada-mp') {
    //         divDatos.classList.add('almacen-mp','formulario');
    //         campos = ['Id_materia_prima','cantidad',"fecha"];
    //         divDatos.innerHTML = crearFormulario(campos);
    //         divPanel.appendChild(divDatos);

    //         let btnRegistrar = document.querySelector('#formulario-registro button');
    //         console.log(btnRegistrar)
    //         btnRegistrar.addEventListener('click', (e) => {
    //             tomarDatos(e);
    //         });
    //     } else if (opcionInventarioSeleccionada === 'salida-mp') {
    //         divDatos.classList.add('almacen-mp','formulario');
    //         campos = ['Id_materia_prima','cantidad',"fecha","motivo"];
    //         divDatos.innerHTML = crearFormulario(campos);
    //         divPanel.appendChild(divDatos);
    //         let btnRegistrar = document.querySelector('#formulario-registro button');
    //         console.log(btnRegistrar)
    //         btnRegistrar.addEventListener('click', (e) => {
    //             tomarDatos(e);
    //         });
    //     } else if (opcionInventarioSeleccionada === 'consultar-pt') {
    //         campos = ['producto-terminado'];
    //         divDatos.classList.add('form-datos');
    //         divDatos.innerHTML = crearFormularioNav(campos);
    //         divPanel.appendChild(divDatos);
    //         let tablas = document.createElement('div');
    //         tablas.classList.add('tablas');
    //         let tabla = document.createElement('table');
    //         tabla.classList.add('tabla');
    //         tabla.innerHTML = ` <tbody>
    //         <tr>
    //             <th>ID del Producto</th>
    //             <th>Nombre del Producto</th>
    //             <th>Descripción del Producto</th>
    //             <th>Cantidad en Stock</th>
    //             <th>Precio de Venta</th>
    //         </tr>
    //     </tbody>
    // `;
    //         tablas.appendChild(tabla);
    //         divPanel.appendChild(tablas);
    // } else if (opcionInventarioSeleccionada === 'entrada-pt') {
    //     divDatos.classList.add('entrada-producto', 'formulario');
    //     divDatos.classList.add('almacen-producto-terminado', 'formulario');
    //     campos = ['ID_producto_terminado','cantidad',"fecha"];
    //     divDatos.innerHTML = crearFormulario(campos);
    //     divPanel.appendChild(divDatos);
    // } else if (opcionInventarioSeleccionada === 'salida-pt') {
    //     divDatos.classList.add('salida-materia', 'formulario');
    //     campos = ['ID_producto_terminado','cantidad',"fecha","motivo"];
    //     divDatos.innerHTML = crearFormulario(campos);
    //     divPanel.appendChild(divDatos);
    //     } else if (opcionInventarioSeleccionada === 'agregar-mp') {
    //         divDatos.classList.add('almacen-mp','formulario');
    //         campos = ["nombre","Id_proveedor","categoria","unidad_de_medida","precio_de_compra"];
    //         divDatos.innerHTML = crearFormulario(campos);
    //         divPanel.appendChild(divDatos);
    //         let btnRegistrar = document.querySelector('#formulario-registro button');
    //         console.log(btnRegistrar)
    //         btnRegistrar.addEventListener('click', (e) => {
    //             tomarDatos(e);
    //         });
    // } else if (opcionInventarioSeleccionada === 'agregar-pt') {
    //     divDatos.classList.add('salida-materia', 'formulario');
    //     campos = ["nombre","categoria","precio_de_venta"];
    //     divDatos.innerHTML = crearFormulario(campos);
    //     divPanel.appendChild(divDatos);
    //     } else if (opcionInventarioSeleccionada === 'agregar-categoria'){
    //         divDatos.classList.add('categoria','formulario');
    //         divDatos.innerHTML = `<form id="formulario-registro">
    //         <label for="nombre">Nombre de categoria: </label>
    //         <input type="text" id="Nombre" name="Nombre" autocomplete="off">

    //         <label for="tipo">Tipo: </label>
    //         <select id="tipo">
    //             <option value="mp">Materia prima</option>
    //             <option value="pt">Producto terminado</option>
    //         </select>

    //         <button type="submit">Registrar</button>
    //     </form>
    // `;
    //         divPanel.appendChild(divDatos);

    //         let btnRegistrar = document.querySelector('#formulario-registro button');
    //         console.log(btnRegistrar)
    //         btnRegistrar.addEventListener('click', (e) => {
    //             tomarDatos(e);
    //         });
    //     } else if (opcionInventarioSeleccionada === 'editar-categoria'){
    //         campos = ['id-categoria'];
    //         divDatos.classList.add('form-datos');
    //         divDatos.innerHTML = crearFormularioNav(campos);
    //         divPanel.appendChild(divDatos);
    //     } else if (opcionInventarioSeleccionada === 'lista-categoria'){
    //         let tablas = document.createElement('div');
    //         tablas.classList.add('tablas');
    //         let tabla = document.createElement('table');
    //         tabla.classList.add('tabla');
    //         tabla.innerHTML = ` <tbody>
    //         <tr>
    //             <th>ID Garantia</th>
    //             <th>Nombre</th>
    //             <th>Descripcion</th>
    //         </tr>
    //     </tbody>
    // `;
    //         tablas.appendChild(tabla);
    //         divPanel.appendChild(tablas);
    //     } else if (opcionInventarioSeleccionada === 'eliminar-categoria'){
    //         campos = ['id-categoria'];
    //         divDatos.classList.add('form-datos');
    //         divDatos.innerHTML = crearFormularioNav(campos);
    //         divPanel.appendChild(divDatos);
    //     }


    let campos, formularioHTML, tituloTabla, thTabla;

    if (opcionInventarioSeleccionada === 'entrada-mp') {
        campos = ['Id_materia_prima', 'cantidad', 'fecha'];
    } else if (opcionInventarioSeleccionada === 'salida-mp') {
        campos = ['Id_materia_prima', 'cantidad', 'fecha', 'motivo'];
    } else if (opcionInventarioSeleccionada === 'agregar-mp') {
        campos = ['nombre', 'Id_proveedor', 'categoria', 'unidad_de_medida', 'precio_de_compra'];
    } else if (opcionInventarioSeleccionada === 'agregar-categoria') {
        divDatos.classList.remove('formulario'); // Si es necesario, quitar la clase 'formulario' para este caso especial
        campos = ['Nombre', 'tipo'];
        formularioHTML = `
        <form id="formulario-registro">
            <label for="nombre">Nombre de categoria: </label>
            <input type="text" id="Nombre" name="Nombre" autocomplete="off">

            <label for="tipo">Tipo: </label>
            <select id="tipo">
                <option value="mp">Materia prima</option>
                <option value="pt">Producto terminado</option>
            </select>

            <button type="submit">Registrar</button>
        </form>
    `;
    } else if (opcionInventarioSeleccionada === 'consultar-mp') {
        campos = ['materia-prima'];
        tituloTabla = 'Consulta de Materias Primas';
        thTabla = ['ID Materia Prima', 'Nombre', 'Categoria', 'Cantidad en Stock', 'Precio de Compra'];
    } else if (opcionInventarioSeleccionada === 'consultar-pt') {
        campos = ['producto-terminado'];
        tituloTabla = 'Consulta de Productos Terminados';
        thTabla = ['ID del Producto', 'Nombre del Producto', 'Descripción del Producto', 'Cantidad en Stock', 'Precio de Venta'];
    } else if (opcionInventarioSeleccionada === 'editar-categoria') {
        campos = ['id-categoria'];
        tituloTabla = 'Editar Categoría';
        thTabla = ['ID del Producto', 'Nombre del Producto', 'Descripción del Producto', 'Cantidad en Stock', 'Precio de Venta'];
    } else if (opcionInventarioSeleccionada === 'entrada-pt') {
        campos = ['ID_producto_terminado', 'cantidad', 'fecha'];
    } else if (opcionInventarioSeleccionada === 'salida-pt') {
        campos = ['ID_producto_terminado', 'cantidad', 'fecha', 'motivo'];
    } else if (opcionInventarioSeleccionada === 'agregar-pt') {
        campos = ['nombre', 'categoria', 'precio_de_venta'];
    } else if (opcionInventarioSeleccionada === 'lista-categoria') {
        tituloTabla = 'Lista de Categorías';
        thTabla = ['ID Garantia', 'Nombre', 'Descripcion'];
    } else if (opcionInventarioSeleccionada === 'eliminar-categoria') {
        campos = ['id-categoria'];
    }

    if (campos) {
        if (opcionInventarioSeleccionada === 'consultar-mp' || opcionInventarioSeleccionada === 'entrada-mp' || opcionInventarioSeleccionada === 'salida-mp') {
            divDatos.classList.add('almacen-mp');
        } else if (opcionInventarioSeleccionada === 'consultar-pt' || opcionInventarioSeleccionada === 'entrada-pt' || opcionInventarioSeleccionada === 'salida-pt') {
            divDatos.classList.add('almacen-pt');
        } else if (opcionInventarioSeleccionada === 'agregar-categoria' || opcionInventarioSeleccionada === 'editar-categoria' || opcionInventarioSeleccionada === 'eliminar-categoria' || opcionInventarioSeleccionada === 'lista-categoria') {
            divDatos.classList.add('categoria');
        }

        if (opcionInventarioSeleccionada === 'consultar-mp' || opcionInventarioSeleccionada === 'consultar-pt' || opcionInventarioSeleccionada === 'editar-categoria' || opcionInventarioSeleccionada === 'eliminar-categoria') {
            divDatos.innerHTML = crearFormularioNav(campos);
            divDatos.classList.add('form-datos');
        } else {
            divDatos.innerHTML = crearFormulario(campos);
            divDatos.classList.add('formulario');
        }
        divPanel.appendChild(divDatos);

        if (formularioHTML) {
            divDatos.innerHTML = formularioHTML;
        }

        let btnRegistrar = document.querySelector('#formulario-registro button');
        console.log(btnRegistrar);
        btnRegistrar.addEventListener('click', (e) => {
            tomarDatos(e);
        });
    } else {
        // Manejar caso no contemplado
    }


}

function tomarDatos(e) {
    e.preventDefault();
    // Obtener los valores del formula
    const form = document.querySelector("#formulario-registro");

    let tipoTabla = form.parentElement.classList[0];

    if (tipoTabla === 'categoria') {
        if (opcionInventarioSeleccionada === 'agregar-categoria') {
            tipoTabla += "_" + document.querySelector("#formulario-registro #tipo").value;
            console.log(tipoTabla)
        }
    } else if (tipoTabla === 'almacen-mp') {
        if (opcionInventarioSeleccionada !== 'agregar-mp') {
            console.log(tipoTabla);
        } else {
            tipoTabla = 'materia_prima';
            console.log(tipoTabla);
        }
    }


    const form_data = new FormData(form);
    const data = new URLSearchParams(form_data);

    form_data.forEach((valor, clave) => {
        console.log(`${clave}: ${valor}`);
    });

    fetch(`http://localhost:3000/tipoTabla`, {
        method: 'POST',
        body: data
    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));

    agregarModal();
}

function agregarModal() {
    // Crear el modal
    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.innerHTML = `
        <div class="modal-content">
            <p>Se han guardado correctamente los cambios<br>La materia prima tendra el ID 1</p>
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
    let formulario = '<form action="" class="form">';

    campos.forEach(campo => {
        formulario += `
        <label for="${campo}">${campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
        <input type="text" name="${campo}" id="${campo}" class="">
        <input type="submit" name="${campo}" id="${campo}" value="Buscar" class="producto">`;
    });

    formulario += '</form>';
    return formulario;
}

function crearFormulario(campos) {
    let formulario = '<form action="" id="formulario-registro">';

    campos.forEach(campo => {
        let textoLabel = campo.replace(/_/g, ' ');
        formulario += `
        <label for="${campo}">${textoLabel.charAt(0).toUpperCase() + textoLabel.slice(1)}</label>`;
        if (campo === 'fecha') {
            formulario += `<input type="date" name="${campo}" id="${campo}">`;
        } else {
            formulario += `<input type="text" name="${campo}" id="${campo}">`;
        }

    });

    formulario += '<button type="submit">Registrar</button></form>';
    return formulario;
}