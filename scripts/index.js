window.addEventListener('load', (event) => {
    const pages = [
        'areas.html',
        'admin.html',
        'trabArea.html',
        'adminTrab.html',
        'modRutinas.html',
        'newRutina.html',
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

document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var tabScripts = {
        'admin-tab': './scripts/admin.js',
        'adminTrab-tab': './scripts/adminTrab.js',
        'areas-tab': './scripts/areas.js',
        'modRutinas-tab': './scripts/modRutinas.js',
        'newRutina-tab': './scripts/newRutina.js',
        'trabArea-tab': './scripts/trabArea.js'
        };
    navLinks.forEach(function (navLink) {
        navLink.addEventListener('click', function (event) {
            event.preventDefault();
            var tabId = navLink.getAttribute('id');
            loadScript(tabScripts[tabId]);
            //console.log('Se hizo clic en la pestaña:', tabId);
            });
        });
    function loadScript(scriptPath) {
        var script = document.createElement('script');
        script.src = scriptPath;
        document.body.appendChild(script);
    }
    });
    