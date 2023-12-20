const axios = require('axios');

async function getGeocodeInfo(latitude, longitude) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data.display_name) {
            const address = response.data.display_name;
            return address;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

// Example usage
const latitude = 17.4292992;
const longitude = 78.462976;

getGeocodeInfo(latitude, longitude)
    .then(address => {
        if (address) {
            console.log(`Address: ${address}`);
        } else {
            console.log('Unable to retrieve address information.');
        }
    })
    