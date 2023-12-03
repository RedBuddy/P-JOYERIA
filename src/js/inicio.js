
const nivel_acceso = localStorage.getItem('nivel_acceso');
const sinlog = 'unloged';

if (nivel_acceso == 'unloged' || typeof nivel_acceso === 'undefined') {
    Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Por favor ingresa tus credenciales',
        allowOutsideClick: false
    }).then((result) => {
        if (!result.isDismissed) {
            window.location.href = '../../index.html';
        }
    });
}


const btn_logout = document.querySelector('.nav-link-logout');

btn_logout.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
    localStorage.setItem('nivel_acceso', sinlog);
})