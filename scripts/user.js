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
    const data = await window.electronAPI.rutinasPorArea(areaElegida);
    const rutinaCheckboxes = document.getElementById('rutinaCheckboxes');
    console.log(rutinaCheckboxes);
    rutinaCheckboxes.innerHTML = "";
    // logica para llenar checkboxes con rutinas correspondientes
    data.forEach(item => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.classList.add('checkbox-group');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'rutinas';
      checkbox.value = item.id_rutina;
      const label = document.createElement('label');
      label.textContent = item.descripcion_rutina;
      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      rutinaCheckboxes.appendChild(checkboxDiv);
    });
  } catch (error) {
    console.error('Error al cargar datos en la lista de rutinas:', error);
  }
}

// confirmar emision de formulario
function confirmForm() {
  var confirmEdit = confirm('Va a emitir el reporte con los datos seleccionados, ¿está seguro?');
  if (confirmEdit) {
    emitirInforme()
  }
}

async function emitirInforme() {
  try {
    // obtener variables a insertar en BD
    var operadorACargo = document.getElementById('selectTrabajador');
    //var rutinaRealizada = document.getElementById('rutinaCheckboxes');
    var observacionesRutina = document.getElementById('observacionesRutina');
    const padre = document.getElementById('rutinaCheckboxes')
    const checkboxes = padre.querySelectorAll('input[type="checkbox"]');
    console.log(checkboxes)
    //comprobar al menos una rutina fue seleccionada
    var bool = false;
    checkboxes.forEach((checkbox)=>{
      if(checkbox.checked == true){
        bool = true
      }
    })
    // comprobar que estan los datos necesarios para insertar
    if(operadorACargo.value === '' || bool === false){
      alert('Rellene los campos necesarios para emitir informe')
      return;
    }
    //data = await window.electronAPI.emitirInforme(operadorACargo.value, rutinaRealizada.value, observacionesRutina.value);
    // resetear valores insertados
    operadorACargo.value = ''
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    observacionesRutina.value = ''
    alert('Informe emitido exitosamente')
  }
  catch (error) {
    alert('Error al emitir informe')
    console.error('Error al emitir informe: ', error);
  }
}

getAreas()