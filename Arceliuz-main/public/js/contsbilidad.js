var HOST_API = `https://domiburguer.com/api/`
if (this.origin.includes('http://127.0.0.1') || this.origin.includes('http://localhost')) HOST_API = `http://localhost:8087/api/`

let loginDomi = JSON.parse(localStorage.getItem('login-domi'))
if (!loginDomi) {
	window.location.href = "/401"

}
var token = `Bearer ${loginDomi.token}`


async function findDomiciliarios() {
	var HOST_FINDDOMICILIARIOS = `${HOST_API}domiciliarios`
	let url = HOST_FINDDOMICILIARIOS

	const options = {
		method: 'GET',
		headers: {
			Authorization: token
		},
	}
	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const domiciliarios = await res.json()
	return domiciliarios.body
}

async function findDomiciliariosHistory(id) {
	var HOST_FINDDOMICILIARIOS = `${HOST_API}domiciliarios/history?idDomiciliario=${id}`
	let url = HOST_FINDDOMICILIARIOS

	const options = {
		method: 'GET',
		headers: {
			Authorization: token
		},
	}
	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const domiciliarios = await res.json()
	return domiciliarios.body
}

crearSectionListaDomiciliarios()

async function crearSectionListaDomiciliarios() {
	const sectionListaDomiciliarios = document.getElementById('sectionListaDomiciliarios')
	//miramos de la collecion de domiciliario todo los domiciliarios 
	const domiciliarios = await findDomiciliarios()
	//por cada docimicilairo cramso una targeta
	var divContenedora = ""

	const losDomiciliarios = domiciliarios.map(async element => {
		const peidodosHistory = await findDomiciliariosHistory(element.id)
		return { ...element, historyPedidos: peidodosHistory || [] }

	})

	const pedidosFind = await Promise.all(losDomiciliarios);
	console.log("🚀 ~ file: contsbilidad.js:50 ~ crearSectionListaDomiciliarios ~ pedidosFind:", pedidosFind)


	const contenidoDelDiv = pedidosFind.forEach(element => {
		if (!element.historyPedidos) return
		const totalDomicilios = element.historyPedidos.reduce((a, b) => {
			console.log("🚀 ~ file: contsbilidad.js:57 ~ totalDomicilios ~ a, b:", a, b)
			const precioDelDomi = b.order.filter(elem => elem.type == 'domicilio')
			console.log("🚀 ~ file: contsbilidad.js:59 ~ totalDomicilios ~ precioDelDomi:", precioDelDomi)
			return a + precioDelDomi[0].price
		}, 0)
		console.log("🚀 ~ file: contsbilidad.js:62 ~ totalDomicilios ~ totalDomicilios:", totalDomicilios)

		divContenedora += `
			<div class="col-md-4 mb-4" id="${element.id}">
				<div class="card">
					<img src="https://art.pixilart.com/sr2b03cff5cce42.png" alt="Pedido 2" class="card-img-top">
					<div class="card-body">
						<h3 class="card-title">${element.name}</h3>
						<div class="d-flex justify-content-between align-items-center ">			

							<div class="card-text"><b>Total: $${totalDomicilios}</b></div>
							<div class="card-text"><b>pedidos: ${element.historyPedidos.length }</b></div>
						</div>

						<buton  class="btn btn-primary">Ver detalles</buton>
						<buton  class="btn  bg-info" onclick="pagarDomicilios('${element.id}')">Pagado</buton>
					</div>
				</div>
			</div>
		`
	})

	sectionListaDomiciliarios.innerHTML = divContenedora


}



async function findPedido(pedidoRefId) {
	try {
		var HOST_PEDIDOS = `${HOST_API}pedidos/`
		const params = { id: pedidoRefId }
		const queryParams = new URLSearchParams(params);
		let url = `${HOST_PEDIDOS}/id/${pedidoRefId}`

		const options = {
			method: 'GET',
			headers: {
				Authorization: token
			},
		}
		const res = await fetch(url, options)
		const handle = await handleResponse(res)
		const pedidos = await res.json()
		return pedidos.body

	} catch (error) {
		throw error
	}
}

async function handleResponse(res) {
	var HOST = `https://domiburguer.com`
	if (this.origin.includes('http://127.0.0.1')) HOST = `http://localhost:8087`

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
			console.log(`Hubo un erro ${res.status}, `, res);

			// Redirigir al usuario a la página de inicio de sesión con el parámetro de consulta
			// window.location.href = `${HOST}/login?${queryString}`;

			break;
	}
}

async function pagarDomicilios(id) {
	try {
		console.log("🚀 ~ file: contsbilidad.js:148 ~ pagarDomicilios ~ id:", id)
		const pago = await cancelarPagoDomicilios(id)
		crearSectionListaDomiciliarios()
	} catch (error) {

	}
}

async function cancelarPagoDomicilios(id) {
	var HOST_FINDDOMICILIARIOS = `${HOST_API}domiciliarios/pagarDomicilios?idDomiciliario=${id}`
	let url = HOST_FINDDOMICILIARIOS

	const options = {
		method: 'GET',
		headers: {
			Authorization: token
		},
	}
	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const domiciliarios = await res.json()
	return domiciliarios.body
}
