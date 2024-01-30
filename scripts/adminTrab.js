async function getTrabajadores(){
  try{
    const data = await window.electronAPI.getListaTrabajadores();
    const listaTrabajadores = document.getElementById('workerName')
    listaTrabajadores.innerHTML = ''
    data.forEach(item => {
      const trabajador = document.createElement('option')
      option.value = item.id_trabajador;
      option.text = item.nombre_trabajador;
    });  
  }
  catch(error){
    console.error('Error al cargar lista de datos: ', error)
  }
}

function openForm() {
    document.getElementById('addWorkerForm').style.display = 'block';
  }

  function closeForm() {
    document.getElementById('addWorkerForm').style.display = 'none';
  }
  function updateWorker() {
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
  }

  getTrabajadores()