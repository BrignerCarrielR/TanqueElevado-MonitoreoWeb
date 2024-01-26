// configuracion de FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAYwDm4XeSq790QnLLF06AWID1xuEg_XmM",
    authDomain: "control-web-bcaf8.firebaseapp.com",
    databaseURL: "https://control-web-bcaf8-default-rtdb.firebaseio.com",
    projectId: "control-web-bcaf8",
    storageBucket: "control-web-bcaf8.appspot.com",
    messagingSenderId: "654778806495",
    appId: "1:654778806495:web:350bdae3e1bdc5a4d4796a",
    measurementId: "G-6LM7BD2524"
};

firebase.initializeApp(firebaseConfig);

const datosref = firebase.database().ref('Datos')



var speedCanvas = document.getElementById("speedChart");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

// Aquí defines tus datos de porcentaje

var porcentajes = [];
var scrollOffset = 0;
console.log(porcentajes)


var speedData = {
    labels: [],
    datasets: [{
        label: "Porcentaje",
        data: porcentajes, // Usa los datos de porcentaje aquí
        lineTension: 0,
        fill: false,
        borderColor: 'orange',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointBorderColor: 'orange',
        pointBackgroundColor: 'rgba(255,150,0,0.5)',
        pointRadius: 5,
        pointHoverRadius: 10,
        pointHitRadius: 30,
        pointBorderWidth: 2,
        pointStyle: 'rectRounded'
    }]
};
function generateTimeLabels(totalSeconds, interval) {
    const labels = [];
    for (let i = 0; i <= totalSeconds; i += interval) {
        labels.push(moment().startOf('minute').add(i, 'seconds').format('ss'));
    }
    return labels;
}

var chartOptions = {
    legend: {
        display: true,
        position: 'top',
        labels: {
            boxWidth: 80,
            fontColor: 'black'
        }
    }
};

var lineChart = new Chart(speedCanvas, {
    type: 'line',
    data: speedData,
    options: chartOptions
});

window.addEventListener('DOMContentLoaded', async (e) =>
    await datosref.on('value', (snapshot) => {
        const datosData = snapshot.val();

        // console.log(datosData);
        // guadar datos en una arreglo
        const datosArray = Object.values(datosData);
        console.log(datosArray);
        // guardar datos
        const D_cantflujo = datosArray[1];
        const D_porcentaje = datosArray[3];
        console.log('flujo', D_cantflujo)

        speedData.labels.push(moment().format('HH:mm:ss'));
        // Mantener una cantidad máxima de tomas de datos almacenadas
        const maxDataPoints = 10; // Cambia esto según tus necesidades
        if (porcentajes.length > maxDataPoints) {
            const removedPoints = porcentajes.length - maxDataPoints;
            porcentajes.splice(0, removedPoints); // Elimina los puntos excedentes
            speedData.labels.splice(0, removedPoints); // Elimina las etiquetas excedentes
            scrollOffset += removedPoints; // Ajusta el desplazamiento
        }
        porcentajes.push(D_porcentaje);
        lineChart.data.datasets[0].data = porcentajes;
        lineChart.data.labels = speedData.labels;
        lineChart.update();

        const gaugeElement = document.querySelector(".gauge");
        let porcentaje = document.getElementById('porcentaje');
        let cantidad = document.getElementById('cantidad');
        let ico_rojo = document.getElementById('ico_rojo');
        let ico_amarillo = document.getElementById('ico_amarillo');
        let ico_verde = document.getElementById('ico_verde');
        let bomba1_2 = document.getElementById('bomba1_2');
        let canflujo = document.getElementById('canflujo');
        let valor_nivel
        let nivel
        let mm

        porcentaje.textContent = String(D_porcentaje)
        canflujo.textContent = String(D_cantflujo)
        valor_nivel = D_porcentaje
        nivel = valor_nivel * 0.01
        console.log(nivel)
        mm = (valor_nivel * 900) / 100
        console.log(mm)

        function setGaugeValue(gauge, value) {
            if (value < 0 || value > 1) {
                return;
            }
            gauge.querySelector(".gauge__fill").style.transform = `rotate(${value / 2
                }turn)`;
        }
        setGaugeValue(gaugeElement, nivel);


        if (valor_nivel > 33) {
            cantidad.style.backgroundColor = "#1c3247"
            cantidad.textContent = String(mm) + ' mm'
            ico_rojo.disabled = false;
            bomba1_2.checked = true
        } else {
            cantidad.style.backgroundColor = "red"
            cantidad.textContent = String(mm) + ' mm'
            ico_rojo.disabled = true;
        }
        if (D_cantflujo > 0) {
            canflujo.style.backgroundColor = "#1c3247"
            canflujo.textContent = String(D_cantflujo) + ' ml'
        } else {
            canflujo.style.backgroundColor = "red"
            canflujo.textContent = String(D_cantflujo) + ' ml'
        }



        // semaforo
        if (valor_nivel >= 0 && valor_nivel <= 33) {
            ico_rojo.disabled = false
            ico_rojo.style.backgroundColor = "RED"
            bomba1_2.checked = true
        } else {
            ico_rojo.disabled = true
            ico_rojo.style.backgroundColor = "#d8d4ed"
        }
        if (valor_nivel >= 34 && valor_nivel <= 65) {
            ico_amarillo.disabled = false
            ico_amarillo.style.backgroundColor = "YELLOW"
        } else {
            ico_amarillo.disabled = true
            ico_amarillo.style.backgroundColor = "#d8d4ed"

        }
        if (valor_nivel >= 66 && valor_nivel <= 100) {
            ico_verde.disabled = false
            ico_verde.style.backgroundColor = "GREEN"
        } else {
            ico_verde.disabled = true
            ico_verde.style.backgroundColor = "#d8d4ed"
        }
        if (valor_nivel >= 90) {
            bomba1_2.checked = false
        }



    })
)

function ActualizarReloj() {
    const now = new Date();
    let hora = now.getHours();
    const ampm = hora >= 12 ? 'PM' : 'AM';
    hora = hora % 12 || 12;  // Convertir a formato de 12 horas
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const tiempo_string = `${hora}:${minutos} ${ampm}`;

    document.getElementById('reloj').textContent = tiempo_string;
}

// Actualizar el reloj cada segundo
setInterval(ActualizarReloj, 1000);

// Inicializar el reloj
ActualizarReloj();

