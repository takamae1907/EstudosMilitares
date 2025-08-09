document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const editalInput = document.getElementById('edital-input');
    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const dashboardMain = document.getElementById('dashboard-main');

    analyzeBtn.addEventListener('click', async () => {
        if (editalInput.files.length === 0) {
            alert('Por favor, selecione um arquivo de edital.');
            return;
        }

        uploadSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        dashboardMain.classList.add('hidden');

        const formData = new FormData();
        formData.append('editalPdf', editalInput.files[0]);

        try {
            const response = await fetch('http://localhost:3000/api/edital/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }

            const realApiData = await response.json();
            
            const finalDashboardData = {
                fases: realApiData.fases_concurso || [],
                criterios: realApiData.criterios_avaliacao || [],
                conteudo: Object.entries(realApiData.conteudo_programatico || {}).map(([materia, topicos]) => ({ materia, topicos })),
                cronograma: realApiData.cronograma || [],
                progressoUsuario: { editalVisto: 35, rendimentoQuestoes: 78 },
                planoDoDia: [
                    'Revisar Direitos e Garantias Fundamentais',
                    'Fazer 20 questões de Língua Portuguesa',
                    'Ler sobre Redação Oficial'
                ]
            };

            displayDashboardData(finalDashboardData);
            dashboardMain.classList.remove('hidden');

        } catch (error) {
            alert(`Ocorreu um erro ao analisar o edital: ${error.message}`);
            uploadSection.classList.remove('hidden');
        } finally {
            loadingSection.classList.add('hidden');
        }
    });

    function displayDashboardData(data) {
        const fasesList = document.getElementById('fases-list');
        fasesList.innerHTML = '';
        data.fases.forEach(fase => {
            const li = document.createElement('li');
            li.textContent = fase;
            fasesList.appendChild(li);
        });

        const materiasTableBody = document.querySelector('#materias-table tbody');
        materiasTableBody.innerHTML = '';
        data.criterios.forEach(criterio => {
            const row = materiasTableBody.insertRow();
            row.innerHTML = `<td>${criterio.materia || 'N/A'}</td><td>${criterio.numero_questoes || 'N/A'}</td><td>${criterio.peso || 'N/A'}</td>`;
        });

        const conteudoList = document.getElementById('conteudo-list');
        conteudoList.innerHTML = '';
        data.conteudo.forEach(item => {
            const topicDiv = document.createElement('div');
            topicDiv.className = 'topic';
            let topicosHtml = item.topicos.map(t => `<li>${t}</li>`).join('');
            topicDiv.innerHTML = `<h4>${item.materia}</h4><ul>${topicosHtml}</ul>`;
            conteudoList.appendChild(topicDiv);
        });

        const cronogramaList = document.getElementById('cronograma-list');
        cronogramaList.innerHTML = '';
        data.cronograma.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.evento}: ${item.data}`;
            cronogramaList.appendChild(li);
        });

        const diaEstudoList = document.getElementById('dia-estudo-list');
        diaEstudoList.innerHTML = '';
        data.planoDoDia.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            diaEstudoList.appendChild(li);
        });

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