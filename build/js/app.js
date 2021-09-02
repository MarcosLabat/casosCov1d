const select = document.querySelector('#paises');
const btnInput = document.querySelector('#btn');
const contenedorInfo = document.querySelector('.contenedor');
const hijosInfo = document.querySelectorAll('.info');


document.addEventListener('DOMContentLoaded', () => {
    mostrarDatos()
    leerInput()
    llenarSelect()
})

const pais = {
    region: '',
}

//FUNCION PARA QUE CUANDO ELIJAN UN PAÍS SE MUESTREN LOS DATOS
const leerInput = () => {
    select.addEventListener('change', (e) => {
        pais.region = e.target.value
        mostrarDatos()
        limpiarHtml()
    })
}

//FUNCION PARA OBTENER LOS DATOS DE LA API
const mostrarDatos = async () => {
    try {
        const respuesta = await fetch('https://api.covid19api.com/summary')
        const data = await respuesta.json();
        const dataTotal = await data.Countries
        llenarSelect(dataTotal)
        mostrarContenido(dataTotal)

    } catch (error) {
        console.log(error)
    }   
    
}

//FUNCION PARA LLENAR EL SELECT CON EL NOMBRE DE LOS PAISES
const llenarSelect = (info) => {
    const hijo = select.lastElementChild;
    if(hijo.classList.contains('pais')){
        return;
    }
    const fragmento = document.createDocumentFragment();
    if(info){
    for(const paisess of info ){
            const option = document.createElement('OPTION')
            option.value = paisess.Country
            option.textContent = paisess.Country;
            option.classList.add('pais')
            fragmento.appendChild(option)
        }
    }
    select.appendChild(fragmento)
}

//FUNCION PARA MOSTRAR EL CONTENIDO SOBRE LOS DATOS DEL COVID
const mostrarContenido = (informacion) => {
    const datosCovid =  informacion.find(element => {
        const { region } = pais;
        if(region){
            return element.Country.toLowerCase() === region.toLowerCase()
        }
        else return pais
    })
    const nombrePais = document.createElement('P')
    nombrePais.textContent = datosCovid.Country
    nombrePais.classList.add('borrar')

    const positivo = document.createElement('P');
    positivo.textContent = datosCovid.TotalConfirmed.toLocaleString('en-US')
    positivo.classList.add('borrar')
    
    const fallecidos = document.createElement('P');
    fallecidos.textContent = datosCovid.TotalDeaths.toLocaleString('en-US')
    fallecidos.classList.add('borrar')
    
    
    const recuperados = document.createElement('P');
    if(recuperados.TotalRecovered <= 1)recuperados.textContent = datosCovid.TotalRecovered.toLocaleString('en-US')
    else recuperados.textContent = 'Datos no encontrados.'
    recuperados.classList.add('borrar')

    
    hijosInfo[0].appendChild(nombrePais)
    hijosInfo[1].appendChild(positivo)
    hijosInfo[2].appendChild(fallecidos)
    hijosInfo[3].appendChild(recuperados)
    
    contenedorInfo.appendChild(hijosInfo[0])
    contenedorInfo.appendChild(hijosInfo[1])
    contenedorInfo.appendChild(hijosInfo[2])
    contenedorInfo.appendChild(hijosInfo[3])
}

//FUNCION PARA QUE CUANDO CAMBIEN DE PAIS SE BORREN LOS DATOS ANTERIORES
const limpiarHtml = () => {
    const borrar = document.querySelectorAll('.borrar')
    for(const hijos of borrar){
        hijos.remove()
    }
}
mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY29zbGFiYXQiLCJhIjoiY2txc2FxbW1kMXhscTJucXE2NTM4c2szMCJ9.j6Df4-XKHxM15g7wkSVG1A';

document.addEventListener('DOMContentLoaded', () => {
    mostrarMapa()
})
//INFORMACION PARA EL MAPA
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-3, 40],
    zoom: 3
})
//FUNCION PARA OBTENER LOS DATOS DE LA API
const mostrarDatosMapa = async () => {
    try {
        const dataMapa = await fetch('https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/latest');
        const data = await dataMapa.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

//FUNCION PARA MOSTRAR EL MAAPA CON LOS MARKES EN CADA PAÍS QUE TENGA CASOS CONFIRMADOS
const mostrarMapa = async () => {
    const datos = await mostrarDatosMapa()
    datos.forEach(marcador => {
        let popup = new mapboxgl.Popup({ offset: 25 }).setText(infomarker(marcador))
        if(marcador.confirmed > 0){
            new mapboxgl.Marker({
                color: '#e50914',
                draggable: false
            }).setLngLat([marcador.location.lng,marcador.location.lat])
            .setPopup(popup)
            .addTo(map)
        }
    });
}

//FUNCION PARA MOSTRAR LOS DATOS EN LOS MARKERS
const infomarker = (info) => {
    const {confirmed, deaths, recovered, countryregion} = info
    if(recovered){
    return `
        País: ${countryregion}
        Confirmados: ${confirmed.toLocaleString('es-ES')}   
        Muertes: ${deaths.toLocaleString('es-ES')}
        Recuperados ${recovered.toLocaleString('es-ES')}`
    }
    else{
        return `
            Confirmados: ${confirmed.toLocaleString('es-ES')}      
            Muertes: ${deaths.toLocaleString('es-ES')}
            Recuperados: Datos no encontrados
        `
    }
}