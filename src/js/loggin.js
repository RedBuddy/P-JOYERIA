
const form_loggin = document.querySelector('.formulario-login')
const nombreHtml = window.location.pathname.split("/").pop();

if (nombreHtml == 'index.html') {
    form_loggin.addEventListener('submit', event => {
        event.preventDefault();

        const form_data = new FormData(form_loggin);
        const data = new URLSearchParams(form_data);

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


export const verificar_permiso_subsistema = (rol, modulo) => {
    if (rol == 'Admin' || rol == 'Gerente') {
        return true;
    } else if (rol == 'Vendedor' && (modulo == 'ventas' || modulo == 'clientes' || modulo == 'garantias')) {
        return true;
    } else if (rol == 'Artesano' && (modulo == 'inventario')) {
        return true;
    } else if (rol == 'Almacenista' && (modulo == 'inventario')) {
        return true;
    } else if (rol == 'Atencion al cliente' && (modulo == 'clientes' || modulo == 'garantias')) {
        return true;
    } else if (rol == 'Contabilidad' && (modulo == 'informes')) {
        return true;
    } else if (rol == 'Encargado de compras' && (modulo == 'compras' || modulo == 'proveedores')) {
        return true;
    } else {
        return false;
    }
}



export const verificar_permiso_modulo = (rol, modulo, subsistema) => {

    if (subsistema == 'ventas') {
        if (rol == 'Admin' || rol == 'Gerente' || rol == 'Vendedor') {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'inventario') {
        if (rol == 'Admin' || rol == 'Gerente' || rol == 'Vendedor') {
            return true;
        } else if (rol == 'Artesano' && (modulo == 'producto_terminado' || modulo == 'almacen_pt')) {
            return true;
        } else if (rol == 'Almacenista' && (modulo == 'almacen_mp' || modulo == 'almacen_pt')) {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'clientes') {
        if (rol == 'Admin' || rol == 'Gerente' || rol == 'Vendedor' || rol == 'Atencion al cliente') {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'informes') {
        if (rol == 'Admin' || rol == 'Gerente' || rol == 'Contabilidad') {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'garantias') {
        if (rol == 'Admin' || rol == 'Gerente') {
            return true;
        } else if (rol == 'Atencion al cliente' && (modulo == 'registrar-garantias' || modulo == 'consultar-garantias' || modulo == 'registrar-devolucion-clientes')) {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'empleados') {
        if (rol == 'Admin' || rol == 'Gerente') {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'compras') {
        if (rol == 'Admin' || rol == 'Gerente' || rol == 'Encargado de compras') {
            return true;
        } else {
            return false;
        };
    } else if (subsistema == 'proveedores') {
        if (rol == 'Admin' || rol == 'Gerente' || rol == 'Encargado de compras') {
            return true;
        } else {
            return false;
        };
    } else {
        return false;
    };
};

export const contenido_denegado = () => {
    Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes acceso a este contenido',
        allowOutsideClick: false
    }).then((result) => {
        if (!result.isDismissed) {
            window.location.href = 'inicio.html';
        }
    });
}



