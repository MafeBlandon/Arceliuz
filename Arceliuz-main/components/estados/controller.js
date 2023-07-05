const storeDb = require("../../network/utils/database/store.js")
const boom = require("@hapi/boom")
const { COLLECTIONS, ESTADOS, ROLES } = require('../../network/utils/estadosCollectionsNames.js')

const calientes = 'Calientes'
const preparando = 'Preparando'
const espera = 'Espera'
const despachados = 'Despachados'
const entregados = 'Entregados'
const facturados = 'Facturados'
const clientes = 'Clientes'
const pedidos = 'Pedidos'
const estados = 'Estados'
const pendieteTransferencia = 'PendieteTransferencia'


async function estadosGet(estado) {
	try {
		if (!ESTADOS[estado]) throw boom.badData(`no existe este estado ${estado}`)

		const filter = { key: 'estado', options: '==', value: ESTADOS[estado] }
		const docsRef = await storeDb.findFilter(COLLECTIONS.Pedidos, filter)//recogemos todo los documentos de la collecion calientes (las referencia de los pedidos en un lista)
		return docsRef
	} catch (error) {
		throw error
	}
}


async function trasladarEstado(idPedido, estadoPre, estadoPos) {
	try {
		console.log(`[trasladarEstado] idPedido, estadoPre, estadoPos  ${idPedido, estadoPre, estadoPos}`);

		if (!ESTADOS[estadoPre]) throw boom.badData(`no existe este estadoPre ${estadoPre}`)
		if (!ESTADOS[estadoPos]) throw boom.badData(`no existe este estadoPos ${estadoPos}`)
		///devemos de hacer un manejador de rroara para que si sigan borrran las cosas aunque falle algo 
		const nowDate = new Date();

		//cambiar el estado del pedido 
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)

		if (pedido.data.estado != estadoPre) {
			throw `no es valido el estado pre , no te puede pasar  los otros estados, primero debe de pasar por le estado de ${estadoPre}`
		}

		const { valid, message } = condicionesTraslados(pedido, estadoPos)
		if (!valid) throw boom.badData(message)

		const pedidoModifiacaso = await storeDb.updateDoc(pedido.ref, {
			estado: estadoPos,
			//timelapse para tener un registro del tiempo del cambio del estado
			timelapseStatus: pedido.data.timelapseStatus.concat({ nowDate, estado: estadoPos })
		})
		//crear referencia en nuevo estado 
		//const newEstado = estadosAdd(idPedido, pedido.ref, estadoPos)
		return 'todo  melo'
	} catch (error) {
		throw error
	}
}

async function elminarPedido(idPedido, estadoPos) {
	try {
		///devemos de hacer un manejador de rroara para que si sigan borrran las cosas aunque falle algo 
		//eliminarmos de calientes

		const now = new Date();

		const date = now

		//cambiar el estado del pedido 
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)
		console.log("eliminando el pedido ", pedido)

		const pedidoModifiacaso = await storeDb.updateDoc(pedido.ref, {
			estado: estadoPos,
			//timelapse para tener un registro del tiempo del cambio del estado
			timelapseStatus: pedido.data.timelapseStatus.concat({ date, estado: estadoPos })
		})

		if (pedido?.data?.domiciliario_asignado) {
			const idDomiciliario = pedido?.data?.domiciliario_asignado.id
			console.log("se eliminara el pedido del domiciliario ", idDomiciliario)

			const borrarRefDeAsignados = await borrarDeDomiciliario(idPedido, idDomiciliario)
		}

		//crear referencia en nuevo estado 
		//const newEstado = estadosAdd(idPedido, pedido.ref, estadoPos)
		return 'todo  melo'
	} catch (error) {
		throw error
	}
}

async function borrarDeDomiciliario(idPedido, idDomiciliario) {
	try {///hay quer organiasar todo esto de los data.domicilio...
		//buscamos el pedido
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)
		///por el domicilioriario asignso lo buscamoos
		const domiciliarioAsignadoId = await pedido.data.domiciliario_asignado.id
		const dataDomiciliario = await storeDb.findIdCollection(domiciliarioAsignadoId, COLLECTIONS.users)
		//borramos del array el pedido

		const indexPedido = dataDomiciliario.data.domiciliario.pedidos_asignados.findIndex(element => element.id == pedido.id)

		if (indexPedido < 0) {
			throw boom.badData('no tiene asiganado este  pedido')
		}
		//borramos del array el elemento 

		const domiciliosReducido = dataDomiciliario.data.domiciliario.pedidos_asignados.splice(indexPedido, 1)

		const nuevaDataDomiciliario = {

			...dataDomiciliario.data,
			domiciliario: {
				...dataDomiciliario.data.domiciliario,
				pedidos_asignados: dataDomiciliario.data.domiciliario.pedidos_asignados
			}
		}

		const updateDomiciliario = await storeDb.updateDoc(dataDomiciliario.ref, nuevaDataDomiciliario)

		// const borrado = await store.borrarDocumento(pedido.ref)
		return updateDomiciliario
	} catch (error) {
		throw error
	}
}

async function estadoEntregado(idPedido) {
	try {

		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)
		const idDomiciliario = await pedido?.data?.domiciliario_asignado?.id
		if (!idDomiciliario) throw boom.conflict('tiene que haber un domiciliario asignado previamente')

		const depacho = await trasladarEstado(idPedido, despachados, entregados)
		//agregar a la lista del historial del domiciliario 
		const dataUpdate = await agregarAlHistorialDomiciliario(idPedido)
		//todo esto lo podemos optmisar para no hacer tantas llamasda a la base de datos
		return dataUpdate
	} catch (error) {
		throw error
	}
}

async function estadoFacturado(idPedido, idDomiciliario) {
	try {
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)

		if (pedido.data.fee == 'Transferencia') {//si es transrefenia la pasamo a pendieteTransferencia
			console.log("hoals como es tas", pedido.data?.pagoConfirmado?.confirmado)
			if (pedido.data?.pagoConfirmado?.confirmado == true) {
				console.log('EL DOMICIOI ASE MANDARA A FATTURA')
				const facturado = await trasladarEstado(idPedido, entregados, facturados)//si ya esta pago lo pasamos al facturasodos
			} else {
				console.log('EL DOMICIOI ASE MANDARA A PENDIDETE')
				const pendieteTransferenciaTras = await trasladarEstado(idPedido, entregados, pendieteTransferencia)//si ya esta pago lo pasamos al facturasodos
			}

		} else {//si es en efectivo la pasamos a faturados 
			const facturado = await trasladarEstado(idPedido, entregados, facturados)

		}
		const borrarRefDeAsignados = await borrarDeDomiciliario(idPedido, idDomiciliario)
		//agregar a la lista del historial de recepcion configuracion 
		//const dataUpdate = await agregarAlHistorialParametrosYCofiguracion(idPedido)
		//todo esto lo podemos optmisar para no hacer tantas llamasda a la base de datos
		//miramos si el pago es en efectivo y si si el ponemos el pagoConfirmado 
		const pagoConfirmado = await agregarPagoConfiramado(idPedido)

		return 'todo melo '
	} catch (error) {
		throw error
	}
}

async function estadosFilter(filter) {
	try {
		//organimos los filtro para qeu correspondan a los tipos de datos
		filter.forEach(element => {
			if (element.type != undefined) {
				switch (element?.type) {
					case 'Date':

						element.value = new Date(element.value)

						break;

					default:
						break;
				}
				delete element.type
			}
		});

		console.log('aciendo un llamado a los pedidos con el filtro ', filter);
		const pedidos = await storeDb.findFilter(COLLECTIONS.Pedidos, filter)
		return pedidos
	} catch (error) {
		throw error
	}
}


async function findCocina() {
	console.log("findCocina:")
	try {
		const filter = [
			{
				key: "estado",
				options: "in",
				value: [ESTADOS.Calientes, ESTADOS.Preparando]
			},
		]
		const arrayPedidos = await storeDb.findFilter(COLLECTIONS.Pedidos, filter)
		const arrayPedidosData = arrayPedidos.map(e => e.data)
		//ordenamos los pedidos porque deded el filtro no da
		const rta = arrayPedidosData.sort((a, b) => a.numeroDeOrdenDelDia - b.numeroDeOrdenDelDia)

		return rta
	} catch (error) {
		throw error
	}
}

async function findRecepcion() {
	console.log("findRecepcion:")
	try {
		const filter = [
			{
				key: "estado",
				options: "not-in",
				value: [ESTADOS.Eliminados, ESTADOS.Facturados]
			},
		]
		const arrayPedidos = await storeDb.findFilter(COLLECTIONS.Pedidos, filter)
		const arrayPedidosData = arrayPedidos.map(e => e.data)
		//ordenamos los pedidos porque deded el filtro no da
		const rta = arrayPedidosData.sort((a, b) => a.numeroDeOrdenDelDia - b.numeroDeOrdenDelDia)

		return rta
	} catch (error) {
		throw error
	}
}


async function findPedidosRole(role) {
	try {
		let pedidos = []
		switch (role) {
			case ROLES.admin:
			case ROLES.recepcion:
				pedidos = await findRecepcion()
				break;
			case ROLES.cocinero:
				pedidos = await findCocina()
				break;
			default:
				break;
		}
		return pedidos
	} catch (error) {
		throw error
	}
}


module.exports = {
	estadosGet,
	trasladarEstado,
	borrarDeDomiciliario,
	estadoEntregado,
	estadoFacturado,
	estadosFilter,
	findCocina,
	findRecepcion,
	findPedidosRole,
	elminarPedido,
}

async function agregarAlHistorialDomiciliario(idPedido) {
	try {
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)
		const idDomiciliario = await pedido.data.domiciliario_asignado.id
		const dataDomiciliario = await storeDb.findIdCollection(idDomiciliario, COLLECTIONS.users)
		const historialPre = dataDomiciliario.data.domiciliario.historyPedidos || []

		const historial = await historialPre.concat(pedido.id)
		// const dataUpdate = {

		// 	historyPedidos: historial,
		// }

		const dataUpdate = {

			...dataDomiciliario.data,
			domiciliario: {
				...dataDomiciliario.data.domiciliario,
				historyPedidos: historial
			}
		}
		const agregarAlHistori = await storeDb.updateDoc(dataDomiciliario.ref, dataUpdate)
		return dataUpdate
	} catch (error) {
		throw error
	}
}


async function agregarPagoConfiramado(idPedido) {
	try {
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)
		if (pedido.data.fee == 'Efectivo') {
			const now = new Date();

			const dataUpdate = {
				pagoConfirmado: {
					time: now,
					confirmado: true
				},
			}
			const agregarConfiramacion = await storeDb.updateDoc(pedido.ref, dataUpdate)
		}
	} catch (error) {
		throw error
	}
}

function condicionesTraslados(pedido, estadoPos) {
	try {
		switch (estadoPos) {
			case ESTADOS.Despachados:
				//miramos si si tiene un domicicilaio asignado
				const domiAsig = pedido.data?.domiciliario_asignado
				if (!domiAsig) {
					return { valid: false, message: 'no tiene ningun domiciliario asignado' }
				}
				break;

			default:

				break;
		}
		return { valid: true, message: 'todo melo ' }

	} catch (error) {
		throw error
	}
}