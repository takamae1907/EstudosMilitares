document.addEventListener('DOMContentLoaded', () => {
    const notebookTitleEl = document.getElementById('notebook-title');
    const editorEl = document.getElementById('editor');
    const saveBtn = document.getElementById('save-btn');
    const saveStatusEl = document.getElementById('save-status');

    let notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];
    let currentNotebookId = null;
    let saveTimeout;

    // Pega o ID do caderno pela URL
    const params = new URLSearchParams(window.location.search);
    currentNotebookId = params.get('id');

    if (!currentNotebookId) {
        alert('Caderno não encontrado!');
        window.location.href = 'cadernos.html';
        return;
    }

    // Carrega o nome e o conteúdo do caderno
    const currentNotebook = notebooks.find(n => n.id == currentNotebookId);
    if (currentNotebook) {
        notebookTitleEl.textContent = currentNotebook.name;
        document.title = currentNotebook.name; // Atualiza o título da aba
        editorEl.value = localStorage.getItem(`notebook_content_${currentNotebookId}`) || '';
    } else {
        alert('Caderno inválido!');
        window.location.href = 'cadernos.html';
    }

    const saveContent = () => {
        // Salva o conteúdo
        localStorage.setItem(`notebook_content_${currentNotebookId}`, editorEl.value);

        // Atualiza a data de modificação na lista principal de cadernos
        const notebookIndex = notebooks.findIndex(n => n.id == currentNotebookId);
        if (notebookIndex !== -1) {
            notebooks[notebookIndex].lastModified = new Date().toISOString();
            localStorage.setItem('notebooks', JSON.stringify(notebooks));
        }

        // Feedback visual
        saveStatusEl.textContent = 'Salvo!';
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveStatusEl.textContent = '';
        }, 2000);
    };

    saveBtn.addEventListener('click', saveContent);

    // Bônus: Salvamento automático enquanto digita
    editorEl.addEventListener('input', () => {
        saveStatusEl.textContent = 'Salvando...';
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContent, 1000); // Salva 1 segundo após parar de digitar
    });
});