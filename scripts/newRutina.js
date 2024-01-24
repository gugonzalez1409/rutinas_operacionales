function marcarTodosLosDias() {
    const checkboxDiario = document.getElementById('diario');
    const checkboxesDias = document.getElementsByName('dias');
    if (checkboxDiario.checked) {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = true;
        });
    } else {
        checkboxesDias.forEach(checkbox => {
        checkbox.checked = false;
        });
    }
    }