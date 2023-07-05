const store = require("./store.js")
const boom = require("@hapi/boom")
const storeDb = require("../../network/utils/database/store.js")
const { COLLECTIONS, ESTADOS, ROLES } = require('../../network/utils/estadosCollectionsNames.js')

async function clientePost(data) {//podemos buscar los codigos de rederios por nombre o todos
	try {
		const now = new Date();

		const fullData = {
			...data,
			dateCreate: now,
			dataUpdate: []

		}
		console.log('[Controlle cliente] ', 'mirando si existe el cliente')
		//miramos que no exista ya un cliente con ese numero de telefono
		const findCliente = await clienteFilter({
			key: "phone",
			options: "==",
			value: data.phone
		})

		if (findCliente.length > 0) {
			throw boom.conflict('ya existe un cliente con el mismo numero de telefono ')
		}

		console.log('[Controlle cliente] ', 'creando pedido')
		const cliente = await store.clienteAdd(fullData)
		//devolvemos el pedidom como se creo
		return { data: { ...fullData, id: cliente.id }, ref: cliente.ref, id: cliente.id }

	} catch (error) {
		throw error
	}

}

async function clientesGet() {
	try {
		console.log('[Controlle cliente] ', 'finds clients')

		const clientes = await store.clientesFind()

		return clientes
	} catch (error) {
		throw error
	}

}

async function clienteGet(id) {
	try {
		console.log('[Controlle cliente] ', 'find cliente')

		const cliente = await store.clienteFind(id)

		return cliente
	} catch (error) {
		throw error
	}

}

async function clienteFilter(filter) {
	try {
		console.log('[Controlle cliente] ', 'find filter clientes')

		const cliente = await store.clienteFindFilter(filter)

		return cliente
	} catch (error) {
		throw error
	}

}

async function clienteUpdate(data) {
	try {
		//miramos que exista ya un cliente con ese numero de telefono
		console.log('[Controlle cliente] ', 'mirando si existe el cliente')
		const findCliente = await clienteFilter({
			key: "phone",
			options: "==",
			value: data.phone
		})

		if (findCliente.length < 1) {
			throw boom.conflict('no existe un cliente con el  numero de telefono ')
		}

		const now = new Date();

		const fullData = {
			...data,
			dateUpdate: now,
		}
		console.log('[Controlle cliente] ', 'actualisando el cliente')

		const cliente = await store.clienteUpdate(fullData, findCliente[0])

		return data
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

		const pedidos = await storeDb.findFilter(COLLECTIONS.Clientes, filter)
		return pedidos
	} catch (error) {
		throw error
	}
}


async function ultimoPedidoGet(id) {
	try {

		const arraCollectionsIds = [
			{
				collection: COLLECTIONS.Clientes,
				id: id
			},
			{
				collection: COLLECTIONS.Pedidos,
			}
		]
		const cliente = await storeDb.findCollectionSub(arraCollectionsIds, null)
		const ref = cliente[0].data.ref
		const rta = await storeDb.findRef(ref)

		return rta
	} catch (error) {
		throw error
	}
}


module.exports = {
	clientePost,
	clientesGet,
	clienteGet,
	clienteFilter,
	clienteUpdate,
	estadosFilter,
	ultimoPedidoGet,
}
