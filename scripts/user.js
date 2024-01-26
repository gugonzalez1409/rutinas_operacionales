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
      console.error('Error al cargar datos en la lista desplegable:', error);
    }
    elegirArea.addEventListener('change', async function (){
      const areaElegida = elegirArea.value;
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

  getAreas()