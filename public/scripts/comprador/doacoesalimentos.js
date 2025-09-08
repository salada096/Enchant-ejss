document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de alimentos
    const alimentosTipo = document.getElementById('alimntostipo');
    const alimentosQuantidade = document.getElementById('alimentosquantidade');
    const alimentosValidade = document.getElementById('alimentovalidade');
    const alimentosEspecificacoes = document.getElementById('alimentosespecificações');
    
    // Elementos do formulário de ração para pets
    const racaoTamanho = document.getElementById('tamanhoracao');
    const racaoTipo = document.getElementById('Tiporacao');
    const racaoQuantidade = document.getElementById('racaoquantidade');
    const racaoEspecificacao = document.getElementById('racaoespecificao');
    
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
    const comidaDiv = document.getElementById('comida');
    const petDiv = document.getElementById('pet');
    
    // Tabs
    const comidaTab = document.getElementById('comida-tab');
    const petTab = document.getElementById('pets-tab');
    
    // Verificar se todos os elementos existem
    if (!botaoEnviar) {
        console.error('Botão enviar não encontrado!');
        return;
    }
    
    // Modais - verificar se Bootstrap está carregado
    let errorModal, confirmModal, erroSenhaModal;
    
    try {
        if (typeof bootstrap !== 'undefined') {
            errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            erroSenhaModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
        } else {
            console.warn('Bootstrap não está carregado. Usando alertas simples.');
        }
    } catch (error) {
        console.warn('Erro ao inicializar modais:', error);
    }
    
    // Modificar o input de data para aceitar texto (múltiplas datas)
    if (alimentosValidade) {
        alimentosValidade.type = "text";
        alimentosValidade.placeholder = "Ex: 10/05/2025, 15/06/2025";
        alimentosValidade.removeAttribute("min");
    }
    
    // Mostrar modal inicial quando a página carregar
    mostrarModalInicial();
    
    // Configurar visualização inicial
    mostrarSecaoComida();
    mostrarImagem1();
    
    // Event listeners para tabs
    if (comidaTab) {
        comidaTab.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarSecaoComida();
            mostrarImagem1();
        });
    }
    
    if (petTab) {
        petTab.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarSecaoPet();
            mostrarImagem1();
        });
    }
    
    // Event listener para botão Avançar
    if (botaoAvancar) {
        botaoAvancar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão avançar clicado');
            mostrarSecaoPet();
            mostrarImagem1();
        });
    }
    
    // Event listener para botão Voltar
    if (botaoVoltar) {
        botaoVoltar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão voltar clicado');
            mostrarSecaoComida();
            mostrarImagem1();
        });
    }
    
    // Event listener para botão Enviar - CORRIGIDO
    botaoEnviar.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Botão enviar clicado');
        
        try {
            const comidaPreenchida = validarFormularioComida();
            const petPreenchido = validarFormularioPet();
            
            console.log('Comida preenchida:', comidaPreenchida);
            console.log('Pet preenchido:', petPreenchido);
            
            if (comidaPreenchida || petPreenchido) {
                if (comidaPreenchida && !petPreenchido) {
                    // Se apenas alimentos estiver preenchido
                    mostrarImagem2();
                    mostrarConfirmacao('Doação de alimentos registrada com sucesso!');
                } else if (!comidaPreenchida && petPreenchido) {
                    // Se apenas ração para pets estiver preenchida
                    mostrarImagem2();
                    mostrarConfirmacao('Doação de ração para animais registrada com sucesso!');
                } else {
                    // Se ambos estiverem preenchidos
                    mostrarImagem2();
                    mostrarConfirmacao('Doação de alimentos e ração para animais registrada com sucesso!');
                }
            } else {
                mostrarErro('Por favor, preencha pelo menos um dos formulários (Alimentos ou Ração para Animais) antes de enviar.');
            }
        } catch (error) {
            console.error('Erro ao processar envio:', error);
            mostrarErro('Erro interno. Tente novamente.');
        }
    });
    
    // Funções auxiliares
    function validarFormularioComida() {
        try {
            const tipo = alimentosTipo ? alimentosTipo.value.trim() : '';
            const quantidade = alimentosQuantidade ? alimentosQuantidade.value.trim() : '';
            const validade = alimentosValidade ? alimentosValidade.value.trim() : '';
            const especificacoes = alimentosEspecificacoes ? alimentosEspecificacoes.value.trim() : '';
            
            console.log('Validação Comida:', { tipo, quantidade, validade, especificacoes });
            
            return tipo !== '' && quantidade !== '' && validade !== '' && especificacoes !== '';
        } catch (error) {
            console.error('Erro na validação de comida:', error);
            return false;
        }
    }
    
    function validarFormularioPet() {
        try {
            const tamanho = racaoTamanho ? racaoTamanho.value.trim() : '';
            const tipo = racaoTipo ? racaoTipo.value.trim() : '';
            const quantidade = racaoQuantidade ? racaoQuantidade.value.trim() : '';
            const especificacao = racaoEspecificacao ? racaoEspecificacao.value.trim() : '';
            
            console.log('Validação Pet:', { tamanho, tipo, quantidade, especificacao });
            
            return tamanho !== '' && tipo !== '' && quantidade !== '' && especificacao !== '';
        } catch (error) {
            console.error('Erro na validação de pet:', error);
            return false;
        }
    }
    
    function mostrarSecaoComida() {
        try {
            if (comidaDiv && petDiv) {
                comidaDiv.style.display = 'block';
                petDiv.style.display = 'none';
            }
            if (comidaTab && petTab) {
                comidaTab.classList.add('active');
                petTab.classList.remove('active');
            }
        } catch (error) {
            console.error('Erro ao mostrar seção comida:', error);
        }
    }
    
    function mostrarSecaoPet() {
        try {
            if (comidaDiv && petDiv) {
                comidaDiv.style.display = 'none';
                petDiv.style.display = 'block';
            }
            if (comidaTab && petTab) {
                comidaTab.classList.remove('active');
                petTab.classList.add('active');
            }
        } catch (error) {
            console.error('Erro ao mostrar seção pet:', error);
        }
    }
    
    function mostrarImagem1() {
        try {
            if (img1) img1.style.display = 'block';
            if (img2) img2.style.display = 'none';
            if (img3) img3.style.display = 'none';
            if (img4) img4.style.display = 'none';
        } catch (error) {
            console.error('Erro ao mostrar imagem 1:', error);
        }
    }
    
    function mostrarImagem2() {
        try {
            if (img1) img1.style.display = 'none';
            if (img2) img2.style.display = 'block';
            if (img3) img3.style.display = 'none';
            if (img4) img4.style.display = 'none';
        } catch (error) {
            console.error('Erro ao mostrar imagem 2:', error);
        }
    }
    
    function mostrarImagem3() {
        try {
            if (img1) img1.style.display = 'none';
            if (img2) img2.style.display = 'none';
            if (img3) img3.style.display = 'block';
            if (img4) img4.style.display = 'none';
        } catch (error) {
            console.error('Erro ao mostrar imagem 3:', error);
        }
    }
    
    function mostrarImagem4() {
        try {
            if (img1) img1.style.display = 'none';
            if (img2) img2.style.display = 'none';
            if (img3) img3.style.display = 'none';
            if (img4) img4.style.display = 'block';
        } catch (error) {
            console.error('Erro ao mostrar imagem 4:', error);
        }
    }
    
    function mostrarErro(mensagem) {
        try {
            if (errorModal && document.getElementById('errorModalBody')) {
                document.getElementById('errorModalBody').innerHTML = `<p>${mensagem}</p>`;
                errorModal.show();
            } else {
                // Fallback para alert simples
                alert('Erro: ' + mensagem);
            }
        } catch (error) {
            console.error('Erro ao mostrar modal de erro:', error);
            alert('Erro: ' + mensagem);
        }
    }
    
    function mostrarConfirmacao(mensagem) {
        try {
            if (confirmModal && document.getElementById('confirmModalBody')) {
                document.getElementById('confirmModalBody').innerHTML = `<p>${mensagem}</p>`;
                confirmModal.show();
            } else {
                // Fallback para alert simples
                alert('Sucesso: ' + mensagem);
            }
        } catch (error) {
            console.error('Erro ao mostrar modal de confirmação:', error);
            alert('Sucesso: ' + mensagem);
        }
    }
    
    function mostrarModalInicial() {
        try {
            if (erroSenhaModal && document.getElementById('erroSenhaModalBody')) {
                document.getElementById('erroSenhaModalBody').innerHTML = `
                    <p>Bem-vindo ao formulário de doação!</p>
                    <p>Por favor, preencha os dados dos alimentos ou ração para animais que deseja doar.</p>
                    <p>Após preencher os dados dos alimentos, você pode prosseguir para a página de ração para animais, para poder enviar sua doação!</p>
                `;
                erroSenhaModal.show();
            }
        } catch (error) {
            console.error('Erro ao mostrar modal inicial:', error);
        }
    }
    
    // Log para debug
    console.log('Script carregado com sucesso');
    console.log('Botão enviar encontrado:', !!botaoEnviar);
});

