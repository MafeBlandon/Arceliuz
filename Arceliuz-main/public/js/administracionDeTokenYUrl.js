var HOST_API = `https://domiburguer.com/api/`
if (this.origin.includes('127.0.0.1') || this.origin.includes('localhost')||this.origin.includes('192.168.1.14') ) HOST_API = `http://localhost:8087/api/`
if (this.origin.includes('127.0.0.1') || this.origin.includes('localhost')||this.origin.includes('192.168.1.14') ) HOST_API = `http://localhost:8087/api/`

let loginDomi = JSON.parse(localStorage.getItem('login-domi'))
if (!loginDomi) {
	//window.location.href = "/401"

}
var token = `Bearer ${loginDomi.token}`
