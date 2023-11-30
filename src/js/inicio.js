
const nivel_acceso = localStorage.getItem('nivel_acceso');
console.log(nivel_acceso)

if (nivel_acceso == null) {
    Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes acceso a este contenido',
        allowOutsideClick: false
    }).then((result) => {
        if (!result.isDismissed) {
            window.location.href = '../../index.html';
        }
    });
}