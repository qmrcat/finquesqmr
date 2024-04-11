(function() {
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    const cadena01 = cadenaTranslate.cadena01
    const cadena02 = cadenaTranslate.cadena02
    const cadena03 = cadenaTranslate.cadena03

    cambiarEstadoBotones.forEach( boton => {
        boton.addEventListener('click', cambiarEstadoPropiedad)
    } )

    async function cambiarEstadoPropiedad(e) {

        const { propietatId: id } = e.target.dataset
        
        try {
            const url = `/propietat/${id}`

            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })

            const {resultat, missatge} = await respuesta.json()

            if(resultat) {
                if(e.target.classList.contains('bg-yellow-100')) {
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = cadena02
                } else {
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = cadena03
                }
            } else {
                alert(cadena01 + '.\n' + missatge)
            }
        } catch (error) {
            console.log(error)
        }
       
    }
})()