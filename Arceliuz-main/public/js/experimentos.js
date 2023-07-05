
function initMap() {
	console.log("🚀 ~ file: experimentos.js:3 ~ initMap ~ initMap:", initMap)
	// Creamos el mapa centrado en una ubicación inicial
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: { lat: 19.4326, lng: -99.1332 } // Coordenadas de la Ciudad de México
	});

	// Creamos un marcador en el centro del mapa
	var marker = new google.maps.Marker({
		position: map.getCenter(),
		map: map,
		draggable: true
	});

	// Actualizamos las coordenadas del marcador al mover el mapa
	google.maps.event.addListener(map, 'center_changed', function () {
		marker.setPosition(map.getCenter());
	});

	// Actualizamos las coordenadas del centro del mapa al mover el marcador
	google.maps.event.addListener(marker, 'dragend', function () {
		map.setCenter(marker.getPosition());
	});

	// Obtenemos las coordenadas del centro del mapa al hacer clic en el botón "Obtener coordenadas"
	// document.getElementById('get-coordinates').addEventListener('click', function () {
	// 	var center = map.getCenter();
	// 	alert('Las coordenadas del centro del mapa son: ' + center.lat() + ', ' + center.lng());
	// });
}
