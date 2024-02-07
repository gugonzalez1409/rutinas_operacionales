async function obtenerIDrutina(){
    
}

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
        actualizarSelecciones()
    } else {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = false;
        });
    }
}

function obtenerDiasSeleccionados(){
    const DiasSeleccionados = []
    const checkboxesDias = document.querySelectorAll('input[name="ModDias"]:checked');
    checkboxesDias.forEach((checkbox) =>{
        DiasSeleccionados.push(checkbox.value);
    });
    return DiasSeleccionados;
}

function obtenerTurnosSeleccionados(){
    const turnosSeleccionados =[]
    const checkboxesTurnos = document.querySelectorAll('input[name="ModTurno"]:checked')
    checkboxesTurnos.forEach((checkbox)=>{
        turnosSeleccionados.push(checkbox.value);
    });
    return turnosSeleccionados;
}

function actualizarSelecciones() {
    const diasSeleccionados = obtenerDiasSeleccionados();
    const turnosSeleccionados = obtenerTurnosSeleccionados();
    for (const dia of diasSeleccionados) {
        for (const turno of turnosSeleccionados) {
          console.log(`${dia}, ${turno}`);
        }
    }
}

getAreasEditRutina()