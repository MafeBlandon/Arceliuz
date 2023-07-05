process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador

const assert = require('assert');
const controller = require('../../components/estados/controller')
const controllerUsers = require('../../components/users/controller')
const controllerDomiciliario = require('../../components/domiciliarios/controller')

const { ESTADOS, COLLECTIONS } = require('../../network/utils/estadosCollectionsNames.js');
const { pedidoPost } = require('../../components/pedidos/controller');
const { generateRandomDataPedido, generateRandomUserDomiciliario } = require('../../network/utils/faker');
const { findIdCollection } = require('../../network/utils/database/store');

describe('Funcianes del controller de los estados ', () => {
	//hacemos un nuevo pedido de pruva
	const dataPedido = generateRandomDataPedido()

	let idPedidoTest
	let pedidoNew
	it('llamando a los estados', async () => {
		pedidoNew = await pedidoPost(dataPedido)

		const rta = await controller.estadosGet(ESTADOS.Calientes)
		idPedidoTest = rta[0]?.data?.id
		assert.strictEqual(typeof rta, 'object');
	});

	it('hacemos un trasla1do de estado', async () => {
		const rta = () => { return controller.trasladarEstado(idPedidoTest, ESTADOS.Calientes, ESTADOS.Preparando) }
		assert.doesNotThrow(rta);
	});

	it('hacemos un trasla1do de estado a facurado', async () => {
		const pedido = await pedidoPost(generateRandomDataPedido())
		//const refPedido = await findIdCollection(pedido.id, COLLECTIONS.Pedidos)

		let dataUser = generateRandomUserDomiciliario()

		const userDomiciliario = await controllerUsers.userPost(dataUser)
		//const refDataDomiciliario = await controllerDomiciliario.domiciliarioGetIdFull(userDomiciliario.id)

		const date = new Date()

		const asiganion = await controllerDomiciliario.asignacion(pedido.id, userDomiciliario.id)

		await controller.trasladarEstado(pedido.id, ESTADOS.Calientes, ESTADOS.Preparando)
		await controller.trasladarEstado(pedido.id, ESTADOS.Preparando, ESTADOS.Espera)
		await controller.trasladarEstado(pedido.id, ESTADOS.Espera, ESTADOS.Despachados)
		// await controller.trasladarEstado(pedido.id, ESTADOS.Despachados, ESTADOS.Entregados)
		await controller.estadoEntregado(pedido.id)
		const refPedido = await findIdCollection(pedido.id, COLLECTIONS.Pedidos)
		console.log("🚀 ~ file: controller.test.js:52 ~ it ~ refPedido:", refPedido)

		const tras = await controller.estadoFacturado(pedido.id, userDomiciliario.id)
		//const idDomiciliario = await 
		assert.strictEqual(tras, 'todo melo ');
	});
})
