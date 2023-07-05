const storeDb = require("../../network/utils/database/store.js")
const { COLLECTIONS, ESTADOS, ROLES } = require('../../network/utils/estadosCollectionsNames.js')
const boom = require("@hapi/boom")

async function productoPost(data) {//podemos buscar los codigos de rederios por nombre o todos
	try {
		const now = new Date();
		const productosCollection = await storeDb.findCollection(COLLECTIONS.Productos)

		//miramos que no exista ya un producto con id
		if (productosCollection.find(e => e.id == data.id)) {
			throw boom.badData('ya existe un procducot con este id')
		}

		//miramos que no exista ya un producto con esename
		if (productosCollection.find(e => e.name == data.name)) {
			throw boom.badData('ya existe un procducot con este nombre')
		}

		const listaDeIds = productosCollection.map(objeto => objeto.id);


		const producto = {
			dataCreate: now,
			dataUpdate: now,
			// userCreate: req.user,
			...data,
			name: data.name,
			id: data.id || `${Math.max(...listaDeIds) + 1}`,// si no hay nombre le ponemo el que sigue
			description: data.description,
			price: data.price,
			imagen: data.imagen,
			colorPrimary: generarColorPastel(),
			colorSecondary: generarColorPastel(),
		}

		console.log('[Controlle producto] ', 'creando pedido', producto)
		const newProducto = await storeDb.addDoc(producto, COLLECTIONS.Productos)
		//devolvemos el producto como se creo
		return producto

	} catch (error) {
		throw error
	}

}

async function productosGet() {
	try {
		console.log('[Controlle producto] ', 'finds clients')

		const productos = await storeDb.findCollection(COLLECTIONS.Productos)

		return productos
	} catch (error) {
		throw error
	}

}

async function productoGet(id) {
	try {
		console.log('[Controlle producto] ', 'find producto')
		const producto = await storeDb.findIdCollection(id, COLLECTIONS.Productos)
		return producto
	} catch (error) {
		throw error
	}

}

async function productoFilter(filter) {
	try {
		console.log('[Controlle producto] ', 'find filter productos')

		const producto = await storeDb.findFilter(COLLECTIONS.Productos, filter)

		return producto
	} catch (error) {
		throw error
	}

}

async function productoUpdate(data) {
	try {
		//miramos que exista ya un producto con ese numero de telefono
		console.log('[Controlle producto] ', 'mirando si existe el producto')
		//miramos que no exista ya un producto con id
		const findproductoId = await storeDb.findIdCollection(data.id, COLLECTIONS.Productos)
		if (!findproductoId) {
			throw boom.badData('no existe un procducot con este id')
		}

		const now = new Date();


		const fullData = {
			...data,
			dateUpdate: now,
		}
		console.log('[Controlle producto] ', 'actualisando el producto')

		const producto = await storeDb.updateDoc(findproductoId.ref, fullData)

		return data
	} catch (error) {
		throw error
	}

}




module.exports = {
	productoPost,
	productosGet,
	productoGet,
	productoFilter,
	productoUpdate
}