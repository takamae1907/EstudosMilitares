document.addEventListener('DOMContentLoaded', () => {

    // --- REFERÊNCIAS DO DOM ---
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const periodDisplay = document.getElementById('period-display');
    const materiasTbody = document.getElementById('materias-tbody');
    const noDataMessage = document.getElementById('no-data-message');
    const chartCanvas = document.getElementById('performanceChart');

    let performanceChart;
    let currentPeriod = 'semana'; // 'semana', 'mes', 'ano', 'total'

    // --- DADOS DE EXEMPLO (Simulando um histórico de estudos) ---
    // Em um app real, isso viria de um banco de dados
    const mockData = {
        semana: {
            labels: ['11/08', '12/08', '13/08', '14/08', '15/08', '16/08', '17/08'],
            data: [65, 70, 75, 80, 78, 85, 78],
            resumo: { total: 89, acertos: 70, aproveitamento: 78 },
            materias: [
                { nome: 'Direito Penal', questoes: 20, acertos: 15, aproveitamento: 75 },
                { nome: 'Língua Portuguesa', questoes: 30, acertos: 25, aproveitamento: 83 },
                { nome: 'Raciocínio Lógico', questoes: 15, acertos: 5, aproveitamento: 33 },
                { nome: 'Legislação Extravagante', questoes: 24, acertos: 24, aproveitamento: 100 }
            ]
        },
        mes: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            data: [72, 78, 75, 81],
            resumo: { total: 450, acertos: 340, aproveitamento: 76 },
            materias: [
                 { nome: 'Direito Penal', questoes: 80, acertos: 60, aproveitamento: 75 },
                 { nome: 'Língua Portuguesa', questoes: 120, acertos: 98, aproveitamento: 82 },
                 { nome: 'Direito Administrativo', questoes: 60, acertos: 30, aproveitamento: 50},
                 { nome: 'Raciocínio Lógico', questoes: 70, acertos: 35, aproveitamento: 50 },
                 { nome: 'Legislação Extravagante', questoes: 120, acertos: 117, aproveitamento: 98 }
            ]
        },
        ano: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
            data: [68, 70, 73, 75, 72, 78, 80, 76],
            resumo: { total: 1890, acertos: 1474, aproveitamento: 78 },
             materias: [
                 { nome: 'Direito Penal', questoes: 300, acertos: 210, aproveitamento: 70 },
                 { nome: 'Língua Portuguesa', questoes: 500, acertos: 410, aproveitamento: 82 },
                 { nome: 'Direito Administrativo', questoes: 250, acertos: 125, aproveitamento: 50},
                 { nome: 'Raciocínio Lógico', questoes: 340, acertos: 170, aproveitamento: 50 },
                 { nome: 'Legislação Extravagante', questoes: 500, acertos: 490, aproveitamento: 98 }
            ]
        },
        // Adicione 'total' se necessário
    };

    // --- FUNÇÕES ---

    // Função para criar/atualizar o gráfico
    function createOrUpdateChart(period) {
        const periodData = mockData[period];
        
        if (!periodData || periodData.data.length === 0) {
            noDataMessage.classList.remove('hidden');
            chartCanvas.classList.add('hidden');
            if(performanceChart) performanceChart.destroy();
            return;
        }

        noDataMessage.classList.add('hidden');
        chartCanvas.classList.remove('hidden');

        const dataConfig = {
            labels: periodData.labels,
            datasets: [{
                label: 'Aproveitamento',
                data: periodData.data,
                borderColor: '#0a84ff',
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                fill: true,
                tension: 0.4, // Suaviza a linha
                pointBackgroundColor: '#0a84ff',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
            }]
        };

        if (performanceChart) {
            performanceChart.data = dataConfig;
            performanceChart.update();
        } else {
            performanceChart = new Chart(ctx, {
                type: 'line',
                data: dataConfig,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#8a8a8e' },
                            grid: { color: '#3a3a3c' }
                        },
                        x: {
                            ticks: { color: '#8a8a8e' },
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
        updateUI(periodData);
    }

    // Função para atualizar o resto da UI (tabela, resumo, insights)
    function updateUI(periodData) {
        // Resumo ao lado do gráfico
        document.getElementById('summary-percentage').textContent = `${periodData.resumo.aproveitamento}%`;
        document.getElementById('summary-details').innerHTML = `
            <strong>${periodData.resumo.total}</strong> questões<br>
            <strong>${periodData.resumo.acertos}</strong> acertos`;

        // Tabela de matérias
        materiasTbody.innerHTML = periodData.materias
            .map(m => `
                <tr>
                    <td>${m.nome}</td>
                    <td>${m.questoes}</td>
                    <td>${m.acertos}</td>
                    <td>${m.aproveitamento}%</td>
                </tr>
            `).join('');
        
        // Insights
        const sortedMaterias = [...periodData.materias].sort((a,b) => b.aproveitamento - a.aproveitamento);
        const best = sortedMaterias[0];
        const worst = sortedMaterias[sortedMaterias.length - 1];

        document.getElementById('best-materia').textContent = best.nome;
        document.getElementById('best-materia-percent').textContent = `${best.aproveitamento}%`;
        document.getElementById('worst-materia').textContent = worst.nome;
        document.getElementById('worst-materia-percent').textContent = `${worst.aproveitamento}%`;
    }


    // --- EVENT LISTENERS ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona no botão clicado
            button.classList.add('active');
            
            currentPeriod = button.dataset.period;
            // Atualiza o display do período (simples por agora)
            periodDisplay.textContent = `Dados de ${currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}`;
            createOrUpdateChart(currentPeriod);
        });
    });

    // --- INICIALIZAÇÃO ---
    createOrUpdateChart(currentPeriod);
});