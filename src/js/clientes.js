
export const hola = () => console.log('hola')

// document.addEventListener('DOMContentLoaded', function () {
//     agregarcosa();
// });


function agregarcosa() {
    const panel = document.querySelector('.panel-clientes')


    const registrar_cliente = document.createElement('div');
    registrar_cliente.classList.add('registrar-cliente');
    registrar_cliente.innerHTML = `<h1>Registro de cliente</h1>
    <form>
        <label for="nombre">Nombre:</label>
        <input class="rc-input-nombre" type="text" id="nombre" name="nombre" placeholder="Ingrese el nombre"
            required>

        <label for="direccion">Dirección:</label>
        <input class="rc-input-direccion" type="text" id="direccion" name="direccion"
            placeholder="Ingrese la dirección" required>

        <label for="telefono">Teléfono:</label>
        <input class="rc-input-telefono" type="text" id="telefono" name="telefono"
            placeholder="Ingrese el número de teléfono" required>

        <label for="email">Correo Electrónico:</label>
        <input class="rc-input-email" type="email" id="email" name="email"
            placeholder="Ingrese el correo electrónico" required>

        <button class="boton-registrar" type="submit">Registrar</button>
    </form>`;


    panel.appendChild(registrar_cliente);

}


const boton_agregar = document.querySelector('.clientes-agregar');


boton_agregar.addEventListener('click', function () {
    const registrar_cliente = document.querySelector('.registrar-cliente')

    if (registrar_cliente) {

    } else {
        agregarcosa();
    }
});

const boton_historial = document.querySelector('.clientes-historial');


boton_historial.addEventListener('click', function () {
    const registrar_cliente = document.querySelector('.registrar-cliente')

    if (registrar_cliente) {
        registrar_cliente.remove();
    } else {
        agregarcosa();
    }
});

