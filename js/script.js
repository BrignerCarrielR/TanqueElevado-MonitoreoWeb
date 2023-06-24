function Llenartanque() {
    var valor = document.getElementById("valor").value;
    var nivelagua = document.getElementById("nivelagua");
    var flujo = document.getElementById("flujo");
    var porcentaje = document.getElementById("porcentaje");
    var mm = document.getElementById("mm");
    var cantidadagua = document.getElementById("cantidadagua");

    // Actualizar la altura del líquido en función de la variable "fillLevel"
    nivelagua.style.height = (valor) + "%";
    var resta = 0.5; // El valor a restar en cada iteración
    var duracion = 500; // La duración en milisegundos entre cada iteración
    var totalIteraciones = valor / resta; // El número total de iteraciones

    for (var i = 0; i < totalIteraciones; i++) {
        // Utilizar setTimeout para crear una pausa entre cada iteración
        setTimeout(function () {
            valor -= resta;
            porcentaje.textContent = String(valor) + ' %.'
            let cantidad = (valor * 800) / 100
            mm.textContent = String(cantidad) + 'mm'
            if (valor < 33) {
                cantidadagua.style.backgroundColor = "red"
            }
            nivelagua.style.height = (valor) + "%";
            console.log(valor)
            if (valor < 10) {
                flujo.style.backgroundColor = "red"
            }
        }, duracion * i);
    }
    if (valor > 10) {
        flujo.style.backgroundColor = "green"
    }
    if (valor > 33) {
        cantidadagua.style.backgroundColor = "green"
    }
}
