require('dotenv').config();
const { app, BrowserWindow, ipcMain, remote, dialog } = require('electron');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const supabaseUrl = 'https://ftxxcnmgoyrppxvjjcmr.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let mainWindow
let modalWindow

let idRutina // para pasar al modal

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        } 
    })
    mainWindow.loadFile('./pages/login.html')
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

ipcMain.handle('log-in', async (event, email, password)=>{
  try{
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if(error){
      console.error('Error al iniciar sesión:', error.message);
        throw new Error('Error al iniciar sesión');
    }
    return data;
  }
  catch(error){
    console.error('Error en login: ', error.message);
    throw error;
  }
})

//MENSAJES DE ALERTA Y CONFIRMACION DE CADA ACCION
ipcMain.handle("send-alert", (event, incomingMessage) => {
  const options = {
      type: "none",
      buttons: ["Ok"],
      title: "Rutinas Operacionales",
      message: incomingMessage
  }
  dialog.showMessageBox(mainWindow, options)
})

ipcMain.handle("send-confirm", (event, incomingMessage) => {
  const options = {
    type: "question",
    buttons: ["Cancel", "Ok"],
    title: "Rutinas Operacionales",
    message: incomingMessage,
    cancelId: 0,
    defaultId: 1

  }
  const response = dialog.showMessageBoxSync(mainWindow, options);
  return response;
});

//MODAL EDIT RUTINAS

ipcMain.handle('abrir-modal', async(event, args) => {
  const {id} = args
  idRutina = args;
  if (!modalWindow) {
    modalWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    modalWindow.loadFile('./pages/modNewRutina.html');
    modalWindow.on('closed', () => {
      modalWindow = null;
    });
  }
  return { success: true, message: 'Modal abierto correctamente' };
})

ipcMain.handle('id-rutina', async()=>{
  try{
    return idRutina;
  }
  catch(error){
    console.error('Error: ', error.message);
    throw error;
  }
})


//LLAMADAS A BASE DE DATOS

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
      .from('trabajador')
      .select('*, rol_trabajador!inner(*)')
      .eq('rol_trabajador.id_area', areaElegida)
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
    catch (error){
        console.error('Error: ', error.message);
        throw error;
    }
});

ipcMain.handle('area-nueva', async(event, newValue)=>{
  try{
    const {data, error} = await supabase
    .from('area')
    .insert([{nombre_area: newValue}])
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

ipcMain.handle('emitir-informe', async(event, operadorACargo, rutinaRealizada, observacionesRutina)=>{
  try{
    date = new Date();
    const {data, error} = await supabase
    .from('informe_rutinas')
    .insert({id_rutina: rutinaRealizada, id_trabajador: operadorACargo, fecha: date, observaciones_rutina: observacionesRutina})
    .select()
    if(error){
      console.error('Error al emitir informe:', error.message);
      throw new Error('Error al emitir informe');
    }
    return data;
  }
  catch(error){
    console.error('Error:', error.message);
    throw error;
  }
})

ipcMain.handle('get-lista-trabajadores', async(event)=>{
  try{
    const {data, error} = await supabase
    .from('trabajador')
    .select('*')
    if(error){
      console.error('Error al obtener trabajadores: ', error.message);
      throw new Error('Error al obtener trabajadores')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message);
    throw error;
  }
})

ipcMain.handle('get-lista-informes', async(event)=>{
  try{
    const {data, error } = await supabase
    .from('informe_rutinas')
    .select('*, rutinas_operacionales!inner(descripcion_rutina), trabajador!inner(nombre_trabajador, turno_trabajador!inner(*), rol_trabajador!inner(nombre_rol, area!inner(nombre_area)))')
    .order('fecha', {ascending: false})
    if(error){
      console.error('Error al obtener lista de informes: ', error.message);
      throw new Error('Error al obtener trabajadores')
    }
    return data;
  }
    catch(error){
      console.error('Error: ', error.message);
    }
  })
  
ipcMain.handle('get-roles', async(event)=>{
  try{
    const {data, error} = await supabase
    .from('trabajador')
    .select('id_trabajador, rol_trabajador!inner(id_rol, nombre_rol)')
    if(error){
      console.error('Error al obtener lista de roles: ', error.message)
      throw new Error('Error al obtener roles')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message);
  }
})  

ipcMain.handle('get-turnos', async(event)=> {
  try{
    const {data, error} = await supabase
    .from('turnos')
    .select('*')
    if(error){
      console.error('Error al obtener turnos: ', error.message)
      throw new Error('Error al obtener turnos')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
  }
})

ipcMain.handle('actualizar-trabajador', async(event, idTrab, rolTrab, turnoTrab) =>{
  try{
    const {data, error} = await supabase
    .from('trabajador')
    .update({rol_trabajador : rolTrab, turno_trabajador : turnoTrab})
    .eq('id_trabajador', idTrab)
    if(error){
      console.error('Error al obtener lista de roles: ', error.message)
      throw new Error('Error al obtener roles')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
  }
})

ipcMain.handle('eliminar-trabajador', async(event, idTrab)=>{
  try{
    const {data, error} = await supabase
    .from('trabajador')
    .delete()
    .eq('id_trabajador', idTrab)
    if(error){
      console.error('Error al eliminar trabajador: ', error.message)
      throw new Error('Error al eliminar trabajador')
    }
    return data;
  }
  catch(error){
    console.error('Error: ',error.message)
  }
})

ipcMain.handle('get-all-roles', async(event) =>{
  try{
    const { data, error } = await supabase
    .from('rol_trabajador')
    .select('*')
    if(error){
      console.error('Error al obtener roles: ', error.message)
      throw new Error('Error al obtener roles')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
  }
})

ipcMain.handle('crear-nuevo-trabajador', async(event, nombreNuevoTrabajador, rolNuevoTrabajador, turnoNuevoTrabajador) => {
  try{
    const { data, error } = await supabase
    .from('trabajador')
    .insert([{nombre_trabajador: nombreNuevoTrabajador, rol_trabajador: rolNuevoTrabajador, turno_trabajador: turnoNuevoTrabajador}])
    .select()
    if(error){
      console.error('Error al insertar nuevo trabajador: ', error.message)
      throw new Error('Error al insertar nuevo trabajador')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
  }
})

ipcMain.handle('nuevo-rol', async(event, nombre, area) => {
  try{
    const { data, error} = await supabase
    .from('rol_trabajador')
    .insert({nombre_rol: nombre, id_area: area})
    .select()
    if(error){
      console.error('Error al insertar nuevo trabajador: ', error.message)
      throw new Error('Error al insertar nuevo trabajador')
    }
    return data;
  }
  catch(error){
    console.error('Error: ',error.message)
  }
})

ipcMain.handle('get-rutinas-por-area', async(event, idArea) =>{
  try{
    const {data, error} = await supabase
    .from('rutinas_operacionales')
    .select('id_rutina, descripcion_rutina')
    .eq('area_rutina', idArea)
    if(error){
      console.error('Error al obtener rutinas: ', error.message)
      throw new Error('Error al insertar nuevo trabajador')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
  }
})

ipcMain.handle('insertar-nueva-rutina', async(event, nombreRutina, area)=>{
  try{
    //insert en rutinas_operacionales
    const {data, error} = await supabase
    .from('rutinas_operacionales')
    .insert({area_rutina: area, descripcion_rutina: nombreRutina})
    .select()
    if(error){
      console.error('Error al insertar rutina: ', error.message)
      throw new error('error al insertar rutina')
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
  }
})

ipcMain.handle('insertar-dia-jornada', async(event, dia, turno, id_rutina)=>{
  try{
    const {data, error} = await supabase
    .from('dia_jornada')
    .insert({id_jornada: turno, id_dia: dia, id_rutina: id_rutina})
    if(error){
      console.error('Error al insertar rutina: ', error.message)
      throw new error('error al insertar rutina')
    }
    return data;
  }
  catch(error){
    console.error('Error al insertar rutina: ', error.message)
    throw new error('error al insertar rutina')
  }
})

ipcMain.handle('borrar-rutina', async(event, id_rutina)=>{
  try{
    const { data, error } = await supabase
    .from('rutinas_operacionales')
    .delete()
    .eq('id_rutina', id_rutina)
    if(error){
      console.error('Error al eliminar rutina: ', error.message)
      throw new Error('Error al eliminar rutina')
    }
    return data;
  }
  catch(error){
    console.error('Error al borrar rutina: ', error.message)
    throw new error('error al borrar rutina')
  }
})

ipcMain.handle('get-nombre-rutina', async(event, id)=> {
  try{
    const {data, error} = await supabase
    .from('rutinas_operacionales')
    .select('descripcion_rutina')
    .eq('id_rutina', id)
    if(error){
      console.error('Error al obtener datos: ', error.message)
      throw new Error('Error al obtener datos')
    }
    return data;
  }
  catch(error){
    console.error('Error al obtener nombre de rutina: ', error.message)
    throw new error('error al obtener nombre de rutina')
  }
})

ipcMain.handle('get-area-rutina', async(event, id)=> {
  try{
    const { data, error } = await supabase
    .from('rutinas_operacionales')
    .select('area_rutina')
    .eq('id_rutina', id)
    if(error){
      console.error('Error al obtener datos: ', error.message)
      throw new Error('Error al obtener datos')
    }
    return data;
  }
  catch(error){
    console.error('Error al obtener nombre de rutina: ', error.message)
    throw new error('error al obtener nombre de rutina')
  }
})

ipcMain.handle('get-jornada-actual', async(event, id) => {
  try {
    const { data, error } = await supabase
      .from('dia_jornada')
      .select('id_jornada, id_dia')
      .eq('id_rutina', id);
    if (error) {
      console.error('Error al obtener datos: ', error.message);
      throw new Error('Error al obtener datos');
    }
    return data;
  } catch (error) {
    console.error('Error al obtener jornadas de rutina: ', error.message);
    throw new Error('Error al obtener jornadas de rutina');
  }
});

async function obtenerRutinas(area, dia, jornada) {
  try {
    const { data, error } = await supabase
      .from('dia_jornada')
      .select('rutinas_operacionales!inner(id_rutina, descripcion_rutina)')
      .eq('id_dia', dia)
      .eq('id_jornada', jornada)
      .eq('rutinas_operacionales.area_rutina', area);

    if (error) {
      console.error('Error al obtener datos: ', error.message);
      throw new Error('Error al obtener datos');
    }
    return data;
  } catch (error) {
    console.error('Error al obtener datos: ', error.message);
    throw new Error('Error al obtener datos');
  }
}

ipcMain.handle('get-rutinas-turno', async (event, area) => {
  try {
    // Obtener momento actual
    const tiempo = new Date();
    const dia = tiempo.getDay();
    const hora = tiempo.getHours();
    // en caso de (ver utilidad) en casos borde (de 5 a 6, de 6 a 7)
    //const minutos = tiempo.getMinutes();
    let turno;
    let nombre_turno;
    switch (dia) {
      case 1:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas lunes turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 1) || (hora <= 6 && dia === 2)) {
          nombre_turno = 'Rutinas lunes turno noche'
          turno = 2;
        }
        break;
      case 2:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas martes turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 2) || (hora <= 6 && dia === 3)) {
          nombre_turno = 'Rutinas martes turno noche'
          turno = 2;
        }
        break;
      case 3:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas miércoles turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 3) || (hora <= 6 && dia === 4)) {
          nombre_turno = 'Rutinas miércoles turno noche'
          turno = 2;
        }
        break;
      case 4:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas jueves turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 4) || (hora <= 6 && dia === 5)) {
          nombre_turno = 'Rutinas jueves turno noche'
          turno = 2;
        }
        break;
      case 5:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas viernes turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 5) || (hora <= 6 && dia === 6)) {
          nombre_turno = 'Rutinas viernes turno noche'
          turno = 2;
        }
        break;
      case 6:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas sábado turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 6) || (hora <= 6 && dia === 7)) {
          nombre_turno = 'Rutinas sábado turno noche'
          turno = 2;
        }
        break;
      case 0:
        if (hora >= 6 && hora <= 18) {
          nombre_turno = 'Rutinas domingo turno dia'
          turno = 1;
        } else if ((hora >= 18 && dia === 7) || (hora <= 6 && dia === 1)) {
          nombre_turno = 'Rutinas domingo turno noche'
          turno = 2;
        }
        break;
      default:
        console.log('Día no válido');
    }
    if (turno !== undefined) {
      const data = await obtenerRutinas(area, dia, turno);
      return [data, nombre_turno];
    }
  } catch (error) {
    console.error('Error al obtener rutinas por turno: ', error.message);
    throw new Error('Error al obtener rutinas por turno');
  }


});

ipcMain.handle('edit-nombre-rutina', async(event, nombre, id)=>{
  try {
    const { data, error } = await supabase
        .from('rutinas_operacionales')
        .update({ descripcion_rutina: nombre })
        .eq('id_rutina', id)
        .select()
    if(error){
        console.error('Error al actualizar rutina:', error.message);
        throw new Error('Error al actualizar rutina');
      }
      return data;
    }
    catch (error){
        console.error('Error: ', error.message);
        throw error;
    }
});

ipcMain.handle('edit-area-rutina', async(event, area, id) =>{
  try {
    const {data, error} = await supabase
    .from('rutinas_operacionales')
    .update({area_rutina : area})
    .eq('id_rutina', id)
    .select()
    return data;
  }
  catch(error){
    console.error('Error: ', error.message);
    throw error;
  }
})

ipcMain.handle('borrar-jornadas-rutina', async(event, id) => {
  try {
    const {data, error} = await supabase
    .from('dia_jornada')
    .delete()
    .eq('id_rutina', id)
    return data;
  }
  catch(error){
    console.error('Error: ', error.message);
    throw error;
  }
})

ipcMain.handle('get-datos-trabajador', async (event, id) => {
  try {
    const { data, error } = await supabase
      .from('trabajador')
      .select('id_trabajador, nombre_trabajador, rol_trabajador!inner(nombre_rol), turno_trabajador!inner(nombre_turno)')
      .eq('id_trabajador', id);
    if (error) {
      console.error('Error al obtener datos de trabajador:', error.message);
      throw new Error('Error al obtener datos de trabajador');
    }
    return data;
  } catch (error) {
    console.error('Error: ', error.message);
    throw error;
  }
});

ipcMain.handle('get-nombre-area', async(event, id)=>{
  try {
    const { data , error} = await supabase
    .from('area')
    .select('nombre_area')
    .eq('id', id)
    if(error){
      console.error('Error al obtener nombre de area: ', error.message)
      throw new Error('Error al obtener datos de trabajador');
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message);
    throw error;
  }
})
