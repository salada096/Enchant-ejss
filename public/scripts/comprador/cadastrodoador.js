document.addEventListener('DOMContentLoaded', () => {

    class FormManager {
        constructor() {
            this.formWrapper = document.querySelector('.formulario');
            if (!this.formWrapper) return;

            this.form = this.formWrapper.querySelector('#cadastro-form-multistep');
            
            this.passos = this.formWrapper.querySelectorAll('.passo');
            this.partes = this.form.querySelectorAll('.parte');

            this.dropdown = this.formWrapper.querySelector('#tipo-doador-dropdown');
            this.dropdownText = this.formWrapper.querySelector('#dropdown-text');
            this.dropdownOptions = this.formWrapper.querySelector('.dropdown-options');
            this.hiddenDoadorValue = this.formWrapper.querySelector('#tipo_doador_value');

            this.dynamicSections = {
                pessoa: document.getElementById('form-dinamico-pessoa'),
                ong: document.getElementById('form-dinamico-ong'),
                instituicao: document.getElementById('form-dinamico-instituicao'),
            };
            
            this.modalEl = document.getElementById('avisoModal');
            this.modalBody = document.getElementById('avisoModalBody');
            this.modal = this.modalEl ? new bootstrap.Modal(this.modalEl) : null;

            this.ongCertificacaoCheckbox = this.form.querySelector('#ong-possui-certificacao');
            this.certificadosContainer = this.form.querySelector('#certificados-container');
            this.listaUploadsCertificados = this.form.querySelector('#lista-uploads-certificados');
            this.btnAddCertificado = this.form.querySelector('#btn-adicionar-certificado');
            this.uploadCounter = 0;
            this.uploadedFileNames = new Set();

            this.currentStep = 1;
            this.maxStepReached = 1;
            this.selectedDoadorFormType = null;

            this.init();
        }

        init() {
            this.setupFormatters();
            this.setupPasswordRequirementsLogic();
            this.setupOngCertificadosLogic();
            this.bindEvents();
            this.navigateToStep(1);
        }

        bindEvents() {
            this.passos.forEach(passo => {
                passo.addEventListener('click', () => {
                    const targetStep = parseInt(passo.dataset.step, 10);
                    if (targetStep <= this.maxStepReached) {
                        this.navigateToStep(targetStep);
                    }
                });
            });

            this.form.querySelector('#btn-continuar-1').addEventListener('click', () => this.handleContinue(1));
            this.form.querySelector('#btn-voltar-2').addEventListener('click', () => this.navigateToStep(1));
            
            const selectedBox = this.dropdown.querySelector('.dropdown-selected');
            selectedBox.addEventListener('click', () => {
                this.dropdown.classList.toggle('open');
            });

            this.dropdownOptions.querySelectorAll('li').forEach(option => {
                option.addEventListener('click', () => {
                    this.dropdownText.textContent = option.textContent;
                    this.hiddenDoadorValue.value = option.dataset.value;
                    this.selectedDoadorFormType = option.dataset.form;
                    this.dropdown.classList.remove('open');
                    this.prepareStep2(); // Adicionado para exibir/ocultar a seção dinâmica após a seleção
                });
            });
            
            window.addEventListener('click', (e) => {
                if (!this.dropdown.contains(e.target)) {
                    this.dropdown.classList.remove('open');
                }
            });

            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        navigateToStep(stepNumber) {
            this.currentStep = stepNumber;
            
            this.partes.forEach((parte, index) => {
                parte.style.display = (index + 1) === stepNumber ? 'block' : 'none';
            });

            this.passos.forEach((passo, index) => {
                const step = index + 1;
                passo.classList.remove('ativo', 'concluido');

                if (step < this.currentStep) {
                    passo.classList.add('concluido');
                } else if (step === this.currentStep) {
                    passo.classList.add('ativo');
                }
            });

            window.scrollTo({ top: this.formWrapper.offsetTop - 80, behavior: 'smooth' });
        }
        
        handleContinue(fromStep) {
            const validationResult = this.validateStep1();

            if (validationResult.isValid) {
                const nextStep = fromStep + 1;
                this.maxStepReached = Math.max(this.maxStepReached, nextStep);
                this.prepareStep2();
                this.navigateToStep(nextStep);
            } else {
                this.mostrarAviso(validationResult.errors.join('<br>'));
            }
        }
        
        prepareStep2() {
            const formType = this.selectedDoadorFormType;
            const instituicaoValue = this.hiddenDoadorValue.value;

            Object.values(this.dynamicSections).forEach(section => section.style.display = 'none');
            
            if (this.dynamicSections[formType]) {
                this.dynamicSections[formType].style.display = 'block';
            }
            
            if (formType === 'instituicao') {
                const select = document.getElementById('instituicao-tipo');
                const optionExists = select.querySelector(`option[value="${instituicaoValue}"]`);
                select.value = optionExists ? instituicaoValue : 'outra';
            }
        }
        
        handleSubmit() {
            let errors = [];
            const step1Validation = this.validateStep1();
            const step2Validation = this.validateStep2();

            if (!step1Validation.isValid) {
                errors.push(...step1Validation.errors);
            }
            if (!step2Validation.isValid) {
                errors.push(...step2Validation.errors);
            }

            if (!this.form.querySelector('#termos-gerais').checked) {
                errors.push('Você deve aceitar os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong>.');
            }
            
            const uniqueErrors = [...new Set(errors)];

            if (uniqueErrors.length > 0) {
                this.mostrarAviso(uniqueErrors.join('<br>'));
            } else {
                this.mostrarAviso('Cadastro realizado com sucesso!');
            }
        }

        setupOngCertificadosLogic() {
            if (!this.ongCertificacaoCheckbox) return;

            this.ongCertificacaoCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.showCertificadosArea();
                } else {
                    this.hideCertificadosArea();
                }
            });

            this.btnAddCertificado.addEventListener('click', () => {
                this.adicionarCampoUpload();
            });

            this.listaUploadsCertificados.addEventListener('click', (e) => {
                if (e.target.closest('.btn-remover')) {
                    const itemToRemove = e.target.closest('.upload-item');
                    this.removerCampoUpload(itemToRemove);
                }
            });

            this.listaUploadsCertificados.addEventListener('change', (e) => {
                if (e.target.classList.contains('input-upload')) {
                    this.handleFileChange(e.target);
                }
            });
        }

        showCertificadosArea() {
            this.certificadosContainer.classList.add('visivel');
            if (this.listaUploadsCertificados.children.length === 0) {
                this.adicionarCampoUpload();
            }
        }

        hideCertificadosArea() {
            this.certificadosContainer.classList.remove('visivel');
        }

        adicionarCampoUpload() {
            this.uploadCounter++;
            const id = `ong_certificado_${this.uploadCounter}`;

            const novoUploadHTML = `
                <div class="upload-item">
                   <input type="file" name="ong_certificados[]" id="${id}" class="input-upload" accept=".jpg, .jpeg, .png, .pdf">
                   <label for="${id}" class="upload-label">
                      <i class="bi bi-paperclip"></i>
                      <span>Anexar certificado</span>
                   </label>
                   <span class="nome-arquivo">Nenhum arquivo selecionado</span>
                   <button type="button" class="btn-remover"><i class="bi bi-trash"></i></button>
                </div>
            `;
            
            this.listaUploadsCertificados.insertAdjacentHTML('beforeend', novoUploadHTML);
            this.updateRemoveButtonsVisibility();
        }

        removerCampoUpload(itemToRemove) {
            const input = itemToRemove.querySelector('.input-upload');
            const fileNameToRemove = input.dataset.currentFile;
            if (fileNameToRemove) {
                this.uploadedFileNames.delete(fileNameToRemove);
            }

            itemToRemove.style.transition = 'opacity 0.3s ease';
            itemToRemove.style.opacity = '0';
            setTimeout(() => {
                itemToRemove.remove();
                this.updateRemoveButtonsVisibility();
            }, 300);
        }
        
        updateRemoveButtonsVisibility() {
            const allItems = this.listaUploadsCertificados.querySelectorAll('.upload-item');
            allItems.forEach((item, index) => {
                const removeBtn = item.querySelector('.btn-remover');
                removeBtn.style.display = allItems.length > 1 ? 'block' : 'none';
            });
        }

        handleFileChange(input) {
            const nomeArquivoSpan = input.closest('.upload-item').querySelector('.nome-arquivo');
            const file = input.files[0];
            const oldFileName = input.dataset.currentFile;

            if (!file) { 
                nomeArquivoSpan.textContent = 'Nenhum arquivo selecionado';
                if(oldFileName) {
                    this.uploadedFileNames.delete(oldFileName);
                    input.dataset.currentFile = '';
                }
                return;
            }
            
            const newFileName = file.name;

            if (this.uploadedFileNames.has(newFileName) && newFileName !== oldFileName) {
                this.mostrarAviso('Este arquivo já foi adicionado. Por favor, escolha outro.');
                input.value = ''; 
                return;
            }

            if (oldFileName) {
                this.uploadedFileNames.delete(oldFileName); 
            }
            this.uploadedFileNames.add(newFileName); 
            input.dataset.currentFile = newFileName; 

            nomeArquivoSpan.textContent = newFileName;
        }

        validateStep1() {
            let errors = [];
            if (!this.form.querySelector('#nome-completo').value.trim()) errors.push('O campo <strong>Nome</strong> é obrigatório.');
            if (!this.validators.email(this.form.querySelector('#email').value)) errors.push('Por favor, insira um <strong>E-mail</strong> válido.');
            const senha = this.form.querySelector('#senha').value;
            if (!this.validators.senha(senha).valido) errors.push('A <strong>Senha</strong> não atende a todos os requisitos.');
            if (senha !== this.form.querySelector('#confirma-senha').value) errors.push('As <strong>senhas</strong> não coincidem.');
            if (!this.hiddenDoadorValue.value) errors.push('Selecione um <strong>Tipo de Doador</strong>.');
            
            return { isValid: errors.length === 0, errors };
        }

        validateStep2() {
            let errors = [];
            const formType = this.selectedDoadorFormType;
            
            if (formType === 'pessoa') {
                if (!this.validators.cpf(this.form.querySelector('#pessoa-cpf').value)) errors.push('Por favor, insira um <strong>CPF</strong> válido.');
                if (!this.form.querySelector('#pessoa-rg').value.trim()) errors.push('O campo <strong>RG</strong> é obrigatório.');
                if (!this.validators.telefone(this.form.querySelector('#pessoa-telefone').value)) errors.push('O <strong>Telefone</strong> é inválido.');
            } else if (formType === 'ong') {
                if (!this.validators.cnpj(this.form.querySelector('#ong-cnpj').value)) errors.push('O <strong>CNPJ</strong> da ONG é inválido.');
                if (!this.validators.telefone(this.form.querySelector('#ong-telefone').value)) errors.push('O <strong>Telefone</strong> da ONG é inválido.');
            } else if (formType === 'instituicao') {
                if (!this.form.querySelector('#instituicao-tipo').value) errors.push('Selecione o <strong>Tipo principal de instituição</strong>.');
                if (!this.validators.cnpj(this.form.querySelector('#instituicao-cnpj').value)) errors.push('O <strong>CNPJ</strong> da Instituição é inválido.');
                if (!this.validators.telefone(this.form.querySelector('#instituicao-telefone').value)) errors.push('O <strong>Telefone</strong> da Instituição é inválido.');
                if (!this.validators.cep(this.form.querySelector('#instituicao-cep').value)) errors.push('O <strong>CEP</strong> é inválido.');
                if (!this.form.querySelector('#instituicao-bairro').value.trim()) errors.push('O <strong>Bairro</strong> é obrigatório.');
            }
            
            return { isValid: errors.length === 0, errors };
        }
        
        setupFormatters() {
            const formatters = {
                'pessoa-cpf': this.formatCPF, 'ong-cnpj': this.formatCNPJ, 'instituicao-cnpj': this.formatCNPJ,
                'pessoa-telefone': this.formatTelefone, 'ong-telefone': this.formatTelefone, 'instituicao-telefone': this.formatTelefone,
                'instituicao-cep': this.formatCEP,
            };
            for (const [id, formatter] of Object.entries(formatters)) {
                const input = document.getElementById(id);
                if (input) input.addEventListener('input', (e) => formatter(e.target));
            }
            const cepInput = document.getElementById('instituicao-cep');
            if (cepInput) cepInput.addEventListener('blur', async (e) => {
                const cep = e.target.value.replace(/\D/g, '');
                if (cep.length !== 8) return;
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    if (!response.ok) throw new Error('Falha na requisição.');
                    const data = await response.json();
                    const bairroInput = document.getElementById('instituicao-bairro');
                    if (data.erro) { this.mostrarAviso('CEP não encontrado.'); } 
                    else if(bairroInput) { bairroInput.value = data.bairro; }
                } catch (error) { console.error('Erro ao buscar CEP:', error); }
            });
        }

        setupPasswordRequirementsLogic() {
            const senhaInput = document.getElementById('senha');
            const requisitos = {
                length: document.getElementById('req-length'), number: document.getElementById('req-number'),
                special: document.getElementById('req-special'), uppercase: document.getElementById('req-uppercase'),
            };
            if (senhaInput) senhaInput.addEventListener('input', () => {
                const validation = this.validators.senha(senhaInput.value);
                Object.keys(requisitos).forEach(key => {
                    const reqElement = requisitos[key];
                    if (reqElement) {
                        if (validation[key]) {
                            reqElement.classList.add('valid');
                        } else {
                            reqElement.classList.remove('valid');
                        }
                    }
                });
            });
        }

        mostrarAviso(mensagem) {
            if (this.modal && this.modalBody) {
                this.modalBody.innerHTML = mensagem;
                this.modal.show();
            } else {
                alert(mensagem.replace(/<br>/g, '\n').replace(/<[^>]*>?/gm, ''));
            }
        }

        validators = {
            email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase()),
            senha: (senha) => {
                const valido = senha.length >= 8 && (senha.match(/\d/g) || []).length >= 2 && /[!@#$%^&*(),.?":{}|<>]/.test(senha) && /[A-Z]/.test(senha);
                return { valido, length: senha.length >= 8, number: (senha.match(/\d/g) || []).length >= 2, special: /[!@#$%^&*(),.?":{}|<>]/.test(senha), uppercase: /[A-Z]/.test(senha) };
            },
            cnpj: (cnpj) => {
                cnpj = cnpj.replace(/[^\d]+/g, '');
                if (cnpj === '' || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
                let t = 12, n = cnpj.substring(0, t), d = cnpj.substring(t), s = 0, p = 5;
                for (let i = 0; i < t; i++) { s += parseInt(n.charAt(i)) * p--; if (p < 2) p = 9; }
                let r = s % 11 < 2 ? 0 : 11 - (s % 11);
                if (r !== parseInt(d.charAt(0))) return false;
                t = 13; n = cnpj.substring(0, t); s = 0, p = 6;
                for (let i = 0; i < t; i++) { s += parseInt(n.charAt(i)) * p--; if (p < 2) p = 9; }
                r = s % 11 < 2 ? 0 : 11 - (s % 11);
                return r === parseInt(d.charAt(1));
            },
            cpf: (cpf) => {
                cpf = cpf.replace(/[^\d]/g, '');
                if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
                let s = 0;
                for (let i = 1; i <= 9; i++) s += parseInt(cpf.substring(i - 1, i)) * (11 - i);
                let r = (s * 10) % 11;
                if (r === 10 || r === 11) r = 0;
                if (r !== parseInt(cpf.substring(9, 10))) return false;
                s = 0;
                for (let i = 1; i <= 10; i++) s += parseInt(cpf.substring(i - 1, i)) * (12 - i);
                r = (s * 10) % 11;
                if (r === 10 || r === 11) r = 0;
                return r === parseInt(cpf.substring(10, 11));
            },
            telefone: (tel) => tel.replace(/\D/g, '').length >= 10,
            cep: (cep) => cep.replace(/\D/g, '').length === 8,
        };

        formatCPF(input) { let v = input.value.replace(/\D/g, '').slice(0, 11); v = v.replace(/(\d{3})(\d)/, '$1.$2'); v = v.replace(/(\d{3})(\d)/, '$1.$2'); v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); input.value = v; }
        formatCNPJ(input) { let v = input.value.replace(/\D/g, '').slice(0, 14); v = v.replace(/^(\d{2})(\d)/, '$1.$2'); v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); v = v.replace(/(\d{4})(\d)/, '$1-$2'); input.value = v; }
        formatTelefone(input) { let v = input.value.replace(/\D/g, '').slice(0, 11); if (v.length > 10) { v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3'); } else if (v.length > 5) { v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3'); } else if (v.length > 2) { v = v.replace(/^(\d{2})(\d*)/, '($1) $2'); } else { v = v.replace(/^(\d*)/, '($1'); } input.value = v; }
        formatCEP(input) { let v = input.value.replace(/\D/g, '').slice(0, 8); v = v.replace(/(\d{5})(\d)/, '$1-$2'); input.value = v; }
    }

    new FormManager();
});