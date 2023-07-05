process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador


const assert = require('assert');
const controller = require('../../components/domiciliarios/controller')
const controllerPedido = require('../../components/pedidos/controller')
const controllerUsers = require('../../components/users/controller')

const store = require('../../network/utils/database/store')
const { ESTADOS, COLLECTIONS } = require('../../network/utils/estadosCollectionsNames.js');
const { generateRandomUserDomiciliario } = require('../../network/utils/faker');

describe('Funcianes del controller de los domiciliarios  ', () => {
	//hacemos un nuevo pedido de pruva
	let dataUser = generateRandomUserDomiciliario()
	let PEDIDO = {
		"name": "Kelvin Gutkowski",
		"phone": "3054498598",
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
			"coordinates": {
				"lat": 6.2999347,
				"lng": -75.5764272
			}
		},
		"fee": "Transferencia",
		"note": "compress Granite convergence"
	}
	let dataPedido = {
		"name": "Kelvin Gutkowski",
		"phone": "3054498598",
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
			"coordinates": {
				"lat": 6.2999347,
				"lng": -75.5764272
			}
		},
		"fee": "Transferencia",
		"note": "compress Granite convergence"
	}
	let order
	let pedidoGet
	let domiciliairoId
	let pedidoId
	let pedidoCreado
	let domiciliairoCreado

	it('creamos un nuevo domiciliario', async () => {
		let dataUser = generateRandomUserDomiciliario()

		const user = await controllerUsers.userPost(dataUser)
		domiciliairoId = user.id
		assert.strictEqual(typeof user, 'object');
	});

	it('creamos un nuevo pedido', async () => {
		const pedidoTest = await controllerPedido.pedidoPost(dataPedido)
		pedidoCreado = pedidoTest
		pedidoId = pedidoTest.id
		assert.strictEqual(typeof pedidoTest.id, 'string');
	});

	it('bsucando todo los domiciliarios', async () => {
		const domiciliairos = await controller.domiciliariosGet()
		assert.strictEqual(typeof domiciliairos, 'object');
	});

	it('bsucando un  domiciliario por el id', async () => {
		const domiciliairo = await controller.domiciliarioGetIdFull(domiciliairoId)
		domiciliairoCreado = domiciliairo
		assert.strictEqual(domiciliairo.data.id, domiciliairoId);
	});

	it('asignarEnDomiciliario  ', async () => {
		let domiciliairo = await controller.domiciliarioGetIdFull(domiciliairoId)
		const lengthPre = domiciliairo.data.domiciliario?.pedidos_asignados?.length || 0

		const date = new Date
		const newPedido = await store.findIdCollection(pedidoCreado.id, COLLECTIONS.Pedidos)

		const asiganion = await controller.asignarEnDomiciliario(newPedido.ref, domiciliairoCreado, date)

		domiciliairo = await controller.domiciliarioGetIdFull(domiciliairoId)
		const lengthPos = domiciliairo.data.domiciliario.pedidos_asignados.length

		assert.strictEqual(lengthPos - lengthPre, 1)
	});

	it('asignacion de pedido ', async () => {
		
		const asignacion = await controller.asignacion(pedidoId, domiciliairoId)

		// const domiciliairo = await controller.domiciliarioGetIdFull(domiciliairoId)
		// domiciliairoCreado = domiciliairo
		assert.strictEqual(asignacion, 'asignado');
	});
	it('reasignar domicilio', async () => {
		let dataUserNew = generateRandomUserDomiciliario()
		const userNew = await controllerUsers.userPost(dataUserNew)
		let domiciliairoIdNew = userNew.id

		const reasignacion = await controller.reasignacion(pedidoId, domiciliairoIdNew)

		assert.strictEqual( reasignacion, 'asignado');
	});

})
