document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZAÇÃO COM USUÁRIO FICTÍCIO ---
    // Este bloco verifica se já existe algum usuário no localStorage.
    // Se não houver, ele cria um usuário padrão para que você possa testar o login.
    if (!localStorage.getItem('users')) {
        // Cria um array com um usuário fictício
        const defaultUsers = [
            { email: 'admin@ficticio.com', password: '12345' }
        ];
        
        // Salva este array no localStorage
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('Usuário fictício criado para testes.');
    }
    // --- FIM DA INICIALIZAÇÃO ---


    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const emailInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const email = emailInput.value;
        const password = passwordInput.value;

        // --- LÓGICA DE VERIFICAÇÃO ---

        // 1. Pega a lista de usuários do localStorage (que agora sempre terá pelo menos o usuário fictício)
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Procura por um usuário que tenha o mesmo email E a mesma senha
        const foundUser = users.find(user => user.email === email && user.password === password);

        // 3. Verifica o resultado
        if (foundUser) {
            // Se encontrou o usuário, o login é bem-sucedido
            alert(`Login bem-sucedido! Bem-vindo(a) ao dashboard.`);
            
            // Redireciona para a página do dashboard
            window.location.href = 'TelaPrincipal/TelaPrincipal.html';

        } else {
            // Se não encontrou, exibe uma mensagem de erro
            alert('Email ou senha incorretos. Verifique seus dados ou cadastre-se.');
        }

        // --- FIM DA LÓGICA DE VERIFICAÇÃO ---
    });

});