const { Client } = require('@googlemaps/google-maps-services-js');
const { KEYMAPS } = require('../../config');

const client = new Client({});

//calcular el tiempo del domicilio 
async function calcularDomicilio(destino) {
	try {
		/*La función utiliza la variable "destino" para especificar la ubicación de destino del viaje.*/
		console.log(`[calcularDomicilio] destino: ${destino}, key map $${KEYMAPS}`)


		/**
		 *   Luego, crea un objeto de parámetros con detalles
		  como la ubicación de origen, el modo de transporte (en este caso, 'TWO_WHEELER' 
		  que  indicar  motocicleta), una clave de API (almacenada en la variable "KEYMAPS"), 
		 y otras opciones relacionadas con la ruta
		 */
		const params = {
			origins: [{ lat: 6.3017314, lng: -75.5743796 }],
			destinations: [destino],
			mode: 'TWO_WHEELER',
			key: KEYMAPS,
			avoidHighways: false,
			avoidTolls: false,
			durationInTraffic: true,
		};

			/**A continuación, utiliza la función "distancematrix" del cliente  para calcular 
		 * la matriz de distancias y duraciones entre la ubicación de origen y la ubicación de destino 
		 * especificadas en los parámetros. 
		 * 
		 * */
		const distance = await client.distancematrix({ params })

			/**
		 * La respuesta se espera como una respuesta asincrónica y se almacena en la variable "distance". 
		 * Luego, se accede a la propiedad "rows" de los datos de distancia 
		 */
		const rta = distance.data.rows[0].elements
	   //	console.log("🚀 ~ file: calcularDomicilio.js:23 ~ calcularDomicilio ~ rta:", rta)

		return rta
		
		/**
		 * Si se produce un error durante el cálculo de la distancia, el código maneja el caso 
		 * específico de un error de conexión abortada ("ECONNABORTED"). 
		 * 
		 */

	} catch (error) {
		// console.log(error);
		if (error.code == 'ECONNABORTED') {
				/**
			* En este caso, se muestra un mensaje de error indicando que probablemente no hay 
			 * conexión a internet 
			 */
			console.log(`😡😡😡😡😡😡😡😡😡😡😡😡😡probablemente no hay internte y se te dara un ibjeto por defaul😡😡😡😡😡😡😡😡😡😡😡😡`);
			/**
			 * y se devuelve un objeto de respuesta predeterminado como si 
			 * el cálculo hubiera tenido éxito.
			 */
			const rtaDefalut = {
				"status": "OK",
				"origin_addresses": [
					"123 Main St, City, State, Country"
				],
				"destination_addresses": [
					"456 Elm St, City, State, Country"
				],
				"rows": [
					{
						"elements": [
							{
								"status": "OK",
								"duration": {
									"value": 1800,
									"text": "30 mins"
								},
								"distance": {
									"value": 1500,
									"text": "1.5 km"
								}
							}
						]
					}
				]
			}
			return rtaDefalut
		}

		/**
		 * En caso de cualquier otro error, se lanza el error original
		 */
		throw error
	}
}


function añidirDomilicilio(matrixDistancia) {

	// la función toma una matriz de distancia como argumento (matrixDistancia).

	
	//lo redondeanmoa a numero mas ssercanoo
	let prece = Math.round((matrixDistancia.distance.value) / 1000) * 1000

	/*Calcula el precio (prece) redondeando
     * el valor de matrixDistancia.distance.value dividido por 1000
     * y luego multiplicándolo por 1000.
    */
	if (prece < 3000) {
		prece = 3000
		/*
         * Si el precio calculado es menor que 3000, se establece en 3000
         */
	} else if (prece < 5500) {
		prece = 5000
		 /**
         * Si es menor que 5500, se establece en 5000.
         */
	}
	/**
         * Calcula la duración (durationText) redondeando hacia abajo el valor
         * de matrixDistancia.duration.value dividido por 60 y luego sumando 15.
         */

	//el 15 deberia de estar en los paramertros de configuracion
	const durationText = Math.floor(matrixDistancia.duration.value / 60) + 15
	const duration = {
		text: `${durationText} minutos`,
		value: durationText
	}
	
	 /**
         * Crea un objeto duration que contiene la duración en formato de texto y su valor numérico.
         */

	if (matrixDistancia.distance.value <= 100) {
		console.log(
			'el domicilio cus5tas 0 es menos de 100m ', {
			price: 0, duration: {
				text: `${15} minutos`,
				value: 15
			}
		}
		);
			/**
         * Si el valor de matrixDistancia.distance.value es menor o igual a 100,
         *  imprime en la consola un mensaje indicando que el domicilio cuesta 0 esto para tener control de los peridos cercanos 
         */
		return {
			price: 0, duration: {
				text: `${15} minutos`,
				value: 15
			}
			 /**
                * devuelve un objeto con el precio y la duración predefinidos.
             */
		}
	}
	console.log(
		'el domicilio cus5tas 0', { price: prece, duration: duration }
	);
	return { price: prece, duration: duration }
	/**
     * Si no se cumple la condición anterior,
     * imprime en la consola un mensaje indicando el precio del domicilio calculado y devuelve un objeto con el precio y la duración calculados.
     */

}

async function establcerDomicilio(destino) {
		/**
	 * //a función toma un argumento destino que se utiliza 
	 * como parámetro para llamar a la función calcularDomicilio(destino)
	 */
	try {
			/**
         * Utilizando la palabra clave await,
         * la función espera a que se resuelva la promesa devuelta por calcularDomicilio(destino).
         * El resultado se almacena en la variable matrixDistancia.
         */
		const matrixDistancia = await calcularDomicilio(destino)
		const domicilio = añidirDomilicilio(matrixDistancia[0])
		return { ...domicilio, id: `D${domicilio.price}`, name: `Domicilio${domicilio.price}`, imagen: "urlmoto", type: 'domicilio' }
	 /**
         * Se crea un objeto que combina las propiedades de domicilio devuelto por añidirDomilicilio,
         * junto con las propiedades id, name, imagen y type.
         * Este objeto resultante se devuelve como resultado de la función establcerDomicilio.
         */
	
	} catch (error) {
		throw error
		/**
         * Si ocurre algún error durante la ejecución del bloque try, se lanza el error utilizando throw error.
         */
	}
}

async function calcularCordenadas(adress) {
	try {
		const coordenadas = await obtenerCoordenadas(`${adress} Antioquia Medellin`)
		return coordenadas

	} catch (error) {
		console.log(`no se pudo encontrar cordenas validas mandaresno unas por defecto . error: ${error}`);
		return {
			"lat": 6.3019079,
			"lng": -75.5755085,
			"type": `default`
		}
	}
}

async function obtenerCoordenadas(direccion) {
	try {
		const response = await client.geocode({
			params: {
				address: direccion,
				key: KEYMAPS // Reemplaza con tu propia clave de API de Google Maps
			}
		});

		const results = response.data.results;

		if (results.length > 0) {
			const { lat, lng } = results[0].geometry.location;
			return { lat: lat, lng: lng };
		} else {
			throw new Error('No se encontraron resultados para la dirección proporcionada.');
		}
	} catch (error) {
		console.error(`Error al obtener las coordenadas: de la direccion ${direccion}`, error);
		throw error;
	}
}

module.exports = {
	calcularDomicilio,
	añidirDomilicilio,
	establcerDomicilio,
	calcularCordenadas,
	obtenerCoordenadas,
}