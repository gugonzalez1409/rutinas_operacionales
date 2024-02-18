async function LogIn(){
    try{
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const log = await window.electronAPI.LogIn(email, password);
        console.log(log)
        if(log !== undefined){   
            window.location.href = './../index.html'
        }
    }
    catch(error){
        window.messageAPI.alerta('send-alert', 'Error al inciar sesión, asegurese de haber ingresado las credenciales correctamente')
    }
}

document.getElementById("login-form").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      LogIn();
    }
  });

async function redirect(){

}