const storeDb = require("../../network/utils/database/store.js")
const boom = require("@hapi/boom")
const { COLLECTIONS, ESTADOS, ROLES } = require('../../network/utils/estadosCollectionsNames.js')

async function docAdd(id, data) {
	try {
		const doc = storeDb.addDoc(id, data)
		return doc
	} catch (error) {
		throw error
	}
}

async function docGet(id) {
	try {
		const doc = storeDb.findIdCollection(id, COLLECTIONS.parametrosYconfiguracion)
		return doc
	} catch (error) {
		throw error
	}
}

async function docUpdate(id, data) {
	try {
		const idD = storeDb.findIdCollection(id, COLLECTIONS.parametrosYconfiguracion)

		const doc = storeDb.updateDoc(idD.ref, data)
		return doc
	} catch (error) {
		throw error
	}
}



module.exports = {
	docAdd,
	docGet,
	docUpdate,
}
