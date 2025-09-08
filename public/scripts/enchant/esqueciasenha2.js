 let inputs; // Variável global para os inputs
        const codigoDoEmail = '789012'; // Código de exemplo

        // Aguarda o DOM carregar completamente
        document.addEventListener('DOMContentLoaded', function() {
            inputs = document.querySelectorAll('.code-input');

            // Função para distribuir múltiplos dígitos pelos inputs
            function distributeDigits(startIndex, value) {
                const digits = value.replace(/\D/g, ''); // Remove caracteres não numéricos

                // Limpa todos os inputs primeiro se estiver colando/digitando sequência completa
                if (digits.length >= 6) {
                    inputs.forEach(input => input.value = '');
                    startIndex = 0;
                }

                // Distribui os dígitos pelos inputs
                for (let i = 0; i < Math.min(digits.length, inputs.length); i++) {
                    if (startIndex + i < inputs.length) {
                        inputs[startIndex + i].value = digits[i];
                    }
                }

                // Foca no próximo input vazio ou no último preenchido
                const nextEmptyIndex = Math.min(startIndex + digits.length, inputs.length - 1);
                if (nextEmptyIndex < inputs.length) {
                    inputs[nextEmptyIndex].focus();
                }
            }

            // Funcionalidade dos inputs
            inputs.forEach((input, index) => {
                // Limita a entrada a apenas números
                input.addEventListener('input', (e) => {
                    const value = e.target.value;

                    // Se foram digitados múltiplos caracteres (cola)
                    if (value.length > 1) {
                        e.preventDefault();
                        distributeDigits(index, value);
                        return;
                    }

                    // Validação para um único caractere - apenas números
                    if (!/^\d*$/.test(value)) {
                        e.target.value = '';
                        return;
                    }

                    // Move para o próximo input se digitou um número
                    if (value.length === 1 && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                });

                input.addEventListener('keydown', (e) => {
                    // Navegação com Backspace
                    if (e.key === 'Backspace') {
                        // Se o campo atual está vazio, vai para o anterior
                        if (e.target.value === '' && index > 0) {
                            inputs[index - 1].focus();
                        }
                        // Se tem conteúdo, limpa e permanece no mesmo campo
                        else if (e.target.value !== '') {
                            e.target.value = '';
                            e.preventDefault();
                        }
                    }

                    // Navegação com setas
                    if (e.key === 'ArrowLeft' && index > 0) {
                        e.preventDefault();
                        inputs[index - 1].focus();
                    }
                    if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                        e.preventDefault();
                        inputs[index + 1].focus();
                    }

                    // Navegação com Home/End
                    if (e.key === 'Home') {
                        e.preventDefault();
                        inputs[0].focus();
                    }
                    if (e.key === 'End') {
                        e.preventDefault();
                        inputs[inputs.length - 1].focus();
                    }

                    // Bloqueia teclas não numéricas (exceto teclas de controle)
                    if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                        e.preventDefault();
                    }
                });

                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const pastedData = (e.clipboardData || window.clipboardData).getData('text');
                    distributeDigits(0, pastedData); // Sempre começa do início quando cola
                });

                input.addEventListener('focus', (e) => {
                    e.target.select();
                });

                // Evita o comportamento padrão de alguns navegadores
                input.addEventListener('beforeinput', (e) => {
                    if (e.inputType === 'insertText' && !/^\d$/.test(e.data)) {
                        e.preventDefault();
                    }
                });
            });

            // Foca no primeiro input quando a página carrega
            if (inputs.length > 0) {
                inputs[0].focus();
            }
        });

        // Função para mostrar o modal usando Bootstrap nativo
        function showModal() {
            const modalElement = document.getElementById('mensagemModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }

        // Função para fechar o modal usando Bootstrap nativo
        function closeModal() {
            const modalElement = document.getElementById('mensagemModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }

        // Remove manipulação manual do data-bs-dismiss pois o Bootstrap cuida disso
        // document.addEventListener('click', function(e) {
        //     if (e.target.hasAttribute('data-bs-dismiss') && e.target.getAttribute('data-bs-dismiss') === 'modal') {
        //         closeModal();
        //     }
        // });

        // Função para confirmar o código
        function confirmCode() {
            if (!inputs) return; // Proteção se inputs não estiver definido

            const enteredCode = Array.from(inputs).map(input => input.value).join('');
            const modalBody = document.getElementById('mensagemModalBody');
            const modalLabel = document.getElementById('mensagemModalLabel');
            const modalElement = document.getElementById('mensagemModal');

            if (enteredCode.length < 6) {
                modalLabel.textContent = 'Atenção';
                modalBody.innerHTML = 'Por favor, digite todos os 6 dígitos do código.';
                showModal();
                return;
            }

            if (enteredCode === codigoDoEmail) {
                modalLabel.textContent = 'Sucesso';
                modalBody.innerHTML = 'Código confirmado com sucesso! Redirecionando...';
                showModal();

                // Redireciona após 2 segundos
                setTimeout(() => {
                    window.location.href = 'esqueciasenha3.html';
                }, 2000);
            } else {
                modalLabel.textContent = 'Código Incorreto';
                modalBody.innerHTML = 'O código digitado está incorreto. Por favor, tente novamente.';
                showModal();

                // Limpa os campos após erro
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                    setTimeout(() => {
                        inputs.forEach(input => input.value = '');
                        if (inputs.length > 0) inputs[0].focus();
                    }, 500);
                }, 2000);
            }
        }

        // Função para reenviar código
        function resendCode() {
            const resendBtn = document.getElementById('resendBtn');
            const modalBody = document.getElementById('mensagemModalBody');
            const modalLabel = document.getElementById('mensagemModalLabel');
            const modalElement = document.getElementById('mensagemModal');

            // Desabilita o botão
            resendBtn.disabled = true;
            resendBtn.textContent = 'Reenviando...';

            // Simula o reenvio
            setTimeout(() => {
                modalLabel.textContent = 'Código Reenviado';
                modalBody.innerHTML = 'Um novo código foi enviado para o seu email. Por favor, verifique sua caixa de entrada.';
                showModal();

                // Reabilita o botão após 30 segundos
                let countdown = 30;
                const countdownInterval = setInterval(() => {
                    resendBtn.textContent = `Reenviar em ${countdown}s`;
                    countdown--;

                    if (countdown < 0) {
                        clearInterval(countdownInterval);
                        resendBtn.disabled = false;
                        resendBtn.textContent = 'Reenviar código';
                    }
                }, 1000);
            }, 1500);
        }

        // Permite confirmar com Enter
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                confirmCode();
            }
            
            // Permite fechar modal com Escape
            if (e.key === 'Escape') {
                closeModal();
            }
        });