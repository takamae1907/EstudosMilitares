document.addEventListener('DOMContentLoaded', () => {

    // --- REFERÊNCIAS DO DOM ---
    const materiasGrid = document.querySelector('.materias-grid');
    const materiasView = document.getElementById('materias-view');
    const questoesView = document.getElementById('questoes-view');
    const backToMateriasBtn = document.getElementById('back-to-materias');
    const materiaTitle = document.getElementById('materia-title');
    const questionContainer = document.querySelector('.question-container');
    const answerBtn = document.getElementById('answer-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const searchInput = document.getElementById('search-materias');
    const resetBtn = document.getElementById('reset-progress-btn');


    // --- ESTADO DA APLICAÇÃO ---
    let userProgress = {};
    let currentMateriaId = null;
    let questionsForCurrentMateria = [];
    let currentQuestionIndex = 0;


    // --- FUNÇÕES DE PERSISTÊNCIA (localStorage) ---
    function loadProgress() {
        const progress = localStorage.getItem('questoesProgresso');
        userProgress = progress ? JSON.parse(progress) : {};
    }

    function saveProgress() {
        localStorage.setItem('questoesProgresso', JSON.stringify(userProgress));
    }

    function initializeProgressForMateria(materiaId) {
        if (!userProgress[materiaId]) {
            userProgress[materiaId] = {
                nome: bancoDeQuestoes[materiaId].nome,
                acertos: 0,
                erros: 0,
                resolvidas: [] // Array de índices das questões resolvidas
            };
        }
    }


    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function renderMateriasCards(filter = '') {
        materiasGrid.innerHTML = '';
        Object.keys(bancoDeQuestoes).forEach(materiaId => {
            const materia = bancoDeQuestoes[materiaId];
            if (!materia.nome.toLowerCase().includes(filter.toLowerCase())) return;

            initializeProgressForMateria(materiaId);
            const progresso = userProgress[materiaId];
            const totalQuestoes = materia.questoes.length;

            const card = document.createElement('div');
            card.className = 'materia-card';
            card.dataset.id = materiaId;
            card.innerHTML = `
                <i class="fa-solid ${materia.icon}"></i>
                <h3>${materia.nome}</h3>
                <p>Resolvidas: ${progresso.resolvidas.length} / ${totalQuestoes}</p>
                <div class="progress-bar-materia">
                    <div class="progress-materia" style="width: ${(progresso.resolvidas.length / totalQuestoes) * 100}%"></div>
                </div>
            `;
            card.addEventListener('click', () => startQuiz(materiaId));
            materiasGrid.appendChild(card);
        });
    }

    function renderRightSidebarStats() {
        const geralStatsContainer = document.getElementById('geral-stats');
        const maisErrosList = document.getElementById('mais-erros-list');
        const maisAcertosList = document.getElementById('mais-acertos-list');

        let totalAcertos = 0, totalErros = 0;
        const materiasArray = Object.values(userProgress);

        materiasArray.forEach(m => {
            totalAcertos += m.acertos;
            totalErros += m.erros;
        });
        const totalResolvidas = totalAcertos + totalErros;
        const aproveitamento = totalResolvidas > 0 ? ((totalAcertos / totalResolvidas) * 100).toFixed(0) : 0;

        geralStatsContainer.innerHTML = `
            <div class="stat-item"><span>Total de Acertos</span><strong class="acertos">${totalAcertos}</strong></div>
            <div class="stat-item"><span>Total de Erros</span><strong class="erros">${totalErros}</strong></div>
            <div class="stat-item aproveitamento"><span>Aproveitamento Geral</span><strong>${aproveitamento}%</strong></div>
        `;

        // Renderiza listas
        const renderList = (listElement, dataArray, key) => {
            listElement.innerHTML = '';
            dataArray.sort((a, b) => b[key] - a[key]) // Ordena decrescente
                .slice(0, 3) // Pega os top 3
                .forEach(item => {
                    if (item[key] > 0) {
                        const li = document.createElement('li');
                        li.innerHTML = `<span>${item.nome}</span><strong>${item[key]}</strong>`;
                        listElement.appendChild(li);
                    }
                });
        };

        renderList(maisErrosList, [...materiasArray], 'erros');
        renderList(maisAcertosList, [...materiasArray], 'acertos');
    }

    function displayQuestion() {
        const questao = questionsForCurrentMateria[currentQuestionIndex];
        questionContainer.innerHTML = `
            <p class="enunciado"><strong>Q:</strong> ${questao.enunciado}</p>
            <ul class="alternativas">
                ${questao.alternativas.map((alt, i) => `
                    <li data-index="${i}">
                        <label for="alt-${i}">${String.fromCharCode(65 + i)}) ${alt}</label>
                        <input type="radio" name="alternativa" id="alt-${i}" value="${i}">
                    </li>
                `).join('')}
            </ul>
        `;
        answerBtn.classList.remove('hidden');
        nextQuestionBtn.classList.add('hidden');
        document.querySelectorAll('.alternativas li').forEach(li => {
            li.addEventListener('click', () => {
                document.querySelectorAll('.alternativas li').forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');
                li.querySelector('input').checked = true;
            });
        });
    }

    // --- LÓGICA DO QUIZ ---
    function startQuiz(materiaId) {
        currentMateriaId = materiaId;
        const progresso = userProgress[materiaId];
        const todasQuestoes = bancoDeQuestoes[materiaId].questoes;

        // Filtra para pegar apenas as questões NÃO resolvidas
        questionsForCurrentMateria = todasQuestoes.map((q, i) => ({ ...q, originalIndex: i }))
            .filter(q => !progresso.resolvidas.includes(q.originalIndex));
        
        if (questionsForCurrentMateria.length === 0) {
            alert('Parabéns! Você já respondeu todas as questões desta matéria. Zere o progresso para tentar novamente.');
            return;
        }

        currentQuestionIndex = 0;
        materiasView.classList.add('hidden');
        questoesView.classList.remove('hidden');
        materiaTitle.textContent = bancoDeQuestoes[materiaId].nome;
        displayQuestion();
    }

    function checkAnswer() {
        const selectedRadio = document.querySelector('input[name="alternativa"]:checked');
        if (!selectedRadio) { alert('Selecione uma alternativa.'); return; }

        const selectedIndex = parseInt(selectedRadio.value);
        const questaoAtual = questionsForCurrentMateria[currentQuestionIndex];
        const correctAnswerIndex = questaoAtual.respostaCorreta;

        const alternativasLis = document.querySelectorAll('.alternativas li');
        alternativasLis.forEach(li => li.style.pointerEvents = 'none');

        const progresso = userProgress[currentMateriaId];
        progresso.resolvidas.push(questaoAtual.originalIndex);

        if (selectedIndex === correctAnswerIndex) {
            alternativasLis[selectedIndex].classList.add('correct');
            progresso.acertos++;
        } else {
            alternativasLis[selectedIndex].classList.add('incorrect');
            alternativasLis[correctAnswerIndex].classList.add('correct');
            progresso.erros++;
        }

        saveProgress();
        renderRightSidebarStats();
        
        answerBtn.classList.add('hidden');
        nextQuestionBtn.classList.remove('hidden');
        if (currentQuestionIndex >= questionsForCurrentMateria.length - 1) {
            nextQuestionBtn.textContent = 'Finalizar';
        }
    }


    // --- EVENT LISTENERS ---
    backToMateriasBtn.addEventListener('click', () => {
        questoesView.classList.add('hidden');
        materiasView.classList.remove('hidden');
        nextQuestionBtn.textContent = 'Próxima';
        renderMateriasCards(); // Atualiza os cards com o novo progresso
    });

    answerBtn.addEventListener('click', checkAnswer);

    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questionsForCurrentMateria.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            backToMateriasBtn.click();
        }
    });

    searchInput.addEventListener('input', (e) => renderMateriasCards(e.target.value));

    resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja apagar todo o seu progresso? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('questoesProgresso');
            init();
        }
    });

    // --- INICIALIZAÇÃO ---
    function init() {
        loadProgress();
        renderMateriasCards();
        renderRightSidebarStats();
    }

    init();
});
// BANCO DE DADOS DE QUESTÕES
// Adicione quantas matérias e questões quiser aqui.
// BANCO DE DADOS DE QUESTÕES
// Adicione quantas matérias e questões quiser aqui.
const bancoDeQuestoes = {
    "direito-constitucional": {
        nome: "Direito Constitucional",
        icon: "fa-gavel",
        questoes: [
            {
                enunciado: "Qual dos seguintes NÃO é um fundamento da República Federativa do Brasil, segundo a Constituição?",
                alternativas: ["Soberania", "Cidadania", "Pluralismo político", "Objetivos do desenvolvimento nacional"],
                respostaCorreta: 3
            },
            {
                enunciado: "A quem compete privativamente legislar sobre direito civil, comercial e penal?",
                alternativas: ["Aos Estados", "Aos Municípios", "À União", "Ao Distrito Federal"],
                respostaCorreta: 2
            },
            {
                enunciado: "O Habeas Corpus é o remédio constitucional cabível para proteger qual direito?",
                alternativas: ["Direito à informação", "Direito de locomoção", "Direito de petição", "Anular ato lesivo ao patrimônio público"],
                respostaCorreta: 1
            }
        ]
    },
    "lingua-portuguesa": {
        nome: "Língua Portuguesa",
        // --- LINHA CORRIGIDA ---
        icon: "fa-book", 
        questoes: [
            {
                enunciado: "Na frase 'A casa, que era antiga, foi demolida', a oração destacada é:",
                alternativas: ["Subordinada Adjetiva Restritiva", "Subordinada Adjetiva Explicativa", "Coordenada Sindética Explicativa", "Subordinada Substantiva Apositiva"],
                respostaCorreta: 1
            },
            {
                enunciado: "Qual palavra é acentuada pela mesma regra de 'história'?",
                alternativas: ["Saída", "Herói", "Relógio", "País"],
                respostaCorreta: 2
            },
             {
                enunciado: "Assinale a alternativa em que o uso da crase está INCORRETO:",
                alternativas: ["Fui à Bahia no verão.", "Refiro-me àquele aluno.", "Ele escreve à lápis.", "A reunião será às três horas."],
                respostaCorreta: 2
            }
        ]
    },
    "raciocinio-logico": {
        nome: "Raciocínio Lógico",
        icon: "fa-brain",
        questoes: [
            {
                enunciado: "A negação da proposição 'Todo homem é mortal' é:",
                alternativas: ["Nenhum homem é mortal", "Todo homem é imortal", "Existe pelo menos um homem que não é mortal", "Existe pelo menos um homem que é mortal"],
                respostaCorreta: 2
            },
            {
                enunciado: "Se Ana é mais alta que Bia, e Bia é mais alta que Carla, qual a relação entre Ana e Carla?",
                alternativas: ["Carla é mais alta que Ana", "Ana é mais baixa que Carla", "Ana tem a mesma altura que Carla", "Ana é mais alta que Carla"],
                respostaCorreta: 3
            }
        ]
    },
    "direito-penal": {
        nome: "Direito Penal",
        icon: "fa-balance-scale",
        questoes: [
            {
                enunciado: "O crime de homicídio é classificado como um crime contra:",
                alternativas: ["A honra", "O patrimônio", "A vida", "A administração pública"],
                respostaCorreta: 2
            },
            {
                enunciado: "Agir em legítima defesa é uma causa de exclusão de:",
                alternativas: ["Tipicidade", "Ilicitude", "Culpabilidade", "Punibilidade"],
                respostaCorreta: 1
            }
        ]
    }
};