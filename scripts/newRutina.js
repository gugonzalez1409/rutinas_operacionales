//TENGO QUE INSERTAR EN RUTINAS Y EN DIAS_AGENDA
//EN RUTINAS SOLO 1 VEZ, EN DIAS_AGENDA DEPENDIENDO DE LOS DIAS Y TURNOS SELECCIONADOS

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
    const nombreRutina = document.getElementById('nombreRutina').value;
    const areaSeleccionada = document.getElementById('areaRutina').value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const turnosSeleccionados = obtenerTurnosSeleccionados();
    console.log("nombre de la rutina: ", nombreRutina);
    console.log('area seleccionada: ', areaSeleccionada);
    console.log('dias seleccionados: ', diasSeleccionados);
    console.log('turnos seleccionados: ', turnosSeleccionados);
    //inserta en rutinas_operacionales
    //data = await window.electronAPI.crearNuevaRutina(nombreRutina, areaSeleccionada)
    /*for(const dia of DiasSeleccionados){
        for(const turno of turnosSelccionados){
            new_data = await window.electronAPI.insertarDiasJornada(dia, turno);
        }
    }*/
}

getAreasNuevaRutina()