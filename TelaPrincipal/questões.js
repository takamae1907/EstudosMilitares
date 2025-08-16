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
    const searchInput = document.getElementById('search-materias');

    let currentMateria = null;
    let currentQuestionIndex = 0;
    let questionsForCurrentMateria = [];
    let stats = { resolvidas: 0, acertos: 0, erros: 0 };

    // --- FUNÇÕES PRINCIPAIS ---

    function renderMaterias(filter = '') {
        materiasGrid.innerHTML = '';
        const filteredMaterias = materias.filter(materia => 
            materia.nome.toLowerCase().includes(filter.toLowerCase())
        );

        filteredMaterias.forEach((materia, originalIndex) => {
            const card = document.createElement('div');
            card.className = 'materia-card';
            // Usamos o índice do array original para encontrar a matéria correta depois
            card.dataset.index = materias.indexOf(materia);
            card.innerHTML = `
                <i class="fa-solid ${materia.icon}"></i>
                <h3>${materia.nome}</h3>
                <p>${materia.questoes.length} questões disponíveis</p>
            `;
            card.addEventListener('click', () => startQuiz(materias.indexOf(materia)));
            materiasGrid.appendChild(card);
        });
    }

    function startQuiz(materiaIndex) {
        currentMateria = materias[materiaIndex];
        questionsForCurrentMateria = [...currentMateria.questoes]; // Cria uma cópia para não alterar a original
        currentQuestionIndex = 0;

        materiasView.classList.add('hidden');
        questoesView.classList.remove('hidden');
        materiaTitle.textContent = currentMateria.nome;

        displayQuestion();
    }

    function displayQuestion() {
        const questao = questionsForCurrentMateria[currentQuestionIndex];
        questionContainer.innerHTML = `
            <p class="enunciado"><strong>Q${currentQuestionIndex + 1}:</strong> ${questao.enunciado}</p>
            <ul class="alternativas">
                ${questao.alternativas.map((alt, i) => `
                    <li data-index="${i}">
                        <label for="alt-${i}">${alt}</label>
                        <input type="radio" name="alternativa" id="alt-${i}" value="${i}">
                    </li>
                `).join('')}
            </ul>
        `;
        answerBtn.classList.remove('hidden');
        nextQuestionBtn.classList.add('hidden');
        
        document.querySelectorAll('.alternativas li').forEach(li => {
            li.addEventListener('click', (e) => {
                // Impede que o clique seja processado duas vezes
                if (e.target.tagName === 'INPUT') return; 

                // Desmarca todos os outros e marca o clicado
                document.querySelectorAll('.alternativas li').forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');
                li.querySelector('input[type="radio"]').checked = true;
            });
        });
    }

    function checkAnswer() {
        const selectedRadio = document.querySelector('input[name="alternativa"]:checked');
        if (!selectedRadio) {
            alert('Por favor, selecione uma alternativa.');
            return;
        }

        const selectedIndex = parseInt(selectedRadio.value);
        const correctAnswerIndex = questionsForCurrentMateria[currentQuestionIndex].respostaCorreta;
        const alternativasLis = document.querySelectorAll('.alternativas li');

        alternativasLis.forEach((li) => {
            li.style.pointerEvents = 'none'; // Desabilita cliques
            li.classList.remove('selected');
            const index = parseInt(li.dataset.index);
            if (index === correctAnswerIndex) {
                li.classList.add('correct');
            } else if (index === selectedIndex) {
                li.classList.add('incorrect');
            }
        });

        stats.resolvidas++;
        if (selectedIndex === correctAnswerIndex) {
            stats.acertos++;
        } else {
            stats.erros++;
        }
        updateStats();

        answerBtn.classList.add('hidden');
        if (currentQuestionIndex < questionsForCurrentMateria.length - 1) {
            nextQuestionBtn.classList.remove('hidden');
            nextQuestionBtn.textContent = 'Próxima';
        } else {
            nextQuestionBtn.textContent = 'Finalizar';
            nextQuestionBtn.classList.remove('hidden');
        }
    }

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
        nextQuestionBtn.textContent = 'Próxima';
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

    searchInput.addEventListener('input', (e) => {
        renderMaterias(e.target.value);
    });

    // Inicialização
    renderMaterias();
});