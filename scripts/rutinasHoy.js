async function getAreas(){
    const data = await window.electronAPI.getAreas();
    const options = document.getElementById('areaRutinasHoy');
    options.innerHTML = '';
    data.forEach(item =>{
        option = document.createElement('option')
        option.text = item.nombre_area;
        option.value = item.id;
        options.add(option)
    })
    const area = options.value;
    await getRutinasDia(area)
    document.addEventListener('change', async function(){
        const area = options.value;
        await getRutinasDia(area)
    })
}

async function getRutinasDia(area) {
    const info = await window.electronAPI.getRutinasDia(area);
    const data = info[0]
    console.log(data)
    const dia = info[1]
    console.log(dia)
    const titulo = document.getElementById('tituloDia')
    titulo.textContent = 'Rutinas día' + ' ' + info[1];
    const tabla = document.getElementById('rutinasPorAreaHoy');
    tabla.innerHTML = '';
    const rutinasPorNombre = {};

    data.forEach(item => {
        const nombreRutina = item.rutinas_operacionales.descripcion_rutina;
        if (rutinasPorNombre[nombreRutina]) {
            rutinasPorNombre[nombreRutina].turnos.push(item.jornada.nombre_jornada);
        } else {
            rutinasPorNombre[nombreRutina] = {
                turnos: [item.jornada.nombre_jornada]
            };
        }
    });
    for (const nombreRutina in rutinasPorNombre) {
        const turnos = rutinasPorNombre[nombreRutina].turnos.join(' y ');
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${nombreRutina}</td>
            <td>${turnos}</td>
        `;
        tabla.appendChild(nuevaFila);
    }
}

getAreas()