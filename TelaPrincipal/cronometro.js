document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS ---
    const modeCronometroBtn = document.getElementById('mode-cronometro');
    const modeManualBtn = document.getElementById('mode-manual');
    const cronometroView = document.getElementById('cronometro-view');
    const manualView = document.getElementById('manual-view');
    const form = document.getElementById('activity-form');
    
    // Controles do Cronômetro
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    // --- ESTADO DO CRONÔMETRO ---
    let seconds = 0;
    let timerInterval = null;
    let currentMode = 'cronometro';

    // --- LÓGICA DE TROCA DE MODO ---
    modeCronometroBtn.addEventListener('click', () => setMode('cronometro'));
    modeManualBtn.addEventListener('click', () => setMode('manual'));

    function setMode(mode) {
        currentMode = mode;
        if (mode === 'cronometro') {
            modeCronometroBtn.classList.add('active');
            modeManualBtn.classList.remove('active');
            cronometroView.classList.remove('hidden');
            manualView.classList.add('hidden');
        } else {
            modeManualBtn.classList.add('active');
            modeCronometroBtn.classList.remove('active');
            manualView.classList.remove('hidden');
            cronometroView.classList.add('hidden');
        }
    }

    // --- LÓGICA DO CRONÔMETRO ---
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    function startTimer() {
        if (timerInterval) return; // Impede múltiplos intervalos
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        pauseTimer();
        seconds = 0;
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        timerDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // --- LÓGICA DO FORMULÁRIO ---
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const activityData = {
            modo: currentMode,
            materia: document.getElementById('materia-input').value.trim(),
            conteudo: document.getElementById('conteudo-input').value.trim(),
            exercicios: {
                quantidade: document.getElementById('questoes-qnt').value,
                acertos: document.getElementById('questoes-acertos').value
            },
            tipoEstudo: document.getElementById('study-type').value,
            anotacoes: document.getElementById('anotacoes').value.trim(),
        };

        if (currentMode === 'cronometro') {
            activityData.duracao = timerDisplay.textContent;
        } else {
            activityData.dataInicio = document.getElementById('start-date').value;
            activityData.horaInicio = document.getElementById('start-time').value;
            activityData.duracao = document.getElementById('duration-input').value;
        }

        console.log("Atividade Salva:", activityData);
        alert("Atividade salva com sucesso! (Verifique o console do navegador para ver os dados)");

        form.reset();
        resetTimer();
    });

    // --- LÓGICA DO GRÁFICO DE PIZZA (CHART.JS) ---
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('study-chart').getContext('2d');
        
        const data = {
            labels: ['Teoria', 'Exercícios', 'Revisão', 'Simulado'],
            datasets: [{
                label: 'Horas por Tipo',
                data: [12, 19, 5, 3],
                backgroundColor: [
                    'rgba(10, 132, 255, 0.8)',  
                    'rgba(52, 199, 89, 0.8)',   
                    'rgba(255, 159, 10, 0.8)',  
                    'rgba(175, 82, 222, 0.8)'   
                ],
                borderColor: '#1c1c1e',
                borderWidth: 3,
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f7',
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);
    } else {
        console.error("Chart.js não foi carregado!");
    }

    // Define a data de hoje no modo manual
    const dateInput = document.getElementById('start-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
});
