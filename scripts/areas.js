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
  function editOption() {
    var selectElement = document.getElementById('options');
    var newValue = document.getElementById('newValue').value; 
    if (!newValue) {
      alert('Por favor, ingresa un valor.');
      return;
    }
    var selectedIndex = selectElement.selectedIndex;
    if (selectedIndex !== -1) {
      selectElement.options[selectedIndex].text = newValue;
      selectElement.options[selectedIndex].value = newValue;
      const data = window.electronAPI.actualizarArea(selectElement, newValue);
      alert('Área editada con éxito.');
    } else {
      alert('Por favor, selecciona un área.');
    }
    
    clearForm();
  }
  function addOption() {
    var selectElement = document.getElementById('options');
    var newValue = document.getElementById('newValue').value;
    if (!newValue) {
      alert('Por favor, ingresa un valor.');
      return;
    }
    var option = document.createElement('option');
    option.text = newValue;
    option.value = newValue;
    selectElement.add(option);
    alert('Área agregada con éxito.');
    clearForm();
  }
  function deleteOption() {
    var selectElement = document.getElementById('options');
    var selectedIndex = selectElement.selectedIndex;
    if (selectedIndex !== -1) {
      selectElement.remove(selectedIndex);
      alert('Área eliminada con éxito.');
    } else {
      alert('Por favor, selecciona un área.');
    }
    clearForm();
  }     
  function clearForm() {
    document.getElementById('newValue').value = '';
  }

  getAreas()
  