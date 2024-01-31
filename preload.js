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
  getRoles: async(trabajadorElegido) => {
    try{
      const data = await ipcRenderer.invoke('get-roles', trabajadorElegido)
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  },
  getTurnos: async(trabajadorElegido) =>{
    try{
      const data = await ipcRenderer.invoke('get-turnos', trabajadorElegido)
      return data;
    }
    catch(error){
      console.error('Error desde main: ', error)
    }
  }
});