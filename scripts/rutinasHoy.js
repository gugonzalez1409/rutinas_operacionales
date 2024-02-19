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

async function getRutinasDia(area){
    const data = await window.electronAPI.getRutinasDia(area)
    const tabla = document.getElementById('rutinasPorAreaHoy')
    tabla.innerHTML = ''
    data.forEach(item => {
        const nuevaFila = document.createElement('tr')
        nuevaFila.innerHTML = `
        <td>${item.rutinas_operacionales.descripcion_rutina}</td>
        <td>${item.jornada.nombre_jornada}</td>
      `;
      tabla.appendChild(nuevaFila)
    })
}

getAreas()