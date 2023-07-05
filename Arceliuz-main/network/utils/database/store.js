const db = require("../../database.js")
const boom = require("@hapi/boom")

async function addDoc(data, collection, id = null) {
	try {
		let ref
		if (id == null) {
			ref = db.collection(collection).doc()//referencia del pedido 
		} else {
			ref = db.collection(collection).doc(id)//referencia del pedido 
		}
		//lo anadimos con el id
		const doc = await ref.set({ ...data, id: ref.id })//añadimos a la coleccion un nuenvo pedido
		return { ...doc, ref: ref, id: ref.id }
	} catch (error) {
		throw error
	}
}

//hay que hacerle un test
async function addDocSub(data, collectionAndIds) {
	try {
		let ref = null

		for (const capa of collectionAndIds) {
			if (ref == null) {
				ref = db.collection(capa.collection).doc(capa.id)
			} else {
				ref = ref.collection(capa.collection).doc(capa.id)
			}
		}

		const doc = await ref.set(data)//añadimos a la coleccion un nuenvo pedido
		return doc
	} catch (error) {
		throw error
	}
}


//entregamos todos los pedido que hay 
async function findCollection(collection, orden) {
	try {
		const docs = []
		var ref = db.collection(collection)
		if (orden) ref = ref.orderBy(orden[0], orden[1])//si tre un ordne definido

		const snapshot = await ref.get()
		snapshot.forEach(doc => {
			docs.push({ data: { id: doc.id, ...doc.data() }, ref: doc.ref })
		})
		return docs
	} catch (error) {
		throw error
	}
}

async function findCollectionSub(collectionAndIds, orden) {
	try {
		const docs = []
		let ref = null

		for (const capa of collectionAndIds) {
			if (ref == null) {
				if(capa.id){
					ref = db.collection(capa.collection).doc(capa.id)
				}else{
					ref = db.collection(capa.collection)
				}
			} else {
				if(capa.id){
					ref = ref.collection(capa.collection).doc(capa.id)
				}else{
					ref = ref.collection(capa.collection)
				}
			}
		}
		if (orden) ref = ref.orderBy(orden[0], orden[1])//si tre un ordne definido
		console.log("🚀 ~ file: store.js:79 ~ findCollectionSub ~ ref:", ref)

		const snapshot = await ref.get()
		console.log("🚀 ~ file: store.js:82 ~ findCollectionSub ~ snapshot:", snapshot)
		snapshot.forEach(doc => {
			docs.push({ data: { id: doc.id, ...doc.data() }, ref: doc.ref })
		})
		return docs
	} catch (error) {
		throw error
	}
}

//entregamos el pedido con el id
async function findIdCollection(id, collection, orden = null) {
	try {
		var ref = db.collection(collection).doc(id)
		if (orden) ref = ref.orderBy(orden[0], orden[1])//si tre un ordne definido
		const doc = await ref.get()
		if (!doc.exists) {
			throw boom.badData('no existe este doc')
		} else {
			return { data: { id: doc.id, ...doc.data() }, ref, id: doc.id }
		}

	} catch (error) {
		throw error
	}
}

async function findRef(ref) {
	try {
		const doc = await ref.get()
		if (!doc.exists) {
			throw boom.badData('no existe este pedido ')
		} else {
			return { data: { id: doc.id, ...doc.data() }, ref, id: doc.id }
		}

	} catch (error) {
		throw error
	}
}

//entregamos todos los pedido que hay con el filtro
async function findFilter(collection, filter, orden = null) {
	try {///hay que tener cuidado con las busqeuedas compuestas , puede salir un error de que falta un index
		//lo ideal es no usara el orden 
		const pedidos = []
		var ref = db.collection(collection)

		if (!Array.isArray(filter)) filter = [filter]//di no es un arrar lo covertimos en uno 


		for (const filterObj of filter) {
			ref = ref.orderBy(`${filterObj.key}`, 'desc').where(filterObj.key, filterObj.options, filterObj.value)
		}

		if (orden) ref = ref.orderBy(orden[0], orden[1])//si tre un ordne definido

		const snapshot = await ref.get()
		snapshot.forEach(doc => {
			pedidos.push({ data: { id: doc.id, ...doc.data() }, ref: doc.ref, id: doc.id })
		})
		return pedidos
	} catch (error) {
		throw error
	}
}


async function updateDoc(ref, data) {
	try {
		const doc = await ref.update(data)
		return doc
	} catch (error) {
		throw error
	}
}

async function updateDocuments(docRefs, data) {
	try {
		const batch = db.batch();

		docRefs.forEach((docRef) => {
			const doc = db.doc(docRef._path.segments.join("/"));
			batch.update(doc, data);
		});

		const commint = await batch.commit();
		return commint
	} catch (error) {
		throw error;
	}
}

async function deleteDoc(ref) {
	try {
		const doc = await ref.delete()
		return doc
	} catch (error) {
		throw error
	}
}


async function findsDocumentsByRefs(docRefs) {
	try {
		const docs = await db.getAll(...docRefs);
		const documents = [];

		docs.forEach((doc) => {
			if (doc.exists) {
				documents.push({
					id: doc.id, ...doc.data()
				});
			} else {
				console.log("El documento no existe");
			}
		});

		return documents;
	} catch (error) {
		console.error("Error al obtener documentos: ", error);
		throw error;
	}
}
async function findDocumentsByIds(collection, docIds) {
	try {
		const documents = [];

		await Promise.all(
			docIds.map(async (docId) => {
				const docRef = db.collection(collection).doc(docId);
				const docSnapshot = await docRef.get();

				if (docSnapshot.exists) {
					const docData = docSnapshot.data();
					documents.push({
						data: docData,
						ref: docRef,
						id: docSnapshot.id,
					});
				} else {
					console.log(`El documento con ID ${docId} no existe`);
				}
			})
		);

		return documents;
	} catch (error) {
		console.error("Error al obtener documentos: ", error);
		throw error;
	}
}



async function updateToDocuments(docRefs, data) {
	try {
		const batch = db.batch();

		docRefs.forEach((docRef) => {
			console.log("🚀 ~ file: store.js:182 ~ docRefs.forEach ~ docRef._path:", docRef._path.segments.join("/"))

			const doc = db.doc(docRef._path.segments.join("/"));
			batch.update(doc, data);
		});

		await batch.commit();
		console.log(`La propiedad '${data}' fue agregada a todos los documentos`);

	} catch (error) {
		console.error("Error al modificar documentos: ", error);
		throw error;
	}
}


module.exports = {
	addDoc,
	addDocSub,
	findCollection,
	findCollectionSub,
	findIdCollection,
	findRef,
	findFilter,
	updateDoc,
	updateDocuments,
	deleteDoc,
	findsDocumentsByRefs,
	findDocumentsByIds,
	updateToDocuments,
}
