async function cambioDeEstado(idPedido, estado) {
	console.log(`idPedido`, idPedido);

	var HOST_DESPACHAR = `${HOST_API}estados/${estado}?idPedido=${idPedido}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'POST',
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`entregado`, despachar);
	actualisarDatos()

	return despachar.body
}

async function facturado(idPedido) {
	console.log(`idPedido`, idPedido);
	//debemo buscar el domiciliaio que tiene este pedido como asignado 
	const index = pedidos.findIndex(ele => ele.id == idPedido)

	const idDomiciliario = pedidos[index].domiciliario_asignado.id

	var HOST_DESPACHAR = `${HOST_API}estados/facturado?idPedido=${idPedido}&idDomiciliario=${idDomiciliario}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'POST',
		headers: {
			Authorization: token
		},
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`despachar`, despachar);

	actualisarDatos()

	return despachar.body
}

async function preparar(idPedido) {
	console.log(`idPedido`, idPedido);

	var HOST_DESPACHAR = `${HOST_API}estados/preparar?idPedido=${idPedido}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'POST',
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`despachar`, despachar);

	actualisarDatos()

	return despachar.body
}

async function espera(idPedido) {
	console.log(`idPedido`, idPedido);

	var HOST_DESPACHAR = `${HOST_API}estados/espera?idPedido=${idPedido}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'POST',
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`entregado`, despachar);
	actualisarDatos()

	return despachar.body
}

async function confirmarPago(idPedido) {
	console.log(`idPedido`, idPedido);

	var HOST_CONFIRMAR_PAGO = `${HOST_API}pedidos/confirmarPago/?id=${idPedido}`
	let url = HOST_CONFIRMAR_PAGO
	let options = {
		method: 'POST',
		headers: {
			Authorization: token
		},
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`entregado`, despachar);
	actualisarDatos()

	return despachar.body
}

async function despachar(idPedido) {
	console.log(`idPedido`, idPedido);

	var HOST_DESPACHAR = `${HOST_API}estados/despachar?idPedido=${idPedido}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'POST',
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`despachar`, despachar);

	actualisarDatos()

	return despachar.body
}

async function entregado(idPedido) {
	console.log(`idPedido`, idPedido);

	var HOST_DESPACHAR = `${HOST_API}estados/entregado?idPedido=${idPedido}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'POST',
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`entregado`, despachar);
	actualisarDatos()

	return despachar.body
}


async function eliminarPedido(idPedido) {
	console.log(`idPedido`, idPedido);

	var HOST_DESPACHAR = `${HOST_API}estados/eliminados?idPedido=${idPedido}`
	let url = HOST_DESPACHAR
	let options = {
		method: 'DELETE',
	};

	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const despachar = await res.json()
	console.log(`elimiar`, despachar);

	actualisarDatos()

	return despachar.body
}

async function mandarAsignacion(idDomiciliario, idPedio) {
	try {
		var HOST_DOMICILIARIO = `${HOST_API}domiciliarios/asignacion?idDomiciliario=${idDomiciliario}&idPedido=${idPedio}`;
		let url = HOST_DOMICILIARIO;

		let options = {
			method: 'POST',
		};

		const res = await fetch(url, options);
		const asignacion = await res.json();

		return asignacion;
	} catch (error) {
		throw error
	}
}


async function mandarReasignacion(idDomiciliario, idPedio) {
	try {
		var HOST_DOMICILIARIO = `${HOST_API}domiciliarios/reasignacion?idDomiciliario=${idDomiciliario}&idPedido=${idPedio}`;
		let url = HOST_DOMICILIARIO;

		let options = {
			method: 'POST',
		};

		const res = await fetch(url, options);
		const asignacion = await res.json();

		return asignacion;
	} catch (error) {
		throw error
	}
}

async function findDomiciliario() {

	var HOST_FINDDOMICILIARIOS = `${HOST_API}domiciliarios`
	let url = HOST_FINDDOMICILIARIOS
	console.log("🚀 ~ file: apiUtils.js:201 ~ findDomiciliario ~ HOST_FINDDOMICILIARIOS:", HOST_FINDDOMICILIARIOS)

	let options = {
		method: 'GET',
		headers: {
			Authorization: token
		}
	};

	console.log(`options0`, options, url);


	const res = await fetch(url, options)
	const domiciliarios = await res.json()
	return domiciliarios.body
}

async function findEstado(estado) {
	try {
		var HOST_CALIENTES = `${HOST_API}estados/?estado=${estado}`
		let url = HOST_CALIENTES

		let options = { method: 'GET' };

		const res = await fetch(url, options)
		const pedidos = await res.json()

		const validos = await pedidos.body.filter(element => element.coordenadas > '')//filramos para tener solos que tienen latitud y lon , esto solo com para probarlo luego se debeia de quitart
		const calientes = validos.map(element => {
			return { coordenadas: element.coordenadas, name: element.name, address: element.address }
		})
		return pedidos

	} catch (error) {
		console.log(error)
		throw error
	}
}


async function findPedidosHoy() {
	try {
		var HOST_PEDIDOS = `${HOST_API}pedidos/historialDia`
		let url = HOST_PEDIDOS


		const options = {
			method: 'GET',
			headers: {
				Authorization: token
			}
		};

		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()

		return pedidos.body

	} catch (error) {
		console.log(error)
		throw error
	}
}

async function findFilter(data) {
	try {
		var HOST_PEDIDOS = `${HOST_API}estados/filter`
		let url = HOST_PEDIDOS
		const raw = JSON.stringify(data)

		const options = {
			method: 'POST',
			headers: {
				Authorization: token,
				"Content-Type": "application/json"
			},
			body: raw
		};

		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()

		return pedidos.body

	} catch (error) {
		console.log(error)
		throw error
	}
}


async function findPedidosRole(role) {
	try {
		var HOST_CALIENTES = `${HOST_API}estados/role/?role=${role}`
		let url = HOST_CALIENTES

		let options = { method: 'GET' };

		const res = await fetch(url, options)
		const pedidos = await res.json()

		return pedidos

	} catch (error) {
		console.log(error)
		throw error
	}
}

async function findPedidos() {
	try {
		var HOST_CALIENTES = `${HOST_API}pedidos`
		let url = HOST_CALIENTES

		let options = { method: 'GET' };

		const res = await fetch(url, options)
		const pedidos = await res.json()
		
		return pedidos

	} catch (error) {
		console.log(error)
		throw error
	}
}


async function findHome() {
	try {
		var HOST_PEDIDOS = `${HOST_API}domiciliarios/home`
		let url = HOST_PEDIDOS


		const options = {
			method: 'GET',
			headers: {
				Authorization: token
			}
		};


		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()

		return pedidos.body.pedidos_asignados

	} catch (error) {
		console.log(error)
		throw error
	}
}

async function findAsignados() {
	try {
		var HOST_PEDIDOS = `${HOST_API}domiciliarios/pedidosAsignados`
		let url = HOST_PEDIDOS
		console.log("🚀 ~ file: apiUtils.js:290 ~ findAsignados ~ HOST_PEDIDOS:", HOST_PEDIDOS)


		const options = {
			method: 'GET',
			headers: {
				Authorization: token
			}
		};


		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()

		return pedidos.body

	} catch (error) {
		console.log(error)
		throw error
	}
}


async function cambiarFee(id, fee) {
	try {
		var HOST_PEDIDOS = `${HOST_API}pedidos/cambiarFee?id=${id}&fee=${fee}`
		let url = HOST_PEDIDOS

		const options = {
			method: 'PATCH',
			headers: {
				Authorization: token
			}
		};

		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const rta = await res.json()

		return rta

	} catch (error) {
		console.log(error)
		throw error
	}
}

async function handleResponse(res) {
	var HOST = `https://domiburguer.com`
	if (window.origin.includes('http://127.0.0.1')) HOST = `http://localhost:8087`

	const previousPage = document.referrer;
	const urlSearchParams = new URLSearchParams({ previousPage: previousPage });
	const queryString = urlSearchParams.toString();

	switch (res.status) {
		case '401':
		case '422':
			console.log(`Hubo unddd erro ${res.status}, `, res);
			// window.location.href = `${HOST}/login?${queryString}`;
			break;
		default:
			console.log(`respuestaa ${res.status}, `, res);

			// Redirigir al usuario a la página de inicio de sesión con el parámetro de consulta
			// window.location.href = `${HOST}/login?${queryString}`;

			break;
	}
}

async function findFilterClients(filter) {
	try {
		var HOST_PEDIDOS = `${HOST_API}clientes/filter`
		let url = HOST_PEDIDOS
		const raw = JSON.stringify(filter)

		const options = {
			method: 'POST',
			headers: {
				Authorization: token,
				"Content-Type": "application/json"
			},
			body: raw
		};

		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()

		return pedidos.body

	} catch (error) {
		console.log(error)
		throw error
	}
}


async function findUlimoPedido(id) {
	try {
		var HOST_PEDIDOS = `${HOST_API}clientes/ulitimoPedido?id=${id}`
		let url = HOST_PEDIDOS

		const options = {
			method: 'GET',
			headers: {
				Authorization: token,
				"Content-Type": "application/json"
			},
		};

		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()

		return pedidos.body

	} catch (error) {
		console.log(error)
		throw error
	}
}
