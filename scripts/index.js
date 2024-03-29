window.addEventListener('load', (event) => {
    const pages = [
        'admin.html',
        'trabArea.html',
        'adminTrab.html',
        'modRutinas.html',
        'newRutina.html',
        'rutinasHoy.html',
        'estadisticas.html'
    ];

    const loadPage = async (page) => {
        try {
            const response = await fetch(`pages/${page}`);
            const html = await response.text();
            const div = document.createElement('div');
            div.innerHTML = html;
            const template = div.querySelector('template');
            const clone = document.importNode(template.content, true);
            const targetTab = document.getElementById(page.replace('.html',''));
            if(targetTab) {
                targetTab.appendChild(clone);
                return targetTab;
            } 
            else {
                console.error(`Error: Contenedor para ${page} no encontrado.`);
            }
        } catch (error) {
                console.error(`Error al cargar la página ${page}: ${error}`);
        }
    };
    pages.forEach((page) => {
        loadPage(page);
        });
    });
  
        