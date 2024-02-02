const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAreas: async () => {
    try {
      const data = await ipcRenderer.invoke('get-areas');
      return data;
    } catch (error) {
      console.error('Error desde main:', error);
      throw error;
    }
  },
  getTrabajadoresporArea: async (areaElegida) => {
    try {
      const data = await ipcRenderer.invoke('get-trabajadores-por-area', areaElegida);
      return data;
    } catch(error){
      console.error('Error desde main:', error);
      throw error;
    }
  },
  rutinasPorArea: async(areaElegida) => {
    try{
      const data = await ipcRenderer.invoke('rutinas-por-area', areaElegida);
      return data;
    }
    catch(error){
      console.error('Error desde main:', error);
      throw error;
    }    
  },
  actualizarArea: async (selectedId, newValue) => {
    try {
      console.log('selectedId: ');
      console.log('newValue: ', newValue);
      const data = await ipcRenderer.invoke('actualizar-area', selectedId, newValue);
      return data;
    } catch(error){
      console.error('Error desde main: ', error);
      throw error;
    }
  },
  areaNueva: async(newValue) => {
    try {
      console.log('newValue: ', newValue);
      const data = await ipcRenderer.invoke('area-nueva', newValue);
      return data;
    } catch(error){
      console.error('Error desde main: ', error);
      throw error;
    }
    },
  eliminarArea: async(selectedId) => {
    try{
      console.log('selectedId:', selectedId);
      const data = await ipcRenderer.invoke('eliminar-area',selectedId);
      return data;
    } catch(error){
      console.error('Error desde main: ', error);
      throw error;
    }
  },
  emitirInforme: async( operadorACargo, rutinaRealizada, observacionesRutina) => {
    try{
      const data = await ipcRenderer.invoke('emitir-informe', operadorACargo, rutinaRealizada, observacionesRutina);
      return data;
    }
    catch(error){
      console.error('Error desde main:', error);
    }
  },
  getListaTrabajadores: async() => {
    try{
      const data = await ipcRenderer.invoke('get-lista-trabajadores');
      return data; 
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  getListaInformes: async() => {
    try{
      const data = await ipcRenderer.invoke('get-lista-informes');
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error);
    }
  },
  getRoles: async() => {
    try{
      const data = await ipcRenderer.invoke('get-roles')
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  getTurnos: async() =>{
    try{
      const data = await ipcRenderer.invoke('get-turnos')
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  actualizarTrabajador: async(idTrab, rolTrab, turnoTrab) => {
    try{
      const data = await ipcRenderer.invoke('actualizar-trabajador', idTrab, rolTrab, turnoTrab)
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  eliminarTrabajador: async(idTrab) => {
    try{
      const data = await ipcRenderer.invoke('eliminar-trabajador', idTrab)
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  getAllRoles: async() => {
    try{
      const data = await ipcRenderer.invoke('get-all-roles')
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  crearNuevoTrabajador: async(nombreNuevoTrabajador, rolNuevoTrabajador, turnoNuevoTrabajador) => {
    try{
      const data = await ipcRenderer.invoke('crear-nuevo-trabajador', nombreNuevoTrabajador, rolNuevoTrabajador, turnoNuevoTrabajador)
      return data;
    }
   catch(error){
    console.error('Error desde main: ', error)
   } 
  },
  nuevoRol: async(nombre, area) => {
    try{
      const data = await ipcRenderer.invoke('nuevo-rol',nombre, area)
      return data;      
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  getRutinasPorArea: async(idArea) => {
    try{
      const data = await ipcRenderer.invoke('get-rutinas-por-area', idArea)
      return data;
    }
    catch(error){
      console.error('Error desde main:', error);
    }
  },
  insertarNuevaRutina: async(nombreRutina, area) => {
    try{
      const data = await ipcRenderer.invoke('insertar-nueva-rutina', nombreRutina, area)
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error);
    }
  },
  insertarDiasJornada: async() => {
    try{
      const data = await ipcRenderer.invoke('isertar-dias-jornada')
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error);
    }
  }
})
