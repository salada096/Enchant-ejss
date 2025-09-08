document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.containersubsub');
  const emailInput = document.getElementById('email-e1');

  console.log('Formulário encontrado:', form); // Debug
  console.log('Campo email encontrado:', emailInput); // Debug

  if (!form || !emailInput) {
    console.error('Formulário ou campo de email não encontrado');
    return;
  }

  // Função simples para mostrar mensagem
  function mostrarMensagem(mensagem, tipo = 'erro') {
    // Tentar usar o modal primeiro
    const modal = document.getElementById('mensagemModal');
    const modalBody = document.getElementById('mensagemModalBody');
    const modalLabel = document.getElementById('mensagemModalLabel');

    if (modal && modalBody && modalLabel) {
      modalBody.textContent = mensagem;
      
      if (tipo === 'sucesso') {
        modalLabel.textContent = 'Sucesso';
        modalLabel.style.color = '#28a745';
      } else {
        modalLabel.textContent = 'Atenção';
        modalLabel.style.color = '#dc3545';
      }

      // Tentar mostrar modal de diferentes formas
      try {
        if (typeof $ !== 'undefined' && $.fn.modal) {
          // jQuery + Bootstrap
          $('#mensagemModal').modal('show');
        } else if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          // Bootstrap 5
          const bsModal = new bootstrap.Modal(modal);
          bsModal.show();
        } else {
          // Fallback manual
          modal.style.display = 'block';
          modal.classList.add('show');
          document.body.classList.add('modal-open');
          
          // Criar backdrop se não existir
          if (!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop show';
            document.body.appendChild(backdrop);
          }
        }
      } catch (error) {
        console.error('Erro ao mostrar modal:', error);
        alert(mensagem); // Fallback para alert
      }
    } else {
      // Se modal não existir, usar alert
      alert(mensagem);
    }
  }

  // Função para ir para próxima página
  function irParaProximaPagina() {
    console.log('Redirecionando para esqueciasenha2.html...'); // Debug
    
    // Método mais compatível
    try {
      window.location.assign('esqueciasenha2.html');
    } catch (error) {
      console.error('Erro no redirect:', error);
      // Fallback
      window.location = 'esqueciasenha2.html';
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Formulário submetido'); // Debug

    const email = emailInput.value.trim();
    console.log('Email digitado:', email); // Debug

    // Regex para validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar se campo está vazio
    if (!email) {
      console.log('Campo vazio'); // Debug
      mostrarMensagem('Por favor, insira um endereço de email.');
      emailInput.focus();
      return;
    }

    // Validar formato do email
    if (!emailRegex.test(email)) {
      console.log('Email inválido'); // Debug
      mostrarMensagem('Por favor, insira um email válido. Exemplo: usuario@exemplo.com');
      emailInput.focus();
      return;
    }

    // Email válido
    console.log('Email válido, processando...'); // Debug
    
    // Versão 1: Redirect imediato (teste)
    // irParaProximaPagina();
    
    // Versão 2: Com modal e depois redirect
    mostrarMensagem('Email enviado com sucesso! Redirecionando...', 'sucesso');
    
    // Múltiplas tentativas de redirect
    setTimeout(() => {
      console.log('Tentativa 1 de redirect'); // Debug
      irParaProximaPagina();
    }, 9000);
    
    // Backup - se não funcionou em 1s, tenta novamente
    setTimeout(() => {
      console.log('Tentativa 2 de redirect'); // Debug
      if (window.location.href.includes('esqueciasenha2.html')) {
        console.log('Já redirecionado');
      } else {
        window.location.href = 'esqueciasenha2.html';
      }
    }, 2000);
    
    // Último recurso
    setTimeout(() => {
      console.log('Tentativa 3 de redirect'); // Debug
      if (!window.location.href.includes('esqueciasenha2.html')) {
        // Se ainda não redirecionou, força
        window.open('esqueciasenha2.html', '_self');
      }
    }, 3000);
  });

  // Feedback visual em tempo real
  emailInput.addEventListener('input', function() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Remover classes anteriores
    emailInput.classList.remove('is-valid', 'is-invalid');
    
    if (email) {
      if (emailRegex.test(email)) {
        emailInput.classList.add('is-valid');
      } else {
        emailInput.classList.add('is-invalid');
      }
    }
  });

  // Teste inicial
  console.log('Script carregado e funcionando');
});