document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos do DOM ---
    const analyzeBtn = document.getElementById('analyze-btn');
    const editalInput = document.getElementById('edital-input');
    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const dashboardMain = document.getElementById('dashboard-main');
    const dropZone = document.querySelector('.drop-zone');

    // --- Event Listeners ---
    analyzeBtn.addEventListener('click', () => {
        if (editalInput.files.length === 0) {
            alert('Por favor, selecione um arquivo de edital.');
            return;
        }
        handleAnalysis();
    });

    // Lógica de Arrastar e Soltar (Drag and Drop)
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0a84ff'; // Feedback visual
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#3a3a3c';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3a3a3c';
        if (e.dataTransfer.files.length && e.dataTransfer.files[0].type === 'application/pdf') {
            editalInput.files = e.dataTransfer.files;
            const fileName = e.dataTransfer.files[0].name;
            dropZone.querySelector('p').textContent = `Arquivo selecionado: ${fileName}`;
        } else {
            alert('Por favor, solte um arquivo PDF.');
        }
    });
    dropZone.addEventListener('click', () => editalInput.click());
    editalInput.addEventListener('change', () => {
        if (editalInput.files.length > 0) {
            const fileName = editalInput.files[0].name;
            dropZone.querySelector('p').textContent = `Arquivo selecionado: ${fileName}`;
        }
    });

    /**
     * Função principal que envia o arquivo para o backend e processa a resposta.
     */
    async function handleAnalysis() {
        uploadSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        dashboardMain.classList.add('hidden');

        const formData = new FormData();
        formData.append('editalPdf', editalInput.files[0]);

        try {
            // --- CHAMADA REAL PARA O BACKEND ---
            console.log("Enviando edital para o backend em http://localhost:3000/api/edital/upload");
            const response = await fetch('http://localhost:3000/api/edital/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }

            const apiData = await response.json();

            // Prepara os dados recebidos para a função que exibe o dashboard
            const dadosParaDashboard = {
                fases: apiData.analise_edital.fases_concurso || [],
                criterios: apiData.analise_edital.criterios_avaliacao || [],
                conteudo: Object.entries(apiData.analise_edital.conteudo_programatico || {}).map(([materia, topicos]) => ({ materia, topicos })),
                cronograma: apiData.analise_edital.cronograma || [],
                // Dados de progresso do usuário podem ser mockados ou vir de outra fonte no futuro
                progressoUsuario: { editalVisto: 35, rendimentoQuestoes: 78 },
            };

            displayDashboardData(dadosParaDashboard);
            dashboardMain.classList.remove('hidden');

        } catch (error) {
            alert(`Ocorreu um erro ao analisar o edital: ${error.message}\n\nVerifique se o servidor backend está rodando.`);
            uploadSection.classList.remove('hidden');
        } finally {
            loadingSection.classList.add('hidden');
        }
    }

    /**
     * Preenche o dashboard na tela com os dados processados da API.
     * @param {object} data - O objeto com os dados do edital.
     */
    function displayDashboardData(data) {
        // Preenche as Fases do Concurso
        const fasesList = document.getElementById('fases-list');
        fasesList.innerHTML = data.fases.map(fase => `<li>${fase}</li>`).join('') || '<li>Nenhuma fase encontrada.</li>';

        // Preenche a Tabela de Critérios de Avaliação
        const materiasTableBody = document.querySelector('#materias-table tbody');
        materiasTableBody.innerHTML = data.criterios.map(c => `<tr><td>${c.materia || 'N/A'}</td><td>${c.numero_questoes || 'N/A'}</td><td>${c.peso || 'N/A'}</td></tr>`).join('') || '<tr><td colspan="3">Nenhum critério encontrado.</td></tr>';

        // Preenche o Conteúdo Programático
        const conteudoList = document.getElementById('conteudo-list');
        conteudoList.innerHTML = data.conteudo.map(item => `
            <div class="topic">
                <h4>${item.materia}</h4>
                <ul>${item.topicos.map(t => `<li>${t}</li>`).join('')}</ul>
            </div>
        `).join('') || '<p>Nenhum conteúdo programático encontrado.</p>';

        // Preenche o Cronograma de Datas
        const cronogramaList = document.getElementById('cronograma-list');
        cronogramaList.innerHTML = data.cronograma.map(item => `<li><strong>${item.evento}:</strong> ${item.data}</li>`).join('') || '<li>Nenhum cronograma encontrado.</li>';

        // Atualiza as Barras de Progresso (dados de exemplo)
        const editalVistoBar = document.getElementById('edital-visto-bar');
        const editalVistoPercent = document.getElementById('edital-visto-percent');
        editalVistoBar.style.width = `${data.progressoUsuario.editalVisto}%`;
        editalVistoPercent.textContent = `${data.progressoUsuario.editalVisto}%`;

        const rendimentoBar = document.getElementById('rendimento-bar');
        const rendimentoPercent = document.getElementById('rendimento-percent');
        rendimentoBar.style.width = `${data.progressoUsuario.rendimentoQuestoes}%`;
        rendimentoPercent.textContent = `${data.progressoUsuario.rendimentoQuestoes}%`;
    }
});
