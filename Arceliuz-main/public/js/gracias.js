const pedido = JSON.parse(localStorage.getItem("pedidoDomiburguer")).body;
console.log("🚀 ~ file: gracias.js:2 ~ pedido:", pedido)

//sacamos la duracion del valor duracionEstimada o buscamos en la orden el domicilio y en el guardamos la antidad en un strin y todo lo que hacemos es para recoger en minuto el tiempo
const duracionEstimada = pedido.duracionEstimada.value || pedido.order.filter(element => (element.id).includes('D'))[0].duration.text.split(" ")[0]
const precioTotal = pedido.priceTotal.priceTotal

//esto lo saque de gpt , me devuelce el numero en string y con puntos decimales
const formattedNumber = precioTotal.toLocaleString('es-ES', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }); // "12.000"


const spanTotal = document.getElementById('spanTotal')
const spanTiempo = document.getElementById('spanTiempo')

spanTotal.innerHTML = formattedNumber
spanTiempo.innerHTML = duracionEstimada