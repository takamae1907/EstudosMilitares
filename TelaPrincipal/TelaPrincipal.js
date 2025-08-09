document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO WIDGET DE LEMBRETES ---
    const populateRemindersWidget = () => {
        const lembretesList = document.querySelector('.right-column .lembretes-widget ul');
        if (!lembretesList) return;

        // Dados de exemplo para a demonstração
        const exampleReminders = [
            { text: 'Revisar Direito Penal', date: '2025-08-10' },
            { text: 'Simulado Semanal', date: '2025-08-09' },
            { text: 'Ler 10 págs da Lei 8.112', date: '2025-08-09' },
            { text: 'Assistir aula de RLM', date: '2025-08-13' }
        ];

        // Tenta pegar do localStorage, se não houver, usa os dados de exemplo
        const reminders = JSON.parse(localStorage.getItem('reminders')) || exampleReminders;
        const sortedReminders = reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

        lembretesList.innerHTML = ''; // Limpa a lista antes de popular

        if (sortedReminders.length === 0) {
            lembretesList.innerHTML = '<li>Nenhum lembrete para hoje.</li>';
            return;
        }
        
        // Define a data atual para garantir consistência na demonstração
        const hoje = new Date('2025-08-09T12:00:00'); 
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        sortedReminders.forEach(reminder => {
            const li = document.createElement('li');
            // Adiciona T00:00:00 para evitar problemas de fuso horário na comparação
            const dataLembrete = new Date(reminder.date + 'T00:00:00'); 
            
            let textoData;
            
            // Compara apenas a data (ano, mês, dia), ignorando a hora
            if (dataLembrete.toDateString() === hoje.toDateString()) {
                textoData = 'Hoje, 19:00'; // Hora de exemplo
            } else if (dataLembrete.toDateString() === amanha.toDateString()) {
                textoData = 'Amanhã, 10:00'; // Hora de exemplo
            } else {
                // Formato para outros dias
                textoData = dataLembrete.toLocaleDateString('pt-BR', { weekday: 'long' });
            }

            li.innerHTML = `<strong>${reminder.text}</strong><span>${textoData}</span>`;
            lembretesList.appendChild(li);
        });
    };
    
    populateRemindersWidget();

    // --- LÓGICA DA BARRA LATERAL (SIDEBAR) ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Previne o comportamento padrão do link para não recarregar a página com '#'
            event.preventDefault(); 
            const link = event.currentTarget.querySelector('a');

            if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
                // Se o link for para outra página, navega para ela
                window.location.href = link.getAttribute('href');
            } else {
                // Se for um link '#', apenas atualiza o estado 'ativo'
                sidebarItems.forEach(i => i.classList.remove('active'));
                event.currentTarget.classList.add('active');
            }
        });
    });
    
    // --- LÓGICA DA PESQUISA DE TURMAS ---
    const searchInput = document.querySelector('.turmas-section input');
    // Seleciona os links que envolvem os cards para poder escondê-los
    const turmasLinks = document.querySelectorAll('.turmas-grid .turma-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            
            turmasLinks.forEach(link => {
                const turmaTitle = link.querySelector('.turma-title').textContent.toLowerCase();
                
                // Mostra ou esconde o link (e o card dentro dele)
                if (turmaTitle.includes(searchTerm)) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            });
        });
    }

    // --- ALERTAS DE EXEMPLO PARA INTERATIVIDADE ---
    const pesquisaButton = document.querySelector('.main-header button');
    if (pesquisaButton) {
        pesquisaButton.addEventListener('click', () => alert('Obrigado por participar da pesquisa! (Função de exemplo)'));
    }

    const editalIcons = document.querySelectorAll('.editais-widget .editais-icons i');
    editalIcons.forEach(icon => {
        icon.addEventListener('click', () => alert(`Ação de exemplo: "${icon.title}"`));
    });
});