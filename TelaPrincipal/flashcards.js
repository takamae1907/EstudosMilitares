document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DE EXEMPLO PARA OS FLASHCARDS ---
    // No futuro, isso pode vir de um banco de dados ou API.
    const flashcardsData = [
        { 
            question: "Qual o objetivo fundamental da República Federativa do Brasil que busca construir uma sociedade livre, justa e solidária?", 
            answer: "É o Inciso I do Art. 3º da Constituição Federal. Os outros objetivos são: garantir o desenvolvimento nacional, erradicar a pobreza e a marginalização, e promover o bem de todos." 
        },
        { 
            question: "A casa é asilo inviolável do indivíduo. Em qual situação é permitido entrar nela sem consentimento do morador, durante a noite?", 
            answer: "Durante a noite, apenas em caso de flagrante delito ou desastre, ou para prestar socorro. Com determinação judicial, o ingresso só é permitido durante o dia."
        },
        { 
            question: "Todos podem reunir-se pacificamente, sem armas, em locais abertos ao público. O que é necessário para exercer esse direito?", 
            answer: "Não é necessária autorização, mas apenas prévio aviso à autoridade competente para que não frustre outra reunião anteriormente convocada para o mesmo local." 
        },
        { 
            question: "O que significa o princípio da 'anterioridade da lei penal'?", 
            answer: "Significa que 'não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal'. (Art. 5º, XXXIX)" 
        },
        { 
            question: "A criação de associações e, na forma da lei, a de cooperativas independem de autorização. O que é vedado?", 
            answer: "É vedada a interferência estatal em seu funcionamento." 
        }
    ];

    // --- REFERÊNCIAS AOS ELEMENTOS DO DOM ---
    const flashcard = document.getElementById('flashcard');
    const cardQuestion = document.getElementById('card-question');
    const cardAnswer = document.getElementById('card-answer');
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    const cardCounter = document.getElementById('card-counter');

    let currentCardIndex = 0;

    // --- FUNÇÕES ---

    /**
     * Exibe o card no índice especificado.
     * @param {number} index - O índice do card a ser mostrado.
     */
    function showCard(index) {
        // Garante que o card esteja sempre virado para a frente ao carregar
        flashcard.classList.remove('is-flipped');

        // Atualiza o conteúdo da pergunta e da resposta
        cardQuestion.textContent = flashcardsData[index].question;
        cardAnswer.textContent = flashcardsData[index].answer;

        // Atualiza o contador
        cardCounter.textContent = `${index + 1} / ${flashcardsData.length}`;
    }

    /**
     * Vira o card para mostrar a frente ou o verso.
     */
    function flipCard() {
        flashcard.classList.toggle('is-flipped');
    }

    /**
     * Mostra o próximo card na lista.
     */
    function showNextCard() {
        // Incrementa o índice. Se chegar ao fim, volta para o início (loop).
        currentCardIndex = (currentCardIndex + 1) % flashcardsData.length;
        showCard(currentCardIndex);
    }

    /**
     * Mostra o card anterior na lista.
     */
    function showPrevCard() {
        // Decrementa o índice. Se passar do início, vai para o fim (loop).
        if (currentCardIndex === 0) {
            currentCardIndex = flashcardsData.length - 1;
        } else {
            currentCardIndex--;
        }
        showCard(currentCardIndex);
    }

    // --- EVENT LISTENERS ---

    // Virar o card ao clicar nele
    flashcard.addEventListener('click', flipCard);

    // Navegar para o próximo card
    nextButton.addEventListener('click', showNextCard);

    // Navegar para o card anterior
    prevButton.addEventListener('click', showPrevCard);

    // --- INICIALIZAÇÃO ---
    // Mostra o primeiro card assim que a página carrega
    showCard(currentCardIndex);

});