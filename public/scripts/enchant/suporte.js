document.addEventListener("DOMContentLoaded", () => {
  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("anexos");
  const uploadText = document.getElementById("uploadText");
  const form = document.getElementById("form-suporte");

  // Função para mostrar arquivos selecionados
  function mostrarArquivos(arquivos) {
    const nomes = Array.from(arquivos).map(f => f.name).join(', ');
    uploadText.textContent = `Arquivos selecionados: ${nomes}`;
  }

  // Função de validar email
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Função de validação de texto
  function textoValido(texto) {
    const regex = /^[a-zA-ZÀ-ÿ0-9\s.,?!()\-]*$/;
    return regex.test(texto);
  }

  // Função para detectar texto inadequado
  function contemTextoInadequado(texto) {
    const palavrasBloqueadas = [
      "teste", "lixo", "idiota", "palavrão", "xxx", "merda", "droga", "bosta", "zoeira", "123", "asd", "asdf", "qqq", "foda", "putaria"
    ];
    const textoLower = texto.toLowerCase();
    return palavrasBloqueadas.some(palavra => textoLower.includes(palavra));
  }

  // Valida os arquivos enviados
  function validarArquivos(arquivos) {
    const tamanhoMax = 10 * 1024 * 1024; // 10MB
    for (const file of arquivos) {
      if (file.size > tamanhoMax) {
        return `O arquivo "${file.name}" excede o tamanho máximo de 10MB.`;
      }
    }
    return null;
  }

  // Função para mostrar o modal com erro
  function mostrarModal(mensagem) {
    const modalBody = document.getElementById('erroModalBody');
    if (modalBody) {
      modalBody.innerHTML = mensagem;
      const erroModalEl = document.getElementById('erroModal');
      const erroModal = new bootstrap.Modal(erroModalEl);
      erroModal.show();
      // Corrige fechamento do modal ao clicar em qualquer botão de fechar
      function fecharModal() {
        erroModal.hide();
      }
      // Botão de rodapé
      const botaoValidar = erroModalEl.querySelector('#botao-validar');
      if (botaoValidar) {
        botaoValidar.onclick = fecharModal;
      }
      // Botão X do header
      const btnClose = erroModalEl.querySelector('.btn-close');
      if (btnClose) {
        btnClose.onclick = fecharModal;
      }
      // Remove event listeners ao fechar
      erroModalEl.addEventListener('hidden.bs.modal', () => {
        if (botaoValidar) botaoValidar.onclick = null;
        if (btnClose) btnClose.onclick = null;
      }, { once: true });
    }
  }

  // Função para mostrar o modal de sucesso
  function mostrarModalSucesso(mensagem) {
    let modal = document.getElementById('sucessoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'sucessoModal';
      modal.tabIndex = -1;
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Sucesso</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">${mensagem}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="botao-validar" data-bs-dismiss="modal">Entendi</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.querySelector('.modal-body').innerHTML = mensagem;
    }
    const sucessoModal = new bootstrap.Modal(modal);
    sucessoModal.show();
    // Corrige fechamento do modal ao clicar em "Entendi" e no X
    function fecharModalSucesso() {
      sucessoModal.hide();
    }
    const botaoSucesso = modal.querySelector('#botao-validar');
    if (botaoSucesso) {
      botaoSucesso.onclick = fecharModalSucesso;
    }
    const btnClose = modal.querySelector('.btn-close');
    if (btnClose) {
      btnClose.onclick = fecharModalSucesso;
    }
    modal.addEventListener('hidden.bs.modal', () => {
      if (botaoSucesso) botaoSucesso.onclick = null;
      if (btnClose) btnClose.onclick = null;
    }, { once: true });
  }

  // Limpa os erros
  function limparErros() {
    const erros = document.querySelectorAll('.erro');
    erros.forEach(erro => erro.remove());
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limparErros(); // Limpa os erros anteriores

    const assuntoEl = document.getElementById("assunto");
    const emailEl = document.getElementById("email");
    const descricaoEl = document.getElementById("descricao");
    const arquivos = fileInput.files;

    const assunto = assuntoEl.value.trim();
    const email = emailEl.value.trim();
    const descricao = descricaoEl.value.trim();

    const erros = [];

    // Valida assunto
    if (assunto === "") {
      erros.push({ campo: assuntoEl, mensagem: "O campo de assunto está vazio." });
    } else if (assunto.length < 3) {
      erros.push({ campo: assuntoEl, mensagem: "O campo de assunto deve conter pelo menos 3 caracteres." });
    } else {
      if (!textoValido(assunto)) {
        erros.push({ campo: assuntoEl, mensagem: "O campo de assunto contém caracteres inválidos." });
      }
      if (contemTextoInadequado(assunto)) {
        erros.push({ campo: assuntoEl, mensagem: "O campo de assunto contém palavras inapropriadas." });
      }
    }

    // Valida e-mail
    if (email === "") {
      erros.push({ campo: emailEl, mensagem: "O campo de e-mail está vazio." });
    } else if (!validarEmail(email)) {
      erros.push({ campo: emailEl, mensagem: "O campo de e-mail está com formato inválido." });
    }

    // Valida descrição
    if (descricao === "") {
      erros.push({ campo: descricaoEl, mensagem: "O campo de descrição está vazio." });
    } else if (descricao.length < 10) {
      erros.push({ campo: descricaoEl, mensagem: "A descrição deve conter pelo menos 10 caracteres." });
    } else {
      if (!textoValido(descricao)) {
        erros.push({ campo: descricaoEl, mensagem: "O campo de descrição contém caracteres inválidos." });
      }
      if (contemTextoInadequado(descricao)) {
        erros.push({ campo: descricaoEl, mensagem: "A descrição contém palavras inapropriadas." });
      }
    }

    // Valida arquivos (opcional)
    if (arquivos.length > 0) {
      const erroArquivo = validarArquivos(arquivos);
      if (erroArquivo) {
        erros.push({ campo: fileInput, mensagem: erroArquivo });
      }
    }

    // Se houver erros
    if (erros.length > 0) {
      let mensagemErro = '<ul>';
      erros.forEach(erro => {
        mensagemErro += `<li>${erro.mensagem}</li>`;
      });
      mensagemErro += '</ul>';
      mostrarModal(mensagemErro);
      return;
    }

    // Se tudo estiver ok
    mostrarModalSucesso("Formulário enviado com sucesso!");
    form.reset();
    uploadText.textContent = "Escolha um arquivo ou arraste e solte aqui";
  });

  // Interação com a caixa de upload
  uploadBox.addEventListener("click", () => {
    fileInput.click();
  });

  uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("dragover");
  });

  uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("dragover");
  });

  uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.classList.remove("dragover");
    fileInput.files = e.dataTransfer.files;
    mostrarArquivos(fileInput.files);
  });

  fileInput.addEventListener("change", () => {
    mostrarArquivos(fileInput.files);
  });
});
