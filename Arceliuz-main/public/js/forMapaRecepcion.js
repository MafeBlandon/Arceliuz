// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let center = { lat: 6.2999347, lng: -75.5764272 }
let map
let mapDiv = document.getElementById("map")
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
// let autocomplete
var direccion
var objDireccion = {
	direccion: null,
	verificado: false
	//{
	//     "direccion": "Ac. 100, Bogotá, Colombia",
	//     "direccionIput": "Avenida Calle 100, Bogotá, Colombia",
	//     "coordenadas": {
	//         "lat": 4.687812099999999,
	//         "lng": -74.0584368
	//     },
	//     "verificado": true,
	//     "type": "placesAutocomplete"
	// }
}
//
document.addEventListener('load', initMap)
var autocompleteInput = document.getElementById('autocompleteInput')

function initMap() {
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

function mostrarEnMapa(center) {
	console.log('[mostrarEnMapa] center ', center)

	//aparecemos el mapa
	mapDiv.style = ''

	// console.log(center?.lng(), center?.lat())
	map = new google.maps.Map(mapDiv, {
		...mapConfig,
		center: center,
		zoom: 18,
	})

	const title = `
		<div style="color: black;" id="divAdentroMapa">
			<b>¿Estoy aqui?</b>
			asigurate que la direccion coincida con el mapa
		</div>
	`
	const marker = new google.maps.Marker({
		position: center,
		animation: google.maps.Animation.DROP,

		map: map,
		title: title,
		// label: `${(objetoFormulario.values.nombre).split(' ')[0]}`,
		body: '',
		optimized: false,
	})
	//activamos de una ves el make
	setTimeout(mostrarMaker(marker), 500)
	marker.addListener("click", mostrarMaker(marker))

	//calcular domicilio
	calcularDomicilio(center)
}

function displayBtnUbicaion(estado = true) {
	const btn_ubicacion = document.getElementById('get-coordinates')
	if (estado) {
		btn_ubicacion.style = 'display: block;'
	} else {
		btn_ubicacion.style = 'display: none;'
	}
}

async function onPlaceChanged() {
	console.log('[onPlaceChanged]')
	interuptorAlertGps(false)


	const alert = document.getElementById("alertDireccion");
	alert.style.display = "none";

	let place = autocomplete.getPlace();

	//escondemos el mapa
	interuptorMapa(true)

	// Verificar si la dirección es válida y completa
	if (place?.geometry) {
		console.log('[onPlaceChanged] place.geometry true ')
		displayBtnUbicaion(false)
		center = {
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng()
		}

		direccion = place.formatted_address

		objDireccion = {
			direccion: place.formatted_address,
			direccionIput: autocompleteInput.value,
			coordenadas: center,
			verificado: true,
			type: 'placesAutocomplete'
		}
		//marker
		mostrarEnMapa(center)
	}
	else {
		console.log('[onPlaceChanged] place.geometry false ')
		let direccionInput = document.getElementById('autocompleteInput')


		objDireccion = {
			direccion: direccionInput.value,
			verificado: false
		}
		displayBtnUbicaion()

	}

}

function interuptorMapa(estado = true, map = 'map') {
	let mapDiv = document.getElementById('map')
	let mapDiv2 = document.getElementById('map2')

	if (estado) {
		mapDiv.style = 'display: block;'
		mapDiv2.style = 'display: none;'

	} else {
		mapDiv.style = 'display: none;'
		mapDiv2.style = 'display: block;'
	}
	return mapDiv
}

function mostrarEnMapa(center) {
	console.log('[mostrarEnMapa] center ', center)

	//aparecemos el mapa
	mapDiv.style = ''

	// console.log(center?.lng(), center?.lat())
	map = new google.maps.Map(mapDiv, {
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
		// label: `${(objetoFormulario.values.nombre).split(' ')[0]}`,
		body: '',
		optimized: false,
	})
	//activamos de una ves el make
	setTimeout(mostrarMaker(marker), 500)
	marker.addListener("click", mostrarMaker(marker))

	//calcular domicilio
	calcularDomicilio(center)
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

async function calcularDomicilio(destino) {
	console.log('[calcularDomicilio]')

	const origen = { lat: 6.3017314, lng: -75.5743796 }

	// Crear una instancia de la clase DistanceMatrixService
	var service = new google.maps.DistanceMatrixService();

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

				// console.log("La distancia es: ", dataMatrix);

				añidirDomilicilio(dataMatrix)

			} else {
				// console.log("Error al calcular la distancia: " + status);
			}
		}
	)
}

function inputChange() {
	console.log('hjola')
	//debugger
	//esconsder mapa
	//interuptorMapa(false)
	//aparecemos aletar
	//interuptorAlertGps(true)

	interuptorMapa(false)
	initMapMove()

}

function obtenerUbicacion() {
	interuptorAlertGps(false)
	if (navigator.permissions) {
		navigator.permissions.query({ name: "geolocation" }).then(async function (permissionStatus) {
			if (permissionStatus.state === "granted") {
				console.log("Ya tienes permiso para acceder a la ubicación.");
			} else if (permissionStatus.state === "prompt") {
				console.log("Se solicitará permiso para acceder a la ubicación.");
				navigator.geolocation.getCurrentPosition(function (position) {
					console.log("Se ha obtenido la ubicación.");
				});
			} else {
				console.log("No tienes permiso para acceder a la ubicación.");
			}

			const coordenadas = await mostrarCoordenadas()

			objDireccion = {
				...objDireccion,
				direccion: await deCoodenadasAdireccion(coordenadas),
				coordenadas: coordenadas,
				verificado: false,
				type: 'GPS',
			}

			mostrarEnMapa(coordenadas)

		});
	} else {
		alert("Tu navegador no admite la API de permisos.");
	}
}
function interuptorAlertGps(estado = true) {
	const smallPedirGPS = document.getElementById('get-coordinates')
	if (estado) {
		smallPedirGPS.style = "display: block;"
	} else {
		smallPedirGPS.style = "display: none;"
	}
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


function mostrarCoordenadas() {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					const latitud = position.coords.latitude;
					const longitud = position.coords.longitude;

					const coordenadas = {
						lat: latitud,
						lng: longitud
					};
					console.log("Las coordenadas son: ", coordenadas);

					resolve(coordenadas);
				},
				function (error) {
					console.log("Error al obtener las coordenadas: " + error.message);
					reject(error);
				}
			);
		} else {
			console.log("Tu navegador no admite la API de geolocalización.");
			reject(new Error("API de geolocalización no disponible"));
		}
	});
}

function geocodeLatLng(geocoder, map, infowindow, latlng) {
	geocoder
		.geocode({ location: latlng })
		.then((response) => {
			if (response.results[0]) {
				const title = `Estoy aqui?.`
				const marker = new google.maps.Marker({
					position: latlng,
					map: map,
					center: latlng,
					animation: google.maps.Animation.DROP,
					zoom: 18,
					title: title,
					// label: `${(objetoFormulario.values.nombre).split(' ')[0]}`,
					body: '',
					optimized: false,
				});

				infowindow.setContent(title);
				infowindow.open(map, marker);
			} else {
				window.alert("No results found");
			}
		})
		.catch((e) => window.alert("Geocoder failed due to: " + e));
}

window.initMap = initMap;


function initMapMove() {
	// Creamos el mapa centrado en una ubicación inicial
	var map2 = new google.maps.Map(document.getElementById('map2'), {
		...mapConfig
	});

	// Creamos un marcador en el centro del mapa
	var marker = new google.maps.Marker({
		position: map2.getCenter(),
		map: map2,
		draggable: true
	});

	// Actualizamos las coordenadas del marcador al mover el mapa
	google.maps.event.addListener(map2, 'center_changed', function () {
		marker.setPosition(map2.getCenter());
		interuptorAlertGps(true)

	});

	// Actualizamos las coordenadas del centro del mapa al mover el marcador
	google.maps.event.addListener(marker, 'dragend', function () {
		map2.setCenter(marker.getPosition());
		interuptorAlertGps(true)

	});

	// Obtenemos las coordenadas del centro del mapa al hacer clic en el botón "Obtener coordenadas"
	document.getElementById('get-coordinates').addEventListener('click', function () {
		console.log('hoal')
		var centerMap2 = map2.getCenter();
		objDireccion = {
			...objDireccion,
			direccion: objDireccion.direccionIput,
			coordenadas: { lat: centerMap2.lat(), lng: centerMap2.lng() },
			verificado: false,
			type: 'GPS',
		}
		calcularDomicilio(center)

		interuptorAlertGps(false)
		//alert('huhuLas coordenadas del centro del mapa son: ' + centerMap2.lat() + ', ' + centerMap2.lng());
	});
}


