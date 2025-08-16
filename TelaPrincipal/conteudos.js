document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA PESQUISA DE TURMAS NA PÁGINA DE CONTEÚDO ---
    const searchInput = document.querySelector('.search-container input');
    const turmasCards = document.querySelectorAll('.turma-card-conteudo');

    if (searchInput && turmasCards.length > 0) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            
            turmasCards.forEach(card => {
                const turmaTitle = card.querySelector('h4').textContent.toLowerCase();
                
                // Mostra ou esconde o card com base na pesquisa
                if (turmaTitle.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});