
const form_loggin = document.querySelector('.formulario-login')
const nombreHtml = window.location.pathname.split("/").pop();

if (nombreHtml == 'index.html') {
    form_loggin.addEventListener('submit', event => {
        event.preventDefault();

        const form_data = new FormData(form_loggin);
        const data = new URLSearchParams(form_data);

        var user = document.getElementById("user").value;
        var pass = document.getElementById("pass").value;

        // Mostrar los datos en la consola
        console.log("User:", user);
        console.log("Pass:", pass);

        fetch('http://localhost:3000/usuarios/credenciales', {
            method: 'POST',
            body: data
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data == "INVALIDO") {
                    //Mensaje de alerta con biblioteca sweetalert
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ingresa bien las credenciales',
                    });
                } else {
                    loggedin(data);
                }
            })
            .catch(error => console.log(error));

    })
}



const loggedin = (data) => {
    const nivel_acceso = data;
    localStorage.setItem('nivel_acceso', nivel_acceso);
    window.location.href = 'modulos/inicio.html';
};



export const verificar_permiso_modulo = (rol, modulo) => {

    if (rol == 'Admin' || rol == 'Gerente') {
        return true;
    } else if (rol == 'Vendedor' && (modulo == 'Registrar garantia' || modulo == 'Consultar garantia')) {
        return true;
    } else if (rol == 'Artesano' && (modulo == 'Producto terminado' || modulo == 'Almacen producto terminado')) {
        return true;
    } else if (rol == 'Almacenista' && (modulo == 'Almacen materia prima' || modulo == 'Almacen producto terminado')) {
        return true;
    } else if (rol == 'Atencion al cliente' && (modulo == 'Registrar garantia' || modulo == 'Consultar garantia' || modulo == 'Registrar devolucion de cliente')) {
        return true;
    } else if (rol == 'Contabilidad' && (modulo == 'Informes')) {
        return true;
    } else if (rol == 'Encargado de compras' && (modulo == 'Compras' || modulo == 'Proveedores')) {
        return true;
    } else {
        return false;
    }

};


export const verificar_permiso_subsistema = (rol, modulo) => {

    if (rol == 'Admin' || rol == 'Gerente') {
        return true;
    } else if (rol == 'Vendedor' && (modulo == 'ventas' || modulo == 'clientes' || modulo == 'garantias')) {
        return true;
    } else if (rol == 'Artesano' && (modulo == 'inventario')) {
        return true;
    } else if (rol == 'Almacenista' && (modulo == 'inventario')) {
        return true;
    } else if (rol == 'Atencion al cliente' && (modulo == 'garantias')) {
        return true;
    } else if (rol == 'Contabilidad' && (modulo == 'informes')) {
        return true;
    } else if (rol == 'Encargado de compras' && (modulo == 'compras' || modulo == 'proveedores')) {
        return true;
    } else {
        return false;
    }

}


