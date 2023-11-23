const opcionesVenta = document.querySelectorAll('.panel-clientes .nav-sup .nav-sup-link');
const test = document.querySelector('.nav-sup')
const divPanel = document.querySelector('.panel-clientes');
let opcionVentaSeleccionada;

test.addEventListener('click', e => {

    let clase = e.target.classList;
    if (clase.contains('clientes-agregar')) {
        limpiar_panel();
        add_registrar_cliente();
        addevent_rcliente();
    } else if (clase.contains('clientes-historial')) {
        limpiar_panel();
        add_historial_cliente();
    } else if (clase.contains('clientes-editar')) {
        limpiar_panel();
        console.log('boton editar')
    }

});

function add_registrar_cliente() {
    const registrar_cliente = document.createElement('div');
    registrar_cliente.classList.add('registrar-cliente');
    registrar_cliente.innerHTML = `<h1>Registro de cliente</h1>
    <form class="form-clientes">
        <label for="nombre">Nombre:</label>
        <input class="rc-input-nombre" type="text" id="nombre" name="Nombre" placeholder="Ingrese el nombre"
            required>

        <label for="direccion">Dirección:</label>
        <input class="rc-input-direccion" type="text" id="direccion" name="Direccion"
            placeholder="Ingrese la dirección" required>

        <label for="telefono">Teléfono:</label>
        <input class="rc-input-telefono" type="text" id="telefono" name="Telefono"
            placeholder="Ingrese el número de teléfono" required>

        <label for="email">Correo Electrónico:</label>
        <input class="rc-input-email" type="email" id="email" name="Correo"
            placeholder="Ingrese el correo electrónico" required>

        <button class="boton-registrar" type="submit">Registrar</button>
    </form>`;


    divPanel.appendChild(registrar_cliente);

}

function add_historial_cliente() {
    const historial_cliente = document.createElement('div');
    historial_cliente.classList.add('historial-cliente');
    historial_cliente.innerHTML = `<h1>Historial de cliente</h1>
    <form>
        <label for="nombre">Nombre:</label>
        <input class="rc-input-nombre" type="text" id="nombre" name="nombre"
            placeholder="Ingrese el nombre del cliente" required>
        <button type="submit">Aceptar</button>

    </form>`;


    divPanel.appendChild(historial_cliente);
}

function limpiar_panel() {
    const opciones = ['registrar-cliente', 'historial-cliente'];
    let selector = opciones.map(opc => '.' + opc).join(', ');
    let elementos = divPanel.querySelectorAll(selector);

    elementos.forEach(elemento => {
        elemento.remove();
    });
}

function addevent_rcliente() {
    const form_clientes = document.querySelector('.form-clientes');

    form_clientes.addEventListener('submit', event => {
        event.preventDefault();

        const form_data = new FormData(form_clientes);
        const data = new URLSearchParams(form_data)

        fetch('http://localhost:3000/clientes', {
            method: 'POST',
            body: data
        }).then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));


    });
}



// const boton_agregar = document.querySelector('.clientes-agregar');


// boton_agregar.addEventListener('click', function () {
//     const registrar_cliente = document.querySelector('.registrar-cliente')

//     if (registrar_cliente) {

//     } else {
//         add_registrar_cliente();
//         addevent_rcliente();
//     }
// });

// function addevent_rcliente() {
//     const form_clientes = document.querySelector('.form-clientes');

//     form_clientes.addEventListener('submit', event => {
//         event.preventDefault();

//         const form_data = new FormData(form_clientes);
//         const data = new URLSearchParams(form_data)

//         fetch('http://localhost:3000/clientes', {
//             method: 'POST',
//             body: data
//         }).then(res => res.json())
//             .then(data => console.log(data))
//             .catch(error => console.log(error));


//     });
// }


// const boton_historial = document.querySelector('.clientes-historial');


// boton_historial.addEventListener('click', function () {
//     const registrar_cliente = document.querySelector('.registrar-cliente')

//     if (registrar_cliente) {
//         registrar_cliente.remove();
//     } else {
//         add_historial_cliente();
//     }
// });


{/* <div class="historial-cliente">
            <h1>Historial de cliente</h1>
            <form>
                <label for="nombre">Nombre:</label>
                <input class="rc-input-nombre" type="text" id="nombre" name="nombre"
                    placeholder="Ingrese el nombre del cliente" required>
                <button type="submit">Aceptar</button>

            </form>
        </div> */}

