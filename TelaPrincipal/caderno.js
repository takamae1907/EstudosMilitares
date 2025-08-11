document.addEventListener('DOMContentLoaded', () => {
    // ELEMENTOS DO DOM
    const monthYearHeader = document.getElementById('month-year-header');
    const calendarGrid = document.getElementById('calendar-days-grid');
    const prevMonthBtn = document.getElementById('prev-month-button');
    const nextMonthBtn = document.getElementById('next-month-button');

    const addProvaForm = document.getElementById('add-prova-form');
    const provaNameInput = document.getElementById('prova-name-input');
    const provaDateInput = document.getElementById('prova-date-input');
    const provasList = document.getElementById('provas-list');

    const todoTitle = document.getElementById('todo-title');
    const reminderList = document.getElementById('reminder-list');
    const addReminderForm = document.getElementById('add-reminder-form');
    const newReminderInput = document.getElementById('new-reminder-input');
    const showCompletedToggle = document.getElementById('show-completed-toggle');

    // ESTADO DA APLICAÇÃO
    let currentDate = new Date();
    let selectedDate = new Date();
    let provas = JSON.parse(localStorage.getItem('provas')) || {}; // Formato: { "YYYY-MM-DD": [{ name: 'Nome' }] }
    let reminders = JSON.parse(localStorage.getItem('reminders')) || {}; // Formato: { "YYYY-MM-DD": [{ text: 'Tarefa', completed: false, id: ... }] }

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // FUNÇÕES DE DATA
    const toDateString = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

    // FUNÇÕES DE RENDERIZAÇÃO
    const renderCalendar = () => {
        calendarGrid.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYearHeader.textContent = `${monthNames[month]} de ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Preenche dias vazios no início do mês
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.innerHTML += `<div class="day-cell empty-day"></div>`;
        }

        // Preenche os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            dayCell.classList.add('day-cell');

            const cellDate = new Date(year, month, day);
            const cellDateString = toDateString(cellDate);
            const todayString = toDateString(new Date());

            if (cellDateString === toDateString(selectedDate)) {
                dayCell.classList.add('selected-day');
            }
            if (cellDateString === todayString) {
                dayCell.classList.add('today-cell');
            }
            if (reminders[cellDateString] && reminders[cellDateString].length > 0) {
                dayCell.classList.add('has-reminder');
            }
            if (provas[cellDateString] && provas[cellDateString].length > 0) {
                dayCell.classList.add('has-prova');
            }

            dayCell.addEventListener('click', () => handleDayClick(cellDate));
            calendarGrid.appendChild(dayCell);
        }
        renderProvasList();
    };

    const renderProvasList = () => {
        provasList.innerHTML = '';
        const sortedProvas = Object.entries(provas)
            .flatMap(([date, provaArr]) => provaArr.map(p => ({ ...p, date })))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedProvas.forEach(prova => {
            const [y, m, d] = prova.date.split('-');
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${prova.name}</strong>
                <span>${d}/${m}/${y}</span>
            `;
            provasList.appendChild(li);
        });
    };

    const renderRemindersForSelectedDate = () => {
        const dateString = toDateString(selectedDate);
        const dateFormatted = selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        todoTitle.textContent = `Lembretes para ${dateFormatted}`;
        reminderList.innerHTML = '';

        const dayReminders = reminders[dateString] || [];

        if (dayReminders.length === 0) {
            reminderList.innerHTML = `<li><span class="task-text text-muted">Nenhuma tarefa para este dia.</span></li>`;
        } else {
            dayReminders.forEach(reminder => {
                const li = document.createElement('li');
                li.dataset.id = reminder.id;
                if (reminder.completed) {
                    li.classList.add('completed');
                }

                // Esconde concluídos se o toggle estiver desmarcado
                if (reminder.completed && !showCompletedToggle.checked) {
                    li.classList.add('hidden');
                }

                li.innerHTML = `
                    <button class="complete-btn">
                        <i class="far ${reminder.completed ? 'fa-check-square' : 'fa-square'}"></i>
                    </button>
                    <span class="task-text">${reminder.text}</span>
                    <div class="task-actions">
                        <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                reminderList.appendChild(li);
            });
        }
    };

    // FUNÇÕES DE MANIPULAÇÃO DE DADOS (COM LOCALSTORAGE)
    const saveData = () => {
        localStorage.setItem('provas', JSON.stringify(provas));
        localStorage.setItem('reminders', JSON.stringify(reminders));
    };

    const addProva = (name, date) => {
        if (!provas[date]) provas[date] = [];
        provas[date].push({ name });
        saveData();
        renderCalendar();
    };

    const addReminder = (text, dateString) => {
        if (!reminders[dateString]) reminders[dateString] = [];
        const newReminder = {
            text,
            completed: false,
            id: Date.now() // ID único baseado no timestamp
        };
        reminders[dateString].push(newReminder);
        saveData();
        renderRemindersForSelectedDate();
        renderCalendar(); // Para atualizar o pontinho no dia
    };

    const toggleReminderCompletion = (id, dateString) => {
        const reminder = reminders[dateString]?.find(r => r.id == id);
        if (reminder) {
            reminder.completed = !reminder.completed;
            saveData();
            renderRemindersForSelectedDate();
        }
    };

    const deleteReminder = (id, dateString) => {
        if (reminders[dateString]) {
            reminders[dateString] = reminders[dateString].filter(r => r.id != id);
            // Se não houver mais lembretes para o dia, remove a chave
            if (reminders[dateString].length === 0) {
                delete reminders[dateString];
            }
            saveData();
            renderRemindersForSelectedDate();
            renderCalendar();
        }
    };

    // EVENT HANDLERS
    const handleDayClick = (date) => {
        selectedDate = date;
        renderCalendar();
        renderRemindersForSelectedDate();
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    addProvaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (provaNameInput.value && provaDateInput.value) {
            addProva(provaNameInput.value, provaDateInput.value);
            provaNameInput.value = '';
            provaDateInput.value = '';
        }
    });

    addReminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newReminderInput.value.trim();
        if (text) {
            addReminder(text, toDateString(selectedDate));
            newReminderInput.value = '';
        }
    });

    reminderList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li || !li.dataset.id) return;

        const id = li.dataset.id;
        const dateString = toDateString(selectedDate);

        if (e.target.closest('.complete-btn')) {
            toggleReminderCompletion(id, dateString);
        }
        if (e.target.closest('.delete-btn')) {
            deleteReminder(id, dateString);
        }
    });

    showCompletedToggle.addEventListener('change', renderRemindersForSelectedDate);

    // INICIALIZAÇÃO
    renderCalendar();
    renderRemindersForSelectedDate();
});