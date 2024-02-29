async function getAreas(){
    const data = await window.electronAPI.getAreas()
    const options = document.getElementById('areaEstadisticas')
    options.innerHTML = ''
    data.forEach(item =>{
        const option = document.createElement('option')
        option.text = item.nombre_area;
        option.value = item.id;
        options.add(option)
    })
    const area = options.options[options.selectedIndex].text;
    await getEstadisticas(area)
    options.addEventListener('change', async function(){
        const area = options.options[options.selectedIndex].text;
        await getEstadisticas(area)
    })
}

async function getEstadisticas(area){
    try {
        const informes = await window.electronAPI.getEstadisticas(area); //obtiene todos los informes del area
        const turnos = await window.electronAPI.getTurnos();
        const tabla = document.getElementById('estadisticasPorTurno')
        tabla.innerHTML = '';
        const informesPorTurno = {};
        turnos.forEach(item => {
            // obtener todos los reportes del area y turno especifico
            const informesFiltrados = informes.filter(informe => informe.turno_trabajador == item.nombre_turno);
            informesPorTurno[item.nombre_turno] = informesFiltrados;
            //console.log('informe filtrado turno: ',item.nombre_turno);
            //console.log(informesPorTurno)
            let total = 0;
            let hechas = 0;
            informesFiltrados.forEach(informe => {
                //console.log('turno', item.nombre_turno)
                const rutinas = informe.nombre_rutina;
                //console.log(rutinas)
                const totalRutinas = Object.keys(rutinas).length
                total += totalRutinas
                //console.log('total rutinas turno', item.nombre_turno)
                //console.log(totalRutinas)
                const rutinasHechas = Object.values(rutinas).reduce((acumulador, valor) => acumulador + valor, 0);
                hechas += rutinasHechas
            });
            const promedio = (hechas/total)*100;
                const nuevaFila = document.createElement('tr')
                nuevaFila.innerHTML = `
                <td>${item.nombre_turno}</td>
                <td>${promedio.toFixed(2)}%</td>
              `;
              tabla.appendChild(nuevaFila)
        })
    }
    catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}

getAreas()