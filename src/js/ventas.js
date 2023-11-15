let opcionesVenta = document.querySelectorAll('.panel .nav-sup .nav-sup-link');
let divPanel = document.querySelector('.panel');
let opcionVentaSeleccionada;

opcionesVenta.forEach((opcion) => {
    opcion.addEventListener('click', e => {
      e.preventDefault();
      let opcionSeleccionada = e.target.classList;
      if(opcionSeleccionada.contains('venta-contado')){
        opcionVentaSeleccionada = 'venta-contado';
      }else if(opcionSeleccionada.contains('venta-credito')){
        opcionVentaSeleccionada = 'venta-credito';
      }else if(opcionSeleccionada.contains('registrar-abonos')){
        opcionVentaSeleccionada = 'registrar-abono';
      }else if(opcionSeleccionada.contains('historial-ventas')){
        opcionVentaSeleccionada = 'historial-venta';
      }
    pintarHtml();
    });
});


function pintarHtml(){
  limpiarHtml();
  let divDatosCompra = document.createElement('div');
  divDatosCompra.classList.add('form-datos');
  let campos;
  let claseDivPrincipal;

  if(opcionVentaSeleccionada === 'venta-contado' || opcionVentaSeleccionada === 'venta-credito'){
    campos = ['producto', 'cliente'];
    claseDivPrincipal = 'registrar-ventas'
  }else if(opcionVentaSeleccionada === 'registrar-abono'){
    campos = ['cliente'];
    claseDivPrincipal = opcionVentaSeleccionada;
  }else if(opcionVentaSeleccionada === 'historial-venta'){
    campos = ['venta', 'cliente'];
    claseDivPrincipal = opcionVentaSeleccionada;
  }

  divDatosCompra.innerHTML = crearFormulario(campos);
  divPanel.appendChild(divDatosCompra);

  let divPrincipal = document.createElement('div');
  console.log(claseDivPrincipal);
  divPrincipal.classList.add(claseDivPrincipal);
  if(claseDivPrincipal === 'registrar-ventas' && opcionVentaSeleccionada === 'venta-contado'){
    divPrincipal.innerHTML = `
    <div class="contenedor-productos-ventas">
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
</div>

<div class="tablas">
    <table class="tabla">
        <tr>
            <th>Borrar</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
        </tr>
    </table>

        <div class="btn">
            Finalizar
        </div>
    `;
  }else if(claseDivPrincipal === 'registrar-ventas' && opcionVentaSeleccionada === 'venta-credito'){
    divPrincipal.innerHTML = `
    <div class="contenedor-productos-ventas">
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
    <div class="producto">
    </div>
</div>

<div class="tablas">
    <table class="tabla">
        <tr>
            <th>Borrar</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
        </tr>
    </table>
    <div class="grupo-btn-ventas">
                    <div class="btn">
                        Finalizar
                    </div>
        
                    <div class="btn">
                        Plan de pagos
                    </div>
                  </div>
    `
  }else if(claseDivPrincipal === 'registrar-abono'){
    divPrincipal.innerHTML = `
    <div class="tablas">
        <table class="tabla">
            <tr>
                <th>ID de Venta</th>
                <th>Fecha de Venta</th>
                <th>ID de Cliente</th>
                <th>Monto Total</th>
                <th>Monto Pagado</th>
                <th>Monto Restante</th>
                <th>Estatus</th>
            </tr>
        </table>
            <div class="btn">
                Abonar a Cuenta
            </div>
    </div>
`;
  }else if(claseDivPrincipal === 'historial-venta'){
    divPrincipal.innerHTML = `
      <div class="tablas">
      <table class="tabla">
      <tr>
        <th>ID de Venta</th>
        <th>Fecha de Venta</th>
        <th>ID del Cliente</th>
        <th>Nombre del Cliente</th>
        <th>Productos</th>
        <th>Tipo de Venta</th>
        <th>Total</th>
        <th>Método de Pago</th>
        <th>Estatus</th>
      </tr>
      <!-- Agrega más filas según sea necesario -->
    </table>
      </div>
    `
  }

  divPanel.appendChild(divPrincipal);

}

function crearFormulario(campos) {
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

function limpiarHtml(){
  let opciones = ['form-datos','registrar-ventas','registrar-abono','historial-venta'];
  let selector = opciones.map(opc => '.' + opc).join(', ');
  let elementos = divPanel.querySelectorAll(selector);

  elementos.forEach(elemento => {
    elemento.remove();
  });
}