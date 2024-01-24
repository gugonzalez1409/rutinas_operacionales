function eliminarUsuario(nombreUsuario) {
    var confirmarEliminar = confirm(`¿Estás seguro de que deseas eliminar a ${nombreUsuario}?`);
    if (confirmarEliminar) {
        // Lógica para eliminar el usuario
        console.log(`Usuario ${nombreUsuario} eliminado.`);
    }
}

function crearNuevoUsuario() {
    // Lógica para crear un nuevo usuario
    console.log("Crear nuevo usuario");
}