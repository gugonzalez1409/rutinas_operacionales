async function getAreas() {
  try {
    const data = await window.electronAPI.getAreas();
    const elegirArea = document.getElementById('options');
    elegirArea.innerHTML = '';
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.text = item.nombre_area;
      elegirArea.add(option);
    });
  } 
  catch (error) {
    console.error('Error al cargar datos en la lista desplegable:', error);
  }
}

function confirmEdit() {
    var confirmEdit = confirm('¿Estás seguro de que deseas editar esta área?');
    if (confirmEdit) {
      editOption();
    }
  }
  function confirmAdd() {
    var confirmAdd = confirm('¿Estás seguro de que deseas agregar esta área?');
    if (confirmAdd) {
      addOption();
    }
  }
  function confirmDelete() {
    var confirmDelete = confirm('¿Estás seguro de que deseas eliminar este área?');
    if (confirmDelete) {
      deleteOption();
    }
  }
  async function editOption() {
    try {
      var selectElement = document.getElementById('options');
      var selectedIndex = selectElement.selectedIndex;
      if (selectedIndex !== -1) {
        var newValue = document.getElementById('newValue').value;
        if (!newValue) {
          alert('Por favor, ingresa un valor.');
          return;
        }
        var selectedId = selectElement.options[selectedIndex].value;
        await window.electronAPI.actualizarArea(selectedId, newValue);
        alert('Área editada con éxito.');
        clearForm();
        //actualizar pestaña
      } else {
        alert('Por favor, selecciona un área.');
      }
    } catch (error) {
      console.error('Error al editar área:', error);
    }
  }
  
  async function addOption() {
    try {
      var newValue = document.getElementById('newValue').value;
      if (!newValue) {
        alert('Por favor, ingresa un valor.');
        return;
      }
     await window.electronAPI.areaNueva(newValue);
  
      alert('Área agregada con éxito.');
      clearForm();
      getAreas(); // recargar lista, funciona más o menos XD
    } catch (error) {
      console.error('Error al agregar área:', error);
    }
  }
  async function deleteOption() {
    try {
      var selectElement = document.getElementById('options');
      var selectedIndex = selectElement.selectedIndex;
      if (selectedIndex !== -1) {
        var selectedId = selectElement.options[selectedIndex].value;
        await window.electronAPI.eliminarArea(selectedId);
        alert('Área eliminada con éxito.');
        clearForm();
        getAreas();
      } else {
        alert('Por favor, selecciona un área.');
      }
    } catch (error) {
      console.error('Error al eliminar área:', error);
    }
  }     

  function clearForm() {
    document.getElementById('newValue').value = '';
  }

getAreas()