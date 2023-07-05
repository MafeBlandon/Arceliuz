/*este archivo consta de una serie de funciones las cuales 
utilizan la librería faker para datos aleatorios y así facilitar las pruebas */

// Importar la librería faker.js para generar datos aleatorios
const faker = require('faker');
const { ROLES } = require('../../network/utils/estadosCollectionsNames.js')
const roles = Object.values(ROLES)

// Generar un objeto de usuario aleatorio
const generateRandomUser = () => {
	const phoneNumber = '+57305' + faker.phone.phoneNumber('#######');

	const user = {
		"user": faker.internet.userName(),
		"password": faker.internet.password(),
		"role": faker.random.arrayElement([...roles]),
		"name": faker.name.findName(),
		"phone": phoneNumber,
		"email": faker.internet.email()
	};

	return user;
};

const generateRandomUserDomiciliario = () => {
	const phoneNumber = '+57305' + faker.phone.phoneNumber('#######');

	const user = {
		"user": faker.internet.userName(),
		"password": faker.internet.password(),
		"role": [ROLES.domiciliario],
		"name": faker.name.findName(),
		"phone": phoneNumber,
		"email": faker.internet.email()
	};

	return user;
};

// Generar coordenadas aleatorias dentro de Medellín
const generateRandomCoordinates = () => {
	// Límites geográficos de Medellín
	const minLat = 6.130833;
	const maxLat = 6.419231;
	const minLng = -75.676111;
	const maxLng = -75.493057;

	// Generar coordenadas aleatorias
	const latitude = Math.random() * (maxLat - minLat) + minLat;
	const longitude = Math.random() * (maxLng - minLng) + minLng;

	const coordinates = {
		"latitude": latitude,
		"longitude": longitude,
		"lat": latitude,
		"lng": longitude
	};

	return coordinates;
};

const generateRandomDataPedido = () => {
	const phoneNumber = '+57305' + faker.phone.phoneNumber('#######');
	const dataPedido = {
		"name": faker.name.findName(),
		"phone": phoneNumber,
		"order": [
			{
				"id": "1",
				"modifique": [
					{
						"id": "5"
					}
				]
			}
		],
		"address": {
			"address_complete": "calle 101 b  # 74 b a",
			"verified": false,
			"coordinates": generateRandomCoordinates()
		},
		"fee": faker.random.arrayElement(['Transferencia', 'Efectivo']),
		"note": faker.lorem.text()

	}
	return dataPedido
}

module.exports = {
	generateRandomUser,
	generateRandomUserDomiciliario,
	generateRandomCoordinates,
	generateRandomDataPedido,
}
