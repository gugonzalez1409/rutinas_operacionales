async function loadAreas() {
    try {
      const data = await window.electronAPI.getAreas();
      // Obtener el elemento select
      const selectElement = document.getElementById('elegirArea');
      // Limpiar cualquier opción existente
      selectElement.innerHTML = '';
      // Agregar opciones al select
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