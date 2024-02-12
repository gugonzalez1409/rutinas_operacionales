async function getIDrutina(){
   id = await window.electronAPI.getIDrutina()
   return id;
}

async function getAreaRutina(){
    try{
       const id = await getIDrutina();
       const data = await window.electronAPI.getAreaRutina(id);
       const idArea = data[0]['area_rutina']
       return idArea
        
    }
    catch(error){
       console.error('Error al obtener nombre de rutina:', error);
    }
}

async function getNombreRutina(){
    try{
        const id = await getIDrutina();
        const data = await window.electronAPI.getNombreRutina(id)
        if (data && data.length > 0) {
            const nombre = data[0]['descripcion_rutina'];
            const nombreInput = document.getElementById('nombreModRutina');
            if (nombreInput) {
                nombreInput.value = nombre;
            }
        }
    }
    catch(error){
        console.error('Error al obtener nombre de rutina:', error);
    }
}

async function getAreasEditRutina(){
    try{
        const data = await window.electronAPI.getAreas()
        const areaMod = document.getElementById('areaModRutina')
        const idArea = await getAreaRutina()
        areaMod.innerHTML = ''
        data.forEach(item => {
            const nuevaArea = document.createElement('option')
            nuevaArea.value = item.id;
            nuevaArea.text = item.nombre_area;
            if(item.id == idArea){
               nuevaArea.selected = true
            }
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

getNombreRutina()
getAreasEditRutina()
getAreaRutina()