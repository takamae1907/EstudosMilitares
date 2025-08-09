document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos do DOM ---
    const calendarGrid = document.getElementById('calendar-days-grid');
    const monthYearHeader = document.getElementById('month-year-header');
    const prevMonthBtn = document.getElementById('prev-month-button');
    const nextMonthBtn = document.getElementById('next-month-button');
    const todoTitle = document.getElementById('todo-title');
    const reminderList = document.getElementById('reminder-list');
    const addReminderForm = document.getElementById('add-reminder-form');
    const newReminderInput = document.getElementById('new-reminder-input');
    const showCompletedToggle = document.getElementById('show-completed-toggle');
    const addProvaForm = document.getElementById('add-prova-form');
    const provaNameInput = document.getElementById('prova-name-input');
    const provaDateInput = document.getElementById('prova-date-input');
    const provasList = document.getElementById('provas-list');
    const editModal = document.getElementById('edit-modal');

    // --- Estado da Aplicação ---
    let dateForCalendar = new Date();
    let selectedDate = new Date().toISOString().split('T')[0]; // Formato AAAA-MM-DD
    let reminders = JSON.parse(localStorage.getItem('study_reminders_v2')) || [];
    let provas = JSON.parse(localStorage.getItem('study_provas')) || [];
    let currentEditingReminderId = null;

    // --- Funções Auxiliares ---
    const saveData = () => {
        localStorage.setItem('study_reminders_v2', JSON.stringify(reminders));
        localStorage.setItem('study_provas', JSON.stringify(provas));
    };

    // --- Funções de Renderização ---

    const renderCalendar = () => {
        const year = dateForCalendar.getFullYear();
        const month = dateForCalendar.getMonth();
        calendarGrid.innerHTML = '';
        monthYearHeader.textContent = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.innerHTML += '<div class="day-cell empty-day"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = day;
            dayCell.dataset.date = dateStr;

            if (dateStr === selectedDate) dayCell.classList.add('selected-day');
            if (provas.some(p => p.date === dateStr)) dayCell.classList.add('has-prova');
            if (reminders.some(r => r.date === dateStr && !r.completed)) dayCell.classList.add('has-reminder');

            calendarGrid.appendChild(dayCell);
        }
    };

    const renderReminders = () => {
        reminderList.innerHTML = '';
        const dateObj = new Date(selectedDate + 'T12:00:00'); // Usar T12:00 para evitar bugs de fuso
        const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        todoTitle.textContent = `Tarefas de ${formattedDate}`;

        const showCompleted = showCompletedToggle.checked;
        const dayReminders = reminders
            .filter(r => r.date === selectedDate)
            .filter(r => showCompleted || !r.completed);

        if (dayReminders.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma tarefa para este dia.';
            li.style.justifyContent = 'center';
            li.style.color = 'var(--text-muted-color)';
            reminderList.appendChild(li);
            return;
        }

        dayReminders.forEach(reminder => {
            const li = document.createElement('li');
            li.className = reminder.completed ? 'completed' : '';
            li.dataset.id = reminder.id;

            li.innerHTML = `
                <button class="complete-btn" title="Marcar como concluído"><i class="fas ${reminder.completed ? 'fa-check-square' : 'fa-square'}"></i></button>
                <span class="task-text">${reminder.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            reminderList.appendChild(li);
        });
    };

    const renderProvas = () => {
        provasList.innerHTML = '';
        if (provas.length === 0) {
            provasList.innerHTML = '<li>Nenhuma prova adicionada.</li>';
            return;
        }
        const sortedProvas = [...provas].sort((a, b) => new Date(a.date) - new Date(b.date));
        sortedProvas.forEach(prova => {
            const li = document.createElement('li');
            const formattedDate = new Date(prova.date + 'T12:00:00').toLocaleDateString('pt-BR', { dateStyle: 'long' });
            li.innerHTML = `<strong>${prova.name}</strong><span>${formattedDate}</span>`;
            provasList.appendChild(li);
        });
    };

    // --- Lógica do Modal de Edição ---
    const openEditModal = (reminder) => {
        currentEditingReminderId = reminder.id;
        editModal.innerHTML = `
            <div class="modal-content">
                <h4>Editar Tarefa</h4>
                <form id="edit-reminder-form">
                    <textarea id="edit-reminder-textarea" rows="4">${reminder.text}</textarea>
                    <div class="modal-actions">
                        <button type="button" id="cancel-edit-btn">Cancelar</button>
                        <button type="submit">Salvar</button>
                    </div>
                </form>
            </div>
        `;
        editModal.classList.add('visible');
        document.getElementById('edit-reminder-textarea').focus();
    };

    const closeEditModal = () => {
        editModal.classList.remove('visible');
        editModal.innerHTML = '';
        currentEditingReminderId = null;
    };

    // --- Event Listeners ---

    calendarGrid.addEventListener('click', (e) => {
        const dayCell = e.target.closest('.day-cell:not(.empty-day)');
        if (!dayCell) return;
        selectedDate = dayCell.dataset.date;
        renderCalendar();
        renderReminders();
    });

    prevMonthBtn.addEventListener('click', () => {
        dateForCalendar.setMonth(dateForCalendar.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        dateForCalendar.setMonth(dateForCalendar.getMonth() + 1);
        renderCalendar();
    });

    addReminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newReminderInput.value.trim();
        if (text) {
            reminders.push({
                id: Date.now(),
                text: text,
                date: selectedDate,
                completed: false
            });
            saveData();
            renderReminders();
            renderCalendar();
            newReminderInput.value = '';
        }
    });

    reminderList.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li[data-id]');
        if (!li) return;

        const reminderId = Number(li.dataset.id);
        const reminder = reminders.find(r => r.id === reminderId);

        if (target.closest('.complete-btn')) {
            reminder.completed = !reminder.completed;
        } else if (target.closest('.delete-btn')) {
            reminders = reminders.filter(r => r.id !== reminderId);
        } else if (target.closest('.edit-btn')) {
            openEditModal(reminder);
            return; // Impede re-renderização imediata para o modal funcionar
        } else {
            return; // Não faz nada se clicar no texto
        }

        saveData();
        renderReminders();
        renderCalendar();
    });

    showCompletedToggle.addEventListener('change', renderReminders);

    addProvaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = provaNameInput.value.trim();
        const data = provaDateInput.value;
        if (nome && data) {
            provas.push({ id: Date.now(), name: nome, date: data });
            saveData();
            renderProvas();
            renderCalendar();
            addProvaForm.reset();
        }
    });

    editModal.addEventListener('click', (e) => {
        if (e.target.id === 'cancel-edit-btn' || e.target.classList.contains('modal-overlay')) {
            closeEditModal();
        }
    });

    editModal.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.id !== 'edit-reminder-form') return;

        const newText = document.getElementById('edit-reminder-textarea').value.trim();
        const reminder = reminders.find(r => r.id === currentEditingReminderId);
        if (reminder && newText) {
            reminder.text = newText;
            saveData();
            renderReminders();
            closeEditModal();
        }
    });

    // --- Inicialização ---
    const init = () => {
        // Define a data atual para o calendário e a data selecionada
        dateForCalendar = new Date();
        selectedDate = dateForCalendar.toISOString().split('T')[0];

        // Renderiza tudo
        renderCalendar();
        renderReminders();
        renderProvas();
    };

    init();
});