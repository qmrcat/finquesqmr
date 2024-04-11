(function() {
    const lat = document.querySelector('#lat').textContent
    const lng = document.querySelector('#lng').textContent
    const titulo = document.querySelector('#titol').textContent
    const mapa = L.map('mapa').setView([lat, lng], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ca', {
        //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributorsQMR'
        attributionControl: false
    }).addTo(mapa);

    try {
        mapa.attributionControl._container.innerHTML = ''
    } catch (error) {
        console.log( error );
    }

    // Agregar el pin
    L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(titulo)
    
})()
