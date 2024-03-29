require('dotenv').config();
const { app, BrowserWindow, ipcMain, remote, dialog } = require('electron');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const XLSX = require('xlsx');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let mainWindow
let modalWindow

let idRutina
let rolSesion

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        } 
    })
    mainWindow.loadFile('./pages/login.html')
    mainWindow.setMenuBarVisibility(false)
    //mainWindow.webContents.openDevTools()

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
    else{
      // obtener rol de usuario
      const {data: userData, error: userError} = await supabase
      .from('usuarios')
      .select('rol')
      .eq('email', email)
      .single()
      if(userError){
        console.error('Error al obtener rol de usuario: ', userError.message)
        throw new Error('Error al obtener rol de usuario')
      }
      rolSesion = userData.rol
      return userData
    }
  }
  catch(error){
    console.error('Error en login: ', error.message);
    throw error;
  }
})

ipcMain.handle('log-out', async(event)=>{
  const { error } = await supabase.auth.signOut()
  if(error){
    console.log('Error al terminar turno: ',error.message)
    throw error;
  }
  return 1;
})

ipcMain.handle('get-rol', async(event)=>{
  const rol = parseInt(rolSesion)
  return rol
})

//MENSAJES DE ALERTA Y CONFIRMACION DE CADA ACCION
ipcMain.handle("send-alert", async(event, incomingMessage) => {
  const options = {
      type: "none",
      buttons: ["Ok"],
      title: "Rutinas Operacionales",
      message: incomingMessage
  }
  dialog.showMessageBox(mainWindow, options)
})

ipcMain.handle("send-confirm", async(event, incomingMessage) => {
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

ipcMain.handle('get-trabajadores-por-area', async (event, areaElegida, rol) =>{
    try {
      const {data, error } = await supabase
      .from('trabajador')
      .select('*, rol_trabajador!inner(*)')
      .eq('rol_trabajador.id_area', areaElegida)
      .eq('turno_trabajador', rol)
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
    .insert([{
        nombre_area: newValue
      }])
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

ipcMain.handle('emitir-informe', async(event, nombre_trabajador, rol_trabajador, turno_trabajador, observacionesRutina, area_rutina, rutinas)=>{
  try{
    date = new Date();
    const {data, error} = await supabase
    .from('informe_rutinas')
    .insert({
      fecha : date, 
      nombre_trabajador : nombre_trabajador, 
      rol_trabajador : rol_trabajador, 
      turno_trabajador : turno_trabajador, 
      observaciones_rutina : observacionesRutina, 
      area_rutina : area_rutina,
      nombre_rutina : rutinas
    })
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
    .select('*')
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
    .insert([{
      nombre_trabajador: nombreNuevoTrabajador,
      rol_trabajador: rolNuevoTrabajador, 
      turno_trabajador: turnoNuevoTrabajador
    }])
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
    .insert({
      nombre_rol: nombre,
      id_area: area
    })
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
      throw new Error('Error al obtener rutinas')
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
    .insert({
      area_rutina: area, 
      descripcion_rutina: nombreRutina
    })
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
    .insert({
      id_jornada: turno, 
      id_dia: dia, 
      id_rutina: id_rutina
    })
    if(error){
      console.error('Error al insertar rutina: ', error.message)
      throw new error('error al insertar rutina')
    }
    return data;
  }
  catch(error){
    console.error('Error al insertar jornada: ', error.message)
    throw new error('error al insertar jornada')
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
    //TURNO LUNES DIA
    if(dia == 1 && (hora >= 6 && hora <= 18) ){
      nombre_turno = 'Rutinas Lunes turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO LUNES NOCHE
    else if( (dia == 1 && hora >= 18) || (dia == 2 && hora <= 6) ){
      nombre_turno = 'Rutinas Lunes turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    }
    // TURNO MARTES DIA
    else if(dia == 2 && (hora >= 6 && hora <= 18) ){ 
      nombre_turno = 'Rutinas Martes turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO MARTES NOCHE
    else if((dia == 2 && hora >= 18) || (dia == 3 && hora <= 6)){ 
      nombre_turno ='Rutinas Martes turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    }
    // TURNO MIERCOLES DIA
    else if(dia == 3 && (hora >= 6 && hora <= 18)){ 
      nombre_turno = 'Rutinas Miercoles turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO MIERCOLES NOCHE
    else if((dia == 3 && hora >= 18) || (dia == 4 && hora <= 6)){ 
      nombre_turno = 'Rutinas Miercoles turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    }
    // TURNO JUEVES DIA
    else if(dia == 4 && (hora >= 6 && hora <= 18)){
      nombre_turno = 'Rutinas Jueves turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO JUEVES NOCHE
    else if((dia == 4 && hora >= 18) || (dia == 5 && hora <= 6)){
      nombre_turno = 'Rutinas Jueves turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    }
    // TURNO VIERNES DIA
    else if(dia == 5 && (hora >= 6 && hora <= 18)){
      nombre_turno = 'Rutinas Viernes turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO VIERNES NOCHE
    else if((dia == 5 && hora >= 18) || (dia == 6 && hora <= 6)){
      nombre_turno = 'Rutinas Viernes turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    }
    // TURNO SABADO DIA
    else if(dia == 6 && (hora >= 6 && hora <= 18)){
      nombre_turno = 'Rutinas Sábado turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO SABADO NOCHE
    else if((dia == 6 && hora >= 18) || (dia == 0 && hora <= 6)){
      nombre_turno = 'Rutinas Sábado turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    }
    // TURNO DOMINGO DIA
    else if(dia == 0 && (hora >= 6 && hora <= 18)){
      nombre_turno = 'Rutinas Domingo turno dia'
      const data = await obtenerRutinas(area, dia, 1)
      return [data, nombre_turno];
    }
    // TURNO DOMINGO NOCHE
    else if((dia == 0 && hora >= 18) || (dia == 1 && hora <= 6)){
      nombre_turno = 'Rutinas Domingo turno noche'
      const data = await obtenerRutinas(area, dia, 2)
      return [data, nombre_turno];
    } 
  }
  catch(error){
    console.error('Error al obtener rutinas por turno: ', error.message)
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

ipcMain.handle('get-trabajadores', async(event, area)=>{
  try{
    const {data, error} = await supabase
    .from('trabajador')
    .select('nombre_trabajador, rol_trabajador!inner(nombre_rol, id_area), turno_trabajador!inner(nombre_turno)')
    .eq('rol_trabajador.id_area', area)
    if(error){
      console.error('Error al obtener trabajadores: ', error.message)
      throw new Error('Error al obtener trabajadores');
    }
    return data;
  }
  catch(error){
    console.error('Error: ', error.message)
    throw Error;
  }
})

ipcMain.handle('get-rutinas-dia', async(event, area)=>{
  try {
    const tiempo = new Date()
    const dia = tiempo.getDay()
    let nombre_dia;
    switch(dia){
      case 0:
        nombre_dia = 'Domingo'
        break;
      case 1:
        nombre_dia = 'Lunes'
        break;
      case 2:
        nombre_dia = 'Martes'
        break;
      case 3:
        nombre_dia = 'Miércoles'
        break;
      case 4:
        nombre_dia = 'Jueves'
        break;
      case 5:
        nombre_dia = 'Viernes'
        break;
      case 6:
        nombre_dia = 'Sábado'    
        break;
    }
    const {data, error} = await supabase
    .from('dia_jornada')
    .select('rutinas_operacionales!inner(descripcion_rutina), jornada!inner(nombre_jornada)')
    .eq('rutinas_operacionales.area_rutina', area)
    .eq('id_dia', dia)
    if(error){
      console.error('Error al obtener trabajadores: ', error.message)
      throw new Error('Error al obtener trabajadores');
    }
    return [data, nombre_dia];
  }
  catch(error){
    console.error('Error: ' , error.message)
    throw Error;
  }
})

ipcMain.handle('exportar-informacion', async(event, data)=>{
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  const descargasPath = app.getPath('downloads');
  const xlsxFilePath = path.join(descargasPath, 'informe_rutinas.xlsx');
  XLSX.writeFile(wb, xlsxFilePath);
  return;
})

ipcMain.handle('borrar-informes', async(event)=> {
  try{
    const {data, error} = await supabase
    .from('informe_rutinas')
    .delete()
    .neq('id_informe', 0)
    if(error){
      console.error('Error: ', error.message)
      throw Error;
    }
    return data;
  }
  catch(error){
    console.error('Error: ' , error.message)
    throw Error;
  }
})

ipcMain.handle('get-estadisticas', async(event, area)=>{
  try{
    const {data, error} = await supabase
    .from('informe_rutinas')
    .select('*')
    .eq('area_rutina', area)
    if(error){
      console.error('Error: ', error.message)
      throw Error;
    }
    return data;
  }
  catch(error){
    console.error('Error: ' , error.message)
    throw Error;
  }
})
