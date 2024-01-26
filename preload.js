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
  actualizarArea: async (areaSeleccionada, nuevoValor) => {
    try {
      const data = await ipcRenderer.invoke('actualizar-area', areaSeleccionada, nuevoValor);
      return data;
    } catch(error){
      console.error('Error desde main: ', error);
      throw error;
    }
  } 
});