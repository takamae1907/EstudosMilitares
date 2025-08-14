document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DE EXEMPLO ---
    const dadosProgresso = [
        { nome: 'Língua Portuguesa', progresso: 25 },
        { nome: 'Direitos Humanos', progresso: 0 },
        { nome: 'Criminologia', progresso: 0 },
        { nome: 'Raciocínio Lógico', progresso: 33 },
        { nome: 'Inglês', progresso: 50 },
        { nome: 'Direito Constitucional', progresso: 0 },
        { nome: 'Direito Administrativo', progresso: 40 },
        { nome: 'Direito Penal', progresso: 33 },
        { nome: 'Direito Processual Penal', progresso: 0 },
        { nome: 'Direito Penal Militar', progresso: 0 },
        { nome: 'Direito Processual Penal Militar', progresso: 0 },
        { nome: 'Legislação Extravagante', progresso: 100 },
    ];

    // --- REFERÊNCIAS DO DOM ---
    const progressGrid = document.querySelector('.progress-grid');
    const pontosFortesList = document.querySelector('#pontos-fortes ul');
    const pontosFracosList = document.querySelector('#pontos-fracos ul');
    const sugestoesList = document.querySelector('.sugestoes-widget ul');

    // Função para renderizar os cards de progresso
    function renderProgressCards() {
        // Calcula o progresso geral primeiro
        const totalProgresso = dadosProgresso.reduce((acc, materia) => acc + materia.progresso, 0);
        const progressoGeral = Math.round(totalProgresso / dadosProgresso.length);

        // Cria o card de Progresso Geral
        const cardGeralHTML = `
            <div class="progress-card">
                <h3>Progresso Geral do Edital</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-bar-fill geral" style="width: ${progressoGeral}%"></div>
                    </div>
                    <span class="percentage">${progressoGeral}%</span>
                </div>
            </div>
        `;
        progressGrid.innerHTML += cardGeralHTML;

        // Cria os cards para as outras matérias
        dadosProgresso.forEach(materia => {
            const cardHTML = `
                <div class="progress-card">
                    <h3>${materia.nome}</h3>
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${materia.progresso}%"></div>
                        </div>
                        <span class="percentage">${materia.progresso}%</span>
                    </div>
                </div>
            `;
            progressGrid.innerHTML += cardHTML;
        });
    }

    // Função para analisar e mostrar pontos fortes e fracos
    function renderPerformanceAnalysis() {
        const sortedMaterias = [...dadosProgresso].sort((a, b) => b.progresso - a.progresso);

        // Pontos Fortes (3 maiores)
        const fortes = sortedMaterias.slice(0, 3);
        pontosFortesList.innerHTML = fortes.map(m => `<li>${m.nome} <span>${m.progresso}%</span></li>`).join('');

        // Pontos a Melhorar (3 menores, com progresso < 100)
        const fracos = sortedMaterias.filter(m => m.progresso < 100).slice(-3).reverse();
        pontosFracosList.innerHTML = fracos.map(m => `<li>${m.nome} <span>${m.progresso}%</span></li>`).join('');
        
        // Gera sugestão baseada no ponto mais fraco
        if (fracos.length > 0) {
            sugestoesList.innerHTML = `
                <li><i class="fa-solid fa-lightbulb"></i> Foque em <strong>${fracos[0].nome}</strong> para melhorar seu desempenho geral.</li>
                <li><i class="fa-solid fa-list-check"></i> Faça uma lista de revisão para <strong>${fortes[0].nome}</strong> para manter o bom resultado.</li>
            `;
        }
    }


    // --- INICIALIZAÇÃO DA PÁGINA ---
    renderProgressCards();
    renderPerformanceAnalysis();

});