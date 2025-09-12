document.addEventListener('DOMContentLoaded', function () {

  const form = document.querySelector('.containersubsub');
  const emailInput = document.getElementById('email');

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

  form.addEventListener('submit', async (event) => {

    const formData = new FormData(form);

    event.preventDefault();

    console.log('Formulário submetido'); // Debug

    const email = formData.get('email').trim();

    console.log('Email digitado:', email); // Debug

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      console.log('Campo vazio'); // Debug
      mostrarMensagem('Por favor, insira um endereço de email.');
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {

      console.log('Email inválido'); // Debug

      mostrarMensagem('Por favor, insira um email válido. Exemplo: usuario@exemplo.com');

      emailInput.focus();
      
      return;
    }

    console.log('Email válido, processando...'); // Debug

    try {
      const response = await fetch('/forgotPassword', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();
      console.log('📦 Dados recebidos:', data);
      form.reset();

      mostrarMensagem('Email enviado com sucesso! Redirecionando...', 'sucesso');

      setTimeout(() => {
        console.log('Redirecionando');
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
        }
      }, 1000);

    } catch (error) {

      console.error('❌ Erro na requisição:', error);
      mostrarMensagem('Erro ao enviar o formulário. Tente novamente mais tarde.');

    }
  });

});