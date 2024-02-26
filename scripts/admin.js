async function getListaInformes() {
    try {
        const data = await window.electronAPI.getListaInformes()
        const reporte = document.getElementById('report-data')
        reporte.innerHTML = ''
        data.forEach(fila => {
            // info de trabajador que emitio informe
            const nuevaFila = document.createElement('tr');
            const fechaFormateada = formatearFechaYHora(fila.fecha);
            nuevaFila.classList.add('worker-row');
            nuevaFila.innerHTML = `
            <td>${fechaFormateada}</td>
            <td>${fila.nombre_trabajador}</td>
            <td>${fila.rol_trabajador}</td>
            <td>${fila.turno_trabajador}</td>
            <td>${fila.area_rutina}</td>
            <td class = "actions">
            <button type="button" class="mostrarDetalles" onclick = "mostrarDetalles(this)">Detalles</button>
            </td>
            `;
            reporte.appendChild(nuevaFila)
            // mostrando info de rutinas realizadas y observaciones
            const detallesFila = document.createElement('tr')
            detallesFila.classList.add('details')
            const observaciones = fila.observaciones_rutina ? fila.observaciones_rutina : 'No hay observaciones';
            let rutinasHTML = '<ul>'
            for(const [nombreRutina, realizada] of Object.entries(fila.nombre_rutina)){
                const icono = realizada === 1 ? '<i class="fas fa-check-circle" style="color: green;"></i>' : '<i class="fas fa-times-circle" style="color: red;"></i>';
                rutinasHTML += `<li>${icono} ${nombreRutina}</li>`;
            }
            rutinasHTML += '</ul>'
            detallesFila.innerHTML = `
            <td colspan="6">
              <ul>
                  <li> Rutinas: <li>
                  ${rutinasHTML}
                  <li> Observaciones: </li>
                  ${observaciones}
              </ul>
            </td>
      `;
            reporte.appendChild(detallesFila);
        })
    }
    catch(error){
        console.error('Error al cargar datos en la lista desplegable:', error);
    }
}
 // obtener todas las areas para hacer filtro
async function getAreasFiltro(){
    const data = await window.electronAPI.getAreas()
    const filtroArea = document.getElementById('area-filter')
    const todo_area = document.createElement('option')
    todo_area.value = 'todos'
    todo_area.text = 'Todas las areas'
    filtroArea.add(todo_area)
    data.forEach(item =>{
        const option = document.createElement('option')
        option.value = item.nombre_area;
        option.text = item.nombre_area;
        filtroArea.add(option)
    })
    filtroArea.addEventListener('change', function(){
        filtrarTabla()
    })   
}

async function getTurnosFiltro(){
    const data = await window.electronAPI.getTurnos()
    const filtroTurno = document.getElementById('turno-filter')
    const todo_turno = document.createElement('option')
    todo_turno.value = 'todos'
    todo_turno.text = 'Todos los turnos'
    filtroTurno.add(todo_turno)
    data.forEach(item => {
        const option = document.createElement('option')
        option.value = item.nombre_turno;
        option.text = item.nombre_turno;
        filtroTurno.add(option)
    })
    filtroTurno.addEventListener('change', function(){
        filtrarTabla();
    })
}

// formateo de fecha para mostrar en tabla
function formatearFechaYHora(fechaTS) {
    const fecha = new Date(fechaTS);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const minutosFormateados = (minutos < 10) ? `0${minutos}` : minutos;
    const formatoFecha = `${diaSemana} ${dia} de ${mes} ${año} ${hora}:${minutosFormateados}`;
    return formatoFecha;
  }

  //filtros
function filtrarTabla() {
    var input = document.getElementById('search').value.toLowerCase();
    var turnoFilter = document.getElementById('turno-filter').value.toLowerCase();
    var areaFilter = document.getElementById('area-filter').value.toLowerCase()
    var rows = document.querySelectorAll('tbody tr');

    rows.forEach(function (row) {
        var cells = row.getElementsByTagName('td');
        if (cells.length >= 5) {
            var matchSearch = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(input));
            var matchTurno = turnoFilter === 'todos' || cells[3].textContent.toLowerCase().includes(turnoFilter);
            var matchArea = areaFilter === 'todos' || cells[4].textContent.toLowerCase().includes(areaFilter);
            if (matchSearch && matchTurno && matchArea) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
    // Ocultar detalles despuEs de filtrar
    var detallesRows = document.querySelectorAll('.details');
    detallesRows.forEach(function (detailsRow) {
        detailsRow.style.display = 'none';
        var button = detailsRow.previousElementSibling.querySelector('.mostrarDetalles');
        button.textContent = 'Detalles';
    });
}


 // cambia display de detalles
 function mostrarDetalles(button) {
    var detailsRow = button.closest('.worker-row').nextElementSibling;
    if (detailsRow.classList.contains('details')) {
        var currentDisplayStyle = window.getComputedStyle(detailsRow).getPropertyValue('display');
        detailsRow.style.display = currentDisplayStyle === 'none' ? 'table-row' : 'none';
        button.textContent = detailsRow.style.display === 'none' ? 'Detalles' : 'Ocultar';
    }
}

async function exportarInformacion(){
    const data = await window.electronAPI.getListaInformes()
    const dataFormateada = data.map(item => {
        const fechaFormateada = formatearFechaYHora(item.fecha)
        const rutinas = JSON.stringify(item.nombre_rutina)
        return {
            'ID Informe': item.id_informe,
            'Fecha': fechaFormateada,
            'Nombre': item.nombre_trabajador,
            'Rol de trabajo': item.rol_trabajador,
            'Turno': item.turno_trabajador,
            'Observaciones': item.observaciones_rutina,
            'Area': item.area_rutina,
            'Rutinas': rutinas
        }
    })
    const xl = window.electronAPI.exportarInformacion(dataFormateada)
    if(xl){
        await window.messageAPI.alerta('send-alert', 'Descarga exitosa, busque el archivo "informe_rutinas.xlsx" en su carpeta de descargas')
    }
    else{
        await window.messageAPI.alerta('send-alert', 'Error al convertir archivo, intentelo de nuevo más tarde')
    }
}

async function confirmBorrarInformes(){
    var confirm = await window.messageAPI.confirmar('send-confirm', '¿Está seguro que desea borrar los informes?');
    if(confirm){
        var confirm2 = await window.messageAPI.confirmar('send-confirm', 'Esta acción borrará TODOS los informes realizados por operadores y NO se podrá deshacer, ¿Está seguro?')
        if(confirm2){
            borrarInformes()
            await window.messageAPI.alerta('send-alert', 'Informes borrados exitosamente')
        }
    }
}

async function borrarInformes(){
    const data = await window.electronAPI.borrarInformes();
    return data;
}


getListaInformes()
getAreasFiltro()
getTurnosFiltro()