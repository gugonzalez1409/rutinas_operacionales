async function getAreasEditRutina(){
    try{
        console.log('hola')
        const data = await window.electronAPI.getAreas()
        const area = document.getElementById('areaModRutina')
        area.innerHTML = ''
        data.forEach(item => {
            const option = document.createElement('option')
            option.value = item.id;
            option.text = item.nombre_area;
            area.add(option)
        });
    }
    catch(error){
        console.error('Error al cargar lista de areas:', error);
    }
}

getAreasEditRutina()