process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador


const assert = require('assert');
const { importarCliente, importsPedidos } = require('../../network/utils/imports/importaciones');

describe('Importacion  desde json de tridy', () => {
	//hacemos un nuevo pedido de pruva
	// it('importamos clietes desde los pedidos de tridy', async () => {
	// 	const dataClient = {
	// 		"responsable": "Domiburguer (DOMIBURGUER)",
	// 		"tienda_celular_contacto": "No permitido",
	// 		"tienda_nombre_contacto": "No permitido",
	// 		"tienda_nombre_tienda": "No permitido",
	// 		"proveedor_celular_contacto": "No permitido",
	// 		"proveedor_nombre_contacto": "No permitido",
	// 		"proveedor_nombre_tienda": "No permitido",
	// 		"mostrar_panel_dropshipping": "NO",
	// 		"mostrar_tienda_creadora": "NO",
	// 		"permite_solictar_anulacion_drop": "NO",
	// 		"es_venta_dropshipping": "NO",
	// 		"permite_solicitar_indemnizacion": "NO",
	// 		"estado_indemnizacion": "",
	// 		"permite_disputa": "NO",
	// 		"reasignar_domicilio": "NO",
	// 		"relacion_Actual": "",
	// 		"transportadora": "Domicilio",
	// 		"estado_pago": "Aceptado",
	// 		"fecha_programada": "",
	// 		"guia_en_novedad": "NO",
	// 		"estado": "Despachado",
	// 		"icono_programado": "NO",
	// 		"icono_anulado": "NO",
	// 		"icono_devuelto": "NO",
	// 		"icono_pagado": "SI",
	// 		"icono_guia": "SI",
	// 		"icono_exportado": "SI",
	// 		"icono_registrado": "NO",
	// 		"valor_recaudo": "16000",
	// 		"forma_de_pago": "Transferencia",
	// 		"mensajero": "Víctor123",
	// 		"origen": "Whatsapp",
	// 		"numero_guia": "1547485",
	// 		"telefono_destinatario": "3127270885",
	// 		"ciudad_destinatario": "medellin  (antioquia)",
	// 		"direccion_destinatario": "Calle 103C # 74 - 55 Barrio pedregal para diego",
	// 		"nombre_destinatario": "Daniel Sanchez",
	// 		"detalle_pedido": "1 Hamburguesa , 1 Domicilio 2500",
	// 		"fecha_pedido": "02/01/2022 - 08:57:28 p.m.",
	// 		"solicitud_de_pago": "NA",
	// 		"costo_envio": null, "precio_alterado": "NO",
	// 		"permite_anulaciones": "SI",
	// 		"estado_trasnportadora": "Despachado",
	// 		"estado_mixto": "En circulacion",
	// 		"generado_por": "39",
	// 		"url_rotulo_base": null, "url_rotulo": "https://triidyftp.s3.us-east-2.amazonaws.com/Guias/1547485.pdf",
	// 		"url_rotulo_sticker": null
	// 	}
	// 	const clietne = await importarCliente(dataClient)
	// 	console.log("🚀 ~ file: importaciones.test.js:61 ~ it ~ clietne:", clietne)
	// 	assert.strictEqual(typeof clietne, 'object');
	// });

	it('importamos un pedido desde los pedidos de tridy', async () => {
		const dataClient = {
			"responsable": "Domiburguer (DOMIBURGUER)",
			"tienda_celular_contacto": "No permitido",
			"tienda_nombre_contacto": "No permitido",
			"tienda_nombre_tienda": "No permitido",
			"proveedor_celular_contacto": "No permitido",
			"proveedor_nombre_contacto": "No permitido",
			"proveedor_nombre_tienda": "No permitido",
			"mostrar_panel_dropshipping": "NO",
			"mostrar_tienda_creadora": "NO",
			"permite_solictar_anulacion_drop": "NO",
			"es_venta_dropshipping": "NO",
			"permite_solicitar_indemnizacion": "NO",
			"estado_indemnizacion": "",
			"permite_disputa": "NO",
			"reasignar_domicilio": "NO",
			"relacion_Actual": "",
			"transportadora": "Domicilio",
			"estado_pago": "Aceptado",
			"fecha_programada": "",
			"guia_en_novedad": "NO",
			"estado": "Despachado",
			"icono_programado": "NO",
			"icono_anulado": "NO",
			"icono_devuelto": "NO",
			"icono_pagado": "SI",
			"icono_guia": "SI",
			"icono_exportado": "SI",
			"icono_registrado": "NO",
			"valor_recaudo": "16000",
			"forma_de_pago": "Transferencia",
			"mensajero": "Víctor123",
			"origen": "Whatsapp",
			"numero_guia": "1547485",
			"telefono_destinatario": "3127270885",
			"ciudad_destinatario": "medellin  (antioquia)",
			"direccion_destinatario": "Calle 103C # 74 - 55 Barrio pedregal para diego",
			"nombre_destinatario": "Daniel Sanchez",
			"detalle_pedido": "1 Hamburguesa , 1 Domicilio 2500",
			"fecha_pedido": "02/01/2022 - 08:57:28 p.m.",
			"solicitud_de_pago": "NA",
			"costo_envio": null, "precio_alterado": "NO",
			"permite_anulaciones": "SI",
			"estado_trasnportadora": "Despachado",
			"estado_mixto": "En circulacion",
			"generado_por": "39",
			"url_rotulo_base": null, "url_rotulo": "https://triidyftp.s3.us-east-2.amazonaws.com/Guias/1547485.pdf",
			"url_rotulo_sticker": null
		}
		const clietne = await importsPedidos([dataClient])
		console.log("🚀 ~ file: importaciones.test.js:61 ~ it ~ clietne:", clietne)
		assert.strictEqual(typeof clietne, 'object');
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
