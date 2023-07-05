const boom = require("@hapi/boom")
const bcrypt = require("bcrypt")
const { creteDomiciliarioConId } = require("../domiciliarios/controller.js")
const storeDb = require("../../network/utils/database/store.js")
const { COLLECTIONS, ESTADOS, ROLES } = require('../../network/utils/estadosCollectionsNames.js')

async function userPost(data) {//podemos buscar los codigos de rederios por nombre o todos
	try {
		const now = new Date();

		let fullData = {
			...data,
			dateCreate: now,
			dataUpdate: []

		}
		console.log('[Controlle user] ', 'mirando si existe el user')
		//miramos que no exista ya un user con ese numero de telefono
		const finduser = await storeDb.findFilter(COLLECTIONS.users, {
			key: "user",
			options: "==",
			value: data.user
		})

		const userFind = finduser[0] || null

		if (userFind) {
			throw boom.conflict('ya existe un user con el mismo nombre de user ')
		}

		const hash = await bcrypt.hash(data.password, 10)
		fullData.password = hash

		console.log('[Controlle user] ', 'creando user')

		fullData = creacionDeRole(fullData)

		const user = await storeDb.addDoc(fullData, COLLECTIONS.users)

		fullData.id = user.id///tengo que corregir esto , cuandon se crea un nuevo dimiciliaio , se crera el usuario primero 
		//y luego si falla el crar el domiciliio se habra creado un usuari de domiciliio pero si el domiciliairo
		//const copia = await mandarCopiaColleccion(fullData)
		//devolvemos el pedidom como se creo	
		delete fullData.password
		return fullData
	} catch (error) {
		throw error
	}
}

function creacionDeRole(data) {
	let rta = { ...data }
	const now = new Date();

	for (const i in data.role) {
		if (Object.hasOwnProperty.call(data.role, i)) {
			const rol = data.role[i];
			switch (rol) {
				case ROLES.domiciliario:
					rta = {
						...rta,
						domiciliario: {
							dateCreate: now,
							dataUpdate: [],
							historyPedidos: [],
							active: false
						}
					}
					break;
				default:
					rta = {
						...rta,
					}
					break;
			}
		}
	}
	return rta
}

async function usersGet() {
	try {
		console.log('[Controlle user] ')

		const users = await storeDb.findCollection(COLLECTIONS.users)

		return users
	} catch (error) {
		throw error
	}

}

async function userUserGet(userUser) {
	try {
		console.log('[Controlle user] userUserGet')
		const filter = { key: 'user', options: '==', value: userUser }
		const user = await userFilter(filter)

		return user
	} catch (error) {
		throw error
	}

}



async function finduserUser(user, role) {
	try {
		console.log('[Controlle user] ', 'usersLogin')

		const userFind = await userUserGet(user, role)


		return userFind
		const rta = userFind.filter(element => {
			console.log("🚀 ~ file: controller.js:120 ~ finduserUser ~ element:",)
			element.role.find(e => e == role)
		})

		console.log("🚀 ~ file: controller.js:123 ~ rta ~ rta:", rta)
		if (rta.length < 1) throw boom.badData(' no existe esete usuario')

		return rta[0]
	} catch (error) {
		throw error
	}

}

async function userGet(id) {
	try {
		console.log('[Controlle user] ', 'find user')

		const user = await storeDb.findIdCollection(id, COLLECTIONS.users)

		return user
	} catch (error) {
		throw error
	}

}

async function userFilter(filter) {
	try {
		console.log('[Controlle user] ', 'find filter users')

		const user = await storeDb.findFilter(COLLECTIONS.users, filter)

		return user
	} catch (error) {
		throw error
	}

}

async function userUpdate(data) {
	try {
		//miramos que exista ya un user con ese numero de telefono
		console.log('[Controlle user] ', 'mirando si existe el user')
		const finduser = await storeDb.findFilter(COLLECTIONS.users, {
			key: "phone",
			options: "==",
			value: data.phone
		})

		if (finduser.length < 1) {
			throw boom.conflict('no existe un user con el  numero de telefono ')
		}

		const now = new Date();

		const fullData = {
			...data,
			dateUpdate: now,
		}
		console.log('[Controlle user] ', 'actualisando el user')

		const user = await storeDb.updateDoc(finduser[0].ref, fullData)

		return data
	} catch (error) {
		throw error
	}

}
/////quedara en desuso
async function mandarCopiaColleccion(userData) {
	try {
		console.log('[Controlle user] ', 'mandarCopiaColleccion')
		console.log('userData.role', userData.role);

		switch (userData.role) {
			case 'domiciliario':
				const domiciliario = await creteDomiciliarioConId(userData)
				console.log('domiciliario', domiciliario);

				break;
			default:
				break;
		}

		return
	} catch (error) {
		throw error
	}

}



module.exports = {
	userPost,
	usersGet,
	userUserGet,
	finduserUser,
	userGet,
	userFilter,
	userUpdate,
	mandarCopiaColleccion,
}
