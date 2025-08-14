document.addEventListener('DOMContentLoaded', () => {
    // --- DADOS DE EXEMPLO (Simulando um banco de dados) ---
    const materias = [
        {
            nome: 'Direito Constitucional',
            icon: 'fa-gavel',
            questoes: [
                {
                    enunciado: 'Qual dos seguintes NÃO é um fundamento da República Federativa do Brasil, segundo a Constituição?',
                    alternativas: ['Soberania', 'Cidadania', 'Pluralismo político', 'Objetivos do desenvolvimento nacional'],
                    respostaCorreta: 3
                },
                {
                    enunciado: 'A quem compete privativamente legislar sobre direito civil, comercial e penal?',
                    alternativas: ['Aos Estados', 'Aos Municípios', 'À União', 'Ao Distrito Federal'],
                    respostaCorreta: 2
                }
            ]
        },
        {
            nome: 'Língua Portuguesa',
            icon: 'fa-book-closed',
            questoes: [
                {
                    enunciado: 'Qual a classificação da oração "É preciso que todos estudem"?',
                    alternativas: ['Oração Subordinada Substantiva Objetiva Direta', 'Oração Subordinada Substantiva Subjetiva', 'Oração Coordenada Sindética Explicativa', 'Oração Subordinada Adverbial Condicional'],
                    respostaCorreta: 1
                },
                {
                    enunciado: 'A palavra "gato" é classificada como:',
                    alternativas: ['Proparoxítona', 'Paroxítona', 'Oxítona', 'Monossílabo tônico'],
                    respostaCorreta: 1
                }
            ]
        },
        {
            nome: 'Raciocínio Lógico',
            icon: 'fa-brain',
            questoes: [
                {
                    enunciado: 'Se todo A é B, e todo B é C, então podemos concluir que:',
                    alternativas: ['Todo C é A', 'Nenhum A é C', 'Todo A é C', 'Algum A não é C'],
                    respostaCorreta: 2
                }
            ]
        }
        // Adicione mais matérias aqui
    ];

    // --- REFERÊNCIAS DO DOM ---
    const materiasView = document.getElementById('materias-view');
    const materiasGrid = document.querySelector('.materias-grid');
    const questoesView = document.getElementById('questoes-view');
    const backToMateriasBtn = document.getElementById('back-to-materias');
    const materiaTitle = document.getElementById('materia-title');
    const questionContainer = document.querySelector('.question-container');
    const answerBtn = document.getElementById('answer-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    let currentMateria = null;
    let currentQuestionIndex = 0;
    let questionsForCurrentMateria = [];
    let stats = { resolvidas: 0, acertos: 0, erros: 0 };

    // --- FUNÇÕES PRINCIPAIS ---

    // 1. Renderiza os cards das matérias na tela inicial
    function renderMaterias() {
        materiasGrid.innerHTML = '';
        materias.forEach((materia, index) => {
            const card = document.createElement('div');
            card.className = 'materia-card';
            card.dataset.index = index;
            card.innerHTML = `
                <i class="fa-solid ${materia.icon}"></i>
                <h3>${materia.nome}</h3>
                <p>${materia.questoes.length} questões disponíveis</p>
            `;
            card.addEventListener('click', () => startQuiz(index));
            materiasGrid.appendChild(card);
        });
    }

    // 2. Inicia o "quiz" para uma matéria selecionada
    function startQuiz(materiaIndex) {
        currentMateria = materias[materiaIndex];
        questionsForCurrentMateria = currentMateria.questoes;
        currentQuestionIndex = 0;

        materiasView.classList.add('hidden');
        questoesView.classList.remove('hidden');
        materiaTitle.textContent = currentMateria.nome;

        displayQuestion();
    }

    // 3. Mostra a questão atual na tela
    function displayQuestion() {
        const questao = questionsForCurrentMateria[currentQuestionIndex];
        questionContainer.innerHTML = `
            <p class="enunciado"><strong>Q${currentQuestionIndex + 1}:</strong> ${questao.enunciado}</p>
            <ul class="alternativas">
                ${questao.alternativas.map((alt, i) => `
                    <li data-index="${i}">
                        <input type="radio" name="alternativa" id="alt-${i}" value="${i}">
                        <label for="alt-${i}">${alt}</label>
                    </li>
                `).join('')}
            </ul>
        `;
        answerBtn.classList.remove('hidden', 'disabled');
        nextQuestionBtn.classList.add('hidden');
        
        // Adiciona evento de clique para selecionar o radio ao clicar no LI
        document.querySelectorAll('.alternativas li').forEach(li => {
            li.addEventListener('click', () => {
                li.querySelector('input[type="radio"]').checked = true;
                document.querySelectorAll('.alternativas li').forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');
            });
        });
    }

    // 4. Verifica a resposta do usuário
    function checkAnswer() {
        const selectedRadio = document.querySelector('input[name="alternativa"]:checked');
        if (!selectedRadio) {
            alert('Por favor, selecione uma alternativa.');
            return;
        }

        const selectedIndex = parseInt(selectedRadio.value);
        const correctAnswerIndex = questionsForCurrentMateria[currentQuestionIndex].respostaCorreta;
        const alternativasLis = document.querySelectorAll('.alternativas li');

        // Mostra a resposta correta e a incorreta (se houver)
        alternativasLis.forEach((li, index) => {
            if (index === correctAnswerIndex) {
                li.classList.add('correct');
            }
            if (index === selectedIndex && selectedIndex !== correctAnswerIndex) {
                li.classList.add('incorrect');
            }
            // Desabilita cliques futuros
            li.style.pointerEvents = 'none';
        });

        // Atualiza estatísticas
        stats.resolvidas++;
        if (selectedIndex === correctAnswerIndex) {
            stats.acertos++;
        } else {
            stats.erros++;
        }
        updateStats();

        // Prepara para a próxima questão
        answerBtn.classList.add('hidden');
        if (currentQuestionIndex < questionsForCurrentMateria.length - 1) {
            nextQuestionBtn.classList.remove('hidden');
        } else {
            // Fim do quiz
            nextQuestionBtn.textContent = 'Finalizar';
            nextQuestionBtn.classList.remove('hidden');
        }
    }

    // 5. Atualiza o widget de estatísticas
    function updateStats() {
        document.getElementById('stat-resolvidas').textContent = stats.resolvidas;
        document.getElementById('stat-acertos').textContent = stats.acertos;
        document.getElementById('stat-erros').textContent = stats.erros;
        const aproveitamento = stats.resolvidas > 0 ? ((stats.acertos / stats.resolvidas) * 100).toFixed(0) : 0;
        document.getElementById('stat-aproveitamento').textContent = `${aproveitamento}%`;
    }

    // --- EVENT LISTENERS ---
    backToMateriasBtn.addEventListener('click', () => {
        questoesView.classList.add('hidden');
        materiasView.classList.remove('hidden');
    });

    answerBtn.addEventListener('click', checkAnswer);

    nextQuestionBtn.addEventListener('click', () => {
        if (nextQuestionBtn.textContent === 'Finalizar') {
            backToMateriasBtn.click(); // Volta para a tela de matérias
            nextQuestionBtn.textContent = 'Próxima'; // Reseta o botão
        } else {
            currentQuestionIndex++;
            displayQuestion();
        }
    });

    // Inicialização da página
    renderMaterias();
});
