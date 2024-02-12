async function getTrabajadores(){
  try{
    const data = await window.electronAPI.getListaTrabajadores();
    const listaTrabajadores = document.getElementById('nombreTrab')
    listaTrabajadores.innerHTML = '';
    data.forEach(item => {
      const trabajador = document.createElement('option')
      trabajador.value = item.id_trabajador;
      trabajador.text = item.nombre_trabajador;
      listaTrabajadores.add(trabajador);
    });

    const trabajadorElegido = listaTrabajadores.value;
    var trabajadorSeleccionado = data.find(function(diccionario) {
      return diccionario.id_trabajador == trabajadorElegido;
  });
    const rolTrabajadorElegido = trabajadorSeleccionado['rol_trabajador'];
    const turnoTrabajadorElegido = trabajadorSeleccionado['turno_trabajador'];
    await getRoles(rolTrabajadorElegido);
    await getTurnos(turnoTrabajadorElegido);
    
    listaTrabajadores.addEventListener('change', async function() {
      const trabajadorElegido = listaTrabajadores.value;
      var trabajadorSeleccionado = data.find(function(diccionario) {
        return diccionario.id_trabajador == trabajadorElegido;
    });
      const rolTrabajadorElegido = trabajadorSeleccionado['rol_trabajador'];
      const turnoTrabajadorElegido = trabajadorSeleccionado['turno_trabajador'];
      await getRoles(rolTrabajadorElegido);
      await getTurnos(turnoTrabajadorElegido);
    });
  }
  catch(error){
    console.error('Error al cargar lista de datos: ', error)
  }
}

async function getRoles(rolTrabajadorElegido){
  try{
    const data = await window.electronAPI.getAllRoles()
    const roles = document.getElementById('rolTrab')
    roles.innerHTML= ''
    data.forEach(item => {
      const rol = document.createElement('option')
      if(rolTrabajadorElegido == item.id_rol){
        rol.value = item.id_rol;
        rol.text = item.nombre_rol;
        rol.selected = true;
      }
      else{
        rol.value = item.id_rol;
        rol.text = item.nombre_rol;
      }
      roles.add(rol)
    });
  }
  catch(error){
    console.error('Error al cargar la lista de datos: ',error)
  }
}

async function getTurnos(turnoTrabajadorElegido){
  try{
    const data = await window.electronAPI.getTurnos()
    const turnos = document.getElementById('turnoTrab')
    turnos.innerHTML= ''
    data.forEach(item => {
      const turno = document.createElement('option')
      if(turnoTrabajadorElegido == item.id){
        turno.text = item.nombre_turno;
        turno.value = item.id;
        turno.selected = true;
      }
      else{
        turno.text = item.nombre_turno;
        turno.value = item.id;
      }
      turnos.add(turno)
    });
  }
  catch(error){
    console.error('Error al cargar la lista de datos: ',error)
  }
}

function openForm() {
    document.getElementById('nuevoTrabForm').style.display = 'block';
    getAllRoles()
    turnoNuevoTrab()
  }

function closeForm() {
    document.getElementById('nuevoTrabForm').style.display = 'none';
  }

function closeRolForm() {
    document.getElementById('nuevoRolForm').style.display = 'none';
  }

function openRolForm(){
  document.getElementById('nuevoRolForm').style.display ='block';
  getAreasRol()
}  

async function actualizarTrabajador() {
  try {
    var idTrab = document.getElementById('nombreTrab').value;
    var rolTrab = document.getElementById('rolTrab').value;
    var turnoTrab = document.getElementById('turnoTrab').value;
    data = await window.electronAPI.actualizarTrabajador(idTrab, rolTrab, turnoTrab);
    window.messageAPI.alerta("send-alert", "Trabajador actualizado exitosamente.")
  }
  catch(error){
    alert('Error al actualizar trabajador')
    console.error('Error al actualizar trabajador: ', error);
  }
}

async function eliminarTrabajador(){
  try{
    var idTrab = document.getElementById('nombreTrab').value;
    data = await window.electronAPI.eliminarTrabajador(idTrab);
    window.messageAPI.alerta("send-alert", "Trabajador eliminado exitosamente.")
  }
  catch(error){
    window.messageAPI.alerta("send-alert", "Error al eliminar el trabajador.")
    console.error('Error al eliminar trabajador: ', error);
  }
}

async function getAllRoles(){
  try{
    const data = await window.electronAPI.getAllRoles()
    const nuevoTrabRol = document.getElementById('nuevoTrabRol')
    nuevoTrabRol.innerHTML =''
    data.forEach(item =>{
      const rol = document.createElement('option')
      rol.value = item.id_rol;
      rol.text = item.nombre_rol;
      nuevoTrabRol.add(rol)
    })
  }
  catch(error){
    window.messageAPI.alerta("send-alert", "Error al encontrar areas.")
    console.error('Error al encontrar areas: ', error)
  }
}

async function turnoNuevoTrab(){
  try{
    const data = await window.electronAPI.getTurnos()
    const turnos = document.getElementById('nuevoTrabTurno')
    turnos.innerHTML =''
    data.forEach(item =>{
      const turno = document.createElement('option')
      turno.value = item.id
      turno.text = item.nombre_turno
      turnos.add(turno)
    })
  }
  catch(error){
    window.messageAPI.alerta("send-alert", "Error al encontrar turnos.")
    console.error('Error al encontrar turnos: ', error)
  }
}

async function nuevoTrabajador(){
  try{
    var nombreNuevoTrabajador = document.getElementById('nuevoTrabNombre').value;
    if(nombreNuevoTrabajador == ''){
      window.messageAPI.alerta("send-alert", "Ingrese todos los campos necesarios antes de confirmar")
      return;
    }
    var rolNuevoTrabajador = document.getElementById('nuevoTrabRol').value;
    var turnoNuevoTrabajador = document.getElementById('nuevoTrabTurno').value;
    data = await window.electronAPI.crearNuevoTrabajador(nombreNuevoTrabajador, rolNuevoTrabajador, turnoNuevoTrabajador)
    nombreNuevoTrabajador = ''
    rolNuevoTrabajador = ''
    turnoNuevoTrabajador = ''
    window.messageAPI.alerta("send-alert", "Trabajador creado exitosamente.")

  }
  catch(error){
    window.messageAPI.alerta("send-alert", "Error al crear trabajador.")
    console.error('Error al crear trabajador: ', error);
  }
}

async function getAreasRol(){
  try{
    const data = await window.electronAPI.getAreas();
    const areas = document.getElementById('areaRol');
    areas.innerHTML = ''
    data.forEach(item => {
      const area = document.createElement('option')
      area.value = item.id;
      area.text = item.nombre_area;
      areas.add(area);
    })
  }
  catch(error){
    window.messageAPI.alerta("send-alert", "Error al buscar areas.")
    console.error('Error al buscar areas: ', error)
  }
}

async function nuevoRol(){
  try{
    var nombre = document.getElementById('nuevoRolNombre').value;
    var area = document.getElementById('areaRol').value;
    data = window.electronAPI.nuevoRol(nombre, area)
    nombre.innerHTML ='';
    area.innerHTML = '';
    window.messageAPI.alerta("send-alert", "Nuevo rol creado exitosamente.")
  }
  catch(error){
    window.messageAPI.alerta("send-alert", "Error al crear nuevo rol.")
    console.error('Error al crear nuevo rol: ', error)
  }
}

async function confirmActualizarTrabajador(){
  try{
    var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro de editar los datos seleccionados?")
    if(alert){
      actualizarTrabajador()
    }
  }
  catch(error){
    console.error('Error al actualizar trabajador:', error);
  }
}

async function confirmEliminarTrabajador(){
  try {
    var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro de eliminar el trabajador seleccionado?")
    if(alert){
      eliminarTrabajador()
    }
  }
  catch(error){
    console.error('Error al eliminar trabajador:', error);
  }
}

async function confirmNuevoTrabajador(){
  try {
    var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro de crear un nuevo trabajador con los datos seleccionados?")
    if(alert){
      nuevoTrabajador()
    }
  }
  catch(error){
    console.error('Error al crear nuevo trabajador:', error);
  }
}

async function confirmNuevoRol(){
  try{
    var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro de crear el rol con los datos seleccionados?")
    if(alert){
      nuevoRol()
    }
  }
  catch(error){
    console.error('Error al crear nuevo rol: ', error);
  }
}

  getTrabajadores()