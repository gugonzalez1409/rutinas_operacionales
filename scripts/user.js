async function getAreas() {
    try {
      const data = await window.electronAPI.getAreas();
      const elegirArea = document.getElementById('elegirArea');
      elegirArea.innerHTML = '';
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.nombre_area;
        elegirArea.add(option);
      });
    } 
    catch (error) {
      console.error('Error al cargar datos en la lista de areas:', error);
    }
    elegirArea.addEventListener('change', async function (){
      const areaElegida = elegirArea.value;
      await getRutinas(areaElegida);
      await getTrabajadores(areaElegida);
    });
  }

  async function getTrabajadores(areaElegida){
    const data = await window.electronAPI.getTrabajadoresporArea(areaElegida);
    const selectTrabajador = document.getElementById('selectTrabajador');
    selectTrabajador.innerHTML ='';
    data.forEach(item=> {
      const option = document.createElement('option');
      option.value = item.id_trabajador;
      option.text = item.nombre_trabajador;
      selectTrabajador.add(option);
    })
  }

  async function getRutinas(areaElegida){
    try{
      const data = await window.electronAPI.rutinasPorArea(areaElegida);
      const selectRutina = document.getElementById('rutinaRealizada');
      selectRutina.innerHTML = "";
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id_rutina;
        option.text = item.descripcion_rutina;
        selectRutina.add(option);
      })
    }
    catch(error){
      console.error('Error al cargar datos en la lista de rutinas:', error);
    }
  }

  async function emitirInforme(){
    try{  
      const operadorACargo = document.getElementById('selectTrabajador').value;
      const rutinaRealizada = document.getElementById('rutinaRealizada').value;
      const observacionesRutina = document.getElementById('observacionesRutina').value;
      data = await window.electronAPI.emitirInforme(operadorACargo, rutinaRealizada, observacionesRutina)
      // limpiar campos del formulario
    }
      catch(error){
        console.error('Error al emitir informe: ', error);
  }
}

  getAreas()