
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador

const assert = require('assert');
const store = require('../../network/utils/database/store')

describe('Funcianes store, la primera capa con el servidor de firebase', () => {
	const collectionNameTest = 'test'
	const docNameTest = 'docNameTest'
	let refTest
	const ordenFind = ['hola', 'desc']

	it('Creando documento con id aleatorio', async () => {
		const newDoc = await store.addDoc({ hola: 'hola saludo ' }, collectionNameTest)
		assert.strictEqual(typeof newDoc._writeTime, 'object');
	});

	it('Creando documento con id definido', async () => {
		const newDoc = await store.addDoc({ hola: 'hola' }, collectionNameTest, docNameTest)
		assert.strictEqual(typeof newDoc._writeTime, 'object');
	});

	it('Haciendo busqueda de una coleccion entera ', async () => {
		const docs = await store.findCollection(collectionNameTest)
		assert.strictEqual(typeof docs, 'object');
	});

	it('Haciendo busqueda de una docuemto por el id y coleccion ', async () => {
		const { ref } = await store.findIdCollection(docNameTest, collectionNameTest)
		refTest = ref // ponemos el ref en la variable par usar despues
		assert.strictEqual(typeof ref, 'object');
	})

	it('Haciendo busqueda de una referencia ', async () => {
		const docs = await store.findRef(refTest)
		assert.strictEqual(typeof docs, 'object');
	})

	it('Haciendo busqueda de filtro ', async () => {
		const docs = await store.findFilter(collectionNameTest, { key: 'hola', value: 'hola', options: "==" })
		assert.strictEqual(typeof docs, 'object');
	})

	it('Haciendo un update de un documento ', async () => {
		const update = await store.updateDoc(refTest, { saludos: true })
		assert.strictEqual(typeof update, 'object');
	})

	it('Haciendo un update de  muchso  documento ', async () => {
		const docs = await store.findCollection(collectionNameTest, ['hola', 'desc'])
		const refs = docs.map(e => e.ref)
		const docDelete = await store.updateDocuments(refs, { saludos: true })
		assert.strictEqual(typeof docDelete, 'object');
	})

	it('borrando un documento ', async () => {
		const docDelete = await store.deleteDoc(refTest)
		assert.strictEqual(typeof docDelete, 'object');
	})




});