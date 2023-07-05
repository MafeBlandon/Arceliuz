
async function validAdres(direccion) {
    try {

        let url = 'https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyAppp0ve_fH4pfM6vQvbI_LW0B8hbNg7IU';
        const address = {
            address: {
                "regionCode": "CO",
                addressLines: [direccion]
            }
        }
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address)
        };
        const res = await fetch(url, options)
        const data = await res.json()

        console.log('[validAdres] ', data.result.geocode.location)


        return { lat: data.result.geocode.location.latitude, lng: data.result.geocode.location.longitude }

    } catch (error) {
        console.log(error)
        throw error
    }
}