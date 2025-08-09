document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validações
        if (password !== confirmPassword) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // --- LÓGICA DE SALVAMENTO ---

        // 1. Pega a lista de usuários já existentes no localStorage.
        // Se não houver nenhuma, cria um array vazio.
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Verifica se o email já foi cadastrado
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            alert('Este email já foi cadastrado. Por favor, use outro.');
            return;
        }

        // 3. Adiciona o novo usuário ao array
        users.push({ email: email, password: password });

        // 4. Salva o array de usuários atualizado de volta no localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // --- FIM DA LÓGICA DE SALVAMENTO ---

        alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
        
        // Redireciona para a página de login
        window.location.href = 'index.html';
    });

});