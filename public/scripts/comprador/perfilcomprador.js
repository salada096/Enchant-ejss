// perfilcomprador.js - Arquivo completo unificado

const userData = {
    orgName: "Nome Comprador",
    email: "nomecomprador@email.com", 
    password: "12345678C@",
    cnpj: "12.345.678/0001-95",
    phone: "(11) 91234-5678",
    estado: "Bahia",
    cidade: "Salvador",
    profileImage: "/api/placeholder/40/40",
    logoImage: null // Nova propriedade para a logo
};

// Variáveis globais
let isPasswordVisible = false;
let campoAtualComErro = '';
let logoPreviewData = null; // Para preview da logo

// ========== FUNÇÕES DE ATUALIZAÇÃO DA UI ==========

// Atualizar interface com dados do usuário 
function updateUI() {
    console.log('Atualizando UI...');
    
    // Atualizar elementos da página principal
    const orgNameElement = document.getElementById("org-name");
    const institutionNameElement = document.getElementById("institution-name");
    const emailElement = document.getElementById("email");
    const cnpjElement = document.getElementById("cnpj");
    const phoneElement = document.getElementById("phone");
    const estadoElement = document.getElementById("estado");
    const cidadeElement = document.getElementById("cidade");
    const profileImageElement = document.getElementById("profile-image");

    if (orgNameElement) orgNameElement.textContent = userData.orgName;
    if (institutionNameElement) institutionNameElement.textContent = userData.orgName;
    if (emailElement) emailElement.textContent = userData.email;
    if (cnpjElement) cnpjElement.textContent = userData.cnpj;
    if (phoneElement) phoneElement.textContent = userData.phone;
    if (estadoElement) estadoElement.textContent = userData.estado;
    if (cidadeElement) cidadeElement.textContent = userData.cidade;
    if (profileImageElement) profileImageElement.src = userData.profileImage;
    
    // Atualizar campos do formulário de edição
    const editInstitutionName = document.getElementById("edit-institution-name");
    const editEmail = document.getElementById("edit-email");
    const editPassword = document.getElementById("edit-password");
    const editCnpj = document.getElementById("edit-cnpj");
    const editPhone = document.getElementById("edit-phone");
    const editEstado = document.getElementById("edit-estado");
    const editCidade = document.getElementById("edit-cidade");

    if (editInstitutionName) editInstitutionName.value = userData.orgName;
    if (editEmail) editEmail.value = userData.email;
    if (editPassword) editPassword.value = userData.password;
    if (editCnpj) editCnpj.value = userData.cnpj;
    if (editPhone) editPhone.value = userData.phone;
    if (editEstado) editEstado.value = userData.estado;
    if (editCidade) editCidade.value = userData.cidade;
    
    // Atualizar exibição da logo
    updateLogoDisplay();
}

// Atualizar exibição da logo na tela principal
function updateLogoDisplay() {
    const logoDisplay = document.getElementById('logo-display');
    const logoPlaceholder = document.getElementById('logo-placeholder');
    const currentLogo = document.getElementById('current-logo');
    
    if (!logoDisplay) return;
    
    if (userData.logoImage) {
        if (logoPlaceholder) logoPlaceholder.style.display = 'none';
        if (currentLogo) {
            currentLogo.src = userData.logoImage;
            currentLogo.style.display = 'block';
        }
    } else {
        if (logoPlaceholder) logoPlaceholder.style.display = 'block';
        if (currentLogo) currentLogo.style.display = 'none';
    }
}

// ========== CONFIGURAÇÕES DE SENHA ==========

// Configurar toggle de senha na tela principal
function setupMainPasswordToggle() {
    const togglePassword = document.getElementById("toggle-password");
    const passwordDots = document.querySelector(".password-dots1");
    
    if (togglePassword && passwordDots) {
        togglePassword.addEventListener("click", function() {
            isPasswordVisible = !isPasswordVisible;
            if (isPasswordVisible) {
                passwordDots.textContent = userData.password;
                togglePassword.textContent = "🙈";
            } else {
                passwordDots.textContent = "••••••••";
                togglePassword.textContent = "👁️";
            }
        });
    }
}

// Configurar toggle de senha no modal de edição
function setupEditPasswordToggle() {
    const editPasswordField = document.getElementById("edit-password");
    const toggleEditPassword = document.getElementById("toggle-edit-password");
    
    if (toggleEditPassword && editPasswordField) {
        // Criar novo botão para evitar múltiplos listeners
        const newToggleButton = toggleEditPassword.cloneNode(true);
        toggleEditPassword.parentNode.replaceChild(newToggleButton, toggleEditPassword);
        
        newToggleButton.addEventListener("click", function() {
            if (editPasswordField.type === "password") {
                editPasswordField.type = "text";
                newToggleButton.innerHTML = '<span class="material-symbols-outlined1">visibility_off</span>';
            } else {
                editPasswordField.type = "password";
                newToggleButton.innerHTML = '<span class="material-symbols-outlined1">visibility</span>';
            }
        });
    }
}

// ========== MODAL DE EDIÇÃO DE INFORMAÇÕES ==========

// Abrir modal de edição
function openEditModal() {
    const editModal = document.getElementById("edit-modal");
    if (!editModal) {
        console.error("Modal de edição não encontrado");
        return;
    }

    const modalOverlay = createModalOverlay();
    modalOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
    editModal.style.display = "flex";
    editModal.style.zIndex = "1060";
    
    // Configurar o botão de mostrar/ocultar senha do modal de edição
    setupEditPasswordToggle();
    
    // Atualizar campos do formulário
    updateUI();
}

// Fechar modal de edição
function closeEditModal() {
    const modalOverlay = document.getElementById("modal-overlay");
    const editModal = document.getElementById("edit-modal");
    
    if (modalOverlay) {
        modalOverlay.style.display = "none";
    }
    if (editModal) {
        editModal.style.display = "none";
    }
    document.body.style.overflow = "auto";
}

// Salvar alterações
function saveChanges() {
    console.log('Salvando alterações...');
    
    // Validar o formulário antes de salvar
    if (validarFormulario()) {
        // Obter valores dos campos
        const editInstitutionName = document.getElementById("edit-institution-name");
        const editEmail = document.getElementById("edit-email");
        const editPassword = document.getElementById("edit-password");
        const editCnpj = document.getElementById("edit-cnpj");
        const editPhone = document.getElementById("edit-phone");
        const editEstado = document.getElementById("edit-estado");
        const editCidade = document.getElementById("edit-cidade");
        
        // Formatar campos antes de salvar
        if (editCnpj) {
            editCnpj.value = validadores.formatarCNPJ(editCnpj.value);
        }
        
        if (editPhone) {
            editPhone.value = validadores.formatarTelefone(editPhone.value);
        }
        
        // Atualizar os dados do usuário
        if (editInstitutionName) userData.orgName = editInstitutionName.value;
        if (editEmail) userData.email = editEmail.value;
        if (editPassword) userData.password = editPassword.value;
        if (editCnpj) userData.cnpj = editCnpj.value;
        if (editPhone) userData.phone = editPhone.value;
        if (editEstado) userData.estado = editEstado.value;
        if (editCidade) userData.cidade = editCidade.value;
        
        updateUI();
        closeEditModal();
        
        // Mostrar mensagem de sucesso
        mostrarModal('<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> Dados atualizados com sucesso!</div>');
    }
}

// ========== MODAL DE FOTO DE PERFIL ==========

// Abrir modal de foto
function openPhotoModal() {
    const photoModal = document.getElementById("photo-modal");
    if (photoModal) {
        const modalOverlay = createModalOverlay();
        modalOverlay.style.display = "block";
        document.body.style.overflow = "hidden";
        photoModal.style.display = "flex";
        photoModal.style.zIndex = "1060";
    }
}

// Fechar modal de foto
function closePhotoModal() {
    const photoModal = document.getElementById("photo-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    
    if (photoModal) {
        photoModal.style.display = "none";
    }
    if (modalOverlay) {
        modalOverlay.style.display = "none";
    }
    document.body.style.overflow = "auto";
}

// Salvar nova foto
function savePhoto() {
    const fileInput = document.getElementById("photo-upload");
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            userData.profileImage = e.target.result;
            const profileImage = document.getElementById("profile-image");
            if (profileImage) {
                profileImage.src = e.target.result;
            }
        };
        
        reader.readAsDataURL(fileInput.files[0]);
    }
    
    closePhotoModal();
}

// ========== MODAL DE LOGO ==========

// Abrir modal de logo
function openLogoModal() {
    const logoModal = document.getElementById("logo-modal");
    if (!logoModal) {
        console.error("Modal de logo não encontrado");
        return;
    }

    const modalOverlay = createModalOverlay();
    modalOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
    logoModal.style.display = "flex";
    logoModal.style.zIndex = "1060";
    
    // Configurar área de upload
    setupLogoUpload();
}

// Fechar modal de logo
function closeLogoModal() {
    const logoModal = document.getElementById("logo-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    
    if (logoModal) {
        logoModal.style.display = "none";
    }
    if (modalOverlay) {
        modalOverlay.style.display = "none";
    }
    document.body.style.overflow = "auto";
    
    // Limpar preview
    clearLogoPreview();
}

// Configurar funcionalidades de upload da logo
function setupLogoUpload() {
    const logoUploadArea = document.getElementById('logo-upload-area');
    const logoUpload = document.getElementById('logo-upload');
    
    if (!logoUploadArea || !logoUpload) return;
    
    // Eventos de drag and drop
    logoUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        logoUploadArea.classList.add('drag-over');
    });
    
    logoUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        logoUploadArea.classList.remove('drag-over');
    });
    
    logoUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        logoUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleLogoFile(files[0]);
        }
    });
    
    // Evento de mudança do input de arquivo
    logoUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleLogoFile(e.target.files[0]);
        }
    });
}

// Processar arquivo de logo
function handleLogoFile(file) {
    // Validar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!tiposPermitidos.includes(file.type)) {
        mostrarModal('<div class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill"></i> Formato não permitido. Use apenas JPG, PNG ou SVG.</div>');
        return;
    }
    
    // Validar tamanho (2MB máximo)
    const tamanhoMaximo = 2 * 1024 * 1024; // 2MB em bytes
    if (file.size > tamanhoMaximo) {
        mostrarModal('<div class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill"></i> Arquivo muito grande. O tamanho máximo é 2MB.</div>');
        return;
    }
    
    // Ler arquivo e mostrar preview
    const reader = new FileReader();
    reader.onload = function(e) {
        logoPreviewData = e.target.result;
        showLogoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Mostrar preview da logo (SEM CSS inline)
function showLogoPreview(imageSrc) {
    const logoUploadArea = document.getElementById('logo-upload-area');
    if (!logoUploadArea) return;
    
    logoUploadArea.innerHTML = `
        <div class="logo-preview-container">
            <img src="${imageSrc}" class="logo-preview-image" alt="Preview da logo">
            <button type="button" onclick="clearLogoPreview()" class="logo-preview-remove">×</button>
        </div>
        <p class="logo-preview-text">Clique em "Salvar" para confirmar a nova logo</p>
    `;
}

// Limpar preview da logo
function clearLogoPreview() {
    const logoUploadArea = document.getElementById('logo-upload-area');
    if (!logoUploadArea) return;
    
    logoUploadArea.innerHTML = `
        <i class="bi bi-cloud-upload logo-upload-icon"></i>
        <p>Clique ou arraste uma imagem aqui</p>
        <p class="logo-upload-subtitle">JPG, PNG, SVG (máx. 2MB)</p>
    `;
    
    logoPreviewData = null;
    
    // Limpar o input de arquivo
    const logoUpload = document.getElementById('logo-upload');
    if (logoUpload) {
        logoUpload.value = '';
    }
}

// Salvar nova logo
function saveLogo() {
    if (logoPreviewData) {
        userData.logoImage = logoPreviewData;
        updateLogoDisplay();
        mostrarModal('<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> Logo atualizada com sucesso!</div>');
    } else {
        // Se não há preview, remover logo atual
        userData.logoImage = null;
        updateLogoDisplay();
        mostrarModal('<div class="alert alert-info"><i class="bi bi-info-circle-fill"></i> Logo removida.</div>');
    }
    
    closeLogoModal();
}

// ========== FUNÇÕES PARA ABRIR PDFs ==========

// Abrir PDF de política de privacidade
function openPrivacyPDF() {
    const pdfUrl = '/assets/pdfs/politica-privacidade.pdf'; // Ajuste o caminho conforme necessário
    window.open(pdfUrl, '_blank');
}

// Abrir PDF de termos de serviço
function openTermsPDF() {
    const pdfUrl = '/assets/pdfs/termos-servico.pdf'; // Ajuste o caminho conforme necessário
    window.open(pdfUrl, '_blank');
}

// Manter as funções de modal antigas para compatibilidade (caso ainda sejam usadas no HTML)
function openPrivacyModal() {
    openPrivacyPDF();
}

function closePrivacyModal() {
    // Função mantida para compatibilidade, mas não faz nada já que abre PDF
}

function openTermsModal() {
    openTermsPDF();
}

function closeTermsModal() {
    // Função mantida para compatibilidade, mas não faz nada já que abre PDF
}

// ========== GESTÃO DE MODAIS ==========

// Criar overlay para modais
function createModalOverlay() {
    let modalOverlay = document.getElementById("modal-overlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "modal-overlay";
        modalOverlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1050;
        `;
        document.body.appendChild(modalOverlay);
        
        // Fechar modal ao clicar no overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeAllModals();
            }
        });
    }
    return modalOverlay;
}

// Função para fechar todos os modais
function closeAllModals() {
    closeEditModal();
    closePhotoModal();
    closeLogoModal();
}

// ========== FUNÇÕES DE VALIDAÇÃO ==========

// Objeto com funções de validação
const validadores = {
    validarNome: function(nome) {
        if (!nome || nome.trim() === "") {
            return { valido: false, mensagem: "O nome não pode ficar em branco." };
        }
        
        if (nome.trim().length < 3) {
            return { valido: false, mensagem: "O nome deve ter pelo menos 3 caracteres." };
        }
        
        const regexNome = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s.,'-]+$/;
        if (!regexNome.test(nome)) {
            return { 
                valido: false, 
                mensagem: "O nome contém caracteres não permitidos. Use apenas letras, números, espaços e os símbolos .,'-" 
            };
        }
        
        return { valido: true };
    },
    
    validarEmail: function(email) {
        if (!email || email.trim() === "") {
            return { valido: false, mensagem: "O email não pode ficar em branco." };
        }
        
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            return { 
                valido: false, 
                mensagem: "Formato de email inválido. Por favor, verifique se o email está no formato correto (exemplo@dominio.com)." 
            };
        }
        
        return { valido: true };
    },
    
    validarSenha: function(senha) {
        if (!senha || senha === "") {
            return { valido: false, mensagem: "A senha não pode ficar em branco." };
        }
        
        if (senha.length < 8) {
            return { 
                valido: false, 
                mensagem: "A senha deve ter no mínimo 8 caracteres." 
            };
        }
        
        if (!/[A-Z]/.test(senha)) {
            return { 
                valido: false, 
                mensagem: "A senha deve conter pelo menos uma letra maiúscula." 
            };
        }
        
        if (!/[0-9]/.test(senha)) {
            return { 
                valido: false, 
                mensagem: "A senha deve conter pelo menos um número." 
            };
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
            return { 
                valido: false, 
                mensagem: "A senha deve conter pelo menos um caractere especial (ex: !@#$%&*)." 
            };
        }
        
        return { valido: true };
    },
    
    validarCNPJ: function(cnpj) {
        if (!cnpj || cnpj.trim() === "") {
            return { valido: false, mensagem: "O CNPJ não pode ficar em branco." };
        }
        
        cnpj = cnpj.replace(/[^\d]+/g, '');
        
        if (cnpj.length !== 14) {
            return { 
                valido: false, 
                mensagem: "O CNPJ deve ter 14 dígitos (xx.xxx.xxx/xxxx-xx)." 
            };
        }
        
        if (/^(\d)\1+$/.test(cnpj)) {
            return { valido: false, mensagem: "CNPJ inválido." };
        }
        
        // Validação dos dígitos verificadores
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) {
            return { valido: false, mensagem: "CNPJ inválido." };
        }
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) {
            return { valido: false, mensagem: "CNPJ inválido." };
        }
        
        return { valido: true };
    },
    
    validarTelefone: function(telefone) {
        if (!telefone || telefone.trim() === "") {
            return { valido: false, mensagem: "O telefone não pode ficar em branco." };
        }
        
        const numeroLimpo = telefone.replace(/\D/g, '');
        
        if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
            return { 
                valido: false, 
                mensagem: "O número de telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)." 
            };
        }
        
        if (numeroLimpo.length === 11 && numeroLimpo.charAt(2) !== '9') {
            return { 
                valido: false, 
                mensagem: "Para celulares, o formato deve ser (XX) 9XXXX-XXXX" 
            };
        }
        
        const ddd = parseInt(numeroLimpo.substring(0, 2));
        if (ddd < 11 || ddd > 99) {
            return { valido: false, mensagem: "DDD inválido." };
        }
        
        return { valido: true };
    },
    
    formatarCNPJ: function(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    },
    
    formatarTelefone: function(telefone) {
        telefone = telefone.replace(/\D/g, '');
        
        if (telefone.length === 11) {
            return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else {
            return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
        }
    }
};

// Função para validar o formulário
function validarFormulario() {
    const campos = {
        "edit-institution-name": { 
            elemento: document.getElementById("edit-institution-name"),
            validador: validadores.validarNome,
            nome: "Nome da ONG" 
        },
        "edit-email": { 
            elemento: document.getElementById("edit-email"),
            validador: validadores.validarEmail,
            nome: "E-mail"
        },
        "edit-password": { 
            elemento: document.getElementById("edit-password"),
            validador: validadores.validarSenha,
            nome: "Senha"
        },
        "edit-cnpj": { 
            elemento: document.getElementById("edit-cnpj"),
            validador: validadores.validarCNPJ,
            nome: "CNPJ"
        },
        "edit-phone": { 
            elemento: document.getElementById("edit-phone"),
            validador: validadores.validarTelefone,
            nome: "Telefone"
        }
    };
    
    for (const id in campos) {
        const campo = campos[id];
        if (!campo.elemento) continue;
        
        const resultado = campo.validador(campo.elemento.value || "");
        
        if (!resultado.valido) {
            mostrarModalErro(campo.nome, resultado.mensagem);
            destacarCampoComErro(id);
            return false;
        }
    }
    
    return true;
}

// ========== FUNÇÕES DE FEEDBACK ==========

// Função para mostrar modal com mensagem personalizada
function mostrarModal(mensagem) {
    const modalBody = document.getElementById('erroSenhaModalBody');
    if (modalBody) {
        modalBody.innerHTML = mensagem;
        
        try {
            const erroModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
            erroModal.show();
        } catch (error) {
            console.error('Erro ao mostrar modal:', error);
            alert(mensagem.replace(/<[^>]*>?/gm, ''));
        }
    } else {
        alert(mensagem.replace(/<[^>]*>?/gm, ''));
    }
}

// Função para exibir modal de erro
function mostrarModalErro(campo, mensagem) {
    const titulo = `Erro de validação: ${campo}`;
    
    const conteudo = `
        <div class="alert alert-danger" role="alert">
            <h5><i class="bi bi-exclamation-triangle-fill"></i> Problema no campo "${campo}"</h5>
            <p>${mensagem}</p>
        </div>
        <p>Por favor, corrija o campo e tente novamente.</p>
    `;
    
    const modalLabel = document.getElementById('erroSenhaModalLabel');
    const modalBody = document.getElementById('erroSenhaModalBody');
    
    if (modalLabel) modalLabel.textContent = titulo;
    if (modalBody) modalBody.innerHTML = conteudo;
    
    try {
        const erroModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
        erroModal.show();
        
        document.getElementById('erroSenhaModal').addEventListener('hidden.bs.modal', function() {
            const campo = document.getElementById(campoAtualComErro);
            if (campo) campo.focus();
        }, { once: true });
    } catch (error) {
        console.error('Erro ao mostrar modal:', error);
        alert(`${titulo}\n${mensagem}`);
    }
}

// Destacar campo com erro
function destacarCampoComErro(id) {
    campoAtualComErro = id;
    
    const campo = document.getElementById(id);
    if (campo) {
        campo.style.border = "2px solid #dc3545";
        campo.style.backgroundColor = "#fff8f8";
        
        const removerEstiloErro = function() {
            campo.style.border = "";
            campo.style.backgroundColor = "";
            campo.removeEventListener('input', removerEstiloErro);
        };
        
        campo.addEventListener('input', removerEstiloErro);
    }
}

// ========== MÁSCARAS DE ENTRADA ==========

// Configurar máscara de CNPJ
function configurarMascaraCNPJ() {
    const campoCNPJ = document.getElementById('edit-cnpj');
    if (!campoCNPJ) return;
    
    campoCNPJ.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 14) valor = valor.substring(0, 14);
        
        if (valor.length <= 2) {
            e.target.value = valor;
        } else if (valor.length <= 5) {
            e.target.value = valor.replace(/^(\d{2})(\d+)/, "$1.$2");
        } else if (valor.length <= 8) {
            e.target.value = valor.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
        } else if (valor.length <= 12) {
            e.target.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
        } else {
            e.target.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, "$1.$2.$3/$4-$5");
        }
    });
}

// Configurar máscara de telefone
function configurarMascaraTelefone() {
    const campoTelefone = document.getElementById('edit-phone');
    if (!campoTelefone) return;
    
    campoTelefone.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.substring(0, 11);
        
        if (valor.length <= 2) {
            e.target.value = valor;
        } else if (valor.length <= 6) {
            e.target.value = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
        } else if (valor.length <= 10) {
            e.target.value = valor.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
        } else {
            e.target.value = valor.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
        }
    });
}

// Configurar verificação de senha em tempo real
function configurarVerificacaoSenha() {
    const campoSenha = document.getElementById('edit-password');
    if (!campoSenha) return;
    
    campoSenha.addEventListener('input', function() {
        const senha = campoSenha.value;
        
        const checkLength = document.getElementById("check-length");
        const checkUppercase = document.getElementById("check-uppercase");
        const checkNumber = document.getElementById("check-number");
        const checkSpecial = document.getElementById("check-special");
        
        if (checkLength) {
            if (senha.length >= 8) {
                checkLength.style.color = "#198754";
                checkLength.style.fontWeight = "bold";
            } else {
                checkLength.style.color = "#666";
                checkLength.style.fontWeight = "normal";
            }
        }
        
        if (checkUppercase) {
            if (/[A-Z]/.test(senha)) {
                checkUppercase.style.color = "#198754";
                checkUppercase.style.fontWeight = "bold";
            } else {
                checkUppercase.style.color = "#666";
                checkUppercase.style.fontWeight = "normal";
            }
        }
        
        if (checkNumber) {
            if (/[0-9]/.test(senha)) {
                checkNumber.style.color = "#198754";
                checkNumber.style.fontWeight = "bold";
            } else {
                checkNumber.style.color = "#666";
                checkNumber.style.fontWeight = "normal";
            }
        }
        
        if (checkSpecial) {
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
                checkSpecial.style.color = "#198754";
                checkSpecial.style.fontWeight = "bold";
            } else {
                checkSpecial.style.color = "#666";
                checkSpecial.style.fontWeight = "normal";
            }
        }
    });
}

// ========== MELHORIAS ADICIONAIS ==========

// Função para aplicar máscara visual em tempo real no CNPJ
function aplicarMascaraCNPJVisual() {
    const campoCNPJ = document.getElementById('edit-cnpj');
    if (!campoCNPJ) return;
    
    campoCNPJ.addEventListener('blur', function() {
        if (this.value) {
            this.value = validadores.formatarCNPJ(this.value);
        }
    });
}

// Função para aplicar máscara visual em tempo real no telefone
function aplicarMascaraTelefoneVisual() {
    const campoTelefone = document.getElementById('edit-phone');
    if (!campoTelefone) return;
    
    campoTelefone.addEventListener('blur', function() {
        if (this.value) {
            this.value = validadores.formatarTelefone(this.value);
        }
    });
}

// Função para prevenir comportamentos indesejados nos modais
function prevenirComportamentosIndesejados() {
    // Prevenir que cliques nos conteúdos dos modais fechem os modais
    const modalContents = document.querySelectorAll('.modal-content1');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// ========== FUNÇÕES DE UTILIDADE ==========

// Adicionar Material Icons se não existir
function adicionarMaterialIcons() {
    if (!document.querySelector('link[href*="material-symbols"]')) {
        const materialIconsLink = document.createElement('link');
        materialIconsLink.rel = 'stylesheet';
        materialIconsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
        document.head.appendChild(materialIconsLink);
    }
}

// Função para converter arquivo para base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Função para redimensionar imagem se necessário
function redimensionarImagem(file, maxWidth = 400, maxHeight = 400) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            let { width, height } = img;
            
            // Calcular novas dimensões mantendo proporção
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(resolve, file.type, 0.8);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// ========== FUNÇÕES DE DEBUG ==========

// Função para debug - verificar elementos
function debugElements() {
    const elementos = [
        'org-name', 'institution-name', 'email', 'cnpj', 'phone', 
        'estado', 'cidade', 'profile-image', 'edit-modal', 'photo-modal'
    ];
    
    console.log('=== DEBUG ELEMENTOS ===');
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        console.log(`${id}: ${elemento ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
    });
}

// Função para debug específico das novas funcionalidades
function debugNovasFuncionalidades() {
    console.log('=== DEBUG NOVAS FUNCIONALIDADES ===');
    console.log('userData.logoImage:', userData.logoImage ? 'DEFINIDA' : 'NULL');
    console.log('logoPreviewData:', logoPreviewData ? 'DEFINIDA' : 'NULL');
    
    const elementosLogo = ['logo-display', 'logo-placeholder', 'current-logo', 'logo-upload-area', 'logo-upload'];
    elementosLogo.forEach(id => {
        const elemento = document.getElementById(id);
        console.log(`${id}: ${elemento ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
    });
    
    const modais = ['privacy-modal', 'terms-modal', 'logo-modal'];
    modais.forEach(id => {
        const modal = document.getElementById(id);
        console.log(`${id}: ${modal ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
    });
}

// ========== INICIALIZAÇÃO ==========

// Função principal de inicialização
function inicializar() {
    console.log('Inicializando aplicação...');
    
    // Adicionar ícones
    adicionarMaterialIcons();
    
    // Verificar se elementos essenciais existem
    const elementosEssenciais = [
        'org-name', 'institution-name', 'email', 'cnpj', 
        'phone', 'estado', 'cidade', 'profile-image'
    ];
    
    let elementosEncontrados = 0;
    elementosEssenciais.forEach(id => {
        if (document.getElementById(id)) {
            elementosEncontrados++;
        }
    });
    
    console.log(`Elementos encontrados: ${elementosEncontrados}/${elementosEssenciais.length}`);
    
    // Inicializar UI
    updateUI();
    
    // Configurar funcionalidades
    setupMainPasswordToggle();
    configurarMascaraCNPJ();
    configurarMascaraTelefone(); 
    configurarVerificacaoSenha();
    
    console.log('Inicialização concluída');
}

// Inicialização dos complementos
function inicializarComplementos() {
    console.log('Inicializando complementos...');
    
    // Configurar exibição inicial da logo
    updateLogoDisplay();
    
    // Adicionar event listeners para ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Aplicar melhorias adicionais
    aplicarMascaraCNPJVisual();
    aplicarMascaraTelefoneVisual();
    prevenirComportamentosIndesejados();
    
    // Verificar se todos os elementos de modal existem
    const modaisEssenciais = ['edit-modal', 'photo-modal', 'logo-modal'];
    modaisEssenciais.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal ${modalId} não encontrado`);
        }
    });
    
    console.log('Complementos inicializados');
}

// ========== DISPONIBILIZAR FUNÇÕES GLOBALMENTE ==========

// Garantir que todas as funções estejam disponíveis globalmente
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.saveChanges = saveChanges;
window.openPhotoModal = openPhotoModal;
window.closePhotoModal = closePhotoModal;
window.savePhoto = savePhoto;
window.openLogoModal = openLogoModal;
window.closeLogoModal = closeLogoModal;
window.saveLogo = saveLogo;
window.openPrivacyPDF = openPrivacyPDF;
window.openTermsPDF = openTermsPDF;
window.openPrivacyModal = openPrivacyModal; // Mantido para compatibilidade
window.closePrivacyModal = closePrivacyModal; // Mantido para compatibilidade
window.openTermsModal = openTermsModal; // Mantido para compatibilidade
window.closeTermsModal = closeTermsModal; // Mantido para compatibilidade
window.closeAllModals = closeAllModals;
window.debugElements = debugElements;
window.debugNovasFuncionalidades = debugNovasFuncionalidades;

// ========== AUTO-INICIALIZAÇÃO ==========

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        inicializar();
        // Aguardar um pouco para garantir que tudo foi carregado
        setTimeout(inicializarComplementos, 100);
    });
} else {
    inicializar();
    setTimeout(inicializarComplementos, 100);
}

console.log('Arquivo JavaScript completo carregado com sucesso!');