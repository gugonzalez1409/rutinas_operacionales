  async function getAreasModRutinas(){
    try{
      const data = await window.electronAPI.getAreas()
      const areaElegida = document.getElementById('areasModRutinas')
      areaElegida.innerHTML = ''
      data.forEach(item => {
        const option = document.createElement('option')
        option.value = item.id;
        option.text = item.nombre_area;
        areaElegida.add(option)
      })
      const idArea = areaElegida.value;
      await getRutinasPorArea(idArea);
      
      areaElegida.addEventListener('change', async function(){
        const idArea = areaElegida.value;
        await getRutinasPorArea(idArea);
      })
    }
    catch(error){
      console.error('Error al cargar lista de areas:', error);
    }
  }

  async function getRutinasPorArea(idArea){
    try{
      const data = await window.electronAPI.getRutinasPorArea(idArea)
      const rutinas = document.getElementById('rutinasPorArea')
      rutinas.innerHTML=''
      data.forEach(fila =>{
        const nuevaFila = document.createElement('tr')
        nuevaFila.innerHTML = `
        <td>${fila.id_rutina}</td>
        <td>${fila.descripcion_rutina}</td>
        <td class ="actions">
        <button onclick="editarRutina(${fila.id_rutina})" class="icon-button"><i class="fas fa-edit">Editar</i></button>
        <button onclick="confirmBorrarRutina(${fila.id_rutina})" class="icon-button"><i class="fas fa-trash">Borrar</i></button>
        </td>
      `;
      rutinas.appendChild(nuevaFila)
      })
    }
    catch(error){
      console.error('Error al obtener rutinas:', error);
    }
  }

  async function editarRutina(id) {
    const modal = await window.electronAPI.abrirModal(id);

  }

  async function borrarRutina(id) {
    try{ 
        data = await window.electronAPI.borrarRutina(id)
        window.messageAPI.alerta('send-alert','Rutina borrada exitosamente')
      }
    catch(error){
      console.error('Error al borrar rutina:', error);
    }
  }

  async function confirmBorrarRutina(id){
    try{
      var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro de borrar la rutina con ID: " + id + "?")
      if(alert){
        borrarRutina(id)
      }
    }
    catch(error){
      console.error('Error al confirmar borrar rutina: ', error);
    }
  }  

getAreasModRutinas()