// Script para validação dos formulários de doação de móveis e eletrodomésticos

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de móveis
    const moveisQualidade = document.getElementById('moveisqualidade');
    const moveisQuantidade = document.getElementById('moveisquantidade');
    const moveisDescricao = document.getElementById('moveisdescricao');
    const moveisReparo = document.getElementById('moveisreparo');
    
    // Elementos do formulário de eletrodomésticos
    const eletroQualidade = document.getElementById('eletroqualidade');
    const eletroQuantidade = document.getElementById('eletroquantidade');
    const eletroDescricao = document.getElementById('eletrodescricao');
    const eletroReparo = document.getElementById('eletroreparo');
    
    // Botões de navegação
    const botaoAvancar = document.getElementById('bottao');
    const botaoVoltar = document.getElementById('back-to-roupas');
    const botaoEnviar = document.getElementById('bbtn');
    
    // Imagens de fundo
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    
    // Divs de seção
    const moveisDiv = document.getElementById('moveis');
    const eletroDiv = document.getElementById('eletro');
    
    // Tabs
    const moveisTab = document.getElementById('moveis-tab');
    const eletroTab = document.getElementById('eletro-tab');
    
    // Modais
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const erroSenhaModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
    
    // Mostrar modal inicial quando a página carregar
    mostrarModalInicial();
    
    // Configurar visualização inicial
    mostrarSecaoMoveis();
    mostrarImagem1();
    
    // Event listeners para tabs
    moveisTab.addEventListener('click', function() {
        mostrarSecaoMoveis();
        mostrarImagem1();
    });
    
    eletroTab.addEventListener('click', function() {
        mostrarSecaoEletro();
        mostrarImagem1();
    });
    
    // Event listener para botão Avançar - MODIFICADO para não verificar campos
    botaoAvancar.addEventListener('click', function() {
        // Apenas muda para a próxima seção sem verificar campos
        mostrarSecaoEletro();
        mostrarImagem1();
    });
    
    // Event listener para botão Voltar
    botaoVoltar.addEventListener('click', function() {
        mostrarSecaoMoveis();
        mostrarImagem1();
    });
    
    // Event listener para botão Enviar
    botaoEnviar.addEventListener('click', function() {
        const moveisPreenchido = validarFormularioMoveis();
        const eletroPreenchido = validarFormularioEletro();
        
        if (moveisPreenchido || eletroPreenchido) {
            if (moveisPreenchido && !eletroPreenchido) {
                // Se apenas móveis estiver preenchido
                mostrarImagem2();
                mostrarConfirmacao('Doação de móveis registrada com sucesso!');
            } else if (!moveisPreenchido && eletroPreenchido) {
                // Se apenas eletrodomésticos estiver preenchido
                mostrarImagem2();
                mostrarConfirmacao('Doação de eletrodomésticos registrada com sucesso!');
            } else {
                // Se ambos estiverem preenchidos
                mostrarImagem2(); // ou img4, dependendo da preferência
                mostrarConfirmacao('Doação de móveis e eletrodomésticos registrada com sucesso!');
            }
        } else {
            mostrarErro('Por favor, preencha pelo menos um dos formulários (Móveis ou Eletrodomésticos) antes de enviar.');
        }
    });
    
    // Funções auxiliares
    function validarFormularioMoveis() {
        return moveisQualidade.value !== '' && 
               moveisQuantidade.value !== '' && 
               moveisDescricao.value !== '' && 
               moveisReparo.value !== '';
    }
    
    function validarFormularioEletro() {
        return eletroQualidade.value !== '' && 
               eletroQuantidade.value !== '' && 
               eletroDescricao.value !== '' && 
               eletroReparo.value !== '';
    }
    
    function mostrarSecaoMoveis() {
        moveisDiv.style.display = 'block';
        eletroDiv.style.display = 'none';
        moveisTab.classList.add('active');
        eletroTab.classList.remove('active');
    }
    
    function mostrarSecaoEletro() {
        moveisDiv.style.display = 'none';
        eletroDiv.style.display = 'block';
        moveisTab.classList.remove('active');
        eletroTab.classList.add('active');
    }
    
    function mostrarImagem1() {
        img1.style.display = 'block';
        img2.style.display = 'none';
        img3.style.display = 'none';
        img4.style.display = 'none';
    }
    
    function mostrarImagem2() {
        img1.style.display = 'none';
        img2.style.display = 'block';
        img3.style.display = 'none';
        img4.style.display = 'none';
    }
    
    function mostrarImagem3() {
        img1.style.display = 'none';
        img2.style.display = 'none';
        img3.style.display = 'block';
        img4.style.display = 'none';
    }
    
    function mostrarImagem4() {
        img1.style.display = 'none';
        img2.style.display = 'none';
        img3.style.display = 'none';
        img4.style.display = 'block';
    }
    
    function mostrarErro(mensagem) {
        document.getElementById('errorModalBody').innerHTML = `<p>${mensagem}</p>`;
        errorModal.show();
    }
    
    function mostrarConfirmacao(mensagem) {
        document.getElementById('confirmModalBody').innerHTML = `<p>${mensagem}</p>`;
        confirmModal.show();
    }
    
    function mostrarModalInicial() {
        document.getElementById('erroSenhaModalBody').innerHTML = `
            <p>Bem-vindo ao formulário de doação!</p>
            <p>Por favor, preencha os dados dos móveis ou eletrodomésticos que deseja doar.</p>
            <p>Após preencher os dados dos móveis, você pode prosseguir para a página de eletrodomésticos, para poder enviar sua doação!</p>
            
        `;
        erroSenhaModal.show();
    }
});
