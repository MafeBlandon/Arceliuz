process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador


const assert = require('assert');
const controller = require('../../components/pedidos/controller')
const store = require('./../../network/utils/database/store')
const { ESTADOS, COLLECTIONS } = require('../../network/utils/estadosCollectionsNames.js');
const { generateRandomCoordinates, generateRandomDataPedido } = require('../../network/utils/faker');

describe('Funcianes del controller de los estados ', () => {
	//hacemos un nuevo pedido de pruva
	let dataPedido = generateRandomDataPedido()
	let order
	let pedidoGet


	it('Gestionamos el cliente', async () => {
		console.log("🚀 ~ file: controller.test.js:20 ~ it ~ dataPedido:", dataPedido)

		const cliente = await controller.establecerCliente(dataPedido)
		assert.strictEqual(typeof cliente, 'object');
	});

	it('establecer productos', async () => {
		const productos = await controller.establecerProductos(dataPedido.order)
		order = productos
		assert.strictEqual(typeof productos, 'object');
	});

	it('Calcular costo del pedido', () => {
		const costos = controller.calcularCost(order)
		assert.strictEqual(costos.priceTotal, 21000);
	});

	it('creamos un nuevo pedido', async () => {
		const pedidoTest = await controller.pedidoPost(dataPedido)
		assert.strictEqual(typeof pedidoTest.id, 'string');
	});

	it('Cambiar establecerNumeroDeOrdenDelDia ,miramo si el numero aumenta ', async () => {
		const primerNumero = await controller.establecerNumeroDeOrdenDelDia()
		const segundoNumero = await controller.establecerNumeroDeOrdenDelDia()
		assert.strictEqual(segundoNumero - primerNumero, 1);
	});

	it('llamando al todo los pedidos', async () => {
		const rta = await controller.pedidosGet()
		assert.strictEqual(typeof rta, 'object');
	});

	it('probando el filtrod de los pedidos ', async () => {
		const pedidoFil = await controller.pedidoFilter({ key: 'fee', value: 'Transferencia', options: '==' })
		pedidoGet = pedidoFil[0]
		assert.strictEqual(typeof pedidoFil, 'object');
	});

	it('confirmar el pago de  tranferencia', async () => {
		//anadimos un pedido con tranferencia
		let dataPedido2 = generateRandomDataPedido()
		dataPedido2 = {
			...dataPedido2,
			fee: 'Transferencia'
		}
		const pedidoTest = await controller.pedidoPost(dataPedido2)

		const rta = await controller.confirmarPagoTranferencia(pedidoGet.id)
		const pedioPagado = await controller.findFullDataController(pedidoGet.id)
		assert.strictEqual(pedioPagado.data.pagoConfirmado.confirmado, true);
	});

	it('llamando a un pdiods especifivo', async () => {
		const rta = await controller.findFullDataController(pedidoGet.id)
		assert.strictEqual(typeof rta, 'object');
	});

})
