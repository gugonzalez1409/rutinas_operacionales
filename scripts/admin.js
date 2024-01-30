async function getListaInformes() {
    try {
        const data = await window.electronAPI.getListaInformes()
        console.log(data)
        const reporte = document.getElementById('report-data')
        data.forEach(fila => {
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
            <td>${fila.fecha}</td>
            <td>${fila.trabajador.nombre_trabajador}</td>
            <td>${fila.trabajador.rol_trabajador.nombre_rol}</td>
            <td>${fila.trabajador.turno_trabajador}</td>
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

function filtrarTabla() {
    var input = document.getElementById('search').value.toLowerCase();
    var filter = document.getElementById('filter').value.toLowerCase();
    var rows = document.querySelectorAll('tbody tr');

    rows.forEach(function (row) {
        var cells = row.getElementsByTagName('td');
        var matchSearch = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(input));
        var matchFilter = filter === 'todos' || cells[1].textContent.toLowerCase().includes(filter);

        if (matchSearch && matchFilter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

getListaInformes()