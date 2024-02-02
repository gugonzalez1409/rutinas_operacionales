async function getAreasNuevaRutina(){
    try{
        data = await window.electronAPI.getAreas()
        const areaRutina = document.getElementById('areaRutina')
        areaRutina.innerHTML = ''
        data.forEach(item => {
            const option = document.createElement('option')
            option.value = item.id;
            option.text = item.nombre_area;
            areaRutina.add(option)
        });
    }
    catch(error){
        console.error('Error al cargar lista de areas:', error);
    }
}

//TENGO QUE INSERTAR EN RUTINAS Y EN DIAS_AGENDA
//EN RUTINAS SOLO 1 VEZ, EN DIAS_AGENDA DEPENDIENDO DE LOS DIAS Y TURNOS SELECCIONADOS

function marcarTodosLosDias() {
    const checkboxDiario = document.getElementById('diario');
    const checkboxesDias = document.getElementsByName('dias');
    if (checkboxDiario.checked) {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = true;
        });
    } else {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = false;
        });
    }
}

getAreasNuevaRutina()