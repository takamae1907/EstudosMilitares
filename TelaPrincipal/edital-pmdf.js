document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DO EDITAL ---
    const edital = {
        'Língua Portuguesa': [ 'Compreensão e interpretação de textos', 'Reconhecimento de tipos e gêneros textuais', 'Domínio da ortografia oficial', 'Domínio dos mecanismos de coesão textual', 'Emprego de tempos e modos verbais', 'Domínio da estrutura morfossintática', 'Relações de coordenação e subordinação', 'Emprego dos sinais de pontuação', 'Concordância verbal e nominal', 'Regência verbal e nominal', 'Emprego do sinal indicativo de crase', 'Colocação dos pronomes átonos', 'Reescrita de frases e parágrafos' ],
        'Legislação PMDF': [ 'Lei nº 7.289/1984 (Estatuto)', 'Lei nº 12.086/2009', 'Decreto nº 88.777/1983 (R-200)', 'Decreto nº 10.443/2020', 'Lei nº 14.751/2023 (Lei Orgânica Nacional)', 'Lei Orgânica do DF (Parte 1)', 'Lei Orgânica do DF (Parte 2)' ],
        'Direitos Humanos': [ 'Teoria geral dos direitos humanos', 'Afirmação histórica dos direitos humanos', 'Direitos humanos e responsabilidade do Estado', 'Direitos humanos na CF', 'Política Nacional de Direitos Humanos', 'Constituição e tratados internacionais', 'Declaração Universal dos Direitos Humanos' ],
        'Criminologia': [ 'Criminologia: Conceito, métodos e objetos', 'Funções da criminologia', 'Modelos teóricos da criminologia', 'Prevenção da infração penal', 'Modelos de reação ao crime', 'Criminologia ambiental' ],
        'Raciocínio Lógico': [ 'Estruturas lógicas', 'Lógica de argumentação', 'Lógica sentencial (proposições)', 'Equivalências e Leis de De Morgan', 'Diagramas lógicos', 'Lógica de primeira ordem', 'Operações com conjuntos', 'Conjuntos numéricos', 'Razões, proporções e porcentagens', 'Regras de três', 'Equações e inequações', 'Sistemas lineares', 'Funções e gráficos', 'Princípios de contagem' ],
        'Inglês': [ 'Compreensão de textos variados', 'Domínio do vocabulário e estrutura', 'Ideias principais e secundárias', 'Itens gramaticais relevantes', 'Formas contemporâneas da linguagem' ],
        'Direito Constitucional': [ 'Constituição: Conceito e classificações', 'Supremacia da Constituição', 'Princípios fundamentais', 'Direitos e deveres individuais e coletivos', 'Remédios Constitucionais', 'Direitos sociais, nacionalidade, políticos', 'Organização do Estado', 'Entes Federados', 'Administração pública', 'Defesa do Estado e instituições', 'Organização dos poderes', 'Poder Legislativo e Judiciário' ],
        'Direito Administrativo': [ 'Estado, governo e adm. pública', 'Direito administrativo: conceito', 'Regime jurídico-administrativo', 'Ato administrativo', 'Poderes da administração', 'Responsabilidade civil do Estado', 'Controle da administração', 'Improbidade administrativa (Lei 8.429)', 'Processo administrativo (Lei 9.784)', 'Licitações e contratos (Lei 14.133)' ],
        'Direito Penal': [ 'Princípios aplicáveis', 'Aplicação da lei penal', 'Ilicitude e Culpabilidade', 'Concurso de pessoas', 'Penas', 'Ação penal e Extinção da punibilidade', 'Prescrição', 'Crimes contra a fé pública', 'Crimes contra a adm. pública', 'Crimes contra a pessoa e patrimônio', 'Crimes contra dignidade sexual e incolumidade' ],
        'Direito Processual Penal': [ 'Processo penal brasileiro e constitucional', 'Sistemas e princípios', 'Aplicação da lei processual penal', 'Inquérito policial', 'Ação penal', 'Prova', 'Sujeitos do processo', 'Prisão e medidas cautelares', 'Prazos', 'Nulidades' ],
        'Direito Penal Militar': [ 'Aplicação da lei penal militar e Crime', 'Imputabilidade e Concurso de agentes', 'Penas (aplicação, suspensão, livramento)', 'Penas acessórias e Efeitos', 'Medidas de segurança e Ação penal', 'Extinção da punibilidade', 'Crimes militares em tempo de paz' ],
        'Direito Processual Penal Militar': [ 'Aplicação do processo penal militar', 'Inquérito policial militar', 'Ação penal militar', 'Juiz e partes do processo', 'Denúncia e Competência', 'Exceções e Incidentes', 'Medidas preventivas', 'Prisão em flagrante e preventiva', 'Citação, intimação, notificação', 'Atos probatórios', 'Processos em espécie', 'Nulidades', 'Recursos' ],
        'Legislação Extravagante': [ 'Genocídio e Racismo', 'Crimes Hediondos', 'Crime Organizado', 'Tortura', 'Crimes Ambientais', 'Estatuto do Desarmamento', 'Lei de Drogas', 'Lei Maria da Penha', 'Código de Trânsito', 'ECA', 'Improbidade Administrativa', 'Abuso de Autoridade', 'Prisão Temporária', 'Juizados Especiais' ]
    };
    
    // --- CRONOGRAMA DE ESTUDOS ---
    const cronograma = [
        { semana: 1, dias: [ { dia: "Segunda", topicos: [{ id: "lp1", m: "Língua Portuguesa", t: 0 }, { id: "dc1", m: "Direito Constitucional", t: 0 }, { id: "dc2", m: "Direito Constitucional", t: 1 }] }, { dia: "Terça", topicos: [{ id: "da1", m: "Direito Administrativo", t: 0 }, { id: "da2", m: "Direito Administrativo", t: 1 }, { id: "rl1", m: "Raciocínio Lógico", t: 0 }] }, { dia: "Quarta", topicos: [{ id: "lp2", m: "Língua Portuguesa", t: 1 }, { id: "dp1", m: "Direito Penal", t: 0 }, { id: "dp2", m: "Direito Penal", t: 1 }] }, { dia: "Quinta", topicos: [{ id: "dc3", m: "Direito Constitucional", t: 2 }, { id: "dh1", m: "Direitos Humanos", t: 0 }, { id: "dpm1", m: "Direito Penal Militar", t: 0 }] }, { dia: "Sexta", topicos: [{ id: "da3", m: "Direito Administrativo", t: 2 }, { id: "rl2", m: "Raciocínio Lógico", t: 1 }, { id: "in1", m: "Inglês", t: 0 }] }, { dia: "Sábado", topicos: [{ id: "rev1", m: "Revisão", t: "Revisar todos os tópicos da Semana 1" }] } ] },
        { semana: 2, dias: [ { dia: "Segunda", topicos: [{ id: "lp3", m: "Língua Portuguesa", t: 2 }, { id: "dc4", m: "Direito Constitucional", t: 3 }, { id: "dc5", m: "Direito Constitucional", t: 4 }] }, { dia: "Terça", topicos: [{ id: "da4", m: "Direito Administrativo", t: 3 }, { id: "rl3", m: "Raciocínio Lógico", t: 2 }, { id: "c1", m: "Criminologia", t: 0 }] }, { dia: "Quarta", topicos: [{ id: "lp4", m: "Língua Portuguesa", t: 3 }, { id: "dp3", m: "Direito Penal", t: 2 }, { id: "dpp1", m: "Direito Processual Penal", t: 0 }] }, { dia: "Quinta", topicos: [{ id: "dc6", m: "Direito Constitucional", t: 5 }, { id: "dh2", m: "Direitos Humanos", t: 1 }, { id: "dppm1", m: "Direito Processual Penal Militar", t: 0 }] }, { dia: "Sexta", topicos: [{ id: "da5", m: "Direito Administrativo", t: 4 }, { id: "le1", m: "Legislação Extravagante", t: 0 }, { id: "in2", m: "Inglês", t: 1 }] }, { dia: "Sábado", topicos: [{ id: "rev2", m: "Revisão", t: "Revisar todos os tópicos da Semana 2 e resolver 20 questões." }] } ] },
        { semana: 3, dias: [] }, { semana: 4, dias: [] }, { semana: 5, dias: [] }, { semana: 6, dias: [] },
        { semana: 7, dias: [] }, { semana: 8, dias: [] }, { semana: 9, dias: [] }, { semana: 10, dias: [] }, { semana: 11, dias: [] },
        { semana: 12, dias: [ { dia: "Segunda", topicos: [{ id: "rev_final1", m: "Revisão Final", t: "Revisão geral de Português e RLM." }] }, { dia: "Terça", topicos: [{ id: "rev_final2", m: "Revisão Final", t: "Revisão geral de Constitucional e Administrativo." }] }, { dia: "Quarta", topicos: [{ id: "rev_final3", m: "Revisão Final", t: "Revisão geral de Penais (Comum e Militar)." }] }, { dia: "Quinta", topicos: [{ id: "rev_final4", m: "Revisão Final", t: "Revisão geral de Processuais (Comum e Militar)." }] }, { dia: "Sexta", topicos: [{ id: "rev_final5", m: "Revisão Final", t: "Revisão de Legislação Extravagante e Direitos Humanos." }] }, { dia: "Sábado", topicos: [{ id: "sim1", m: "Simulado", t: "Realizar simulado final completo." }] } ] },
    ];

    const cronogramaContainer = document.getElementById('cronograma-container');
    const progressPanel = document.getElementById('progress-panel');
    const todayList = document.getElementById('today-list');
    const currentDateEl = document.getElementById('current-date');

    let progress = JSON.parse(localStorage.getItem('studyProgressPMDF')) || {};
    let totalTopics = 0;

    function saveProgress() {
        localStorage.setItem('studyProgressPMDF', JSON.stringify(progress));
    }

    function renderCronograma() {
        cronogramaContainer.innerHTML = '';
        totalTopics = 0;

        cronograma.forEach(semanaData => {
            if (!semanaData.dias || semanaData.dias.length === 0) return;

            const semanaEl = document.createElement('div');
            semanaEl.className = 'accordion-item';

            let semanaTopics = 0;
            let semanaCompleted = 0;

            const contentHtml = semanaData.dias.map(diaData => {
                const diaTopics = diaData.topicos.map(topic => {
                    if (typeof topic.t === 'number') {
                        totalTopics++;
                        semanaTopics++;
                        if (progress[topic.id]) {
                            semanaCompleted++;
                        }
                    }
                    const topicText = typeof topic.t === 'number' ? edital[topic.m][topic.t] : topic.t;
                    const isCompleted = progress[topic.id] ? 'completed' : '';
                    const isChecked = progress[topic.id] ? 'checked' : '';
                    
                    return `<li class="topic-item ${isCompleted}" data-id="${topic.id}"><input type="checkbox" id="${topic.id}" ${isChecked}><label for="${topic.id}"><span>${topicText}</span><span class="subject-tag">${topic.m}</span></label></li>`;
                }).join('');
                return `<div class="day-plan"><h4>${diaData.dia}</h4><ul>${diaTopics}</ul></div>`;
            }).join('');
            
            const semanaProgress = semanaTopics > 0 ? Math.round((semanaCompleted / semanaTopics) * 100) : 0;

            semanaEl.innerHTML = `
                <div class="accordion-header">
                    <h3>Semana ${semanaData.semana} <span class="progress-label-semana">(${semanaProgress}%)</span></h3>
                    <i class="fas fa-plus icon"></i>
                </div>
                <div class="accordion-content">${contentHtml}</div>`;

            cronogramaContainer.appendChild(semanaEl);
        });
    }

    function updateCharts() {
        const completedTopics = Object.keys(progress).filter(id => !id.startsWith('rev') && !id.startsWith('sim')).length;
        const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        document.getElementById('geral-progress-bar').style.width = `${overallPercentage}%`;
        document.getElementById('geral-progress-label').textContent = `${overallPercentage}%`;
        
        const existingCharts = progressPanel.querySelectorAll('.chart-container:not(.overall-chart)');
        existingCharts.forEach(chart => chart.remove());

        Object.keys(edital).forEach(materia => {
            let totalMateria = 0, completedMateria = 0;
            cronograma.forEach(s => s.dias && s.dias.forEach(d => d.topicos.forEach(t => {
                if (t.m === materia) {
                    totalMateria++;
                    if (progress[t.id]) completedMateria++;
                }
            })));

            if (totalMateria > 0) {
                const materiaPercentage = Math.round((completedMateria / totalMateria) * 100);
                const chartEl = document.createElement('div');
                chartEl.className = 'chart-container';
                chartEl.innerHTML = `<h4>${materia}</h4><div class="progress-bar-container"><div class="progress-bar" style="width: ${materiaPercentage}%;"></div></div><span class="progress-label">${materiaPercentage}%</span>`;
                progressPanel.appendChild(chartEl);
            }
        });
    }
    
    function renderTodayStudies() {
        const today = new Date(); // Usa a data real
        const dayOfWeek = today.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/-feira/i, '').replace(/^\w/, c => c.toUpperCase());
        
        currentDateEl.textContent = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        todayList.innerHTML = '<li>Nenhum estudo agendado para hoje.</li>';
        
        const startDate = new Date('2025-08-04');
        const weekDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24 * 7));

        if (weekDiff >= 0 && weekDiff < cronograma.length) {
            const currentWeek = cronograma[weekDiff];
            if (currentWeek && currentWeek.dias) {
                const todayPlan = currentWeek.dias.find(d => d.dia === dayOfWeek);
                if (todayPlan) {
                    todayList.innerHTML = todayPlan.topicos.map(topic => {
                        const topicText = typeof topic.t === 'number' ? edital[topic.m][topic.t] : topic.t;
                        return `<li><strong>${topic.m}:</strong> <span>${topicText}</span></li>`
                    }).join('');
                }
            }
        }
    }

    cronogramaContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (header) {
            header.parentElement.classList.toggle('active');
            return;
        }

        const checkbox = e.target.closest('input[type="checkbox"]');
        if (checkbox) {
            const id = checkbox.id;
            const topicItem = checkbox.closest('.topic-item');
            if (checkbox.checked) {
                progress[id] = true;
                topicItem.classList.add('completed');
            } else {
                delete progress[id];
                topicItem.classList.remove('completed');
            }
            saveProgress();
            renderCronograma();
            updateCharts();
        }
    });

    renderCronograma();
    updateCharts();
    renderTodayStudies();
});