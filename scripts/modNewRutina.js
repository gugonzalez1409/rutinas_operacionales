async function getIDrutina(){
   id = await window.electronAPI.getIDrutina()
   return id;
}

async function getAreaRutina(){
    try{
       const id = await getIDrutina();
       const data = await window.electronAPI.getAreaRutina(id);
       const idArea = data[0]['area_rutina'];
       return idArea;
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
            return nombre;
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
        var old_area;
        data.forEach(item => {
            const nuevaArea = document.createElement('option')
            nuevaArea.value = item.id;
            nuevaArea.text = item.nombre_area;
            if(item.id == idArea){
                old_area = item.id;
               nuevaArea.selected = true
            }
            areaMod.add(nuevaArea)
        });
        return old_area;
    }
    catch(error){
        console.error('Error al cargar lista de areas:', error);
    }
}

async function getJornadaActual(){
    const id = await window.electronAPI.getIDrutina()
    const data = await window.electronAPI.getJornadaActual(id);// array con los dias y jornada
    console.log(data);
    //obtener checkboxes
    const padre = document.getElementById('ModNewRutina-template')
    const checkboxes = padre.querySelectorAll('input[type="checkbox"]');
    console.log(checkboxes)
    data.forEach(item => {
        if(checkboxes[0].value == item['id_jornada']){
            checkboxes[0].checked = true
        }
        if(checkboxes[1].value == item['id_jornada']){
            checkboxes[1].checked = true
        }
        if(checkboxes[2].value == item['id_dia']){
            checkboxes[2].checked = true
        }
        else if(checkboxes[3].value == item['id_dia']){
            checkboxes[3].checked = true
        }
        else if(checkboxes[4].value == item['id_dia']){
            checkboxes[4].checked = true
        }
        else if(checkboxes[5].value == item['id_dia']){
            checkboxes[5].checked = true
        }
        else if(checkboxes[6].value == item['id_dia']){
            checkboxes[6].checked = true
        }
        else if(checkboxes[7].value == item['id_dia']){
            checkboxes[7].checked = true
        }
        else if(checkboxes[8].value == item['id_dia']){
            checkboxes[8].checked = true
        }
    })
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

async function modificarRutina(){
    const id = await getIDrutina(); // id rutina seleccionada
    const old_nombre = await getNombreRutina();
    // conseguir nombre y area originales
    const old_area = await getAreaRutina();
    const new_nombre = document.getElementById('nombreModRutina').value; // nombre de rutina
    const new_area = document.getElementById('areaModRutina').value; // area de rutina
    const diasSeleccionados = obtenerDiasSeleccionados(); // dias a realizar 
    const turnosSeleccionados = obtenerTurnosSeleccionados(); // turno a realizar
    if(turnosSeleccionados.length === 0){
        await window.messageAPI.alerta('send-alert', 'Debe seleccionar al menos una jornada de trabajo')
        return;
    }
    else if(diasSeleccionados.length === 0){
        await window.messageAPI.alerta('send-alert', 'Debe seleccionar al menos un dia')
        return;
    }

    if(old_nombre != new_nombre){ // si cambia el nombre
        // update nombre en rutinas_operacionales
        const data_nombre = await window.electronAPI.editNombreRutina(new_nombre, id);
    }
    if(new_area != old_area){ // si cambia el area
        // update rutina en rutinas_operacionales
        const data_area = await window.electronAPI.editAreaRutina(new_area, id); 
    }
    // borra dias anteriores en dia_jornada
    const data_old_dias = await window.electronAPI.borrarJornadasRutina(id); 
    //inserta dias nuevos
    for(const dia of diasSeleccionados){
        for(const turno of turnosSeleccionados){
            // inserta en dia_jornada
            new_data = await window.electronAPI.insertarDiaJornada(dia, turno, id);
        }
    }
    await window.messageAPI.alerta('send-alert', 'Rutina modificada exitosamente')
}

getJornadaActual()
getNombreRutina()
getAreasEditRutina()
getAreaRutina()