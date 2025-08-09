document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DO EDITAL ---
    const edital = {
        'Língua Portuguesa': [
            'Compreensão e interpretação de textos de gêneros variados.', 'Reconhecimento de tipos e gêneros textuais.', 'Domínio da ortografia oficial.', 'Domínio dos mecanismos de coesão textual (referenciação, conectores).', 'Emprego de tempos e modos verbais.', 'Domínio da estrutura morfossintática (classes de palavras).', 'Relações de coordenação e subordinação.', 'Emprego dos sinais de pontuação.', 'Concordância verbal e nominal.', 'Regência verbal e nominal.', 'Emprego do sinal indicativo de crase.', 'Colocação dos pronomes átonos.', 'Reescrita de frases e parágrafos do texto.'
        ],
        'Legislação PMDF': [
            'Lei nº 7.289/1984 (Estatuto dos Policiais Militares).', 'Lei nº 12.086/2009 (Dispõe sobre os militares da PMDF).', 'Decreto nº 88.777/1983 (R-200).', 'Decreto nº 10.443/2020 (Organização básica da PMDF).', 'Lei nº 14.751/2023 (Lei Orgânica Nacional das polícias militares).', 'Lei Orgânica do DF (art 1º ao 30; 87 ao 99).', 'Lei Orgânica do DF (art 117-A ao 124-A; 200 ao 203; 263 ao 311).'
        ],
        'Direitos Humanos': [
            'Teoria geral dos direitos humanos (Conceitos, terminologia, estrutura).', 'Afirmação histórica dos direitos humanos.', 'Direitos humanos e responsabilidade do Estado.', 'Direitos humanos na Constituição Federal.', 'Política Nacional de Direitos Humanos.', 'Constituição e tratados internacionais (EC nº 45/2024).', 'Declaração Universal dos Direitos Humanos.'
        ],
        'Criminologia': [
            'Criminologia: Conceito, métodos e objetos.', 'Funções da criminologia (Relação com política criminal e direito penal).', 'Modelos teóricos da criminologia (Teorias sociológicas).', 'Prevenção da infração penal (primária, secundária, terciária).', 'Modelos de reação ao crime.', 'Criminologia ambiental.'
        ],
        'Raciocínio Lógico': [
            'Estruturas lógicas.', 'Lógica de argumentação.', 'Lógica sentencial (proposições, tabelas-verdade).', 'Equivalências e Leis de De Morgan.', 'Diagramas lógicos.', 'Lógica de primeira ordem.', 'Operações com conjuntos.', 'Conjuntos numéricos.', 'Razões, proporções e porcentagens.', 'Regras de três simples e compostas.', 'Equações e inequações de 1º e 2º graus.', 'Sistemas lineares.', 'Funções e gráficos.', 'Princípios de contagem.'
        ],
        'Inglês': [
            'Compreensão de textos variados.', 'Domínio do vocabulário e estrutura da língua.', 'Ideias principais, secundárias, explícitas e implícitas.', 'Itens gramaticais relevantes para compreensão.', 'Formas contemporâneas da linguagem inglesa.'
        ],
        'Administração': [
            'Evolução da administração pública no Brasil.', 'Processo administrativo (Planejamento, organização, direção, controle).', 'Gestão de pessoas (Comportamento organizacional, motivação, liderança).', 'Gestão da qualidade e ciclo PDCA.', 'Gestão de processos (mapeamento, análise, melhoria).', 'Administração de recursos materiais.'
        ],
        'Direito Constitucional': [
            'Constituição: Conceito, objeto, elementos, classificações.', 'Supremacia da Constituição e aplicabilidade das normas.', 'Princípios fundamentais.', 'Direitos e deveres individuais e coletivos.', 'Habeas corpus, mandado de segurança, mandado de injunção e habeas data.', 'Direitos sociais, nacionalidade, direitos políticos.', 'Organização do Estado (político-administrativa).', 'União, estados, municípios, DF.', 'Administração pública: Disposições gerais e militares.', 'Defesa do Estado e das instituições democráticas; segurança pública.', 'Organização dos poderes e freios e contrapesos.', 'Poder Legislativo e Judiciário.'
        ],
        'Direito Administrativo': [
            'Estado, governo e administração pública.', 'Direito administrativo: conceito, objeto, fontes.', 'Regime jurídico-administrativo e princípios.', 'Ato administrativo: conceito, requisitos, atributos, espécies, extinção.', 'Poderes da administração: hierárquico, disciplinar, regulamentar, de polícia.', 'Responsabilidade civil do Estado.', 'Controle da administração pública.', 'Improbidade administrativa (Lei nº 8.429/1992).', 'Processo administrativo (Lei nº 9.784/1999).', 'Licitações e contratos (Lei nº 14.133/2021).'
        ],
        'Direito Penal': [
            'Princípios aplicáveis ao direito penal.', 'Aplicação da lei penal (tempo, espaço).', 'Ilicitude e Culpabilidade.', 'Concurso de pessoas.', 'Penas e sua cominação.', 'Ação penal e Extinção da punibilidade.', 'Prescrição.', 'Crimes contra a fé pública.', 'Crimes contra a administração pública.', 'Crimes contra a pessoa e o patrimônio.', 'Crimes contra a dignidade sexual e a incolumidade pública.'
        ],
        'Direito Processual Penal': [
            'Processo penal brasileiro e constitucional.', 'Sistemas e princípios fundamentais.', 'Aplicação da lei processual penal.', 'Inquérito policial.', 'Ação penal.', 'Prova.', 'Sujeitos do processo.', 'Prisão, medidas cautelares e liberdade provisória.', 'Prazos.', 'Nulidades.'
        ],
        'Direito Penal Militar': [
            'Aplicação da lei penal militar e Crime.', 'Imputabilidade penal e Concurso de agentes.', 'Penas: aplicação, suspensão condicional, livramento condicional.', 'Penas acessórias e Efeitos da condenação.', 'Medidas de segurança e Ação penal.', 'Extinção da punibilidade.', 'Crimes militares em tempo de paz (próprios e impróprios).'
        ],
        'Direito Processual Penal Militar': [
            'Aplicação do processo penal militar.', 'Inquérito policial militar.', 'Ação penal militar.', 'Juiz, auxiliares e partes do processo.', 'Denúncia e Competência da justiça militar.', 'Exceções e Incidentes (sanidade mental, falsidade).', 'Medidas preventivas e assecuratórias.', 'Prisão em flagrante e preventiva.', 'Citação, intimação e notificação.', 'Atos probatórios (interrogatório, confissão, perícias, testemunhas).', 'Processos em espécie (ordinário, especiais).', 'Nulidades.', 'Recursos.'
        ],
        'Legislação Extravagante': [
            'Lei de Genocídio (2.889/56) e Racismo (7.716/89).', 'Lei de Crimes Hediondos (8.072/90).', 'Lei de Crime Organizado (12.850/2013).', 'Lei de Tortura (9.455/1997).', 'Lei de Crimes Ambientais (9.605/1998).', 'Estatuto do Desarmamento (10.826/2003).', 'Lei de Drogas (11.343/2006).', 'Lei Maria da Penha (11.340/2006).', 'Código de Trânsito Brasileiro (partes específicas).', 'Estatuto da Criança e do Adolescente (partes específicas).', 'Lei de Improbidade Administrativa (8.429/1992).', 'Lei de Abuso de Autoridade (13.869/2019).', 'Lei de Prisão Temporária (7.960/1989).', 'Lei dos Juizados Especiais (9.099/95 e 10.259/2001).'
        ]
    };
    
    // --- CRONOGRAMA DE ESTUDOS ---
    const cronograma = [
        // Semana 1
        {
            semana: 1, dias: [
                { dia: "Segunda", topicos: [{ id: "lp1", m: "Língua Portuguesa", t: 0 }, { id: "dc1", m: "Direito Constitucional", t: 0 }, { id: "dc2", m: "Direito Constitucional", t: 1 }] },
                { dia: "Terça", topicos: [{ id: "da1", m: "Direito Administrativo", t: 0 }, { id: "da2", m: "Direito Administrativo", t: 1 }, { id: "rl1", m: "Raciocínio Lógico", t: 0 }] },
                { dia: "Quarta", topicos: [{ id: "lp2", m: "Língua Portuguesa", t: 1 }, { id: "dp1", m: "Direito Penal", t: 0 }, { id: "dp2", m: "Direito Penal", t: 1 }] },
                { dia: "Quinta", topicos: [{ id: "dc3", m: "Direito Constitucional", t: 2 }, { id: "dh1", m: "Direitos Humanos", t: 0 }, { id: "dpm1", m: "Direito Penal Militar", t: 0 }] },
                { dia: "Sexta", topicos: [{ id: "da3", m: "Direito Administrativo", t: 2 }, { id: "rl2", m: "Raciocínio Lógico", t: 1 }, { id: "in1", m: "Inglês", t: 0 }] },
                { dia: "Sábado", topicos: [{ id: "rev1", m: "Revisão", t: "Revisar todos os tópicos da Semana 1" }] },
            ]
        },
        // Semana 2
        {
            semana: 2, dias: [
                { dia: "Segunda", topicos: [{ id: "lp3", m: "Língua Portuguesa", t: 2 }, { id: "dc4", m: "Direito Constitucional", t: 3 }, { id: "dc5", m: "Direito Constitucional", t: 4 }] },
                { dia: "Terça", topicos: [{ id: "da4", m: "Direito Administrativo", t: 3 }, { id: "rl3", m: "Raciocínio Lógico", t: 2 }, { id: "c1", m: "Criminologia", t: 0 }] },
                { dia: "Quarta", topicos: [{ id: "lp4", m: "Língua Portuguesa", t: 3 }, { id: "dp3", m: "Direito Penal", t: 2 }, { id: "dpp1", m: "Direito Processual Penal", t: 0 }] },
                { dia: "Quinta", topicos: [{ id: "dc6", m: "Direito Constitucional", t: 5 }, { id: "dh2", m: "Direitos Humanos", t: 1 }, { id: "dppm1", m: "Direito Processual Penal Militar", t: 0 }] },
                { dia: "Sexta", topicos: [{ id: "da5", m: "Direito Administrativo", t: 4 }, { id: "le1", m: "Legislação Extravagante", t: 0 }, { id: "in2", m: "Inglês", t: 1 }] },
                { dia: "Sábado", topicos: [{ id: "rev2", m: "Revisão", t: "Revisar todos os tópicos da Semana 2 e resolver 20 questões." }] },
            ]
        },
        // Adicione mais semanas aqui...
        { semana: 3, dias: [ /* ... */ ] }, { semana: 4, dias: [ /* ... */ ] },
        { semana: 5, dias: [ /* ... */ ] }, { semana: 6, dias: [ /* ... */ ] },
        { semana: 7, dias: [ /* ... */ ] }, { semana: 8, dias: [ /* ... */ ] },
        { semana: 9, dias: [ /* ... */ ] }, { semana: 10, dias: [ /* ... */ ] },
        { semana: 11, dias: [ /* ... */ ] },
        {
            semana: 12, dias: [
                { dia: "Segunda", topicos: [{ id: "rev_final1", m: "Revisão Final", t: "Revisão geral de Português e RLM." }] },
                { dia: "Terça", topicos: [{ id: "rev_final2", m: "Revisão Final", t: "Revisão geral de Constitucional e Administrativo." }] },
                { dia: "Quarta", topicos: [{ id: "rev_final3", m: "Revisão Final", t: "Revisão geral de Penais (Comum e Militar)." }] },
                { dia: "Quinta", topicos: [{ id: "rev_final4", m: "Revisão Final", t: "Revisão geral de Processuais (Comum e Militar)." }] },
                { dia: "Sexta", topicos: [{ id: "rev_final5", m: "Revisão Final", t: "Revisão de Legislação Extravagante e Direitos Humanos." }] },
                { dia: "Sábado", topicos: [{ id: "sim1", m: "Simulado", t: "Realizar simulado final completo." }] },
            ]
        },
    ];

    // --- LÓGICA DA PÁGINA ---

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
                    if (topic.m !== 'Revisão' && topic.m !== 'Simulado' && topic.m !== 'Revisão Final') {
                        totalTopics++;
                        semanaTopics++;
                        if (progress[topic.id]) {
                            semanaCompleted++;
                        }
                    }
                    const topicText = typeof topic.t === 'number' ? edital[topic.m][topic.t] : topic.t;
                    const isCompleted = progress[topic.id] ? 'completed' : '';
                    const isChecked = progress[topic.id] ? 'checked' : '';
                    
                    return `
                        <li class="topic-item ${isCompleted}" data-id="${topic.id}">
                            <input type="checkbox" id="${topic.id}" ${isChecked}>
                            <label for="${topic.id}">
                                <span>${topicText}</span>
                                <span class="subject-tag">${topic.m}</span>
                            </label>
                        </li>`;
                }).join('');

                return `
                    <div class="day-plan">
                        <h4>${diaData.dia}</h4>
                        <ul>${diaTopics}</ul>
                    </div>`;
            }).join('');
            
            const semanaProgress = semanaTopics > 0 ? Math.round((semanaCompleted / semanaTopics) * 100) : 0;

            semanaEl.innerHTML = `
                <div class="accordion-header">
                    <h3>Semana ${semanaData.semana} <span class="progress-label-semana">(${semanaProgress}%)</span></h3>
                    <i class="fas fa-chevron-down icon"></i>
                </div>
                <div class="accordion-content">
                    ${contentHtml}
                </div>`;

            cronogramaContainer.appendChild(semanaEl);
        });
    }

    function updateCharts() {
        const completedTopics = Object.keys(progress).filter(id => !id.startsWith('rev') && !id.startsWith('sim')).length;
        const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        const geralProgressBar = document.getElementById('geral-progress-bar');
        const geralProgressLabel = document.getElementById('geral-progress-label');
        if (geralProgressBar && geralProgressLabel) {
            geralProgressBar.style.width = `${overallPercentage}%`;
            geralProgressLabel.textContent = `${overallPercentage}%`;
        }
        
        // Limpa charts antigos (exceto o geral) e redesenha
        const existingCharts = progressPanel.querySelectorAll('.chart-container:not(.overall-chart)');
        existingCharts.forEach(chart => chart.remove());

        Object.keys(edital).forEach(materia => {
            let totalMateria = 0;
            let completedMateria = 0;
            
            cronograma.forEach(s => s.dias && s.dias.forEach(d => d.topicos.forEach(t => {
                if (t.m === materia) {
                    totalMateria++;
                    if (progress[t.id]) {
                        completedMateria++;
                    }
                }
            })));

            if (totalMateria > 0) {
                const materiaPercentage = Math.round((completedMateria / totalMateria) * 100);
                const chartEl = document.createElement('div');
                chartEl.className = 'chart-container';
                chartEl.innerHTML = `
                    <h4>${materia}</h4>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${materiaPercentage}%;"></div>
                    </div>
                    <span class="progress-label">${materiaPercentage}%</span>
                `;
                progressPanel.appendChild(chartEl);
            }
        });
    }
    
    function renderTodayStudies() {
        const today = new Date();
        const dayOfWeek = today.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0].replace(/^\w/, c => c.toUpperCase());
        
        if (currentDateEl) {
            currentDateEl.textContent = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        }

        if(todayList) {
            todayList.innerHTML = '<li>Nenhum estudo agendado para hoje.</li>'; // Padrão
            
            // Lógica para encontrar a semana atual (simplificada aqui)
            // Numa app real, isso seria baseado na data de início do plano.
            // Para demonstração, vamos usar a data de hoje para encontrar a semana atual.
            // Data de início do plano:
            const startDate = new Date('2025-08-04'); // Uma segunda-feira
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
    }

    // --- EVENT LISTENERS ---
    cronogramaContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (header) {
            const item = header.parentElement;
            item.classList.toggle('active');
            // Fecha outros acordeões
            document.querySelectorAll('.accordion-item.active').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            return;
        }

        const label = e.target.closest('label');
        if (label) {
            const checkbox = document.getElementById(label.getAttribute('for'));
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                const event = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(event);
            }
        }
    });

    cronogramaContainer.addEventListener('change', (e) => {
        if(e.target.type === 'checkbox') {
            const id = e.target.id;
            const topicItem = e.target.closest('.topic-item');
            if (e.target.checked) {
                progress[id] = true;
                topicItem.classList.add('completed');
            } else {
                delete progress[id];
                topicItem.classList.remove('completed');
            }
            saveProgress();
            renderCronograma(); // Re-renderiza para atualizar a % da semana
            updateCharts();
        }
    });

    // --- INICIALIZAÇÃO ---
    renderCronograma();
    updateCharts();
    renderTodayStudies();
});