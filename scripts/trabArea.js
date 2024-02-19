async function getAreas(){
    const data = await window.electronAPI.getAreas()
    const options = document.getElementById('areasTrabajadores')
    options.innerHTML = ''
    data.forEach(item =>{
        const option = document.createElement('option')
        option.text = item.nombre_area;
        option.value = item.id;
        options.add(option)
    })
    const area = options.value;
    await getTrabajadores(area)
    document.addEventListener('change', async function(){
        const area = options.value;
        await getTrabajadores(area)
    })
}

async function getTrabajadores(area){
    const data = await window.electronAPI.getTrabajadores(area)
    const tabla = document.getElementById('trabajadoresPorArea')
    tabla.innerHTML = ''
    data.forEach(item =>{
        const nuevaFila = document.createElement('tr')
        nuevaFila.innerHTML = `
        <td>${item.nombre_trabajador}</td>
        <td>${item.rol_trabajador.nombre_rol}</td>
        <td>${item.turno_trabajador.nombre_turno}</td>
      `;
      tabla.appendChild(nuevaFila)
    })
    
}

getAreas()