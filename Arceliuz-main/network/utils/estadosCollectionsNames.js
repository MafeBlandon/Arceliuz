
const ESTADOS = {
	Calientes: 'Calientes',
	Preparando: 'Preparando',
	Espera: 'Espera',
	Despachados: 'Despachados',
	Entregados: 'Entregados',
	Facturados: 'Facturados',
	Eliminados: 'Eliminados',
	PendieteTransferencia: 'PendieteTransferencia',
	Indefinido: "Indefinido",
}

const COLLECTIONS = {
	Clientes: 'Clientes',
	Pedidos: 'Pedidos',
	Productos: 'Productos',
	domiciliarios: 'domiciliarios',
	parametrosYconfiguracion: 'parametrosYconfiguracion',
	users: 'users'
}

const ROLES = {
	admin: 'admin',
	cliente: 'cliente',
	domiciliario: 'domiciliario',
	recepcion: 'recepcion',
	cocinero: 'cocinero'
}

const FORMA_DE_PAGO = {
	Transferencia: 'Transferencia',
	Efectivo: 'Efectivo',
	Nequi: 'Nequi',
	Bancolombia: 'Bancolombia',
	PayPal: 'PayPal',
}

module.exports = { COLLECTIONS, ESTADOS, ROLES, FORMA_DE_PAGO }