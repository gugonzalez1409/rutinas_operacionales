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
        webPreferences :{
            preload: path.join(__dirname, 'preload.js')
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
    try{
        const { data, error } = await supabase.from('area').select('*');  
        if(error){
            console.error('Error de conexion', error.message)
            return;    
        }
        console.log(data)
    }
    catch (error) {
        console.error('Error: ',error.message)
    }
}

testConection()

ipcMain.handle('get-areas', async () => {
    try {
      console.log('estoy dentro cara facherita');
      const { data, error } = await supabase.from('area').select('*');
      if (error) {
        console.error('Error al obtener datos:', error.message);
        throw new Error('Error al obtener datos');
      }
      console.log('Data:', data);
      return data;
    } 
    catch (error) {
      console.error('Error: ', error.message);
      throw error;
    }
  });

  