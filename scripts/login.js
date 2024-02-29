async function LogIn(){
    try{
        var email = document.getElementById('username').value;
        email = email + '@arauco.com'
        const password = document.getElementById('password').value;
        const log = await window.electronAPI.LogIn(email, password);
        const rol = log.rol;
        if(rol !== undefined && rol == 'admin'){  
            window.location.href = './../index.html'
        }
        if(rol != undefined && rol != 'admin'){
            window.location.href = './user.html'
        }
    }
    catch(error){
        window.messageAPI.alerta('send-alert', 'Error al inciar sesión, asegurese de haber ingresado las credenciales correctamente')
        console.error('Error al iniciar sesion: ', error)
        clearLogin()
    }
}

document.getElementById("login-form").addEventListener("keyup", function(event){
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