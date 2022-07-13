(function() {

    const lat = -34.6162284;
    const lng = -68.3299441;
    const mapa = L.map('mapa').setView([lat, lng ], 14);
    let marker;

    //Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    //Obtener lat y lng desde el pin y centrar el mapa donde se posiciona el pin
    marker.on('moveend', function(e){
        let actualMarker = e.target

        const position = actualMarker.getLatLng();

        mapa.panTo(new L.LatLng(position.lat, position.lng))

        //Obtener info de la calle al soltar el pin
        geocodeService.reverse().latlng(position, 13).run(function(err, res){

            marker.bindPopup(res.address.LongLabel)
        })
    })

})()