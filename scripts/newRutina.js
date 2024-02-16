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

function marcarTodosLosDias() {
    const checkboxDiario = document.getElementById('diario');
    const checkboxesDias = document.getElementsByName('dias');
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
    const checkboxesDias = document.querySelectorAll('input[name="dias"]:checked');
    checkboxesDias.forEach((checkbox) =>{
        DiasSeleccionados.push(checkbox.value);
    });
    return DiasSeleccionados;
}

function obtenerTurnosSeleccionados(){
    const turnosSeleccionados =[]
    const checkboxesTurnos = document.querySelectorAll('input[name="turno"]:checked')
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

async function crearNuevaRutina(){
    var nombreRutina = document.getElementById('nombreRutina').value;
    var areaSeleccionada = document.getElementById('areaRutina').value;
    var diasSeleccionados = obtenerDiasSeleccionados();
    var turnosSeleccionados = obtenerTurnosSeleccionados();
    if(turnosSeleccionados.length === 0){
        await window.messageAPI.alerta('send-alert', 'Debe seleccionar al menos una jornada de trabajo')
        return;
    }
    if(diasSeleccionados.length === 0){
        await window.messageAPI.alerta('send-alert', 'Debe seleccionar al menos un dia')
        return;
    }
    console.log("nombre de la rutina: ", nombreRutina);
    console.log('area seleccionada: ', areaSeleccionada);
    console.log('dias seleccionados: ', diasSeleccionados);
    console.log('turnos seleccionados: ', turnosSeleccionados);
    //inserta en rutinas_operacionales
    const data = await window.electronAPI.insertarNuevaRutina(nombreRutina, areaSeleccionada)
    const id_rutina = data[0]['id_rutina']
    for(const dia of diasSeleccionados){
        for(const turno of turnosSeleccionados){
            // inserta en dia_jornada
            new_data = await window.electronAPI.insertarDiaJornada(dia, turno, id_rutina);
        }
    }
    limpiarFormulario()
    await window.messageAPI.alerta('send-alert', 'Rutina agregada exitosamente')

}

function limpiarFormulario(){
    document.getElementById('nombreRutina').value = '';
    document.getElementById('areaRutina').value = '';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}

getAreasNuevaRutina()