const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

console.log("Script carregado. Formulário encontrado:", loginForm);

loginForm.addEventListener('submit', async (event) => {
        
    // Previne que a página recarregue ao enviar o formulário
    event.preventDefault();

    // Pega os valores dos campos de email e senha
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Limpa mensagens anteriores e reseta a cor
    loginMessage.textContent = '';
    loginMessage.className = 'mt-3 text-center font-weight-bold';

    // usar a api
    try {
        // Envia a requisição
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // sucelso 
            loginMessage.textContent = data.message;
            loginMessage.classList.add('text-success'); 

            setTimeout(() => {
                window.location.href = data.redirectUrl; // mudar pra pagina inicial
            }, 2000);
            
        } else {
            loginMessage.textContent = data.error;
            loginMessage.classList.add('text-danger');
        }

    } catch (error) {
        // Trata erros de conexão com o servidor
        console.error('Erro ao conectar com a API:', error);
        loginMessage.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
        loginMessage.classList.add('text-danger');
    }
});