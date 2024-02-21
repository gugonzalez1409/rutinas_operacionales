async function LogIn(){
    try{
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const log = await window.electronAPI.LogIn(email, password);
        const rol = log.rol
        if(rol !== undefined && rol == 'admin'){   
            window.location.href = './../index.html'
        }
        if(rol != undefined && rol != 'admin'){
            window.location.href = './user.html'
        }
    }
    catch(error){
        window.messageAPI.alerta('send-alert', 'Error al inciar sesión, asegurese de haber ingresado las credenciales correctamente')
        clearLogin()
    }
}

document.getElementById("login-form").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      LogIn();
    }
  });

function clearLogin(){
    const email = document.getElementById('username');
    const password = document.getElementById('password');
    email.value = ''
    password.value = ''
}