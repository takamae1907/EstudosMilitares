document.addEventListener('DOMContentLoaded', () => {

    // --- REFERÊNCIAS DO DOM ---
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const periodDisplay = document.getElementById('period-display');
    const summaryFooter = document.getElementById('summary-footer');
    const materiasTbody = document.getElementById('materias-tbody');
    const noDataMessage = document.getElementById('no-data-message');
    const chartCanvas = document.getElementById('performanceChart');

    let performanceChart;
    let currentPeriod = 'semana'; // 'semana', 'mes', 'ano', 'total'

    // --- DADOS DE EXEMPLO ---
    const mockData = {
        semana: {
            display: '11/08/2025 a 17/08/2025',
            labels: ['11/08', '12/08', '13/08', '14/08', '15/08'],
            data: [65, 70, 75, 80, 78],
            resumo: { total: 89, acertos: 70, aproveitamento: 79 },
            materias: [
                { nome: 'Direito Penal', questoes: 20, acertos: 15, aproveitamento: 75 },
                { nome: 'Língua Portuguesa', questoes: 30, acertos: 25, aproveitamento: 83 },
                { nome: 'Raciocínio Lógico', questoes: 15, acertos: 5, aproveitamento: 33 },
                { nome: 'Legislação Extravagante', questoes: 24, acertos: 24, aproveitamento: 100 }
            ]
        },
        mes: {
            display: 'Agosto de 2025',
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            data: [72, 78, 75, 81],
            resumo: { total: 450, acertos: 340, aproveitamento: 76 },
            materias: [
                { nome: 'Direito Penal', questoes: 80, acertos: 60, aproveitamento: 75 },
                { nome: 'Língua Portuguesa', questoes: 120, acertos: 98, aproveitamento: 82 },
                { nome: 'Direito Administrativo', questoes: 60, acertos: 30, aproveitamento: 50 },
                { nome: 'Raciocínio Lógico', questoes: 70, acertos: 35, aproveitamento: 50 },
                { nome: 'Legislação Extravagante', questoes: 120, acertos: 117, aproveitamento: 98 }
            ]
        },
        ano: {
            display: 'Ano de 2025',
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
            data: [68, 70, 73, 75, 72, 78, 80, 76],
            resumo: { total: 1890, acertos: 1474, aproveitamento: 78 },
            materias: [
                { nome: 'Direito Penal', questoes: 300, acertos: 210, aproveitamento: 70 },
                { nome: 'Língua Portuguesa', questoes: 500, acertos: 410, aproveitamento: 82 },
                { nome: 'Direito Administrativo', questoes: 250, acertos: 125, aproveitamento: 50 },
                { nome: 'Raciocínio Lógico', questoes: 340, acertos: 170, aproveitamento: 50 },
                { nome: 'Legislação Extravagante', questoes: 500, acertos: 490, aproveitamento: 98 }
            ]
        },
        total: {
            display: 'Todo o Período',
            data: [] // Forçando o estado de "sem dados" para este exemplo
        }
    };

    // --- FUNÇÕES ---

    function createOrUpdateChart(period) {
        const periodData = mockData[period];

        if (!periodData || periodData.data.length === 0) {
            noDataMessage.classList.remove('hidden');
            chartCanvas.classList.add('hidden');
            if (performanceChart) performanceChart.destroy();
            performanceChart = null; // Garante que o gráfico seja recriado
            updateUI(null); // Limpa a UI
            return;
        }

        noDataMessage.classList.add('hidden');
        chartCanvas.classList.remove('hidden');

        const dataConfig = {
            labels: periodData.labels,
            datasets: [{
                label: 'Aproveitamento', data: periodData.data,
                borderColor: '#0a84ff', backgroundColor: 'rgba(10, 132, 255, 0.1)',
                fill: true, tension: 0.4, pointBackgroundColor: '#0a84ff',
                pointBorderColor: '#fff', pointHoverRadius: 7, pointHoverBorderWidth: 2
            }]
        };

        if (performanceChart) {
            performanceChart.data = dataConfig;
            performanceChart.update();
        } else {
            performanceChart = new Chart(ctx, {
                type: 'line', data: dataConfig,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#8a8a8e' }, grid: { color: '#3a3a3c', drawBorder: false } },
                        x: { ticks: { color: '#8a8a8e' }, grid: { display: false } }
                    },
                    plugins: { legend: { display: false } },
                    interaction: { intersect: false, mode: 'index' }
                }
            });
        }
        updateUI(periodData);
    }

    function updateUI(periodData) {
        // Se não houver dados, limpa os campos
        if (!periodData) {
            periodDisplay.textContent = 'Sem Dados';
            summaryFooter.textContent = 'Média de desempenho';
            document.getElementById('summary-percentage').textContent = `-%`;
            document.getElementById('summary-details').innerHTML = `<strong>-</strong> questões<br><strong>-</strong> acertos`;
            materiasTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #8a8a8e;">Nenhum dado para exibir.</td></tr>`;
            document.getElementById('best-materia').textContent = '-';
            document.getElementById('best-materia-percent').textContent = `-%`;
            document.getElementById('worst-materia').textContent = '-';
            document.getElementById('worst-materia-percent').textContent = `-%`;
            document.getElementById('comparison-value').textContent = `-`;
            return;
        }

        periodDisplay.textContent = periodData.display;
        summaryFooter.textContent = `Média de desempenho em ${periodData.display}`;

        document.getElementById('summary-percentage').textContent = `${periodData.resumo.aproveitamento}%`;
        document.getElementById('summary-details').innerHTML = `<strong>${periodData.resumo.total}</strong> questões<br><strong>${periodData.resumo.acertos}</strong> acertos`;

        materiasTbody.innerHTML = periodData.materias.map(m => `
            <tr>
                <td>${m.nome}</td>
                <td>${m.questoes}</td>
                <td>${m.acertos}</td>
                <td>${m.aproveitamento}%</td>
            </tr>
        `).join('');

        const sortedMaterias = [...periodData.materias].sort((a, b) => b.aproveitamento - a.aproveitamento);
        const best = sortedMaterias[0];
        const worst = sortedMaterias[sortedMaterias.length - 1];

        document.getElementById('best-materia').textContent = best.nome;
        document.getElementById('best-materia-percent').textContent = `${best.aproveitamento}%`;
        document.getElementById('worst-materia').textContent = worst.nome;
        document.getElementById('worst-materia-percent').textContent = `${worst.aproveitamento}%`;
        document.getElementById('comparison-value').textContent = `+5%`; // Valor de exemplo
    }


    // --- EVENT LISTENERS ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPeriod = button.dataset.period;
            createOrUpdateChart(currentPeriod);
        });
    });

    // --- INICIALIZAÇÃO ---
    createOrUpdateChart(currentPeriod);
});