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
  }
});
