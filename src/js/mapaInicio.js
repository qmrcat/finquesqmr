(function(){
    const lat = 41.155101;
    const lng = 1.108758;
    // const lat = document.querySelector('#lat').value || 41.155101;
    // const lng = document.querySelector('#lng').value || 1.108758; 
    const mapa = L.map('mapa-inici').setView([lat, lng ], 13);

    let markers = new L.FeatureGroup().addTo(mapa)

    
    let propietats = [];
    
    // Filtros
    const filtres = {
        categoria: '',
        preu: ''
    }
    
    const categoriesSelect = document.querySelector('#categories');
    const preusSelect = document.querySelector('#preus');

    // Filtrado de Categorias y precios
    categoriesSelect.addEventListener('change', e => {
        filtres.categoria = +e.target.value
        filtrarPropietats();
    })

    preusSelect.addEventListener('change', e => {
        filtres.preu = +e.target.value
        filtrarPropietats();
    })


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ca', {
        //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributorsQMR'
        attributionControl: false
    }).addTo(mapa);

    try {
        mapa.attributionControl._container.innerHTML = ''
    } catch (error) {
        console.log( error );
    }


    const obtenirPropietats = async () => {
        try {
            const url = '/api/propietats'
            const respuesta = await fetch(url)
            propietats = await respuesta.json()
            //console.log("🚀 ~ obtenirPropietats ~ propietats:", propietats)
            visualitzarPropietats(propietats)
        } catch (error) {
            console.log(error)
        }
    }

    const visualitzarPropietats = propietats => {

        markers.clearLayers()

        propietats.forEach(propietat => {
            
            const marker = new L.marker([propietat?.lat, propietat?.lng ], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propietat.categoria.nom}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${propietat?.titol}</h1>
                <img src="/uploads/${propietat?.imatge}" alt="Imatge de la propietat ${propietat.titol}">
                <p class="text-gray-600 font-bold">${propietat.preu.nom}</p>
                <a href="/propietat/${propietat.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white">Visualtzar Propietat</a>
            `)
            markers.addLayer(marker)
        })
    }

    const filtrarPropietats = () => {
        const resultat = propietats.filter( filtrarCategoria ).filter( filtrarPreu )
        visualitzarPropietats(resultat)
    }


    const filtrarCategoria = propietat => filtres.categoria ? propietat.categoriaId === filtres.categoria : propietat
    
    const filtrarPreu = propietat => filtres.preu ? propietat.preuId === filtres.preu : propietat


    obtenirPropietats()
})()
