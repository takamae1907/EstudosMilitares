document.addEventListener('DOMContentLoaded', () => {
    const addNotebookBtn = document.getElementById('add-notebook-btn');
    const modal = document.getElementById('add-notebook-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const addNotebookForm = document.getElementById('add-notebook-form');
    const notebookNameInput = document.getElementById('notebook-name-input');
    const notebooksGrid = document.getElementById('notebooks-grid');

    let notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];

    const saveNotebooks = () => {
        localStorage.setItem('notebooks', JSON.stringify(notebooks));
    };

    const renderNotebooks = () => {
        notebooksGrid.innerHTML = '';
        if (notebooks.length === 0) {
            notebooksGrid.innerHTML = `<p style="color: #8a8a8e;">Você ainda não tem cadernos. Clique em "Adicionar Caderno" para começar!</p>`;
            return;
        }

        notebooks.forEach(notebook => {
            const card = document.createElement('div');
            card.className = 'notebook-card';
            const lastModifiedDate = new Date(notebook.lastModified).toLocaleDateString('pt-BR');

            // --- ESTRUTURA DO CARD CORRIGIDA ---
            card.innerHTML = `
                <div class="card-top">
                    <a href="pagina_caderno.html?id=${notebook.id}" style="text-decoration:none; color:inherit; flex-grow: 1;">
                        <div class="notebook-card-header">
                            <i class="fa-solid fa-book-bookmark icon"></i>
                            <h3>${notebook.name}</h3>
                        </div>
                    </a>
                    <button class="delete-notebook-btn" data-id="${notebook.id}" title="Deletar caderno">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <a href="pagina_caderno.html?id=${notebook.id}" class="card-link-wrapper">
                    <div class="notebook-card-footer">
                        <p>Última alteração: ${lastModifiedDate}</p>
                    </div>
                </a>
            `;
            notebooksGrid.appendChild(card);
        });
    };

    notebooksGrid.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-notebook-btn');
        if (deleteButton) {
            const notebookId = deleteButton.dataset.id;
            const notebookToDelete = notebooks.find(n => n.id == notebookId);
            if (confirm(`Tem certeza que deseja deletar o caderno "${notebookToDelete.name}"? Todo o conteúdo dele será perdido.`)) {
                notebooks = notebooks.filter(n => n.id != notebookId);
                localStorage.removeItem(`notebook_content_${notebookId}`);
                saveNotebooks();
                renderNotebooks();
            }
        }
    });

    addNotebookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const notebookName = notebookNameInput.value.trim();
        if (notebookName) {
            const newNotebook = {
                id: Date.now(),
                name: notebookName,
                lastModified: new Date().toISOString()
            };
            notebooks.unshift(newNotebook);
            saveNotebooks();
            renderNotebooks();
            notebookNameInput.value = '';
            modal.classList.remove('visible');
        }
    });

    addNotebookBtn.addEventListener('click', () => modal.classList.add('visible'));
    cancelBtn.addEventListener('click', () => modal.classList.remove('visible'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('visible');
    });

    renderNotebooks();
});