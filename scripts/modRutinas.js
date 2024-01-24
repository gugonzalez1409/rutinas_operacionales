const rutinasPorArea = {
    area1: [
      { id: 1, rutina: 'Rutina 1', dia: 'Lunes', turno: 'Mañana' },
      { id: 2, rutina: 'Rutina 2', dia: 'Martes', turno: 'Tarde' },
    ],
    area2: [
      { id: 3, rutina: 'Rutina 3', dia: 'Miércoles', turno: 'Noche' },
      { id: 4, rutina: 'Rutina 4', dia: 'Jueves', turno: 'Mañana' },
    ],
  };

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