async function getTrabajadores(){
  try{
    const data = await window.electronAPI.getListaTrabajadores();
    const listaTrabajadores = document.getElementById('nombreTrab')
    console.log(listaTrabajadores)
    listaTrabajadores.innerHTML = ''
    data.forEach(item => {
      const trabajador = document.createElement('option')
      trabajador.value = item.id_trabajador;
      trabajador.text = item.nombre_trabajador;
      listaTrabajadores.add(trabajador);
    });
    listaTrabajadores.addEventListener('change', async function() {
      const trabajadorElegido = listaTrabajadores.value;
      await getRoles(trabajadorElegido)
      await getTurnos(trabajadorElegido)
    });
  }
  catch(error){
    console.error('Error al cargar lista de datos: ', error)
  }
}

async function getRoles(trabajadorElegido){
  try{
    const data = await window.electronAPI.getRoles(trabajadorElegido)
    const roles = document.getElementById('rolTrab')
    roles.innerHTML= ''
    data.forEach(item => {
      const rol = document.createElement('option')
      rol.value = item.rol_trabajador.id_rol;
      rol.text = item.rol_trabajador.nombre_rol;
      roles.add(rol)
    });
  }
  catch(error){
    console.error('Error al cargar la lista de datos: ',error)
  }
}

async function getTurnos(trabajadorElegido){
  try{
    const data = await window.electronAPI.getTurnos(trabajadorElegido)
    const turnos = document.getElementById('turnoTrab')
    turnos.innerHTML= ''
    data.forEach(item => {
      const turno = document.createElement('option')
      turno.text = item.turno_trabajador;
      turnos.add(turno)

    });
  }
  catch(error){
    console.error('Error al cargar la lista de datos: ',error)
  }
}

//necesito cargar todos los roles y areas, pero que tenga preseleccionado el propio del trabajador

function openForm() {
    document.getElementById('addWorkerForm').style.display = 'block';
  }

function closeForm() {
    document.getElementById('addWorkerForm').style.display = 'none';
  }

/*function updateWorker() {
   var workerName = document.getElementById('workerName').value;
   var workerArea = document.getElementById('workerArea').value;
   var workerRole = document.getElementById('workerRole').value;
  // Puedes realizar acciones de actualización, por ejemplo, enviar datos al servidor
  alert(`Actualizando trabajador: ${workerName}, Área: ${workerArea}, Rol: ${workerRole}`);
  }

  function deleteWorker() {
   var workerName = document.getElementById('workerName').value;
    // Puedes realizar acciones de eliminación, por ejemplo, enviar datos al servidor
   alert(`Eliminando trabajador: ${workerName}`);
  }

  // Event listener para actualizar las áreas y roles cuando se selecciona un trabajador
  document.getElementById('workerName').addEventListener('change', function() {
    var selectedWorker = this.value;
    // Simula obtener información del trabajador desde una fuente de datos (puedes reemplazarlo con datos reales)
    var workerDetails = getWorkerDetails(selectedWorker);
    // Actualiza los campos de área y rol con la información obtenida
    document.getElementById('workerArea').value = workerDetails.area;
    document.getElementById('workerRole').value = workerDetails.role;
  });

  // Simula obtener información del trabajador desde una fuente de datos (puedes reemplazarlo con datos reales)
  function getWorkerDetails(workerName) {
    // Este es solo un ejemplo. Deberías obtener los detalles del trabajador desde tu fuente de datos (base de datos, API, etc.)
    var workerDetails = {
      'Dario Aguilar': { area: 'Turbogeneradores', role: 'Operador Turbogeneradores' },
      'Gustavo González': { area: 'Área 2', role: 'Operador terreno Multipropósito' }
      // Agrega más detalles según sea necesario
    };
    return workerDetails[workerName] || { area: '', role: '' };
  }*/

  getTrabajadores()