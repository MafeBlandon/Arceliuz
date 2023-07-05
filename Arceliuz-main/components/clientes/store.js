const db = require("../../network/database.js")
const FieldValue = require('firebase-admin').firestore.FieldValue;//son pongo esto, que deveria de iniciarse en el database.js, no me deja usar los metos de los arrays en el update
const boom = require("@hapi/boom")
const collection = 'Clientes'

//añadiomos un cliente
async function clienteAdd(data) {
	try {
		const ref = db.collection(collection).doc()
		const cliente = await ref.set(data)
		return { doc: cliente, ref: ref, id: ref.id }
	} catch (error) {
		throw error
	}
}

//entregamos todos los cliente que hay 
async function clientesFind() {
	try {
		const cliente = []
		const ref = db.collection(collection)
		const snapshot = await ref.get()
		snapshot.forEach(doc => {
			cliente.push({ id: doc.id, ...doc.data() })
		})
		return cliente
	} catch (error) {
		throw error
	}
}

//entregamos el cliente con el id
async function clienteFind(id) {
	try {
		const ref = db.collection(collection)
		const doc = await ref.doc(id).get()
		if (!doc.exists) {
			throw boom.badData('no existe este cliente')
		} else {
			return doc.data()
		}

	} catch (error) {
		throw error
	}
}

//entregamos todos los pedido que hay con el filtro
async function clienteFindFilter(filter) {
	try {
		const cliente = []
		const ref = db.collection(collection)
		const snapshot = await ref.where(filter.key, filter.options, filter.value).get()
		snapshot.forEach(doc => {
			cliente.push({ id: doc.id, ...doc.data() })
		})
		return cliente
	} catch (error) {
		throw error
	}
}

//actualisamos un cliente
async function clienteUpdate(data, clientePre) {
	try {
		const ref = db.collection(collection)
		const cliente = await ref.doc(clientePre.id).update({
			...data,
			dataUpdate: FieldValue.arrayUnion(data)
		})
		return cliente
	} catch (error) {
		throw error
	}
}


module.exports = {
	clienteAdd,
	clientesFind,
	clienteFind,
	clienteFindFilter,
	clienteUpdate,

}
