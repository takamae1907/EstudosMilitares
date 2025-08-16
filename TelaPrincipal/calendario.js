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
    let selectedDate = new Date().toISOString().split('T')[0];
    let reminders = JSON.parse(localStorage.getItem('study_reminders_v3')) || [];
    let provas = JSON.parse(localStorage.getItem('study_provas_v3')) || [];
    let currentEditingReminderId = null;

    // --- Funções Auxiliares ---
    const saveData = () => {
        localStorage.setItem('study_reminders_v3', JSON.stringify(reminders));
        localStorage.setItem('study_provas_v3', JSON.stringify(provas));
    };

    const renderAll = () => {
        renderCalendar();
        renderReminders();
        renderProvas();
    };

    // --- Funções de Renderização ---
    const renderCalendar = () => {
        const year = dateForCalendar.getFullYear();
        const month = dateForCalendar.getMonth();
        calendarGrid.innerHTML = '';
        monthYearHeader.textContent = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayStr = new Date().toISOString().split('T')[0];

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
            if (dateStr === todayStr) dayCell.classList.add('today');
            if (provas.some(p => p.date === dateStr)) dayCell.classList.add('has-prova');
            if (reminders.some(r => r.date === dateStr && !r.completed)) dayCell.classList.add('has-reminder');

            calendarGrid.appendChild(dayCell);
        }
    };

    const renderReminders = () => {
        const dateObj = new Date(selectedDate.replace(/-/g, '/'));
        todoTitle.textContent = `Tarefas de ${dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}`;

        const showCompleted = showCompletedToggle.checked;
        const dayReminders = reminders.filter(r => r.date === selectedDate).filter(r => showCompleted || !r.completed);

        reminderList.innerHTML = '';
        if (dayReminders.length === 0) {
            reminderList.innerHTML = `<li style="justify-content: center; color: var(--text-muted-color);">Nenhuma tarefa para este dia.</li>`;
            return;
        }

        dayReminders.forEach(reminder => {
            const li = document.createElement('li');
            li.className = reminder.completed ? 'completed' : '';
            li.dataset.id = reminder.id;
            li.innerHTML = `<button class="complete-btn" title="Marcar como concluído"><i class="fas ${reminder.completed ? 'fa-check-square' : 'fa-square'}"></i></button><span class="task-text">${reminder.text}</span><div class="task-actions"><button class="edit-btn" title="Editar"><i class="fas fa-pencil-alt"></i></button><button class="delete-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button></div>`;
            reminderList.appendChild(li);
        });
    };

    const renderProvas = () => {
        provasList.innerHTML = '';
        if (provas.length === 0) {
            provasList.innerHTML = '<li style="color: var(--text-muted-color);">Nenhuma prova adicionada.</li>';
            return;
        }
        const sortedProvas = [...provas].sort((a, b) => new Date(a.date) - new Date(b.date));
        sortedProvas.forEach(prova => {
            const formattedDate = new Date(prova.date.replace(/-/g, '/')).toLocaleDateString('pt-BR', { dateStyle: 'long' });
            provasList.innerHTML += `<li><strong>${prova.name}</strong><span>${formattedDate}</span></li>`;
        });
    };

    const openEditModal = (reminder) => {
        currentEditingReminderId = reminder.id;
        editModal.innerHTML = `<div class="modal-content"><form id="edit-reminder-form"><h4>Editar Tarefa</h4><textarea id="edit-reminder-textarea" rows="4">${reminder.text}</textarea><div class="modal-actions"><button type="button" class="cancel-btn">Cancelar</button><button type="submit">Salvar</button></div></form></div>`;
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

    prevMonthBtn.addEventListener('click', () => { dateForCalendar.setMonth(dateForCalendar.getMonth() - 1); renderCalendar(); });
    nextMonthBtn.addEventListener('click', () => { dateForCalendar.setMonth(dateForCalendar.getMonth() + 1); renderCalendar(); });

    addReminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newReminderInput.value.trim();
        if (text) {
            reminders.push({ id: Date.now(), text, date: selectedDate, completed: false });
            saveData();
            renderAll();
            newReminderInput.value = '';
        }
    });

    reminderList.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-id]');
        if (!li) return;
        const reminderId = Number(li.dataset.id);
        const reminder = reminders.find(r => r.id === reminderId);
        let needsRender = true;

        if (e.target.closest('.complete-btn')) reminder.completed = !reminder.completed;
        else if (e.target.closest('.delete-btn')) reminders = reminders.filter(r => r.id !== reminderId);
        else if (e.target.closest('.edit-btn')) { openEditModal(reminder); needsRender = false; } 
        else return;

        if (needsRender) { saveData(); renderAll(); }
    });

    showCompletedToggle.addEventListener('change', renderReminders);

    addProvaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = provaNameInput.value.trim();
        const date = provaDateInput.value;
        if (name && date) {
            provas.push({ id: Date.now(), name, date });
            saveData();
            renderAll();
            addProvaForm.reset();
        }
    });

    editModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('cancel-btn') || e.target.classList.contains('modal-overlay')) closeEditModal();
    });
    editModal.addEventListener('submit', (e) => {
        e.preventDefault();
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
        dateForCalendar = new Date();
        selectedDate = dateForCalendar.toISOString().split('T')[0];
        renderAll();
    };
    init();
});