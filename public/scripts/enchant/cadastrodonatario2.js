
        document.addEventListener('DOMContentLoaded', function() {
            // Elementos do formulário
            const telefoneInput = document.getElementById('telefone');
            const cpfInput = document.getElementById('cpf');
            const rgInput = document.getElementById('rg');
            const cepInput = document.getElementById('cep');
            const enderecoInput = document.getElementById('endereco');
            const formCadastro = document.getElementById('formCadastro');
            
            // Função para mostrar o modal com mensagem personalizada
            function mostrarModal(mensagem) {
                const modalBody = document.getElementById('erroModalBody');
                if (modalBody) {
                    modalBody.innerHTML = mensagem;
                    
                    // Inicializar e mostrar o modal do Bootstrap
                    const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
                    erroModal.show();
                } else {
                    // Fallback para alert caso o modal não esteja disponível no HTML
                    alert(mensagem.replace(/<[^>]*>?/gm, ''));  // Remove tags HTML para exibir no alert
                }
            }
            
            // Função para validar o formato do telefone
            function validarTelefone(telefone) {
                // Remover caracteres não numéricos
                const telefoneNumerico = telefone.replace(/\D/g, '');
                // Verificar se tem entre 10 e 11 dígitos (com ou sem 9 no celular)
                return telefoneNumerico.length >= 10 && telefoneNumerico.length <= 11;
            }
            
            // Função para validar o CPF
            function validarCPF(cpf) {
                // Remover caracteres não numéricos
                const cpfNumerico = cpf.replace(/\D/g, '');
                // Verificar se tem 11 dígitos
                return cpfNumerico.length === 11;
            }
            
            // Função para validar o RG
            function validarRG(rg) {
                // Remover caracteres não numéricos
                const rgNumerico = rg.replace(/\D/g, '');
                // Verificar se tem entre 7 e 9 dígitos (varia por estado)
                return rgNumerico.length >= 7 && rgNumerico.length <= 9;
            }
            
            // Função para validar o CEP
            function validarCEP(cep) {
                // Remover caracteres não numéricos
                const cepNumerico = cep.replace(/\D/g, '');
                // Verificar se tem 8 dígitos
                return cepNumerico.length === 8;
            }
            
            // Função para validar o endereço
            function validarEndereco(endereco) {
                // Verifica se há caracteres especiais indevidos (permitindo apenas letras, números, espaços e alguns caracteres específicos)
                const regex = /^[a-zA-ZÀ-ÿ0-9\s\.,\-\/º°ª]+$/;
                return regex.test(endereco);
            }

            // Máscara para o telefone
            telefoneInput.addEventListener('input', function() {
                let valor = this.value.replace(/\D/g, '');
                let formatado = '';
                
                if (valor.length > 0) {
                    formatado = '(' + valor.substring(0, 2);
                }
                if (valor.length > 2) {
                    if (valor.length <= 10) {
                        // Formato para telefone fixo
                        formatado += ') ' + valor.substring(2, 6) + '-' + valor.substring(6, 10);
                    } else {
                        // Formato para celular com 9
                        formatado += ') ' + valor.substring(2, 7) + '-' + valor.substring(7, 11);
                    }
                }
                
                this.value = formatado;
            });

            // Máscara para o CPF
            cpfInput.addEventListener('input', function() {
                let valor = this.value.replace(/\D/g, '');
                let formatado = '';
                
                if (valor.length > 0) {
                    formatado = valor.substring(0, 3);
                }
                if (valor.length > 3) {
                    formatado += '.' + valor.substring(3, 6);
                }
                if (valor.length > 6) {
                    formatado += '.' + valor.substring(6, 9);
                }
                if (valor.length > 9) {
                    formatado += '-' + valor.substring(9, 11);
                }
                
                this.value = formatado;
            });
            
            // Máscara para o RG - permitir apenas números
            rgInput.addEventListener('input', function() {
                let valor = this.value.replace(/\D/g, '');
                
                // Limitar o RG a 9 dígitos no máximo
                if (valor.length > 9) {
                    valor = valor.substring(0, 9);
                }
                
                this.value = valor;
            });

            // Máscara para o CEP
            cepInput.addEventListener('input', function() {
                let valor = this.value.replace(/\D/g, '');
                let formatado = '';
                
                if (valor.length > 0) {
                    formatado = valor.substring(0, 5);
                }
                if (valor.length > 5) {
                    formatado += '-' + valor.substring(5, 8);
                }
                
                this.value = formatado;
            });
            
            // Validação do campo de endereço para remover caracteres especiais indesejados
            enderecoInput.addEventListener('input', function() {
                // Permitir apenas letras, números, espaços e caracteres comuns em endereços
                let valor = this.value;
                
                // Filtrar caracteres indesejados
                valor = valor.replace(/[^\w\sÀ-ÿ\.,\-\/º°ª]/g, '');
                
                this.value = valor;
            });

            // Adicionar evento de submit ao formulário
            formCadastro.addEventListener('submit', function(event) {
                event.preventDefault(); // Impedir o comportamento padrão do botão
                
                // Verificar se todos os campos obrigatórios estão preenchidos
                if (!telefoneInput.value || !enderecoInput.value || !cpfInput.value || !rgInput.value || !cepInput.value) {
                    mostrarModal('<p>Por favor, preencha todos os campos obrigatórios!</p>');
                    return;
                }
                
                // Validar formato do telefone
                if (!validarTelefone(telefoneInput.value)) {
                    mostrarModal('<p>Por favor, insira um número de telefone válido!</p>');
                    telefoneInput.focus();
                    return;
                }
                
                // Validar formato do CPF
                if (!validarCPF(cpfInput.value)) {
                    mostrarModal('<p>Por favor, insira um CPF válido!</p>');
                    cpfInput.focus();
                    return;
                }
                
                // Validar formato do RG
                if (!validarRG(rgInput.value)) {
                    mostrarModal('<p>Por favor, insira um RG válido (entre 7 e 9 dígitos)!</p>');
                    rgInput.focus();
                    return;
                }
                
                // Validar formato do CEP
                if (!validarCEP(cepInput.value)) {
                    mostrarModal('<p>Por favor, insira um CEP válido!</p>');
                    cepInput.focus();
                    return;
                }
                
                // Validar formato do endereço
                if (!validarEndereco(enderecoInput.value)) {
                    mostrarModal('<p>Por favor, verifique o endereço. Ele contém caracteres inválidos!</p>');
                    enderecoInput.focus();
                    return;
                }
                
                // Se passar por todas as validações, redirecionar para a próxima página
                window.location.href = 'cadastrodonatario3.html';
            });
        });
 
