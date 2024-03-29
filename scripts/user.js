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

// REFACTOR PARA OBTENER TRABAJADORES DE SESION INICIADA
async function getTrabajadores(areaElegida) {
  const rol = await window.electronAPI.getRol()
  const data = await window.electronAPI.getTrabajadoresporArea(areaElegida, rol);
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
    rutinaCheckboxes.innerHTML = '';
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
    const checkboxes = padre.querySelectorAll('input[type="checkbox"]');
    //comprobar al menos una rutina fue seleccionada
    var bool = false;
    checkboxes.forEach((checkbox) =>{
      if(checkbox.checked == true){
        bool = true
      }
    })
    // comprobar que estan los datos necesarios para insertar
    if(operadorACargo.value === '' || bool === false){
      await window.messageAPI.alerta('send-alert', 'Rellene los campos necesarios para emitir informe')
      return;
    }
    else{
      // info de rutinas realizadas y no realizadas
      const rutinas = {}
      checkboxes.forEach((checkbox) =>{
        const label = checkbox.parentElement.textContent.trim() // obtener nombre de rutina
        const estado = checkbox.checked ? 1 : 0 // comprueba si está marcado, 1 si, 0 no
        rutinas[label] = estado;
      })
      console.log(rutinas)
    data = await window.electronAPI.emitirInforme(nombre_trabajador, rol_trabajador, turno_trabajador, observacionesRutina.value, nombre_area, rutinas);
    console.log(data)
    // RESET CAMPOS DEL FORM
    operadorACargo.value = ''
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    observacionesRutina.value = ''
    await window.messageAPI.alerta('send-alert', 'Informe emitido exitosamente, por favor, cierre su sesión')
    }
  }
  catch (error) {
    await window.messageAPI.alerta('send-alert', 'Error al emitir informe')
    console.error('Error al emitir informe: ', error);
  }
}

async function LogOut(){
  var confirm = await window.messageAPI.confirmar('send-confirm', '¿Está seguro que desea terminar su turno?')
  if(confirm){
    const data = await window.electronAPI.LogOut()
    console.log(data)
    if(data){
      window.location.href= './login.html'
    }
  }
}

getAreas()