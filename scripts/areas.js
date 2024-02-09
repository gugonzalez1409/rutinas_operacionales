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
    console.error('Error al cargar lista de datos:', error);
  }
}

async function confirmEdit() {
  try{
    var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro de editar los datos seleccionados?")
    if (alert){
      editOption();
      //location.reload()
    }
  }
  catch(error){
    console.error('Error al confirmar la edición:', error);
  }
}

async function confirmAdd() {
  var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro que desea agregar el area?")
    if (alert) {
      addOption();
      //location.reload()
    }
  }

async function confirmDelete() {
    var alert = await window.messageAPI.confirmar("send-confirm", "¿Está seguro que desea eliminar este area?")
    if (alert) {
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
          window.messageAPI.alerta("send-alert", "Por favor, ingresa un valor.")
          return;
        }
        var selectedId = selectElement.options[selectedIndex].value;
        await window.electronAPI.actualizarArea(selectedId, newValue);
        window.messageAPI.alerta("send-alert", "Área editada con éxito.")
        clearForm();
      } 
      else {
        window.messageAPI.alerta("send-alert", "Por favor, selecciona un área.")
      }
    } 
    catch (error) {
      window.messageAPI.alerta("send-alert", "Error al editar el área, por favor vuelva a intentarlo.")
    }
  }
  
async function addOption() {
    try {
      var newValue = document.getElementById('newValue').value;
      if (!newValue) {
        window.messageAPI.alerta("send-alert", "Por favor, ingresa un valor.")
        return;
      }
     await window.electronAPI.areaNueva(newValue);
     window.messageAPI.alerta("send-alert", "Área agregada con exitosamente.")
      clearForm();
      //recargar pagina
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
        window.messageAPI.alerta("send-alert", "Área eliminada exitosamente.")
        clearForm();
        //location.reload()
      } else {
        window.messageAPI.alerta("send-alert", "Por favor, selecciona un área.")
      }
    } catch (error) {
      console.error('Error al eliminar área:', error);
    }
  }     

function clearForm() {
    document.getElementById('newValue').value = '';
}


getAreas()