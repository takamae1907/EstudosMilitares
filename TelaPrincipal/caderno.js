document.addEventListener('DOMContentLoaded', () => {
    const editablePage = document.getElementById('editable-page');
    const addBlockButton = document.getElementById('add-block-button');
    const addBlockMenu = document.getElementById('add-block-menu');
    const mainContent = document.querySelector('.main-content');

    let currentBlock = null; // Bloco atualmente em foco ou hover

    // --- FUNÇÕES DE CRIAÇÃO DE BLOCOS ---

    function createBlock(type, content = '') {
        let block;
        switch (type) {
            case 'h1':
                block = document.createElement('h1');
                block.textContent = content;
                break;
            case 'todo':
                return createTodoBlock(false, content);
            // NOVO: Caso para o bloco de link de página
            case 'page-link':
                return createPageLinkBlock('fa-solid fa-file-lines', content || 'Nova Página');
            case 'p':
            default:
                block = document.createElement('p');
                block.textContent = content;
        }
        
        block.classList.add('block');
        block.setAttribute('contenteditable', 'true');
        block.setAttribute('data-placeholder', 'Digite para continuar...');
        return block;
    }
    
    // NOVO: Função para criar o bloco de link de página
    function createPageLinkBlock(iconClass, content) {
        const link = document.createElement('a');
        link.classList.add('block', 'page-link-block');
        // link.href = '#'; // Pode adicionar um link real aqui no futuro

        const icon = document.createElement('i');
        icon.className = iconClass;

        const textSpan = document.createElement('span');
        textSpan.setAttribute('contenteditable', 'true');
        textSpan.textContent = content;

        link.appendChild(icon);
        link.appendChild(textSpan);
        return link;
    }

    function createTodoBlock(isChecked = false, content = '') {
        // ... (código da função createTodoBlock continua o mesmo)
    }

    function insertBlock(type, targetBlock) {
        const newBlock = createBlock(type);
        targetBlock.parentNode.insertBefore(newBlock, targetBlock.nextSibling);
        
        const focusable = newBlock.querySelector('[contenteditable="true"]') || newBlock;
        if (focusable) {
            focusable.focus();
        }
        hideMenu();
    }

    // --- LÓGICA DO BOTÃO E MENU FLUTUANTE ---

    function showMenu() {
        const rect = addBlockButton.getBoundingClientRect();
        addBlockMenu.style.left = `${rect.left}px`;
        addBlockMenu.style.top = `${rect.bottom + 5}px`;
        addBlockMenu.classList.remove('hidden');
    }

    function hideMenu() {
        addBlockMenu.classList.add('hidden');
    }
    
    // Ajusta a posição do botão '+'
    editablePage.addEventListener('pointerover', (e) => {
        const targetBlock = e.target.closest('.block');
        if (targetBlock && targetBlock !== currentBlock) {
            currentBlock = targetBlock;
            const blockRect = targetBlock.getBoundingClientRect();
            const mainRect = mainContent.getBoundingClientRect();
            
            addBlockButton.style.top = `${blockRect.top - mainRect.top + mainContent.scrollTop}px`;
            addBlockButton.classList.remove('hidden');
        }
    });

    addBlockButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showMenu();
    });

    addBlockMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const button = e.target.closest('button');
        if (button) {
            const blockType = button.dataset.blockType;
            if (currentBlock) {
                insertBlock(blockType, currentBlock);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!addBlockMenu.contains(e.target)) {
            hideMenu();
        }
    });

    // --- LÓGICA AVANÇADA DO EDITOR ---
    editablePage.addEventListener('keydown', (e) => {
        // ... (código do keydown continua o mesmo)
    });
});