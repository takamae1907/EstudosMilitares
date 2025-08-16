document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DA BARRA LATERAL (SIDEBAR) ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');

    // Não é necessário um evento de clique para definir a classe 'active',
    // pois cada página já a define no seu próprio HTML.
    // Este código garante que os links funcionem como esperado.
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const link = event.currentTarget.querySelector('a');
            // Se o link for real (não "#"), o navegador seguirá para a página.
            // A classe 'active' já estará definida na página de destino.
            if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
                // Permite o comportamento padrão de navegação
            } else {
                // Previne o comportamento padrão apenas para links vazios '#'
                event.preventDefault(); 
            }
        });
    });

});