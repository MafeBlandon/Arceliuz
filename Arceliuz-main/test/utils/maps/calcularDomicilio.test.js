process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; // Reemplaza con la dirección correcta del emulador
///para hacer el llamado al emulador

const assert = require('assert');
const { obtenerCoordenadas } = require('../../../network/utils/calcularDomicilio')

describe('obtenerCoordenadas', function() {
  it('debería devolver las coordenadas geográficas correctas para una dirección válida', async function() {
    const direccion = '1600 Amphitheatre Parkway, Mountain View, CA';
    const coordenadas = await obtenerCoordenadas(direccion);

    assert.strictEqual(coordenadas.lat, 37.4223878);
    assert.strictEqual(coordenadas.lng, -122.0841877);
  });
});



