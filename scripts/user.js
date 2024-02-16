async function getAreas() {
  try {
    const data = await window.electronAPI.getAreas();
    const elegirArea = document.getElementById('elegirArea');
    elegirArea.innerHTML = '';
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.text = item.nombre_area;
      elegirArea.add(option);
    });
    const areaElegida = elegirArea.value;
    await getRutinas(areaElegida);
    await getTrabajadores(areaElegida);
  }
  catch (error) {
    console.error('Error al cargar datos en la lista de areas:', error);
  }
  elegirArea.addEventListener('change', async function () {
    const areaElegida = elegirArea.value;
    await getRutinas(areaElegida);
    await getTrabajadores(areaElegida);
  });
}

async function getTrabajadores(areaElegida) {
  const data = await window.electronAPI.getTrabajadoresporArea(areaElegida);
  const selectTrabajador = document.getElementById('selectTrabajador');
  selectTrabajador.innerHTML = '';
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id_trabajador;
    option.text = item.nombre_trabajador;
    selectTrabajador.add(option);
  })
}

async function getRutinas(areaElegida) {
  try {
    // obtener rutinas por area, llamado a BD
    const info = await window.electronAPI.getRutinasPorTurno(areaElegida);
    const data = info[0] // obtener rutinas
    const rutinaCheckboxes = document.getElementById('rutinaCheckboxes');
    const form = document.getElementById('checkbox-label')
    form.textContent = info[1]
    //console.log(rutinaCheckboxes);
    rutinaCheckboxes.innerHTML = "";
    // logica para llenar checkboxes con rutinas correspondientes
    data.forEach(item => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.classList.add('checkbox-group');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'rutinas';
      checkbox.value = item.rutinas_operacionales.id_rutina;
      const label = document.createElement('label');
      label.textContent = item.rutinas_operacionales.descripcion_rutina;
      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      rutinaCheckboxes.appendChild(checkboxDiv);
    });
  } 
  catch (error) {
    console.error('Error al cargar datos en la lista de rutinas:', error);
  }
}

// confirmar emision de formulario
async function confirmForm() {
  var confirmEdit = await window.messageAPI.confirmar('send-confirm', 'Va a emitir el reporte con los datos seleccionados, ¿está seguro?')
  if (confirmEdit) {
    emitirInforme()
  }
}

async function emitirInforme() {
  try {
    //obtener area de rutina realizada
    var area = document.getElementById('elegirArea').value;
    var data_area = await window.electronAPI.getNombreArea(area);
    const nombre_area =data_area[0].nombre_area;
    // obtener datos de trabajador a cargo
    var operadorACargo = document.getElementById('selectTrabajador');
    const data_trabajador = await window.electronAPI.getDatosTrabajador(operadorACargo.value)
    const nombre_trabajador = data_trabajador[0].nombre_trabajador;
    const rol_trabajador = data_trabajador[0].rol_trabajador.nombre_rol;
    const turno_trabajador = data_trabajador[0].turno_trabajador.nombre_turno;
    //obteniendo observaciones de rutinas
    var observacionesRutina = document.getElementById('observacionesRutina');
    // checkboxes de rutinas
    const padre = document.getElementById('rutinaCheckboxes')
    const checkboxes = padre.querySelectorAll('input[type="checkbox"]:checked');
    //comprobar al menos una rutina fue seleccionada
    var bool = false;
    checkboxes.forEach((checkbox)=>{
      if(checkbox.checked == true){
        bool = true
      }
    })
    // comprobar que estan los datos necesarios para insertar
    if(operadorACargo.value === '' || bool === false){
      await window.messageAPI.alerta('send-alert', 'Rellene los campos necesarios para emitir informe')
      return;
    }
    console.log(checkboxes)
    //inserto los nombres como texto y no por referencia, para no perder info en el futuro (cambio de rutinas, turnos,areas, etc)
    // guardar el contexto donde se hizo
    //data = await window.electronAPI.emitirInforme(operadorACargo.value, rutinaRealizada.value, observacionesRutina.value);
    // resetear valores insertados
    operadorACargo.value = ''
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    observacionesRutina.value = ''
    await window.messageAPI.alerta('send-alert', 'Informe emitido exitosamente')
  }
  catch (error) {
    await window.messageAPI.alerta('send-alert', 'Error al emitir informe')
    console.error('Error al emitir informe: ', error);
  }
}

getAreas()