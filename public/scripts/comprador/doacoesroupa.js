document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de roupas
    const roupasQualidade = document.getElementById('roupasqualidade');
    const roupasQuantidade = document.getElementById('roupasquantidade');
    const roupasDescricao = document.getElementById('roupasdescricao'); // Este é o campo "Tamanho" no HTML
    const roupasTipo = document.getElementById('roupastipo'); // Este é o campo "Tipo" no HTML
    
    // Elementos do formulário de calçados
    const calcadosQualidade = document.getElementById('calcadosqualidade');
    const calcadosQuantidade = document.getElementById('calcadosquantidade');
    const calcadosDescricao = document.getElementById('calcadosdescricao'); // Este é o campo "Tamanho" no HTML
    
    // Botões de navegação
    const botaoAvancar = document.getElementById('bottao');
    const botaoVoltar = document.getElementById('bbotao');
    const botaoEnviar = document.getElementById('bbtn');
    
    // Imagens de fundo
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    
    // Divs de seção
    const roupasDiv = document.getElementById('roupas');
    const calcadosDiv = document.getElementById('calcados');
    
    // Tabs
    const roupasTab = document.getElementById('roupas-tab');
    const calcadosTab = document.getElementById('calcados-tab');
    
    // Modais
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const erroSenhaModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
    
    // Mostrar modal inicial quando a página carregar
    mostrarModalInicial();
    
    // Configurar visualização inicial
    mostrarSecaoRoupas();
    mostrarImagem1();
    
    // Event listeners para tabs
    roupasTab.addEventListener('click', function() {
        mostrarSecaoRoupas();
        mostrarImagem1();
    });
    
    calcadosTab.addEventListener('click', function() {
        mostrarSecaoCalcados();
        mostrarImagem1();
    });
    
    // Event listener para botão Avançar - MODIFICADO para não verificar campos
    botaoAvancar.addEventListener('click', function() {
        // Apenas muda para a próxima seção sem verificar campos
        mostrarSecaoCalcados();
        mostrarImagem1();
    });
    
    // Event listener para botão Voltar
    botaoVoltar.addEventListener('click', function() {
        mostrarSecaoRoupas();
        mostrarImagem1();
    });
    
    // Event listener para botão Enviar
    botaoEnviar.addEventListener('click', function() {
        const roupasPreenchido = validarFormularioRoupas();
        const calcadosPreenchido = validarFormularioCalcados();
        
        if (roupasPreenchido || calcadosPreenchido) {
            if (roupasPreenchido && !calcadosPreenchido) {
                // Se apenas roupas estiver preenchido
                mostrarImagem2();
                mostrarConfirmacao('Doação de roupas registrada com sucesso!');
            } else if (!roupasPreenchido && calcadosPreenchido) {
                // Se apenas calçados estiver preenchido
                mostrarImagem2();
                mostrarConfirmacao('Doação de calçados registrada com sucesso!');
            } else {
                // Se ambos estiverem preenchidos
                mostrarImagem2(); // ou img4, dependendo da preferência
                mostrarConfirmacao('Doação de roupas e calçados registrada com sucesso!');
            }
        } else {
            mostrarErro('Por favor, preencha pelo menos um dos formulários (Roupas ou Calçados) antes de enviar.');
        }
    });
    
    // Funções auxiliares
    function validarFormularioRoupas() {
        return roupasQualidade.value !== '' && 
               roupasQuantidade.value !== '' && 
               roupasDescricao.value !== '' && 
               roupasTipo.value !== '';
    }
    
    function validarFormularioCalcados() {
        return calcadosQualidade.value !== '' && 
               calcadosQuantidade.value !== '' && 
               calcadosDescricao.value !== '';
    }
    
    function mostrarSecaoRoupas() {
        roupasDiv.style.display = 'block';
        calcadosDiv.style.display = 'none';
        roupasTab.classList.add('active');
        calcadosTab.classList.remove('active');
    }
    
    function mostrarSecaoCalcados() {
        roupasDiv.style.display = 'none';
        calcadosDiv.style.display = 'block';
        roupasTab.classList.remove('active');
        calcadosTab.classList.add('active');
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
            <p>Por favor, preencha os dados das roupas ou calçados que deseja doar.</p>
            <p>Após preencher os dados das roupas, você pode prosseguir para a página de calçados, para poder enviar sua doação!</p>
        `;
        erroSenhaModal.show();
    }
});
