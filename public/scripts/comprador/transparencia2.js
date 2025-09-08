// Dados armazenados em memória para contratos
let uploadedContracts = [];

// Configurações de validação para contratos
const contractValidationRules = {
    title: { min: 10, max: 200, required: true },
    description: { min: 20, max: 2000, required: true },
    year: { required: true },
    file: { required: true, maxSize: 15, allowedTypes: ['.pdf', '.doc', '.docx'] }
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    setupContractsForm();
    setupRealTimeValidation();
    setupDragAndDrop();
    setupModal();
    addCharacterCounters();
    updateContractsList();
});

function setupContractsForm() {
    const form = document.getElementById('contracts-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário completo
        const validation = validateContractsForm();
        
        if (!validation.isValid) {
            showAlert(`Por favor, corrija os seguintes campos: ${validation.errors.join(', ')}`, true);
            
            // Focar no primeiro campo com erro
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Coletar dados do formulário
        const formData = {
            title: document.getElementById('contract-title').value.trim(),
            description: document.getElementById('contract-description').value.trim(),
            year: document.getElementById('contract-year').value,
            file: '',
            fileSize: '',
            id: Date.now(),
            timestamp: new Date().toLocaleDateString('pt-BR'),
            uploadTime: new Date().toLocaleString('pt-BR')
        };
        
        const fileInput = document.getElementById('contract-file');
        if (fileInput.files[0]) {
            formData.file = fileInput.files[0].name;
            formData.fileSize = (fileInput.files[0].size / (1024 * 1024)).toFixed(2) + 'MB';
        }
        
        // Validações finais específicas para contratos
        const titleYear = formData.title.match(/20\d{2}/);
        if (titleYear && titleYear[0] !== formData.year) {
            if (!confirm(`O ano no título (${titleYear[0]}) não coincide com o ano selecionado (${formData.year}). Deseja continuar?`)) {
                return;
            }
        }
        
        // Adicionar aos dados
        uploadedContracts.push(formData);
        
        // Mostrar mensagem de sucesso
        showAlert(`Contrato "${formData.title}" foi publicado na seção de transparência.`);
        
        // Limpar formulário e resetar validações
        resetForm(form);
        
        // Atualizar lista
        updateContractsList();
    });
}

function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
            updateCharacterCounter(this);
        });
        
        input.addEventListener('change', function() {
            validateSingleField(this);
        });
    });

    // Validação especial para arquivos
    const fileInput = document.getElementById('contract-file');
    fileInput.addEventListener('change', function() {
        validateFileField(this);
    });
}

function validateSingleField(field) {
    const fieldId = field.id;
    const fieldName = fieldId.replace('contract-', '');
    
    if (!contractValidationRules[fieldName]) return;
    
    const rules = contractValidationRules[fieldName];
    const value = field.value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    // Validação de campo obrigatório
    if (rules.required && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    // Validação de tamanho mínimo
    else if (rules.min && value.length < rules.min) {
        isValid = false;
        errorMessage = `Mínimo de ${rules.min} caracteres. Atual: ${value.length}`;
    }
    // Validação de tamanho máximo
    else if (rules.max && value.length > rules.max) {
        isValid = false;
        errorMessage = `Máximo de ${rules.max} caracteres. Atual: ${value.length}`;
    }
    // Validações específicas para título
    else if (fieldName === 'title') {
        // Validar caracteres especiais excessivos
        const specialCharsCount = (value.match(/[^a-zA-Z0-9\sÀ-ÿ\-]/g) || []).length;
        if (specialCharsCount > 3) {
            isValid = false;
            errorMessage = 'Evite usar muitos caracteres especiais no título.';
        }
    }
    
    // Aplicar estilo visual
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        hideFieldError(fieldId);
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
        showFieldError(fieldId, errorMessage);
    }
    
    return isValid;
}

function validateFileField(fileInput) {
    const rules = contractValidationRules.file;
    const file = fileInput.files[0];
    const fileUploadDiv = fileInput.closest('.file-upload');
    
    let isValid = true;
    let errorMessage = '';
    
    if (rules.required && !file) {
        isValid = false;
        errorMessage = 'Por favor, selecione um arquivo.';
    } else if (file) {
        // Validar tamanho do arquivo
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > rules.maxSize) {
            isValid = false;
            errorMessage = `Arquivo muito grande. Máximo: ${rules.maxSize}MB. Atual: ${fileSizeMB.toFixed(1)}MB`;
        }
        
        // Validar tipo do arquivo
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!rules.allowedTypes.includes(fileExtension)) {
            isValid = false;
            errorMessage = `Tipo de arquivo não permitido. Aceitos: ${rules.allowedTypes.join(', ')}`;
        }
        
        // Validar nome do arquivo
        if (file.name.length > 100) {
            isValid = false;
            errorMessage = 'Nome do arquivo muito longo (máximo 100 caracteres).';
        }
    }
    
    // Aplicar estilo visual
    if (isValid) {
        fileUploadDiv.classList.remove('error');
        fileUploadDiv.classList.add('valid');
        hideFieldError('contract-file');
        if (file) {
            updateFileUploadDisplay(fileUploadDiv, file.name);
        }
    } else {
        fileUploadDiv.classList.remove('valid');
        fileUploadDiv.classList.add('error');
        showFieldError('contract-file', errorMessage);
    }
    
    return isValid;
}

function validateContractsForm() {
    const form = document.getElementById('contracts-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    let errors = [];

    // Mapa de tradução dos campos
    const fieldNames = {
        title: 'Título',
        description: 'Descrição',
        year: 'Ano',
        file: 'Arquivo',
        'título duplicado': 'Título duplicado'
    };

    // Validar cada campo
    inputs.forEach(input => {
        const fieldValid = input.type === 'file' ? 
            validateFileField(input) : 
            validateSingleField(input);
        
        if (!fieldValid) {
            isFormValid = false;
            const fieldName = input.id.replace('contract-', '');
            errors.push(fieldNames[fieldName] || fieldName);
        }
    });

    // Validar duplicatas
    const titleField = document.getElementById('contract-title');
    if (titleField && titleField.value.trim()) {
        const isDuplicate = uploadedContracts.some(item => 
            item.title.toLowerCase() === titleField.value.trim().toLowerCase()
        );
        
        if (isDuplicate) {
            isFormValid = false;
            showFieldError('contract-title', 'Já existe um contrato com este título.');
            titleField.classList.add('error');
            errors.push(fieldNames['título duplicado']);
        }
    }

    return { isValid: isFormValid, errors };
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearFieldError(field) {
    if (field.classList.contains('error')) {
        field.classList.remove('error');
        hideFieldError(field.id);
    }
}

function showAlert(message, isError = false) {
    const alertElement = document.getElementById(isError ? 'alert-contracts' : 'success-contracts');
    if (alertElement) {
        alertElement.textContent = message;
        alertElement.style.display = 'block';
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, isError ? 5000 : 3000);
    }
}

function resetForm(form) {
    form.reset();
    
    // Remover classes de validação
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.classList.remove('error', 'valid');
        hideFieldError(field.id);
    });
    
    // Resetar file upload
    const fileUpload = form.querySelector('.file-upload');
    if (fileUpload) {
        fileUpload.classList.remove('error', 'valid');
        const p = fileUpload.querySelector('p');
        p.textContent = 'Clique para selecionar o arquivo ou arraste aqui';
        fileUpload.style.borderColor = '#ddd';
        fileUpload.style.backgroundColor = '';
    }
    
    // Remover mensagem de edição
    const editMessage = form.querySelector('.edit-message');
    if (editMessage) {
        editMessage.style.display = 'none';
    }
    
    // Resetar botão
    const submitBtn = form.querySelector('.upload-btn');
    submitBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
        </svg>
        Adicionar Contrato
    `;
    
    // Atualizar contadores
    updateAllCharacterCounters();
}

function updateContractsList() {
    const listContainer = document.getElementById('contracts-list');
    
    // Limpar lista atual (manter apenas o título)
    const title = listContainer.querySelector('h3');
    listContainer.innerHTML = '';
    listContainer.appendChild(title);
    
    if (uploadedContracts.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nenhum contrato adicionado ainda.';
        emptyMessage.style.cssText = 'color: #666; font-style: italic; text-align: center; padding: 20px;';
        listContainer.appendChild(emptyMessage);
        return;
    }
    
    // Ordenar por data de upload (mais recente primeiro)
    const sortedContracts = [...uploadedContracts].sort((a, b) => b.id - a.id);
    
    // Criar lista de documentos
    const documentsList = document.createElement('div');
    documentsList.className = 'documents-list';
    
    sortedContracts.forEach(contract => {
        const documentItem = document.createElement('div');
        documentItem.className = 'document-item';
        
        documentItem.innerHTML = `
            <div class="document-header">
                <div class="document-info">
                    <h3>${contract.title}</h3>
                    <div class="document-description">
                        ${contract.description.length > 100 ? contract.description.substring(0, 100) + '...' : contract.description}
                    </div>
                    <div class="document-meta">Publicado em: ${contract.timestamp} | Tamanho: ${contract.fileSize || 'N/A'}</div>
                </div>
                <div class="document-actions">
                    <span class="file-size">${contract.year || '2024'}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 15px;">
                <button class="download-btn" onclick="downloadFile(${contract.id})">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="currentColor"/>
                    </svg>
                    Download
                </button>
                <button class="view-description-btn" onclick="showDescription(${contract.id})">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" fill="currentColor"/>
                    </svg>
                    Ver descrição
                </button>
                <button class="edit-btn" onclick="editContract(${contract.id})">Editar</button>
                <button class="delete-btn" onclick="deleteContract(${contract.id})">Excluir</button>
            </div>
        `;
        
        documentsList.appendChild(documentItem);
    });
    
    listContainer.appendChild(documentsList);
}

function downloadFile(id) {
    const contract = uploadedContracts.find(item => item.id === id);
    if (!contract) return;
    
    // Simular download
    const fileName = contract.file || 'contrato.pdf';
    const downloadMessage = `Download iniciado: ${fileName}`;
    
    // Mostrar feedback visual
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<span style="color: #28a745;">✓ Baixando...</span>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        alert(downloadMessage);
    }, 1500);
}

function showDescription(id) {
    const contract = uploadedContracts.find(item => item.id === id);
    if (!contract) return;

    const modal = document.getElementById('descriptionModal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    modalTitle.textContent = contract.title;
    modalDescription.textContent = contract.description;
    modal.style.display = 'block';
}

function editContract(id) {
    const contract = uploadedContracts.find(item => item.id === id);
    if (!contract) return;
    
    // Preencher o formulário com os dados do contrato
    document.getElementById('contract-title').value = contract.title;
    document.getElementById('contract-description').value = contract.description;
    document.getElementById('contract-year').value = contract.year;
    
    // Remover o contrato atual dos dados
    uploadedContracts = uploadedContracts.filter(i => i.id !== id);
    updateContractsList();
    
    // Rolar para o formulário
    document.getElementById('contracts-form').scrollIntoView({ behavior: 'smooth' });
    
    // Mostrar mensagem indicando que está editando
    const form = document.getElementById('contracts-form');
    let editMessage = form.querySelector('.edit-message');
    if (!editMessage) {
        editMessage = document.createElement('div');
        editMessage.className = 'edit-message';
        form.insertBefore(editMessage, form.firstChild);
    }
    editMessage.textContent = 'Editando contrato existente. Faça as alterações necessárias e clique em salvar.';
    editMessage.style.display = 'block';
    
    // Alterar texto do botão
    const submitBtn = form.querySelector('.upload-btn');
    submitBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
        </svg>
        Salvar Alterações
    `;
    
    // Remover mensagem após 10 segundos
    setTimeout(() => {
        if (editMessage) {
            editMessage.style.display = 'none';
            submitBtn.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                    <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
                </svg>
                Adicionar Contrato
            `;
        }
    }, 10000);
    
    // Atualizar contadores
    updateAllCharacterCounters();
}

function deleteContract(id) {
    const contract = uploadedContracts.find(item => item.id === id);
    if (!contract) return;
    
    const confirmMessage = `Tem certeza que deseja excluir "${contract.title}"?\n\nEsta ação não pode ser desfeita e o contrato será removido permanentemente da página de transparência.`;
    
    if (confirm(confirmMessage)) {
        uploadedContracts = uploadedContracts.filter(item => item.id !== id);
        updateContractsList();
        
        // Mostrar mensagem de confirmação
        showAlert(`Contrato "${contract.title}" foi excluído com sucesso.`);
    }
}

function setupDragAndDrop() {
    const fileUpload = document.querySelector('.file-upload');
    const input = fileUpload.querySelector('input[type="file"]');
    
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });
    
    fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
    });
    
    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            validateFileField(input);
        }
    });
    
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            validateFileField(e.target);
        }
    });
}

function updateFileUploadDisplay(upload, fileName) {
    const p = upload.querySelector('p');
    const truncatedName = fileName.length > 50 ? 
        fileName.substring(0, 47) + '...' : fileName;
    p.textContent = `Arquivo selecionado: ${truncatedName}`;
    upload.style.borderColor = '#28a745';
    upload.style.backgroundColor = '#f8fff9';
}

function setupModal() {
    const modal = document.getElementById('descriptionModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function addCharacterCounters() {
    const fieldsWithCounters = [
        { id: 'contract-title', max: 200 },
        { id: 'contract-description', max: 2000 }
    ];

    fieldsWithCounters.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element) return;

        const counter = document.createElement('div');
        counter.style.cssText = 'font-size: 12px; color: #666; text-align: right; margin-top: 5px;';
        counter.id = field.id + '-counter';
        
        element.parentNode.insertBefore(counter, element.nextSibling);
        
        function updateCounter() {
            const length = element.value.length;
            const remaining = field.max - length;
            counter.textContent = `${length}/${field.max} caracteres`;
            
            if (remaining < 20) {
                counter.style.color = '#dc3545';
            } else if (remaining < 50) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#666';
            }
        }
        
        element.addEventListener('input', updateCounter);
        updateCounter(); // Inicializar contador
    });
}

function updateCharacterCounter(element) {
    const counter = document.getElementById(element.id + '-counter');
    if (counter) {
        const fieldConfig = element.id === 'contract-title' ? 
            { max: 200 } : 
            element.id === 'contract-description' ? { max: 2000 } : null;
        
        if (fieldConfig) {
            const length = element.value.length;
            const remaining = fieldConfig.max - length;
            counter.textContent = `${length}/${fieldConfig.max} caracteres`;
            
            if (remaining < 20) {
                counter.style.color = '#dc3545';
            } else if (remaining < 50) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#666';
            }
        }
    }
}

function updateAllCharacterCounters() {
    const titleInput = document.getElementById('contract-title');
    const descriptionInput = document.getElementById('contract-description');
    
    if (titleInput) updateCharacterCounter(titleInput);
    if (descriptionInput) updateCharacterCounter(descriptionInput);
}