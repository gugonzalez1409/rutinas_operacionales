async function getAreasEditRutina(){
    try{
        const data = await window.electronAPI.getAreas()
        const areaMod = document.getElementById('areaModRutina')
        areaMod.innerHTML = ''
        data.forEach(item => {
            const nuevaArea = document.createElement('option')
            nuevaArea.value = item.id;
            nuevaArea.text = item.nombre_area;
            areaMod.add(nuevaArea)
        });
    }
    catch(error){
        console.error('Error al cargar lista de areas:', error);
    }
}

function marcarTodosLosDias() {
    const checkboxDiario = document.getElementById('ModDiario');
    const checkboxesDias = document.getElementsByName('ModDias');
    if (checkboxDiario.checked) {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = true;
        });
        //actualizarSelecciones()
    } else {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = false;
        });
    }
}

getAreasEditRutina()