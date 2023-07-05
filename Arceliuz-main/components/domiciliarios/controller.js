const controllerPedidos = require('./../pedidos/controller')
const boom = require("@hapi/boom")
const storeDb = require("../../network/utils/database/store.js")
const { COLLECTIONS, ESTADOS, ROLES } = require('../../network/utils/estadosCollectionsNames.js')

async function domiciliarioPost(data) {//podemos buscar los codigos de rederios por nombre o todos
	try {

		console.log('[Controlle domiciliario] ', 'mirando si existe el domiciliario')
		//miramos que no exista ya un domiciliario con ese numero de telefono
		const findDomiciliario = await domiciliarioFilter({
			key: "phone",
			options: "==",
			value: data.phone
		})


		if (findDomiciliario[0] != undefined) {
			throw boom.conflict('ya existe un domiciliario con el mismo numero de telefono ')
		}

		const newDomiciliario = await creteDomiciliario(data)

		//devolvemos el domiciliario como se creo y id
		return newDomiciliario

	} catch (error) {
		throw error
	}

}

async function creteDomiciliario(data) {
	try {
		console.log('[Controlle domiciliario] ', 'creando Domiciliario')

		const now = new Date();

		const fullData = {
			...data,
			dateCreate: now,
			dataUpdate: [],
			historyPedidos: [],
		}
		const domiciliario = await storeDb.addDoc(fullData, COLLECTIONS.users)

		return { ...fullData, id: domiciliario.id }
	} catch (error) {
		throw error
	}

}
async function domiciliariosGet() {
	try {
		console.log('[Controlle domiciliario] ', 'domiciliariosGet')
		const filter = { key: "role", value: [ROLES.domiciliario], options: 'array-contains-any' }

		const domiciliarios = await storeDb.findFilter(COLLECTIONS.users, filter)
		return domiciliarios
	} catch (error) {
		throw error
	}

}

async function domiciliarioGetId(id) {
	try {
		console.log('[Controlle domiciliario] ', 'find domiciliario', id)
		const domiciliarios = await domiciliarioGetIdFull(id)
		const domiciliario = domiciliarios.data
		return domiciliario
	} catch (error) {
		throw error
	}

}


async function domiciliarioGetIdFull(id) {
	try {
		console.log('[Controlle domiciliario] ', 'find domiciliario', id)
		const domiciliarios = await domiciliariosGet()
		const index = domiciliarios.findIndex(e => e.data.id == id)
		if (index < 0) throw boom.badData(`no existe este domiciliario con id "${id}`)
		const domiciliario = domiciliarios[index]

		return domiciliario
	} catch (error) {
		throw error
	}

}

async function domiciliarioFilter(filterD) {
	try {
		const filter = [
			{ key: "role", value: [ROLES.domiciliario], options: 'array-contains-any' },
			filterD,
		]

		const domiciliarios = await storeDb.findFilter(COLLECTIONS.users, filter)
		console.log("🚀 ~ file: controller.js:103 ~ domiciliarioFilter ~ domiciliarios:", domiciliarios)

		return domiciliarios

	} catch (error) {
		throw error
	}

}

async function domiciliarioUpdate(data, ref) {
	try {

		const now = new Date();

		const fullData = {
			...data,
			dateUpdate: now,
		}
		console.log('[Controlle domiciliario] ', 'actualisando el domiciliario')

		const domiciliario = await storeDb.updateDoc(ref, fullData)

		return data
	} catch (error) {
		throw error
	}

}
async function domiciliarioPatch(data) {
	try {

		console.log('[Controlle domiciliario] ', 'mirando si existe el domiciliario')
		//miramos que no exista ya un domiciliario con ese numero de telefono
		const findDomiciliario = await domiciliarioFilter({
			key: "phone",
			options: "==",
			value: data.phone
		})

		console.log(findDomiciliario)

		if (findDomiciliario[0] == undefined) {
			throw boom.conflict('no  existe un domiciliario con el mismo numero de telefono ')
		}


		const domiciliario = await domiciliarioUpdate(data, findDomiciliario[0])

		return data
	} catch (error) {
		throw error
	}

}

async function asignarEnPedido(domiciliario, pedido, time) {
	try {

		const value = {
			domiciliario_asignado: {
				// ref: domiciliario.ref,
				dateCreate: time,
				name: domiciliario.data.name,
				id: domiciliario.id
			}
		}
		console.log("🚀 ~ file: controller.js:169 ~ value:", value)

		//value = { asignaciones: [{ ref: domiciliario.ref, dateCreate: time }] }

		const domiciliarioUpdate = await storeDb.updateDoc(pedido.ref, value)

		return domiciliarioUpdate

	} catch (error) {
		throw error
	}
}

async function asignarEnDomiciliario(pedidoRef, domiciliario, time) {
	try {
		console.log(`asignarEnDomiciliario id pedido: ${pedidoRef.id}, id domiciliario : ${domiciliario.id}`);

		let value
		if (domiciliario.data?.domiciliario?.pedidos_asignados != undefined) {
			value = {
				domiciliario:
				{
					...domiciliario.data.domiciliario,
					pedidos_asignados:
						[
							...domiciliario.data.domiciliario.pedidos_asignados,
							{
								// ref: pedidoRef,
								dateCreate: time,
								id: pedidoRef.id,
							}]
				}
			}
		} else {
			//no tiene peidos asiganod y no tien el array 
			value = {
				domiciliario:
				{
					...domiciliario.data.domiciliario,
					pedidos_asignados: [
						{
							// ref: pedidoRef,
							dateCreate: time,
							id: pedidoRef.id,
						}]
				}
			}
		}

		const pedidoUpdate = await storeDb.updateDoc(domiciliario.ref, value)

		return pedidoUpdate

	} catch (error) {
		throw error
	}
}

async function esValidoAsignar(idPedido, idDomiciliario) {
	try {
		//leemos los datos de pedido
		const pedido = await controllerPedidos.findFullDataController(idPedido)

		//miramos si ya hay un domiciliario asignado
		if (!pedido.data.domiciliario_asignado) {
			return boom.conflict('este pedido no tiene un domiciliario asignado')
		}

		if (pedido.data.domiciliario_asignado.id == idDomiciliario) {
			throw 'ya esta asiganado a es domiciliario'
		}

	} catch (error) {
		throw error
	}
}

async function reasignacion(idPedido, idDomiciliario) {
	try {
		const comprobarValidoReasignar = await esValidoAsignar(idPedido, idDomiciliario)
		const asignacionEliminada = await eliminarAignacion(idPedido)
		const asignacionPe = await asignacion(idPedido, idDomiciliario)
		return asignacionPe
	} catch (error) {
		console.log("eroror de mi :", error)
		throw error
	}
}

async function asignacion(idPedido, idDomiciliario) {
	try {
		const now = new Date();
		const time = now

		const domiciliario = await domiciliarioGetIdFull(idDomiciliario)
		const pedido = await storeDb.findIdCollection(idPedido, COLLECTIONS.Pedidos)

		const asignacionDePedidoADomiciliario = await asignarEnDomiciliario(pedido.ref, domiciliario, time)
		const asignacionDeDomiciliarioAPedido = await asignarEnPedido(domiciliario, pedido, time)

		return 'asignado'
	} catch (error) {
		throw error
	}

}

async function borrarAsignacionEnPedido(pedido, time) {
	let value
	if (pedido.data?.history_domiciliarios_asignados) {
		value = {
			domiciliario_asignado: null,
			history_domiciliarios_asignados: pedido.data.history_domiciliarios_asignados.concat({
				...pedido.data.domiciliario_asignado,
				dateDelete: time
			})
		}
	} else {
		value = {
			domiciliario_asignado: null,
			history_domiciliarios_asignados: [
				{
					...pedido.data.domiciliario_asignado,
					dateDelete: time
				}]
		}
	}

	const domiciliarioUpdate = await storeDb.updateDoc(pedido.ref, value)
	return domiciliarioUpdate

}

async function borrarAsignacionEnDomiciliario(pedido, time) {
	//uscamos el domiciliario en el que eata asignado 
	const idDomiciliario = pedido.data.domiciliario_asignado.id
	const idPedido = pedido.data.id
	const domici = await storeDb.findIdCollection(idDomiciliario, COLLECTIONS.users)
	const dataDomic = domici.data.domiciliario
	const asignados = dataDomic.pedidos_asignados
	//buscamos el id del peido 

	//le modificamos le array del los pedidos asignados

	const idexDomi = asignados.findIndex(e => e.id == idPedido)

	if (idexDomi >= 0) {

		asignados.splice(idexDomi, 1); // elimina un elemento a partir del índice especificado
		const dataUpdate = {
			domiciliario: {
				...dataDomic,
				pedidos_asignados: asignados
			}
		}
		const domiciliarioUpdate = await storeDb.updateDoc(domici.ref, dataUpdate)

		return domiciliarioUpdate
	}
	return 'no se pudo resasi '
}


async function eliminarAignacion(idPedido) {
	try {
		const now = new Date();

		const time = now

		//leemos los datos de pedido
		const pedido = await controllerPedidos.findFullDataController(idPedido)

		//miramos si ya hay un domiciliario asignado
		if (!pedido.data.domiciliario_asignado) {
			return boom.conflict('este pedido no tiene un domiciliario asignado')
		}
		//borramos en pedido la aisignacin y ponemos un historial 
		const borrarAsignacionDeDomiciliarioAPedido = await borrarAsignacionEnPedido(pedido, time)
		const borrarAsignacionDePedidoADomiciliario = await borrarAsignacionEnDomiciliario(pedido, time)

		return 'se borro correctamente la asignaicon '
	} catch (error) {
		throw error
	}

}

async function historyPedidos(idDomiciliario) {
	try {
		const domiciliario = await domiciliarioGetId(idDomiciliario)
		const history = domiciliario.domiciliario.historyPedidos || []
		if (history[0] == undefined) return

		const pedidos = await storeDb.findsDocumentsByRefs(history)
		return pedidos || []
	} catch (error) {
		throw error
	}
}


async function pagarDomicilios(idDomiciliario) {
	try {
		const domiciliario = await domiciliarioGetIdFull(idDomiciliario)

		const history = domiciliario.data.domiciliario.historyPedidos || []
		const dataUpdate = {
			domiciliario: {
				...domiciliario.data.domiciliario,
				domiciliarioPago: true
			}
		}

		if (history[0] == undefined) {
			const quitarElHistorial = await borarHitorial(idDomiciliario)
			return
		}
		const pedidos = await storeDb.updateToDocuments(history, dataUpdate)
		const quitarElHistorial = await borarHitorial(domiciliario.ref, domiciliario)

		return
	} catch (error) {
		throw error
	}
}

async function borarHitorial(ref, domiciliario) {
	try {
		const data = {
			domiciliario: {
				...domiciliario.data.domiciliario,
				historyPedidos: []
			}
		}
		const dataUpdate = storeDb.updateDoc(ref, data)
		//const dataUpdate = store.actualizarDocumento(idDomiciliario, 'domiciliarios', { historyPedidos: [] })
		return
	} catch (error) {
		throw error
	}
}

async function pedidosAsignados(idDomiciliario) {
	try {
		const domiciliario = await domiciliarioGetId(idDomiciliario)

		if (!domiciliario.domiciliario.pedidos_asignados) {
			throw boom.badData('no tiene ningun domiciliario asigndo')
		}
		const refPedidos = domiciliario.domiciliario.pedidos_asignados.map(e => { return e.id })
		const pedidos = await storeDb.findDocumentsByIds(COLLECTIONS.Pedidos, refPedidos)
		const rta = pedidos.map(e => e.data)
		
		return rta
	} catch (error) {
		throw error
	}
}

module.exports = {
	domiciliarioPost,
	domiciliariosGet,
	domiciliariosGet,
	domiciliarioFilter,
	domiciliarioUpdate,
	creteDomiciliario,
	domiciliarioPatch,
	asignacion,
	reasignacion,
	eliminarAignacion,
	domiciliarioGetId,
	domiciliarioGetIdFull,
	historyPedidos,
	pagarDomicilios,
	borarHitorial,
	pedidosAsignados,
	asignarEnDomiciliario,
	asignarEnPedido,
}
