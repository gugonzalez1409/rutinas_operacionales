async function getAreas() {
    try {
      const data = await window.electronAPI.getAreas();
      const selectElement = document.getElementById('elegirArea');
      selectElement.innerHTML = '';
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.nombre_area;
        selectElement.add(option);
      });
    } 
    catch (error) {
      console.error('Error al cargar datos en la lista desplegable:', error);
    }
  }

  getAreas()