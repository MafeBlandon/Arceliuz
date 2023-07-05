

function uservalid(rolerValid) {

	let loginDomi = JSON.parse(localStorage.getItem('login-domi'))
	let token = `Bearer ${loginDomi?.token}`

	if (!loginDomi) {
		window.location.href = "/401"
	}
	if (rolerValid.some(e => loginDomi.user.role.includes(e))) {
		console.log('es valido ');
	} else {
		console.log(`no es valido `);
		window.location.href = "/401"
	}
}

function gestionarToken() {
	let loginDomi = JSON.parse(localStorage.getItem('login-domi'))
	let token = `Bearer ${loginDomi?.token}`
	return token
}

function gestionarRole() {
	let loginDomi = JSON.parse(localStorage.getItem('login-domi'))
	return loginDomi.user.role
}
