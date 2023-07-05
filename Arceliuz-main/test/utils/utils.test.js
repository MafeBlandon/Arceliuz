process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador

const assert = require('assert');// verificar si una expresión es verdadera. Si la expresión es falsa, se lanza un error y se muestra un mensaje 
const calcularDomicilio = require('../../network/utils/calcularDomicilio')
const colors = require('../../network/utils/colors')
const faker = require('../../network/utils/faker')
const formatearPhone = require('../../network/utils/formatearPhone')

describe('todo lo refente a los domicilio ', () => {
	/**
	 * objeto llamado coordinates que contiene las coordenadas de latitud y longitud
	 */
	const corrdinates = {
		lat: 6.3384413,
		lng: -75.54889229999999
	}
	let matrix //variable undefined(sin  ningún valor)

	//hacemos pruebas 
	it('calcular distancia para el lugar', async () => {
		matrix = await calcularDomicilio.calcularDomicilio(corrdinates)//calculamos  la distancia
		assert.strictEqual(matrix[0].status, 'OK');//verifica si el primer elemento de la matriz tiene una propiedad status con el valor 'OK'.
		//1 assert.strictEqual verificar si dos valores son estrictamente iguales en cuanto a tipo y valor
		//2  matrix[0] El valor que se quiere comprobar.
		//3 status El valor que se espera que sea igual a matrix[0]
		//4 'OK' Un mensaje personalizado que se mostrará si la afirmación es falsa.
	});

	it('calcular costo del domicilio ', async () => {
		const costoDomicilio = calcularDomicilio.añidirDomilicilio(matrix[0])
		assert.strictEqual(costoDomicilio.price, 9000);
	});

	it('establecer destino  ', async () => {
		
		/**
		 *
		 * faker para generar coordenadas aleatorias mediante la función faker.generateRandomCoordinates().
		 *  Luego, pasa esas coordenadas
		 *  a la función calcularDomicilio.establecerDomicilio() y esperas obtener un objeto como resultado.
		 */
		const domicilio = await calcularDomicilio.establcerDomicilio(faker.generateRandomCoordinates())
		assert.strictEqual(typeof domicilio, 'object');
	});
})
/**
 * colors.generarColorPastel() para obtener un color pastel. 
 * Luego, utilizas assert.strictEqual() para verificar si el tipo de dato de colorPastel es una cadena (string).
 */

describe('colors', () => {
	it('colores pastales', () => {
		const colorPastel = colors.generarColorPastel()
		assert.strictEqual(typeof colorPastel, 'string');
	})
})

//Aca hacemos tambien pruebas generando usurios aleatorios para las funciones 
describe('fakers', () => {
	it('usuario aleatorio', () => {
		const user = faker.generateRandomUser()
		assert.strictEqual(typeof user.name, 'string');
	})

	it('usuario  domiciliario aleatorio', () => {
		const user = faker.generateRandomUserDomiciliario()
		assert.strictEqual(typeof user.name, 'string');
	})

	it('cooredenadas aleatorio', () => {
		const coordenadas = faker.generateRandomCoordinates()
		assert.strictEqual(typeof coordenadas.latitude, 'number');
	})

	it('data pedido', () => {
		const dataPedido = faker.generateRandomDataPedido()
		assert.strictEqual(typeof dataPedido, 'object');
	})
})


describe('phone', () => {
	it('Formateamos el telefono', () => {
		const phone = formatearPhone.formatearPhone('3054498598')
		assert.strictEqual(phone, '+573054498598');
	});
})