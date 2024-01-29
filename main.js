require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const supabaseUrl = 'https://ftxxcnmgoyrppxvjjcmr.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        } 
    })
    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})

async function testConection(){
    try {
        const { data, error } = await supabase
            .from('area')
            .update({ nombre_area: 'turbogeneradores' })
            .eq('id', 1)
            .select()
        if(error){
            console.error('Error al obtener datos:', error.message);
            throw new Error('Error al obtener datos');
          }
          return data;
        }
        catch (error) {
            console.error('Error: ', error.message);
            throw error;
          }
}
//testConection()

ipcMain.handle('get-areas', async () => {
    try {
      const { data, error } = await supabase
      .from('area')
      .select('id, nombre_area');
      if (error) {
        console.error('Error al obtener datos:', error.message);
        throw new Error('Error al obtener datos');
      }
      return data;
    } 
    catch (error) {
      console.error('Error: ', error.message);
      throw error;
    }
  });

ipcMain.handle('get-trabajadores-por-area', async (event, areaElegida) =>{
    try {
      const {data, error } = await supabase
      .from('trabajador').select('id_trabajador, nombre_trabajador, rol_trabajador:id_rol(id_area, area:id_area(id))')
      .eq('id', areaElegida)
      if(error){
        console.error('Error al obtener datos:', error.message);
        throw new Error('Error al obtener datos');
      }
      return data;
    }
    catch(error){
        console.error('Error: ', error.message);
        throw error;
    }
  })

ipcMain.handle('actualizar-area', async (event, selectedId, newValue) => {
    try {
    const { data, error } = await supabase
        .from('area')
        .update({ nombre_area: newValue })
        .eq('id', selectedId)
        .select()
    if(error){
        console.error('Error al actualizar area:', error.message);
        throw new Error('Error al actualizar area');
      }
      return data;
    }
    catch (error) {
        console.error('Error: ', error.message);
        throw error;
      }
});

ipcMain.handle('area-nueva', async(event, newValue)=>{
  try{
    const {data, error} = await supabase
    .from('area')
    .insert({nombre_area: newValue})
    .select()
  if(error){
    console.error('Error al insertar datos:' ,error.message);
    throw new Error('Error al actualizar area');
    }
    return data;
  }
  catch(error){
    console.error('Error:', error.message);
    throw error;
  }
});

ipcMain.handle('eliminar-area', async(event,selectedId)=>{
  try{
    const {data, error} = await supabase
    .from('area')
    .delete()
    .eq('id', selectedId)
  if(error){
    console.error('Error al borrar datos:', error.message);
    throw new Error('Error al borrar area');
    }
  return data;  
  }
  catch(error){
    console.error('Error:', error.message);
    throw error;
  }
});

ipcMain.handle('rutinas-por-area', async(event, areaElegida)=>{
  try{
    const {data, error} = await supabase
    .from('rutinas_operacionales')
    .select('id_rutina, descripcion_rutina')
    .eq('area_rutina', areaElegida);
    if(error){
      console.error('Error al obtener rutinas:', error.message);
      throw new Error('Error al obtener rutinas');
    }  
    return data;
  }
  catch(error){
    console.error('Error:', error.message);
    throw error;
  }
})