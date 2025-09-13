document.addEventListener('DOMContentLoaded', function() {
    // Variáveis para controle de etapas
    const etapas = [
        document.getElementById('etapa1'),
        document.getElementById('etapa2'),
        document.getElementById('etapa3'),
        document.getElementById('etapa4')
    ];
    
    const passosContainers = [
        document.querySelector('.passos-container1'),
        document.querySelector('.passos-container2'),
        document.querySelector('.passos-container3'),
        document.querySelector('.passos-container4')
    ];
    
    const passos = [
        document.getElementById('passo1'),
        document.getElementById('passo2'),
        document.getElementById('passo3'),
        document.getElementById('passo4')
    ];

    // Listeners para botões de navegação - CORRIGIDOS
    const btnContinuar1 = document.getElementById('continuar1');
    const btnContinuar2 = document.getElementById('continuar2');
    const btnContinuar3 = document.getElementById('continuar3');
    const btnEnviar = document.getElementById('enviar');

    if (btnContinuar1) btnContinuar1.addEventListener('click', validarEtapa1);
    if (btnContinuar2) btnContinuar2.addEventListener('click', validarEtapa2);
    if (btnContinuar3) btnContinuar3.addEventListener('click', validarEtapa3);
    if (btnEnviar) btnEnviar.addEventListener('click', validarEtapa4);
    
    // Adicionar listeners para navegação pelos passos
    adicionarListenersPassos();
    
    // Botões voltar
    const btnVoltar1 = document.getElementById('voltar1');
    const btnVoltar2 = document.getElementById('voltar2');
    const btnVoltar3 = document.getElementById('voltar3');

    if (btnVoltar1) {
        btnVoltar1.addEventListener('click', function(e) {
            e.preventDefault();
            mudarEtapa(1, 0);
        });
    }
    
    if (btnVoltar2) {
        btnVoltar2.addEventListener('click', function(e) {
            e.preventDefault();
            mudarEtapa(2, 1);
        });
    }
    
    if (btnVoltar3) {
        btnVoltar3.addEventListener('click', function(e) {
            e.preventDefault();
            mudarEtapa(3, 2);
        });
    }

    // Mostrar/ocultar senha
    document.querySelectorAll('.mostrar-senha').forEach(toggle => {
        toggle.innerHTML = '<i class="bi bi-eye-slash"></i>';
        toggle.addEventListener('click', function() {
            const input = this.closest('.senha-grupo').querySelector('input');
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            this.innerHTML = isPassword ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
        });
    });

    // Validação de senha em tempo real
    const campoSenha = document.getElementById('senha');
    if (campoSenha) {
        campoSenha.addEventListener('input', validarRequisitos);
    }

    // Máscaras para campos
    const campoTelefone = document.getElementById('telefone');
    if (campoTelefone) {
        campoTelefone.addEventListener('input', function() {
            this.value = formatarTelefone(this.value);
        });
    }

    const campoCPF = document.getElementById('cpf');
    if (campoCPF) {
        campoCPF.addEventListener('input', function() {
            this.value = formatarCPF(this.value);
        });
    }

    const campoCEP = document.getElementById('cep');
    if (campoCEP) {
        campoCEP.addEventListener('input', function() {
            this.value = formatarCEP(this.value);
        });
    }

    const campoRG = document.getElementById('rg');
    if (campoRG) {
        campoRG.addEventListener('input', function() {
            this.value = formatarRG(this.value);
        });
    }

    // Event listeners para exibir nome do arquivo selecionado
    const inputFoto = document.getElementById('ffoto');
    if (inputFoto) {
        inputFoto.addEventListener('change', function() {
            atualizarNomeArquivo('filedon', this.files[0]);
        });
    }

    const inputVideo = document.getElementById('vvideo');
    if (inputVideo) {
        inputVideo.addEventListener('change', function() {
            atualizarNomeArquivo('videodon', this.files[0]);
        });
    }

    // Função para adicionar listeners de navegação pelos passos
    function adicionarListenersPassos() {
        passosContainers.forEach((container, etapaIndex) => {
            if (container) {
                const passosElementos = container.querySelectorAll('.passo');
                passosElementos.forEach((passo, passoIndex) => {
                    passo.addEventListener('click', function() {
                        const etapaAtual = getEtapaAtual();
                        // Só permite voltar para passos anteriores
                        if (passoIndex < etapaAtual) {
                            mudarEtapa(etapaAtual, passoIndex);
                        }
                    });
                    // Adiciona cursor pointer para passos clicáveis
                    passo.style.cursor = 'pointer';
                });
            }
        });
    }

    // Função para descobrir qual etapa está ativa
    function getEtapaAtual() {
        for (let i = 0; i < etapas.length; i++) {
            if (etapas[i] && etapas[i].style.display !== 'none') {
                return i;
            }
        }
        return 0; // Retorna primeira etapa se não encontrar nenhuma ativa
    }

    // Função para alternar visibilidade da senha
    function toggleMostrarSenha(e) {
        const campoSenhaProximo = e.target.closest('.input-wrapper').querySelector('input');
        if (campoSenhaProximo.type === 'password') {
            campoSenhaProximo.type = 'text';
            e.target.classList.remove('fa-eye');
            e.target.classList.add('fa-eye-slash');
        } else {
            campoSenhaProximo.type = 'password';
            e.target.classList.remove('fa-eye-slash');
            e.target.classList.add('fa-eye');
        }
    }

    // Função para mudar de etapa
    function mudarEtapa(etapaAtual, proximaEtapa) {
        console.log('Mudando da etapa', etapaAtual + 1, 'para', proximaEtapa + 1);
        
        // Verificar se os elementos existem antes de manipulá-los
        if (!etapas[etapaAtual] || !etapas[proximaEtapa]) {
            console.error('Etapa não encontrada:', etapaAtual, proximaEtapa);
            return;
        }
        
        // Ocultar todas as etapas primeiro
        etapas.forEach((etapa, index) => {
            if (etapa) {
                etapa.style.display = 'none';
                if (passosContainers[index]) {
                    passosContainers[index].style.display = 'none';
                }
            }
        });
        
        // Mostrar próxima etapa
        etapas[proximaEtapa].style.display = 'block';
        if (passosContainers[proximaEtapa]) {
            passosContainers[proximaEtapa].style.display = 'flex';
        }
        
        // Atualizar indicadores de passo
        atualizarEstadoPassos(proximaEtapa);
        
        // Rolar para o topo
        window.scrollTo(0, 0);
    }

    // Função para atualizar o estado visual dos passos
    function atualizarEstadoPassos(etapaAtiva) {
        passosContainers.forEach((container, containerIndex) => {
            if (container) {
                const passosElementos = container.querySelectorAll('.passo');
                passosElementos.forEach((passo, passoIndex) => {
                    passo.classList.remove('ativo', 'disponivel', 'indisponivel');
                    if (passoIndex === etapaAtiva) {
                        passo.classList.add('ativo');
                    } else if (passoIndex < etapaAtiva) {
                        passo.classList.add('disponivel');
                    } else {
                        passo.classList.add('indisponivel');
                    }
                });
            }
        });
    }

    // Validação da etapa 1
    function validarEtapa1(e) {
        e.preventDefault();
        
        // Verificar se campos obrigatórios estão preenchidos
        const nome = document.getElementById('nome-completo')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const senha = document.getElementById('senha')?.value;
        const confirmaSenha = document.getElementById('confirma-senha')?.value;
        
        if (!nome) {
            mostrarModal('Por favor, preencha o nome completo.');
            return;
        }
        
        if (!email || !validarEmail(email)) {
            mostrarModal('Por favor, insira um e-mail válido.');
            return;
        }
        
        if (!validarSenhaCompleta(senha)) {
            mostrarModal('A senha não atende a todos os requisitos.');
            return;
        }
        
        if (senha !== confirmaSenha) {
            mostrarModal('As senhas não coincidem.');
            return;
        }
        
        // Se passou por todas as validações, avança para a próxima etapa
        mudarEtapa(0, 1);
    }

    // Validação da etapa 2
    function validarEtapa2(e) {
        e.preventDefault();
        
        // Verificar se campos obrigatórios estão preenchidos
        const telefone = document.getElementById('telefone')?.value?.trim();
        const endereco = document.getElementById('endereco')?.value?.trim();
        const cpf = document.getElementById('cpf')?.value?.trim();
        const rg = document.getElementById('rg')?.value?.trim();
        const cep = document.getElementById('cep')?.value?.trim();
        
        if (!telefone || telefone.length < 14) {
            mostrarModal('Por favor, insira um número de telefone válido.');
            return;
        }
        
        if (!endereco) {
            mostrarModal('Por favor, preencha o endereço completo.');
            return;
        }
        
        if (!validarCPF(cpf.replace(/\D/g, ''))) {
            mostrarModal('CPF inválido. Por favor, verifique.');
            return;
        }
        
        if (!validarRG(rg)) {
            mostrarModal('RG inválido. Por favor, verifique.');
            return;
        }
        
        if (!validarCEP(cep)) {
            mostrarModal('CEP inválido. Formato esperado: XXXXX-XXX');
            return;
        }
        
        // Se passou por todas as validações, avança para a próxima etapa
        mudarEtapa(1, 2);
    }

    // Validação da etapa 3
    function validarEtapa3(e) {
        e.preventDefault();
        
        const inputFoto = document.getElementById('ffoto');
        const inputVideo = document.getElementById('vvideo');
        const observacoes = document.getElementById('campos')?.value?.trim();
        
        // Verificar se a foto foi selecionada
        if (!inputFoto?.files?.length) {
            mostrarModal('Por favor, selecione uma foto 3x4.');
            return;
        }
        
        // Verificar se o vídeo foi selecionado
        if (!inputVideo?.files?.length) {
            mostrarModal('Por favor, selecione um vídeo esclarecedor.');
            return;
        }
        
        const arquivoFoto = inputFoto.files[0];
        const arquivoVideo = inputVideo.files[0];
        
        // Validar foto
        const validacaoFoto = validarFoto(arquivoFoto);
        if (!validacaoFoto.valido) {
            mostrarModal('Erro na foto: ' + validacaoFoto.mensagem);
            return;
        }
        
        // Validar vídeo
        const validacaoVideo = validarVideo(arquivoVideo);
        if (!validacaoVideo.valido) {
            mostrarModal('Erro no vídeo: ' + validacaoVideo.mensagem);
            return;
        }
        
        // Verificar observações
        if (!observacoes) {
            mostrarModal('Por favor, preencha o campo de observações.');
            return;
        }
        
        // Validações assíncronas (dimensões da foto e duração do vídeo)
        Promise.all([
            validarDimensoesFoto(arquivoFoto),
            validarDuracaoVideo(arquivoVideo)
        ]).then(([dimensoesValidas, validacaoDuracao]) => {
            if (!dimensoesValidas) {
                mostrarModal('A foto deve ter proporções próximas ao formato 3x4. Por favor, selecione uma foto com essas dimensões.');
                return;
            }
            
            if (!validacaoDuracao.valido) {
                mostrarModal('Erro na duração do vídeo: ' + validacaoDuracao.mensagem);
                return;
            }
            
            console.log('Validação da etapa 3 passou completamente, mudando para etapa 4');
            mudarEtapa(2, 3);
            
        }).catch(error => {
            console.error('Erro nas validações:', error);
            mostrarModal('Erro ao processar os arquivos. Por favor, tente novamente.');
        });
    }

    // Função para coletar todos os dados do formulário
    // Função para coletar todos os dados do formulário - CORRIGIDA
    function coletarDadosFormulario() {
        const formData = new FormData();
        
        // Dados da etapa 1 - Informações pessoais
        const nome = document.getElementById('nome-completo')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const senha = document.getElementById('senha')?.value;
        const confirmarSenha = document.getElementById('confirma-senha')?.value;
        
        if (nome) formData.append('nomeCompleto', nome); // Nome corrigido
        if (email) formData.append('email', email);
        if (senha) formData.append('senha', senha);
        if (confirmarSenha) formData.append('confirmarSenha', confirmarSenha); // Adicionado
        
        // Dados da etapa 2 - Contato e documentos
        const telefone = document.getElementById('telefone')?.value?.trim();
        const endereco = document.getElementById('endereco')?.value?.trim();
        const cpf = document.getElementById('cpf')?.value?.trim();
        const rg = document.getElementById('rg')?.value?.trim();
        const cep = document.getElementById('cep')?.value?.trim();
        
        if (telefone) formData.append('telefone', telefone);
        if (endereco) formData.append('endereco', endereco);
        if (cpf) formData.append('cpf', cpf);
        if (rg) formData.append('rg', rg);
        if (cep) formData.append('cep', cep);
        
        // Dados da etapa 3 - Arquivos e observações
        const inputFoto = document.getElementById('ffoto');
        const inputVideo = document.getElementById('vvideo');
        const observacoes = document.getElementById('campos')?.value?.trim();
        
        // Nomes dos arquivos devem bater com o multer
        if (inputFoto?.files?.[0]) {
            formData.append('fileDon', inputFoto.files[0]); // Nome correto para multer
        }
        if (inputVideo?.files?.[0]) {
            formData.append('videoDon', inputVideo.files[0]); // Nome correto para multer
        }
        if (observacoes) formData.append('obvdon', observacoes); // Nome corrigido
        
        // Dados da etapa 4 - Informações complementares
        const estadoCivil = document.querySelector('input[name="estadoCivil"]:checked')?.value;
        const numeroPessoas = document.getElementById('numerodepessoas')?.value?.trim();
        const ocupacao = document.getElementById('ocupacao')?.value?.trim();
        const termosAceitos = document.getElementById('termos')?.checked;
        
        // Coletar checkboxes de pessoas (idosos, crianças, deficientes)
        const pessoasCheckboxes = document.querySelectorAll('input[name="pessoas"]:checked');
        const pessoasSelecionadas = Array.from(pessoasCheckboxes).map(cb => cb.value);
        
        if (estadoCivil) formData.append('estadoCivil', estadoCivil); // Nome correto
        if (numeroPessoas) formData.append('numerodepessoas', numeroPessoas); // Nome correto
        if (ocupacao) formData.append('ocupacao', ocupacao);
        if (pessoasSelecionadas.length > 0) {
            formData.append('pessoas', pessoasSelecionadas.join(',')); // Array como string
        }
        formData.append('termos', termosAceitos ? '1' : '0');
        
        return formData;
    }

    // Função para enviar dados para o backend
    async function enviarDadosBackend(formData) {
        try {
            // Mostrar indicador de carregamento
            mostrarCarregamento(true);
            
            // Configurar a requisição
            const response = await fetch('/cadastrar/donatario', {
                method: 'POST',
                body: formData
            });
            
            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }
            
            // Processar resposta de sucesso
            const resultado = await response.json();
            console.log('Dados enviados com sucesso:', resultado);
            
            // Mostrar mensagem de sucesso
            mostrarModal('Cadastro realizado com sucesso! Você será redirecionado em alguns segundos.');
            
            // Redirecionar após 3 segundos
            setTimeout(() => {
                if (resultado.redirectTo) {
                    window.location.href = resultado.redirectTo;
                } else {
                    window.location.href = '/login';
                }
            }, 1500);
            
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            mostrarModal('Erro ao processar seu cadastro: ' + error.message + '. Por favor, tente novamente.');
        } finally {
            // Ocultar indicador de carregamento
            mostrarCarregamento(false);
        }
    }

    // Função para mostrar/ocultar indicador de carregamento
    function mostrarCarregamento(mostrar) {
        const btnEnviar = document.getElementById('enviar');
        if (btnEnviar) {
            if (mostrar) {
                btnEnviar.disabled = true;
                btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
            } else {
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = 'Finalizar Cadastro';
            }
        }
    }

    // Validação da etapa 4 (final) - CORRIGIDA
    function validarEtapa4(e) {
        e.preventDefault();
        
        const estadoCivil = document.querySelector('input[name="estadoCivil"]:checked');
        const numeroPessoas = document.getElementById('numerodepessoas')?.value?.trim();
        const ocupacao = document.getElementById('ocupacao')?.value?.trim();
        const termosAceitos = document.getElementById('termos')?.checked;
        
        if (!estadoCivil) {
            mostrarModal('Por favor, selecione seu estado civil.');
            return;
        }
        
        if (!numeroPessoas || numeroPessoas <= 0) {
            mostrarModal('Por favor, insira um número válido de pessoas na casa.');
            return;
        }
        
        if (!ocupacao) {
            mostrarModal('Por favor, informe sua ocupação/profissão.');
            return;
        }
        
        if (!termosAceitos) {
            mostrarModal('Para prosseguir, você precisa aceitar os termos de uso e a política de privacidade.');
            return;
        }
        
        // Coletar todos os dados do formulário
        const dadosFormulario = coletarDadosFormulario();
        
        // Enviar dados para o backend
        enviarDadosBackend(dadosFormulario);
    }

    // Funções de validação de campos específicos
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validarCPF(cpf) {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais (caso inválido)
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let resto = soma % 11;
        let dv1 = resto < 2 ? 0 : 11 - resto;
        
        if (dv1 !== parseInt(cpf.charAt(9))) return false;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        resto = soma % 11;
        let dv2 = resto < 2 ? 0 : 11 - resto;
        
        if (dv2 !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    function validarRG(rg) {
        // Remove caracteres não alfanuméricos
        rg = rg.replace(/[^\w]/g, '');
        
        // RG deve ter entre 5 e 14 caracteres
        return rg.length >= 5 && rg.length <= 14;
    }

    function validarCEP(cep) {
        const re = /^[0-9]{5}-[0-9]{3}$/;
        return re.test(cep);
    }

    // Validação completa da foto
    function validarFoto(arquivo) {
        // Verificar se o arquivo existe
        if (!arquivo) {
            return { valido: false, mensagem: 'Nenhuma foto foi selecionada.' };
        }
        
        // Verificar tipo de arquivo
        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!tiposPermitidos.includes(arquivo.type)) {
            return { 
                valido: false, 
                mensagem: 'Formato de foto inválido. Use apenas JPG, JPEG ou PNG.' 
            };
        }
        
        // Verificar tamanho do arquivo (máximo 10MB)
        const tamanhoMaximo = 10 * 1024 * 1024; // 10MB em bytes
        if (arquivo.size > tamanhoMaximo) {
            return { 
                valido: false, 
                mensagem: 'A foto é muito grande. O tamanho máximo é 10MB.' 
            };
        }
        
        return { valido: true, mensagem: 'Foto válida.' };
    }

    // Validação das dimensões da foto (formato 3x4)
    function validarDimensoesFoto(arquivo) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(arquivo);
            
            img.onload = function() {
                const largura = this.naturalWidth;
                const altura = this.naturalHeight;
                
                // Calcular proporção (3:4 = 0.75)
                const proporcao = largura / altura;
                const proporcaoIdeal = 3 / 4; // 0.75
                
                // Permitir uma tolerância de ±15% na proporção
                const tolerancia = 0.15;
                const proporcaoMinima = proporcaoIdeal - tolerancia;
                const proporcaoMaxima = proporcaoIdeal + tolerancia;
                
                console.log(`Dimensões da foto: ${largura}x${altura}`);
                console.log(`Proporção atual: ${proporcao.toFixed(3)}`);
                console.log(`Proporção esperada: ${proporcaoIdeal} (±${tolerancia})`);
                
                const dimensoesValidas = proporcao >= proporcaoMinima && proporcao <= proporcaoMaxima;
                
                // Limpar o URL do objeto para liberar memória
                URL.revokeObjectURL(url);
                
                resolve(dimensoesValidas);
            };
            
            img.onerror = function() {
                URL.revokeObjectURL(url);
                reject(new Error('Erro ao carregar a imagem'));
            };
            
            img.src = url;
        });
    }

    // Validação completa do vídeo
    function validarVideo(arquivo) {
        // Verificar se o arquivo existe
        if (!arquivo) {
            return { valido: false, mensagem: 'Nenhum vídeo foi selecionado.' };
        }
        
        // Verificar se é um arquivo de vídeo
        if (!arquivo.type.startsWith('video/')) {
            return { 
                valido: false, 
                mensagem: 'Formato de arquivo inválido. Selecione um arquivo de vídeo.' 
            };
        }
        
        // Verificar tamanho do arquivo (máximo 200MB)
        const tamanhoMaximo = 200 * 1024 * 1024; // 200MB em bytes
        if (arquivo.size > tamanhoMaximo) {
            return { 
                valido: false, 
                mensagem: 'O vídeo é muito grande. O tamanho máximo é 200MB.' 
            };
        }
        
        return { valido: true, mensagem: 'Vídeo válido.' };
    }

    // Validação da duração do vídeo (máximo 2 minutos)
    function validarDuracaoVideo(arquivo) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const url = URL.createObjectURL(arquivo);
            
            video.onloadedmetadata = function() {
                const duracao = this.duration; // duração em segundos
                const duracaoMaxima = 2 * 60; // 2 minutos em segundos
                
                console.log(`Duração do vídeo: ${duracao.toFixed(2)} segundos`);
                console.log(`Duração máxima permitida: ${duracaoMaxima} segundos`);
                
                const duracaoValida = duracao <= duracaoMaxima;
                
                // Limpar o URL do objeto para liberar memória
                URL.revokeObjectURL(url);
                
                resolve({
                    valido: duracaoValida,
                    duracao: duracao,
                    mensagem: duracaoValida ? 
                        'Duração do vídeo é válida.' : 
                        `O vídeo deve ter no máximo 2 minutos. Duração atual: ${Math.ceil(duracao/60)} minuto(s).`
                });
            };
            
            video.onerror = function() {
                URL.revokeObjectURL(url);
                reject(new Error('Erro ao carregar o vídeo'));
            };
            
            video.src = url;
        });
    }

    // Validação dos requisitos de senha em tempo real
    function validarRequisitos() {
        const senha = document.getElementById('senha')?.value || '';
        
        // Validar requisitos individuais
        const oitoDigitos = senha.length >= 8;
        const doisNumeros = (senha.match(/[0-9]/g) || []).length >= 2;
        const caractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        const letraMaiuscula = /[A-Z]/.test(senha);
        
        // Atualizar indicadores visuais
        atualizarIndicadorRequisito('requisito-oito-digitos', oitoDigitos);
        atualizarIndicadorRequisito('requisito-dois-numeros', doisNumeros);
        atualizarIndicadorRequisito('requisito-caractere-especial', caractereEspecial);
        atualizarIndicadorRequisito('requisito-letra-maiuscula', letraMaiuscula);
    }

    function atualizarIndicadorRequisito(id, cumprido) {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (cumprido) {
                elemento.classList.add('cumprido');
            } else {
                elemento.classList.remove('cumprido');
            }
        }
    }

    function validarSenhaCompleta(senha) {
        if (!senha) return false;
        
        // Verifica todos os requisitos
        const oitoDigitos = senha.length >= 8;
        const doisNumeros = (senha.match(/[0-9]/g) || []).length >= 2;
        const caractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        const letraMaiuscula = /[A-Z]/.test(senha);
        
        return oitoDigitos && doisNumeros && caractereEspecial && letraMaiuscula;
    }

    // Funções de formatação de campos
    function formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);
        
        if (telefone.length > 10) {
            telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (telefone.length > 6) {
            telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (telefone.length > 2) {
            telefone = telefone.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        } else if (telefone.length > 0) {
            telefone = telefone.replace(/^(\d{0,2}).*/, '($1');
        }
        
        return telefone;
    }

    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        
        return cpf;
    }

    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length > 8) cep = cep.substring(0, 8);
        
        cep = cep.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
        
        return cep;
    }

    function formatarRG(rg) {
        rg = rg.replace(/\D/g, '');
        if (rg.length > 9) rg = rg.substring(0, 9);
        
        return rg;
    }

    // Função para mostrar modal (unificada para erros e sucesso)
    function mostrarModal(mensagem) {
        const modalBody = document.getElementById('erroSenhaModalBody');
        if (modalBody) {
            modalBody.textContent = mensagem;

            // Usa o Bootstrap para mostrar o modal
            const erroModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
            erroModal.show();
        } else {
            // Fallback se o modal não existir
            alert(mensagem);
        }
    }

    // Função para atualizar o nome do arquivo selecionado
    function atualizarNomeArquivo(labelId, arquivo) {
        const label = document.getElementById(labelId);
        if (label && arquivo) {
            // Truncar nome se for muito longo
            const nomeArquivo = arquivo.name.length > 30 ?
                arquivo.name.substring(0, 27) + '...' :
                arquivo.name;

            // Preservar o input dentro do label e apenas atualizar o texto
            const input = label.querySelector('input[type="file"]');
            if (input) {
                // Criar novo conteúdo preservando o input
                label.innerHTML = `<i class="fas fa-file"></i> ${nomeArquivo}`;
                label.appendChild(input);
            } else {
                label.innerHTML = `<i class="fas fa-file"></i> ${nomeArquivo}`;
            }
        } else if (label) {
            // Reset para o texto padrão se nenhum arquivo selecionado
            const input = label.querySelector('input[type="file"]');
            if (input) {
                label.innerHTML = 'Upload arquivo';
                label.appendChild(input);
            } else {
                label.innerHTML = 'Upload arquivo';
            }
        }
    }

    // Função adicional para debug de formulário
    function debugFormulario() {
        console.log('=== DEBUG FORMULÁRIO ===');
        const formData = coletarDadosFormulario();
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    }

    // Função para validar conectividade com o backend
    async function testarConexaoBackend() {
        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ Conexão com backend estabelecida');
                return true;
            } else {
                console.warn('⚠️ Backend respondeu com erro:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro de conexão com backend:', error);
            return false;
        }
    }

    // Inicializar estado dos passos na primeira carga
    atualizarEstadoPassos(0); // Começa no primeiro passo

    // Testar conexão com backend na inicialização
    testarConexaoBackend();

    // Debug: Verificar se todos os elementos necessários existem
    console.log('=== DEBUG ELEMENTOS ===');
    console.log('Etapas encontradas:', etapas.map((e, i) => e ? `etapa${i+1}: OK` : `etapa${i+1}: ERRO`));
    console.log('Passos containers encontrados:', passosContainers.map((p, i) => p ? `container${i+1}: OK` : `container${i+1}: ERRO`));
    console.log('Botões encontrados:', {
        continuar1: document.getElementById('continuar1') ? 'OK' : 'ERRO',
        continuar2: document.getElementById('continuar2') ? 'OK' : 'ERRO',
        continuar3: document.getElementById('continuar3') ? 'OK' : 'ERRO',
        enviar: document.getElementById('enviar') ? 'OK' : 'ERRO',
        voltar1: document.getElementById('voltar1') ? 'OK' : 'ERRO',
        voltar2: document.getElementById('voltar2') ? 'OK' : 'ERRO',
        voltar3: document.getElementById('voltar3') ? 'OK' : 'ERRO'
    });

    window.debugFormulario = debugFormulario;
    window.testarConexaoBackend = testarConexaoBackend;
});