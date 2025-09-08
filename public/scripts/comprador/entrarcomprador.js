function validateLogin(event) {
    event.preventDefault();
    
    // Obter valores dos campos
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Credenciais válidas
    const validEmail = "compradorong@gmail.com";
    const validPassword = "ong123@";
    
    // 1. Validação básica de campos vazios
    if (!email || !password) {
        showError("Por favor, preencha todos os campos.");
        return false;
    }
    
    // 2. Validação do formato do email
    if (!validateEmail(email)) {
        showError("Formato de email inválido!");
        return false;
    }
    
    // 3. Verificar se as credenciais estão corretas
    if (email !== validEmail) {
        showError("Email não encontrado!");
        return false;
    }
    
    if (password !== validPassword) {
        showError("Senha incorreta! Verifique sua senha.");
        return false;
    }
    
    // Login bem-sucedido se passou por todas as validações
    showSuccess("Login realizado com sucesso! ");
    
    // Redirecionamento após 2 segundos
    setTimeout(() => {
        window.location.href = "../../Comprador/html/compradordepois.html";
    }, 2000);
    
    return false;
}

// Funções auxiliares
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Não precisamos mais validar a força da senha, apenas se está correta
    return [];
}

function showError(message) {
    // Remove mensagens anteriores
    const oldError = document.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    // Remove mensagens de sucesso
    const oldSuccess = document.querySelector('.success-message');
    if (oldSuccess) oldSuccess.remove();
    
    // Cria nova mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message alert alert-danger';
    errorElement.style.cssText = `
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
       
    `;
    errorElement.textContent = message;
    
    // Insere antes do formulário
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorElement, form);
}

function showSuccess(message) {
    // Remove mensagens anteriores
    const oldError = document.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    const oldSuccess = document.querySelector('.success-message');
    if (oldSuccess) oldSuccess.remove();
    
    // Cria nova mensagem de sucesso
    const successElement = document.createElement('div');
    successElement.className = 'success-message alert alert-success';
    successElement.style.cssText = `
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      
    `;
    successElement.textContent = message;
    
    // Insere antes do formulário
    const form = document.querySelector('form');
    form.parentNode.insertBefore(successElement, form);
}

// Adicionar o event listener ao formulário quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', validateLogin);
    }
});

// Função para facilitar o teste - você pode remover esta parte em produção
function showCredentials() {
    console.log("Credenciais para teste:");
    console.log("Email: compradorong@gmail.com");
    console.log("Senha: ong123@");
}

// Chamar a função para mostrar as credenciais no console (opcional)
showCredentials();
