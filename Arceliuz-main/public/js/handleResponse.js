
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
