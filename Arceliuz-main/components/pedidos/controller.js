const storeDb = require("../../network/utils/database/store.js")
//storeDb es el controlador que hay la base de datos 
const controllerCliente = require("./../clientes/controller")
const controllerEstados = require("./../estados/controller")

const boom = require("@hapi/boom")
const { establcerDomicilio } = require("../../network/utils/calcularDomicilio.js")

const { productoGet, productoFilter } = require("../productos/controller.js")

const { COLLECTIONS, ESTADOS } = require('../../network/utils/estadosCollectionsNames.js')
const { formatearPhone } = require("../../network/utils/formatearPhone.js")

async function pedidoPost(data) {//podemos buscar los codigos de rederios por nombre o todos
	try {
		console.log('[Controller Pedidos] ', 'nuevo pedido')
		//debemos de formatear el telefon para que tenga el codio del pais 
		data.phone = formatearPhone(data.phone)
		//miramos que no exista ya un cliente con ese numero de telefono
		const clienteNow = await establecerCliente(data)
		console.log("🚀 ~ file: controller.js:21 ~ pedidoPost ~ clienteNow:", clienteNow)

		const products = await establecerProductos(data.order)
		//calculamos cuanto cuesta el domicilio 
		const costoDomicilio = await establcerDomicilio(data.address.coordinates)

		data.order = products
		data.order.push(costoDomicilio)

		const priceTotal = calcularCost(data.order)

		//eatablecemos el valor del numer del telefon de hoy
		const numeroDeOrdenDelDia = await establecerNumeroDeOrdenDelDia()
		// Obtener la hora actual en UTC
		// Crear un objeto Date con la hora en Colombia
		const date = new Date();

		const fullData = {
			...data,
			clientId: clienteNow.id,
			priceTotal: priceTotal,
			pagoConfirmado: {
				time: null,
				confirmado: false
			},
			date: date,
			estado: data.estado ? data.estado : ESTADOS.Calientes,//establecemos un estado automatico si no hay uno
			timelapseStatus: [{ date, estado: data.estado ? data.estado : ESTADOS.Calientes }],
			numeroDeOrdenDelDia,
			duracionEstimada: costoDomicilio.duration
		}
		console.log("🚀 ~ file: controller.js:38 ~ pedidoPost ~ fullData:", fullData)

		//añadimos el pedido
		// const pedidoAdd = await storeDb.addDoc(fullData, COLLECTIONS.Pedidos)
		// const pedidoInClientAdd = await storeDb.addDoc(fullData, findCliente[0].id)

		const pedidoAddc = await pedidoAdd(fullData, clienteNow.id)

		//devolvemos el pedidom como se creo
		console.log(`[Controller Pedidos]  pedido creado ${{ ...fullData, id: pedidoAddc.ref.id }}`)


		return { ...fullData, id: pedidoAddc.ref.id }
	} catch (error) {
		console.log(error)
		throw error
	}

}

async function pedidoAdd(fullData, clientId) {
	try {
		// console.log("🚀 ~ file: controller.js:75 ~ pedidoAdd ~ fullData:", fullData)

		const pedido = await storeDb.addDoc(fullData, COLLECTIONS.Pedidos)//referencia del pedido
		const pedidoId = pedido.ref.id
		//guardamos la rerferencia del pedido en el documento del cliente en una subcollecion de 'Pedidos'
		const capas = [
			{ collection: COLLECTIONS.Clientes, id: clientId },
			{ collection: COLLECTIONS.Pedidos, id: pedidoId },
		]
		const clenteRef = await storeDb.addDocSub({ ref: pedido.ref }, capas)

		return { ref: pedido.ref, id: pedidoId }
	} catch (error) {
		throw error

	}
}

//falta un trycahat
async function establecerCliente(data) {
	try {
		console.log(`[Controller Pedidos]  establecerCliente ${data.phone}`)

		const findCliente = await storeDb.findFilter(COLLECTIONS.Clientes, {
			key: "phone",
			options: "==",
			value: data.phone
		})
		const clienteBuscado = findCliente[0] || false

		//si no hay un cliente lo cramos
		if (clienteBuscado.data == undefined) {
			console.log(`creando nuevo cliente`);
			const newClient = await controllerCliente.clientePost({
				phone: data.phone,
				address: data.address,
				name: data.name
			})

			//aqui podriamos crear el cliete automaticamente si quisieramos
			//throw boom.conflict('no existe un cliente con el mismo numero de telefono ')
			// return { data: { ...fullData, id: cliente.id }, ref: cliente.ref, id: cliente.id }
			return newClient//retornamos el su misma funcion para porque ya estara el cliente creado y no caera en este return 
		}

		//miramos si los datos de telefono o direccion cambiaron
		if (data.address.address_complete != clienteBuscado.data.address.address_complete ||
			data.name != clienteBuscado.data.name) {
			console.log(`[Controller Pedidos]  establecer
			Cliente  los datos cambiaron desde la ultima vez phone: ${data.phone}`)

			//actualizamos los datos
			const clientUpdate = await controllerCliente.clienteUpdate({
				name: data.name,
				address: data.address,
				phone: data.phone
			})

			data = {
				data: {
					...clienteBuscado.data,
					...{ name: data.name, address: data.address, phone: data.phone },
				},
				ref: clienteBuscado.ref,
				id: clienteBuscado.id,
			}

			return data

		}

		// return {data :{...}, ref: ... id: ...}

		data = {
			data: data,
			ref: clienteBuscado.ref,
			id: clienteBuscado.id,
		}

		return data
	} catch (error) {
		throw error
	}
}



async function establecerNumeroDeOrdenDelDia() {
	let numero = 1
	try {
		const numeroDeOrden = await storeDb.findIdCollection('numeroDeOrden', COLLECTIONS.parametrosYconfiguracion)
		numero = numeroDeOrden.data.numeroDeOrden + 1 || 1
		const actualisamosNumero = await storeDb.updateDoc(numeroDeOrden.ref, { numeroDeOrden: numero })
		return numero
	} catch (error) {
		const creamosNumero = await storeDb.addDoc({ numeroDeOrden: numero }, COLLECTIONS.parametrosYconfiguracion, 'numeroDeOrden',)
		return numero
	}
}

async function pedidosGet() {
	try {
		const pedidos = await storeDb.findCollection(COLLECTIONS.Pedidos)
		return pedidos
	} catch (error) {
		throw error
	}
}

async function pedidoGet(id) {
	try {
		const pedido = await storeDb.findIdCollection(id, COLLECTIONS.Pedidos)
		return pedido
	} catch (error) {
		throw error
	}

}

async function pedidoFilter(filter) {
	try {
		const pedidos = await storeDb.findFilter(COLLECTIONS.Pedidos, filter)
		return pedidos
	} catch (error) {
		throw error
	}
}

async function findFullDataController(id) {
	try {
		console.log('[Controlle pedido] ', 'find pedido', id)
		const pedido = await storeDb.findIdCollection(id, COLLECTIONS.Pedidos)
		return pedido
	} catch (error) {
		throw error
	}
}

async function establecerProductos(orden) {
	try {
		//console.log(`{establecerProductos `, orden);
		//sale mas barato leer toda la collercicon de producot y eler eso luego 
		let productosAdiciones = []
		let productos = []
		for (const key in orden) {
			try {
				const element = orden[key];
				let producto = await productoGet(element.id)
				producto = producto.data

				delete producto.dataUpdate
				delete producto.dateUpdate
				delete producto.dataCreate

				//mirar si se hicieron especificaciones
				if (element.modifique) {
					productosAdiciones = await productoFilter({ key: "type", value: "Adicion", options: "==" })
					producto.modifique = []
					for (const i in element.modifique) {
						const elementAdiciones = element.modifique[i];
						const indexAdicion = productosAdiciones.findIndex(e => e.id == elementAdiciones.id)
						const adicionDefinitivo = productosAdiciones[indexAdicion].data
						producto.modifique.push(adicionDefinitivo)
						producto.price += adicionDefinitivo.price
					}
				}

				productos.push(producto)
			} catch (error) {
				throw error
			}
		}
		console.log("🚀 ~ file: controller.js:217 ~ productos:", productos)

		return productos
	} catch (error) {
		throw error
	}
}

function calcularCost(data) {
	const costo = data.reduce((a, b) => a + b.price, 0)
	return { COP: `$${String(costo)}`, priceTotal: costo }
}

//esto deberia de estar en estados
async function confirmarPagoTranferencia(id) {
	try {
		const pedido = await storeDb.findIdCollection(id, COLLECTIONS.Pedidos)

		if (pedido.data.fee == 'Efectivo') throw 'el pedido no es una trasferencia, no lo puedes confirmar su pago'

		const now = new Date();

		const dataUpdate = {
			pagoConfirmado: {
				time: now,
				confirmado: true
			},
		}
		const agregarConfiramacion = await storeDb.updateDoc(pedido.ref, dataUpdate)
		console.log(`[confirmarPagoTranferencia] el pedido ${id}, se confirmo la tranferencia`);
		///validamos si esta en el estados de PendieteTransferencia para poner en facturados
		if (pedido.data.estado == 'PendieteTransferencia') {
			const pendieteTransferenciaTras = await controllerEstados.trasladarEstado(pedido.data.id, "PendieteTransferencia", "Facturados")//si ya esta pago lo pasamos al facturasodos
		}
		return agregarConfiramacion
	} catch (error) {
		throw error
	}
}

async function cambioDeFee(id, fee) {
	try {
		const pedido = await storeDb.findIdCollection(id, COLLECTIONS.Pedidos)
		if (fee != `Transferencia` && fee != `Efectivo`) throw `meto de pago no exixtente`
		if (pedido.data.fee == fee) throw 'el pedido  ya esta con es metodo de pago '

		let dataUpdateTimeLapse = []
		if (pedido.data.dataUpdateTimeLapse) dataUpdateTimeLapse = pedido.data.dataUpdateTimeLapse
		const now = new Date();

		const actulisacion = {
			date: now,
			data: {
				fee: pedido.data.fee
			}
		}

		dataUpdateTimeLapse.push(actulisacion)

		const dataUpdate = {
			fee: fee,
			dataUpdateTimeLapse: dataUpdateTimeLapse
		}

		const actualisar = await storeDb.updateDoc(pedido.ref, dataUpdate)
		///validamos si esta en el estados de PendieteTransferencia para poner en facturados

		return actualisar
	} catch (error) {
		throw error
	}
}

module.exports = {
	pedidoPost,
	pedidoAdd,
	pedidosGet,
	pedidoGet,
	pedidoFilter,
	findFullDataController,
	confirmarPagoTranferencia,
	establecerCliente,
	calcularCost,
	establecerProductos,
	establcerDomicilio,
	establecerNumeroDeOrdenDelDia,
	cambioDeFee,
}
