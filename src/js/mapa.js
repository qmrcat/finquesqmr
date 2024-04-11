(function() {

    // Logical Or // 41.155101, 1.108758
    const lat = document.querySelector('#lat').value || 41.155101;
    const lng = document.querySelector('#lng').value || 1.108758; 
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ca', {
        //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributorsQMR'
        attributionControl: false
    }).addTo(mapa);

    try {
        mapa.attributionControl._container.innerHTML = ''
    } catch (error) {
        console.log( error );
    }

    // El Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

    
        geocodeService.reverse().latlng(posicion, 13).language('ca').run(function(error, resultado) {
    
            marker.bindPopup(resultado.address.LongLabel)

            document.querySelector('.carrer').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#carrer').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })



})()
