process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador


const assert = require('assert');
const controller = require('../../components/users/controller')
const store = require('../../network/utils/database/store')
const { ESTADOS, COLLECTIONS } = require('../../network/utils/estadosCollectionsNames.js');

/**
 * una prueba para las funciones del controlador de estados, 
 * específicamente para la función controller.userPost()
 */

/**
 * creamos un nuevo usuario utilizando la función controller.userPost() y 
 * pasando los datos del usuario en el objeto dataUser.
 *  
 */

describe('Funcianes del controller de los estados ', () => {
	//hacemos un nuevo pedido de pruva
	let dataUser=  {
    "user": "Jesed hjosl d",
    "password": "maria300",
    "role": "admin",
    "name": "Maria Jesed",
    "phone": "3006740076",
    "email": "pmonrtes@gima.com"
}
	let order
	let pedidoGet

	it('creando nuevo usuari', async () => {
		const user = await controller.userPost(dataUser)
		console.log("🚀 ~ file: controller.test.js:41 ~ it ~ user:", user)
		//Luego, utilizas assert.strictEqual() para verificar si el tipo de dato de user es un objeto.
		assert.strictEqual(typeof user, 'object');
	});

	// it('establecer productos', async () => {
	// 	const productos = await controller.establecerProductos(dataPedido.order)
	// 	order = productos
	// 	assert.strictEqual(typeof productos, 'object');
	// });

	// it('Calcular costo del pedido', () => {
	// 	const costos = controller.calcularCost(order)
	// 	assert.strictEqual(costos.priceTotal, 21000);
	// });

	// it('creamos un nuevo pedido', async () => {
	// 	const pedidoTest = await controller.pedidoPost(dataPedido)
	// 	assert.strictEqual(typeof pedidoTest.id, 'string');
	// });

	// it('Cambiar establecerNumeroDeOrdenDelDia ,miramo si el numero aumenta ', async () => {
	// 	const primerNumero = await controller.establecerNumeroDeOrdenDelDia()
	// 	const segundoNumero = await controller.establecerNumeroDeOrdenDelDia()
	// 	assert.strictEqual(segundoNumero - primerNumero, 1);
	// });

	// it('llamando al todo los pedidos', async () => {
	// 	const rta = await controller.pedidosGet()
	// 	assert.strictEqual(typeof rta, 'object');
	// });

	// it('probando el filtrod de los pedidos ', async () => {
	// 	const pedidoFil = await controller.pedidoFilter({ key: 'fee', value: 'Transferencia', options: '==' })
	// 	pedidoGet = pedidoFil[0]
	// 	assert.strictEqual(typeof pedidoFil, 'object');
	// });

	// it('confirmar el pago de  tranferencia', async () => {
	// 	const rta = await controller.confirmarPagoTranferencia(pedidoGet.data.id)
	// 	const pedioPagado = await controller.findFullDataController(pedidoGet.data.id)
	// 	assert.strictEqual(pedioPagado.data.pagoConfirmado.confirmado, true);
	// });

	// it('llamando a un pdiods especifivo', async () => {
	// 	const rta = await controller.findFullDataController(pedidoGet.data.id)
	// 	assert.strictEqual(typeof rta, 'object');
	// });
})
