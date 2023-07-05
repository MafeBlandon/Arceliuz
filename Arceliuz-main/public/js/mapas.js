// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let center = { lat: 6.2999347, lng: -75.5764272 }
let map
function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: center,
		zoom: 13,
		mapTypeControl: false,
	});

	autocomplete = new google.maps.places.Autocomplete(
		document.getElementById('autocomplete'), {
		types: ['address'],
		bounds: {//area de busqueda
			north: center.lat + 1,
			south: center.lat - 1,
			east: center.lng + 1,
			west: center.lng - 1,
		},
		strictBounds: true, // especifica si la API debe mostrar solo los lugares que están estrictamente dentro de la región definida por el bounds especificado
		componentRestrictions: { 'country': ['CO'] },
		fields: ['geometry', 'name', 'formatted_address'],
	}
	)

	autocomplete.addListener('place_changed', onPlaceChanged)

}


async function onPlaceChanged(e) {
	var place = autocomplete.getPlace()
	const infoWindow = new google.maps.InfoWindow();

	console.log(place?.geometry?.location?.lat())
	console.log(place, e)

	if (place.geometry) {
		console.log('too coorreog ')

		map = new google.maps.Map(document.getElementById("map"), {
			center: center,
			zoom: 13,
		});

		center = place.geometry
		const marker = new google.maps.Marker({
			position: { lat: 6.2999347, lng: -75.5764272 },
			map,
			title: `titulo`,
			label: `laeble`,
			optimized: false,
		})
		console.log(marker)

		marker.addListener("click", () => {
			infoWindow.close();
			infoWindow.setContent(marker.getTitle());
			infoWindow.open(marker.getMap(), marker);
		});


	}


}

console.log('hola mapas script')

window.initMap = initMap;