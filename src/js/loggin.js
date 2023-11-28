
const form_loggin = document.querySelector('.formulario-login')
var nombreHtml = window.location.pathname.split("/").pop();

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
}



