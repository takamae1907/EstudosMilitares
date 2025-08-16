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
        dropZone.style.borderColor = '#0a84ff';
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#3a3a3c';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3a3a3c';
        if (e.dataTransfer.files.length && e.dataTransfer.files[0].type === 'application/pdf') {
            editalInput.files = e.dataTransfer.files;
            updateDropZoneText(e.dataTransfer.files[0].name);
        } else {
            alert('Por favor, solte um arquivo PDF.');
        }
    });
    dropZone.addEventListener('click', () => editalInput.click());
    editalInput.addEventListener('change', () => {
        if (editalInput.files.length > 0) {
            updateDropZoneText(editalInput.files[0].name);
        }
    });
    
    function updateDropZoneText(fileName) {
         const p = dropZone.querySelector('p');
         const browseBtn = dropZone.querySelector('.browse-btn');
         p.innerHTML = `Arquivo selecionado: <strong>${fileName}</strong>`;
         browseBtn.textContent = 'trocar arquivo';
    }

    async function handleAnalysis() {
        uploadSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        dashboardMain.classList.add('hidden');

        // SIMULAÇÃO DE CHAMADA DE API
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simula o tempo de processamento

        try {
            // DADOS MOCKADOS (simulando a resposta da API)
            const mockApiData = {
                analise_edital: {
                    fases_concurso: ["Prova Objetiva", "Prova Discursiva", "Teste de Aptidão Física (TAF)", "Avaliação Psicológica", "Investigação Social"],
                    criterios_avaliacao: [
                        { materia: "Língua Portuguesa", numero_questoes: 20, peso: 1 },
                        { materia: "Direito Constitucional", numero_questoes: 15, peso: 1.5 },
                        { materia: "Direito Penal", numero_questoes: 15, peso: 1.5 },
                        { materia: "Legislação Extravagante", numero_questoes: 10, peso: 2 }
                    ],
                    conteudo_programatico: {
                        "Língua Portuguesa": ["Interpretação de textos", "Gramática e uso da norma culta", "Redação Oficial"],
                        "Direito Constitucional": ["Art. 5º - Direitos e Deveres Individuais e Coletivos", "Art. 144 - Segurança Pública", "Controle de Constitucionalidade"]
                    },
                    cronograma: [
                        { evento: "Publicação do Edital", data: "15/08/2025" },
                        { evento: "Período de Inscrição", data: "20/08/2025 a 15/09/2025" },
                        { evento: "Data da Prova Objetiva", data: "26/10/2025" }
                    ]
                }
            };

            const dadosParaDashboard = {
                fases: mockApiData.analise_edital.fases_concurso || [],
                criterios: mockApiData.analise_edital.criterios_avaliacao || [],
                conteudo: Object.entries(mockApiData.analise_edital.conteudo_programatico || {}).map(([materia, topicos]) => ({ materia, topicos })),
                cronograma: mockApiData.analise_edital.cronograma || [],
                progressoUsuario: { editalVisto: 35, rendimentoQuestoes: 78 },
            };

            displayDashboardData(dadosParaDashboard);
            dashboardMain.classList.remove('hidden');

        } catch (error) {
            alert(`Ocorreu um erro ao analisar o edital: ${error.message}`);
            uploadSection.classList.remove('hidden');
        } finally {
            loadingSection.classList.add('hidden');
        }
    }

    function displayDashboardData(data) {
        // Fases
        const fasesList = document.getElementById('fases-list');
        fasesList.innerHTML = data.fases.map(fase => `<li>${fase}</li>`).join('') || '<li>Nenhuma fase encontrada.</li>';

        // Tabela de Critérios
        const materiasTableBody = document.querySelector('#materias-table tbody');
        materiasTableBody.innerHTML = data.criterios.map(c => `<tr><td>${c.materia || 'N/A'}</td><td>${c.numero_questoes || 'N/A'}</td><td>${c.peso || 'N/A'}</td></tr>`).join('') || '<tr><td colspan="3">Nenhum critério encontrado.</td></tr>';

        // Conteúdo Programático
        const conteudoList = document.getElementById('conteudo-list');
        conteudoList.innerHTML = data.conteudo.map(item => `
            <div class="topic">
                <h4>${item.materia}</h4>
                <ul>${item.topicos.map(t => `<li>${t}</li>`).join('')}</ul>
            </div>
        `).join('') || '<p>Nenhum conteúdo programático encontrado.</p>';

        // Cronograma
        const cronogramaList = document.getElementById('cronograma-list');
        cronogramaList.innerHTML = data.cronograma.map(item => `<li><strong>${item.evento}:</strong> ${item.data}</li>`).join('') || '<li>Nenhum cronograma encontrado.</li>';

        // Barras de Progresso
        document.getElementById('edital-visto-bar').style.width = `${data.progressoUsuario.editalVisto}%`;
        document.getElementById('edital-visto-percent').textContent = `${data.progressoUsuario.editalVisto}%`;
        document.getElementById('rendimento-bar').style.width = `${data.progressoUsuario.rendimentoQuestoes}%`;
        document.getElementById('rendimento-percent').textContent = `${data.progressoUsuario.rendimentoQuestoes}%`;
        
        // **NOVO**: Atualiza o widget de resumo na coluna da direita
        document.getElementById('summary-fases').textContent = `${data.fases.length} fases`;
        document.getElementById('summary-materias').textContent = `${data.criterios.length} matérias`;
        document.getElementById('summary-data').textContent = data.cronograma.length > 1 ? `${data.cronograma[1].evento}: ${data.cronograma[1].data}` : 'Não definida';
    }
});