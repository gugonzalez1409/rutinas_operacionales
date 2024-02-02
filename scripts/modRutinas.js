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
      `;
      rutinas.appendChild(nuevaFila)
        
      })
    }
    catch(error){
      console.error('Error al obtener rutinas:', error);
    }
  }

  function cargarRutinas() {
    var selectedArea = document.getElementById('areas').value;
    var rutinas = rutinasPorArea[selectedArea] || [];

    var tablaRutinas = document.getElementById('tablaRutinas');
    var tbody = tablaRutinas.getElementsByTagName('tbody')[0];
    
    // Limpiamos el contenido anterior de la tabla
    tbody.innerHTML = '';

    // Llenamos la tabla con las rutinas
    rutinas.forEach(function(rutina) {
      var row = tbody.insertRow();
      row.insertCell(0).innerText = rutina.id;
      row.insertCell(1).innerText = rutina.rutina;
      row.insertCell(2).innerText = rutina.dia;
      row.insertCell(3).innerText = rutina.turno;

      // botones
      var cellAcciones = row.insertCell(4);
      var btnEditar = document.createElement('button');
      btnEditar.innerText = 'Editar';
      btnEditar.onclick = function() { editarRutina(rutina.id); };
      cellAcciones.appendChild(btnEditar);

      var btnBorrar = document.createElement('button');
      btnBorrar.innerText = 'Borrar';
      btnBorrar.onclick = function() { borrarRutina(rutina.id); };
      cellAcciones.appendChild(btnBorrar);
    });
  }

  function editarRutina(id) {
    // editar rutina
    alert('Editar rutina con ID: ' + id);
  }

  function borrarRutina(id) {
    // borrar rutina
    alert('Borrar rutina con ID: ' + id);
  }

getAreasModRutinas()