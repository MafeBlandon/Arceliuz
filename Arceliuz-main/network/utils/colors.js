function generarColorPastel(rangoRojo, rangoVerde, rangoAzul) {
	const r = Math.floor(Math.random() * (rangoRojo[1] - rangoRojo[0] + 1)) + rangoRojo[0];
	const g = Math.floor(Math.random() * (rangoVerde[1] - rangoVerde[0] + 1)) + rangoVerde[0];
	const b = Math.floor(Math.random() * (rangoAzul[1] - rangoAzul[0] + 1)) + rangoAzul[0];
  
	// Mezcla los componentes de color con blanco para crear un color pastel
	const mezcla = Math.floor(Math.random() * 256);
	const rPastel = Math.floor((r + mezcla) / 2).toString(16).padStart(2, '0');
	const gPastel = Math.floor((g + mezcla) / 2).toString(16).padStart(2, '0');
	const bPastel = Math.floor((b + mezcla) / 2).toString(16).padStart(2, '0');
		// Concatena los componentes de color mezclados para formar el color pastel en formato hexadecim
  	const colorPastel = '#' + rPastel + gPastel + bPastel;
	return colorPastel;
  }

// Genera un color pastel aleatorio y lo imprime en la consola

module.exports = {
	generarColorPastel,
}