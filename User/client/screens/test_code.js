const calculateDistance = (userLocation, restaurantLocation) => {
    const earthRadiusKm = 6371; 
    const lat1 = userLocation.latitude;
    const lon1 = userLocation.longitude;
    const lat2 = restaurantLocation.latitude;
    const lon2 = restaurantLocation.longitude;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    
    console.log(distance)
};

const toRadians = (angle) => {
    return angle * (Math.PI / 180);
};


calculateDistance('FB Area Block 12, Karachi, Pakistan', 'FB Area Block 12, Karachi, Pakistan')