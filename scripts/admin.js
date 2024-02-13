async function getListaInformes() {
    try {
        const data = await window.electronAPI.getListaInformes()
        const reporte = document.getElementById('report-data')
        data.forEach(fila => {
            const nuevaFila = document.createElement('tr');
            const fechaFormateada = formatearFechaYHora(fila.fecha);
            nuevaFila.innerHTML = `
            <td>${fechaFormateada}</td>
            <td>${fila.trabajador.nombre_trabajador}</td>
            <td>${fila.trabajador.rol_trabajador.nombre_rol}</td>
            <td>${fila.trabajador.turno_trabajador.nombre_turno}</td>
            <td>${fila.trabajador.rol_trabajador.area.nombre_area}</td>
            <td>${fila.rutinas_operacionales.descripcion_rutina}</td>
            <td>${fila.observaciones_rutina}</td>
          `;
          reporte.appendChild(nuevaFila)
        })
    }
    catch(error){
        console.error('Error al cargar datos en la lista desplegable:', error);
    }
}

async function getRolesFiltro(){
    const data = await window.electronAPI.getAllRoles();
    const filtroRol = document.getElementById('rol-filter')
    filtroRol.innerHTML = ''
    const todo = document.createElement('option')
    todo.value = 'todos'
    todo.text = `Todos los roles`
    filtroRol.add(todo)
    data.forEach(item =>{
        const option = document.createElement('option')
        option.value = item.nombre_rol
        option.text = item.nombre_rol
        filtroRol.add(option);
    })
}

function formatearFechaYHora(fechaTS) {
    const fecha = new Date(fechaTS);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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

  function filtrarTabla() {
    var input = document.getElementById('search').value.toLowerCase();
    var turnoFilter = document.getElementById('turno-filter').value.toLowerCase();
    var rolFilter = document.getElementById('rol-filter').value.toLowerCase();
    var rows = document.querySelectorAll('tbody tr');

    rows.forEach(function (row) {
        var cells = row.getElementsByTagName('td');

        // Verificar si hay suficientes celdas antes de intentar acceder a la cuarta celda (columna de "Turno")
        if (cells.length >= 4) {
            var matchSearch = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(input));
            var matchTurno = turnoFilter === 'todos' || cells[3].textContent.toLowerCase().includes(turnoFilter); 
            var matchRol = rolFilter === 'todos' || cells[2].textContent.toLowerCase().includes(rolFilter);
            if (matchSearch && matchTurno && matchRol) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

getListaInformes()
getRolesFiltro()