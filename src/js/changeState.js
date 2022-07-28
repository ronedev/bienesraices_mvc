(function(){
    const changeStateButtons = document.querySelectorAll('.changeState')

    const token = document.querySelector('meta[name="csrfToken"]').getAttribute('content')

    changeStateButtons.forEach(button =>{
        button.addEventListener('click', changeStateProperty)
    })

    async function changeStateProperty(e){
        const { propertyId: id} = e.target.dataset

        try {
            const url = `/propetries/${id}`

            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token     
                }
            })

            const {response} = await res.json()
            if(response){
                if(e.target.classList.contains('bg-red-100')){
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-red-100', 'text-red-800')
                    e.target.textContent = 'Publicado'
                }else{
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-red-100', 'text-red-800')
                    e.target.textContent = 'Sin publicar'

                }
            }
        } catch (error) {
            console.log(error)
        }
    }
})()