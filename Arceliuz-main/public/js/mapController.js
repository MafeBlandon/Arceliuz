let center = { lat: 6.2999347, lng: -75.5764272 }


var mapConfig = {
	center: center,
	zoom: 14,
	disableDefaultUI: true,
	mapTypeControl: false,
	mapTypeControlOptions: {
		///style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
		mapTypeIds: ["roadmap", "terrain"],
	},
	restriction: {
		latLngBounds: {//area de busqueda
			north: center.lat + .5,
			south: center.lat - .5,
			east: center.lng + .5,
			west: center.lng - 1,
		},
		strictBounds: false,

	},
}

function initAutocomplete(autocompleteInput) {
	console.log("google:", google)

	const autocomplete = new google.maps.places.Autocomplete(
		autocompleteInput, {
		// types: ['address'],
		bounds: {//area de busqueda
			north: center.lat + 1,
			south: center.lat - 1,
			east: center.lng + 1,
			west: center.lng - 1,
		},
		// strictBounds: true, // especifica si la API debe mostrar solo los lugares que están estrictamente dentro de la región definida por el bounds especificado
		componentRestrictions: { 'country': ['CO'] },
		fields: ['geometry', 'name', 'formatted_address', 'type', 'address_components'],

	})
	console.log(`campo autocomplete activado`);
	//cada ves que se haga un cambio en el input de google maps

	return autocomplete
}

async function onPlaceChanged(autoComplete, callback) {
	console.log('[onPlaceChanged]')
	let place = autoComplete.getPlace();

	// Verificar si la dirección es válida y completa
	if (place?.geometry) {
		console.log('[onPlaceChanged] place.geometry true ')
		return callback(place)
	}
	else {
		console.log('[onPlaceChanged] place.geometry false ')
		return callback(null, true)
	}
}


function initMapAutocomplete(map) {
	console.log('[initMap]')

	map = new google.maps.Map(document.getElementById("map"), {
		...mapConfig
	});

	autocomplete = new google.maps.places.Autocomplete(
		autocompleteInput, {
		// types: ['address'],
		bounds: {//area de busqueda
			north: center.lat + 1,
			south: center.lat - 1,
			east: center.lng + 1,
			west: center.lng - 1,
		},
		// strictBounds: true, // especifica si la API debe mostrar solo los lugares que están estrictamente dentro de la región definida por el bounds especificado
		componentRestrictions: { 'country': ['CO'] },
		fields: ['geometry', 'name', 'formatted_address', 'type', 'address_components'],

	})
	autocomplete.addListener('place_changed', onPlaceChanged)
	autocompleteInput.addEventListener('change', displayBtnUbicaion)
	autocompleteInput.addEventListener('change', inputChange)
	autocompleteInput.addEventListener('change', () => objDireccion.direccionIput = autocompleteInput.value)
}

async function deCoodenadasAdireccion(cordenadas) {
	const geocoder = new google.maps.Geocoder();
	const infowindow = new google.maps.InfoWindow();
	console.log(cordenadas);

	try {
		const response = await geocoder.geocode({ location: cordenadas });
		if (response.results[0]) {
			console.log(response.results[0].formatted_address, 'response.results[0].formatted_address');
			return response.results[0].formatted_address;
		} else {
			window.alert("No results found");
		}
	} catch (error) {
		window.alert("Geocoder failed due to: " + error);
	}
}

function mostrarEnMapa(center, mapDiv) {
	console.log('[mostrarEnMapa] center ', center, mapDiv)

	//aparecemos el mapa
	mapDiv.style = 'height: 200px;'//le  ponemos una altura para que siempre se rederise

	// console.log(center?.lng(), center?.lat())
	const map = new google.maps.Map(mapDiv, {
		...mapConfig,
		center: center,
		zoom: 18,
	})

	const title = `
		<b>¿Estoy aqui?</b>
		asigurate que la direccion coincida con el mapa
	`
	const marker = new google.maps.Marker({
		position: center,
		animation: google.maps.Animation.DROP,

		map: map,
		title: title,
		body: '',
		optimized: false,
	})
	return marker
	//activamos de una ves el make
}

function mostrarMaker(marker) {
	console.log('[mostrarMaker]')
	const infoWindow = new google.maps.InfoWindow();

	return () => {
		infoWindow.close()
		infoWindow.setContent(marker.getTitle())
		infoWindow.open(marker.getMap(), marker)
	}
}


function initMapMove(mapDiv, button, callback) {//document.getElementById(map), document.getElementById(boton), callback (funcion que se ejecuta con cuanso se haga un cambion en las corrdenadas)
	console.log(`initMapMove`);
	// Creamos el mapa centrado en una ubicación inicial
	var map = new google.maps.Map(mapDiv, {
		...mapConfig
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
		callback(null, true)
	});

	// Actualizamos las coordenadas del centro del mapa al mover el marcador
	google.maps.event.addListener(map, 'zoom_changed', function () {
		marker.setPosition(map.getCenter());
		callback(null, true)
	});

	//cuando hacemos zoom
	google.maps.event.addListener(marker, 'dragend', function () {
		map.setCenter(marker.getPosition());
		callback(null, true)
	});

	// Obtenemos las coordenadas del centro del mapa al hacer clic en el botón "Obtener coordenadas"
	button.addEventListener('click', function () {
		// console.log(`hola ocmo esat$`, mapDiv, button, callback);
		var centerMap = map.getCenter();
		callback({ lat: centerMap.lat(), lng: centerMap.lng() })
	});
}

async function calcularDomicilio(destino) {
	return new Promise((resolve, reject) => {
		console.log('[calcularDomicilio]', destino)

		const origen = { lat: 6.3017314, lng: -75.5743796 }

		// Crear una instancia de la clase DistanceMatrixService
		// var service = new google.maps.DistanceMatrixService();

		// Definir la configuración para la solicitud

		var service = new google.maps.DistanceMatrixService();
		// Define el modo de transporte (en este caso "MOTORCYCLE" para moto).
		var modoTransporte = google.maps.TravelMode.TWO_WHEELER;

		// Envía una solicitud a DistanceMatrixService.

		service.getDistanceMatrix(
			{
				origins: [origen],
				destinations: [destino],
				travelMode: modoTransporte,
				unitSystem: google.maps.UnitSystem.METRIC,
				avoidHighways: false,
				avoidTolls: false,
				durationInTraffic: true, // Incluir tráfico en el cálculo

			},
			// En la respuesta, extrae la información de distancia.
			function (response, status) {
				if (status == "OK") {
					console.log(`hoal`, response);

					const dataMatrix = response.rows[0].elements[0]
					console.log("🚀 ~ file: mapController.js:222 ~ calcularDomicilio ~ dataMatrix:", dataMatrix)

					// console.log("La distancia es: ", dataMatrix);

					resolve(dataMatrix)

				} else {
					// console.log("Error al calcular la distancia: " + status);
					reject(response)
				}
			}
		)
	})

}

