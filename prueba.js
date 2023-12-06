document.addEventListener('DOMContentLoaded', async function () {

    let objeto = {
        "Fecha_inicio" : "2023-01-1",
        "Fecha_fin"  : "2023-12-31"
    }


    let valor = await ponerDatos('obtenerVentasTotales', objeto);

    console.log(valor);

    var salesData = {
      labels: [""],
      datasets: [
        {
          label: 'Ventas',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: [65],
        },
        {
          label: 'Compras',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          data: [28],
        },
      ],
    };
  
    // Crear un elemento canvas y agregarlo al contenedor
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    document.getElementById('chartContainer').appendChild(canvas);
  
    // Configurar el contexto y dibujar el gráfico
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: salesData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
  

async function ponerDatos(tipoTabla, objetoForm) {
  try {
    const response = await fetch(`http://localhost:3000/${tipoTabla}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objetoForm)
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Propagar el error para que pueda ser manejado externamente si es necesario
  }
}