async function LogOut(){
    var confirm = await window.messageAPI.confirmar('send-confirm', '¿Está seguro que desea cerrar sesión?')
    if(confirm){
      const data = await window.electronAPI.LogOut()
      if(data){
        window.location.href= './pages/login.html'
      }
    }
  }

document.addEventListener('DOMContentLoaded', function () {
    var cerrarSesionLink = document.getElementById('cerrarSesion-tab');
    cerrarSesionLink.addEventListener('click', function (event) {
        event.preventDefault();
        LogOut();
    });
})