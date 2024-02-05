  async function getAreasModRutinas(){
    try{
      data = await window.electronAPI.getAreas()
      const areaElegida = document.getElementById('areasModRutinas')
      areaElegida.innerHTML = ''
      data.forEach(item => {
        const option = document.createElement('option')
        option.value = item.id;
        option.text = item.nombre_area;
        areaElegida.add(option)
      })
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
        <button onclick="borrarRutina(${fila.id_rutina})" class="icon-button"><i class="fas fa-trash">Borrar</i></button>
        </td>
      `;
      rutinas.appendChild(nuevaFila)
      })
    }
    catch(error){
      console.error('Error al obtener rutinas:', error);
    }
  }

  function editarRutina(id) {
    alert('Editar rutina con ID: ' + id);
  }

  async function borrarRutina(id) {
    var confirmBorrar = confirm('¿Está seguro que desea borrar la rutina operacional con ID: ' + id + '?')
    if(confirmBorrar){
      data = await window.electronAPI.borrarRutina(id)
      //recargar página
      alert('Rutina operacional borrada exitosamente')
    }
    else{
      return;
    }
  }

getAreasModRutinas()