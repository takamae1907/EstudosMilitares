document.addEventListener('DOMContentLoaded', () => {

    // --- ESTRUTURA DE DADOS E VARIÁVEIS ---
    let decks = [];
    let activeDeck = null;
    let currentCardIndex = 0;

    // --- REFERÊNCIAS AOS ELEMENTOS DO DOM ---
    const deckSelectionView = document.getElementById('deck-selection-view');
    const flashcardViewerView = document.getElementById('flashcard-viewer-view');
    const deckGrid = document.getElementById('deck-grid');
    const addDeckBtn = document.getElementById('add-deck-btn');
    
    // Elementos do Viewer
    const flashcard = document.getElementById('flashcard');
    const deckTitle = document.getElementById('deck-title');
    const cardQuestion = document.getElementById('card-question');
    const cardAnswer = document.getElementById('card-answer');
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    const cardCounter = document.getElementById('card-counter');
    const backToDecksBtn = document.getElementById('back-to-decks-btn');
    const addFlashcardBtn = document.getElementById('add-flashcard-btn');

    // Elementos dos Modais
    const addDeckModal = document.getElementById('add-deck-modal');
    const addDeckForm = document.getElementById('add-deck-form');
    const addFlashcardModal = document.getElementById('add-flashcard-modal');
    const addFlashcardForm = document.getElementById('add-flashcard-form');

    // --- FUNÇÕES DE DADOS (LocalStorage) ---

    function loadDecks() {
        const savedDecks = localStorage.getItem('flashcardDecks');
        if (savedDecks) {
            decks = JSON.parse(savedDecks);
        } else {
            // Dados de exemplo para o primeiro uso
            decks = [{
                id: Date.now(),
                title: "Exemplo: Direito Constitucional",
                cards: [
                    { question: "Qual o objetivo da RFB que busca construir uma sociedade livre, justa e solidária?", answer: "É o Inciso I do Art. 3º da CF." },
                    { question: "Quando é permitido entrar na casa de alguém sem consentimento, durante a noite?", answer: "Apenas em flagrante delito, desastre, ou para prestar socorro." }
                ]
            }];
        }
    }

    function saveDecks() {
        localStorage.setItem('flashcardDecks', JSON.stringify(decks));
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO E VISUALIZAÇÃO ---

    function renderDecks() {
        deckGrid.innerHTML = '';
        
        decks.forEach(deck => {
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.dataset.deckId = deck.id;
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="icon"><i class="fa-solid fa-layer-group"></i></span>
                    <button class="delete-btn" title="Apagar baralho" data-deck-id="${deck.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <div class="card-content">
                    <h2>${deck.title}</h2>
                    <p>${deck.cards.length} card(s)</p>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    showFlashcardView(deck.id);
                }
            });

            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza que deseja apagar o baralho "${deck.title}"?`)) {
                    deleteDeck(deck.id);
                }
            });

            deckGrid.appendChild(card);
        });
    }

    function showDeckSelectionView() {
        flashcardViewerView.classList.add('hidden');
        deckSelectionView.classList.remove('hidden');
        activeDeck = null;
        renderDecks();
    }

    function showFlashcardView(deckId) {
        const deck = decks.find(d => d.id == deckId);
        if (!deck) return;

        activeDeck = deck;
        currentCardIndex = 0;
        deckTitle.textContent = activeDeck.title;
        
        deckSelectionView.classList.add('hidden');
        flashcardViewerView.classList.remove('hidden');
        
        displayCurrentCard();
    }

    function displayCurrentCard() {
        flashcard.classList.remove('is-flipped');

        if (!activeDeck || activeDeck.cards.length === 0) {
            cardQuestion.textContent = "Este baralho está vazio.";
            cardAnswer.textContent = "Adicione um novo card para começar!";
            cardCounter.textContent = "0 / 0";
        } else {
            const card = activeDeck.cards[currentCardIndex];
            cardQuestion.textContent = card.question;
            cardAnswer.textContent = card.answer;
            cardCounter.textContent = `${currentCardIndex + 1} / ${activeDeck.cards.length}`;
        }
    }
    
    // --- FUNÇÕES DE MODAIS E AÇÕES ---
    function openModal(modal) { modal.classList.remove('hidden'); }
    function closeModal(modal) { modal.classList.add('hidden'); }
    
    function deleteDeck(deckId) {
        decks = decks.filter(d => d.id !== deckId);
        saveDecks();
        renderDecks();
    }

    // --- LÓGICA DE EVENTOS ---
    
    flashcard.addEventListener('click', () => flashcard.classList.toggle('is-flipped'));
    nextButton.addEventListener('click', () => {
        if (activeDeck && activeDeck.cards.length > 0) {
            currentCardIndex = (currentCardIndex + 1) % activeDeck.cards.length;
            displayCurrentCard();
        }
    });
    prevButton.addEventListener('click', () => {
        if (activeDeck && activeDeck.cards.length > 0) {
            currentCardIndex = (currentCardIndex - 1 + activeDeck.cards.length) % activeDeck.cards.length;
            displayCurrentCard();
        }
    });

    backToDecksBtn.addEventListener('click', showDeckSelectionView);
    addFlashcardBtn.addEventListener('click', () => openModal(addFlashcardModal));
    addDeckBtn.addEventListener('click', () => openModal(addDeckModal));

    [addDeckModal, addFlashcardModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('cancel-btn')) {
                closeModal(modal);
            }
        });
    });

    addDeckForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('new-deck-title');
        if (titleInput.value.trim()) {
            decks.push({ id: Date.now(), title: titleInput.value.trim(), cards: [] });
            saveDecks();
            renderDecks();
            titleInput.value = '';
            closeModal(addDeckModal);
        }
    });

    addFlashcardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const questionInput = document.getElementById('new-card-question');
        const answerInput = document.getElementById('new-card-answer');
        if (questionInput.value.trim() && answerInput.value.trim() && activeDeck) {
            activeDeck.cards.push({ question: questionInput.value.trim(), answer: answerInput.value.trim() });
            saveDecks();
            currentCardIndex = activeDeck.cards.length - 1;
            displayCurrentCard();
            questionInput.value = '';
            answerInput.value = '';
            closeModal(addFlashcardModal);
        }
    });
    
    // --- INICIALIZAÇÃO ---
    loadDecks();
    showDeckSelectionView();
});