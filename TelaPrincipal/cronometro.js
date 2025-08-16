document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos ---
    const modeCronometroBtn = document.getElementById('mode-cronometro');
    const modeManualBtn = document.getElementById('mode-manual');
    const timerForm = document.getElementById('timer-form');
    const manualForm = document.getElementById('manual-form');
    const saveBtn = document.getElementById('save-btn');

    // Cronômetro
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const activityNameTimer = document.getElementById('activity-name-timer');

    // Manual
    const activityNameManual = document.getElementById('activity-name-manual');
    const activityDate = document.getElementById('activity-date');
    const activityDuration = document.getElementById('activity-duration');

    // Gráfico
    const ctx = document.getElementById('activity-chart').getContext('2d');
    let activityChart;

    // --- Estado do Cronômetro ---
    let timerInterval;
    let seconds = 0;
    let isRunning = false;

    // --- Lógica de Troca de Modo ---
    modeCronometroBtn.addEventListener('click', () => {
        modeCronometroBtn.classList.add('active');
        modeManualBtn.classList.remove('active');
        timerForm.classList.remove('hidden');
        manualForm.classList.add('hidden');
    });

    modeManualBtn.addEventListener('click', () => {
        modeManualBtn.classList.add('active');
        modeCronometroBtn.classList.remove('active');
        manualForm.classList.remove('hidden');
        timerForm.classList.add('hidden');
    });

    // --- Lógica do Cronômetro ---
    const formatTime = (sec) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, '0');
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const startTimer = () => {
        if (isRunning) return;
        isRunning = true;
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    };

    const pauseTimer = () => {
        isRunning = false;
        clearInterval(timerInterval);
    };

    const resetTimer = () => {
        pauseTimer();
        seconds = 0;
        timerDisplay.textContent = formatTime(seconds);
    };

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // --- Lógica de Salvamento e Gráfico ---
    const saveActivity = () => {
        const activities = JSON.parse(localStorage.getItem('studyActivities')) || [];
        const isCronometroMode = modeCronometroBtn.classList.contains('active');
        let newActivity;

        if (isCronometroMode) {
            if (!activityNameTimer.value.trim() || seconds === 0) {
                alert('Por favor, insira um nome para a atividade e inicie o cronômetro.');
                return;
            }
            newActivity = {
                name: activityNameTimer.value.trim(),
                date: new Date().toISOString().split('T')[0],
                duration: Math.round(seconds / 60) // Salva em minutos
            };
            resetTimer();
            activityNameTimer.value = '';
        } else {
            if (!activityNameManual.value.trim() || !activityDate.value || !activityDuration.value) {
                alert('Por favor, preencha todos os campos do registro manual.');
                return;
            }
            newActivity = {
                name: activityNameManual.value.trim(),
                date: activityDate.value,
                duration: parseInt(activityDuration.value, 10)
            };
            manualForm.reset();
            activityDate.value = new Date().toISOString().split('T')[0]; // Reseta para data de hoje
        }

        activities.push(newActivity);
        localStorage.setItem('studyActivities', JSON.stringify(activities));
        renderChart();
    };

    saveBtn.addEventListener('click', saveActivity);

    const renderChart = () => {
        const activities = JSON.parse(localStorage.getItem('studyActivities')) || [];
        const today = new Date();
        const last7Days = Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const labels = last7Days.map(dateStr => new Date(dateStr.replace(/-/g, '/')).toLocaleDateString('pt-BR', { weekday: 'short' }));
        const data = last7Days.map(dateStr => {
            return activities
                .filter(act => act.date === dateStr)
                .reduce((total, act) => total + act.duration, 0);
        });

        if (activityChart) {
            activityChart.data.labels = labels;
            activityChart.data.datasets[0].data = data;
            activityChart.update();
        } else {
            activityChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Minutos Estudados',
                        data: data,
                        backgroundColor: 'rgba(10, 132, 255, 0.6)',
                        borderColor: 'rgba(10, 132, 255, 1)',
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#3a3a3c' }, ticks: { color: '#8a8a8e' } },
                        x: { grid: { display: false }, ticks: { color: '#8a8a8e' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    };

    // --- Inicialização ---
    activityDate.value = new Date().toISOString().split('T')[0];
    renderChart();
});