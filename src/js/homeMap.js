(function(){

    const lat = -34.6162284;
    const lng = -68.3299441;
    const mapa = L.map('home-map').setView([lat, lng ], 14);
    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = []

    const filtros ={
        categorys: '',
        prices:''
    }

    const selectCategory = document.querySelector('#categorys')
    const selectPrice = document.querySelector('#prices')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    selectCategory.addEventListener('change', e=>{
        filtros.categorys = +e.target.value
        filterProperty()
    })
    selectPrice.addEventListener('change', e=>{
        filtros.prices = +e.target.value
        filterProperty()
    })

    const getProperties = async ()=>{
        const URL = '/api/properties'

        const response = await fetch(URL)

        propiedades = await response.json()

        showProperties(propiedades)
    }

    const showProperties = async (propiedades)=>{

        //Limpiar markers antiguos
        markers.clearLayers()

        propiedades.forEach(propiedad =>{
            //Agregar los markers
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan:true,

            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-extrabold text-center uppercase">${propiedad?.categoria.name}</p>
                <h1 class="text-l font-bold my-5 uppercase">${propiedad?.title}</h1>
                <img src="/uploads/${propiedad?.image}" alt="Propiedad"/>
                <p class="text-gray-600 font-bold">${propiedad?.precio.name}</p>
                <a href="/property/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
            `)

            markers.addLayer(marker)
        })
    }

    const filterProperty = ()=>{
        const filterCategory = propiedad => filtros.categorys ? propiedad.categoryId === filtros.categorys : propiedad
        const filterPrice = propiedad => filtros.prices ? propiedad.priceId === filtros.prices : propiedad
        
        const result = propiedades.filter(filterCategory).filter(filterPrice)

        showProperties(result)
    }

    getProperties()
})()