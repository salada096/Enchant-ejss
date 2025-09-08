// Dados armazenados em memória para auditorias
let uploadedAudits = [];

// Configurações de validação para auditorias
const auditValidationRules = {
    title: { min: 20, max: 200, required: true },
    date: { required: true },
    type: { required: true },
    status: { required: true },
    file: { required: true, maxSize: 20, allowedTypes: ['.pdf', '.doc', '.docx'] }
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    setupAuditsForm();
    setupRealTimeValidation();
    setupDragAndDrop();
    setupModal();
    setupDateLimits();
    addCharacterCounters();
    updateAuditsList();
});

function setupAuditsForm() {
    const form = document.getElementById('audits-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário completo
        const validation = validateAuditsForm();
        
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
            title: document.getElementById('audit-title').value.trim(),
            date: document.getElementById('audit-date').value,
            type: document.getElementById('audit-type').value,
            status: document.getElementById('audit-status').value,
            file: '',
            fileSize: '',
            id: Date.now(),
            timestamp: new Date().toLocaleDateString('pt-BR'),
            uploadTime: new Date().toLocaleString('pt-BR')
        };
        
        const fileInput = document.getElementById('audit-file');
        if (fileInput.files[0]) {
            formData.file = fileInput.files[0].name;
            formData.fileSize = (fileInput.files[0].size / (1024 * 1024)).toFixed(2) + 'MB';
        }
        
        // Validações finais específicas para auditorias
        if (formData.status === 'approved' && formData.type === 'externa' && !formData.title.toLowerCase().includes('externa')) {
            showAlert('Atenção: Verifique se o título condiz com o tipo de auditoria externa aprovada.', true);
            return;
        }
        
        // Adicionar aos dados
        uploadedAudits.push(formData);
        
        // Mostrar mensagem de sucesso
        showAlert(`Auditoria "${formData.title}" foi registrada com status "${getStatusText(formData.status)}".`);
        
        // Limpar formulário e resetar validações
        resetForm(form);
        
        // Atualizar lista
        updateAuditsList();
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
    const fileInput = document.getElementById('audit-file');
    fileInput.addEventListener('change', function() {
        validateFileField(this);
    });
}

function validateSingleField(field) {
    const fieldId = field.id;
    const fieldName = fieldId.replace('audit-', '');
    
    if (!auditValidationRules[fieldName]) return;
    
    const rules = auditValidationRules[fieldName];
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
    // Validações específicas para data
    else if (fieldName === 'date') {
        const selectedDate = new Date(value);
        const today = new Date();
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        
        if (selectedDate > today) {
            isValid = false;
            errorMessage = 'A data não pode ser futura.';
        } else if (selectedDate < fiveYearsAgo) {
            isValid = false;
            errorMessage = 'A data não pode ser anterior a 5 anos.';
        }
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
    const rules = auditValidationRules.file;
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
        hideFieldError('audit-file');
        if (file) {
            updateFileUploadDisplay(fileUploadDiv, file.name);
        }
    } else {
        fileUploadDiv.classList.remove('valid');
        fileUploadDiv.classList.add('error');
        showFieldError('audit-file', errorMessage);
    }
    
    return isValid;
}

function validateAuditsForm() {
    const form = document.getElementById('audits-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    let errors = [];

    // Mapa de tradução dos campos
    const fieldNames = {
        title: 'Título',
        date: 'Data',
        type: 'Tipo',
        status: 'Status',
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
            const fieldName = input.id.replace('audit-', '');
            errors.push(fieldNames[fieldName] || fieldName);
        }
    });

    // Validar duplicatas
    const titleField = document.getElementById('audit-title');
    if (titleField && titleField.value.trim()) {
        const isDuplicate = uploadedAudits.some(item => 
            item.title.toLowerCase() === titleField.value.trim().toLowerCase()
        );
        
        if (isDuplicate) {
            isFormValid = false;
            showFieldError('audit-title', 'Já existe uma auditoria com este título.');
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
    const alertElement = document.getElementById(isError ? 'alert-audits' : 'success-audits');
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
        Adicionar Auditoria
    `;
    
    // Atualizar contadores
    updateAllCharacterCounters();
}

function updateAuditsList() {
    const listContainer = document.getElementById('audits-list');
    
    // Limpar lista atual (manter apenas o título)
    const title = listContainer.querySelector('h3');
    listContainer.innerHTML = '';
    listContainer.appendChild(title);
    
    if (uploadedAudits.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nenhuma auditoria adicionada ainda.';
        emptyMessage.style.cssText = 'color: #666; font-style: italic; text-align: center; padding: 20px;';
        listContainer.appendChild(emptyMessage);
        return;
    }
    
    // Ordenar por data de upload (mais recente primeiro)
    const sortedAudits = [...uploadedAudits].sort((a, b) => b.id - a.id);
    
    // Criar cards de auditoria
    const auditCards = document.createElement('div');
    auditCards.className = 'audit-cards';
    
    sortedAudits.forEach(audit => {
        const auditCard = document.createElement('div');
        auditCard.className = 'audit-card';
        
        const statusClass = audit.status === 'approved' ? 'approved' : 
                           audit.status === 'rejected' ? 'rejected' :
                           audit.status === 'review' ? 'review' : 'pending';
        const auditDate = audit.date ? new Date(audit.date).toLocaleDateString('pt-BR') : 'Data não informada';
        
        auditCard.innerHTML = `
            <h3>${audit.title}</h3>
            <div class="audit-meta">
                <span class="audit-date">Data: ${auditDate}</span>
                <div style="margin: 5px 0;">
                    <small style="color: #666;">Tipo: ${getAuditTypeText(audit.type)} | Publicado: ${audit.timestamp}</small>
                </div>
                <div class="audit-status">
                    <span class="status-label">Status:</span>
                    <span class="status-badge ${statusClass}">${getStatusText(audit.status)}</span>
                </div>
            </div>
            <div class="audit-actions">
                <button class="view-report-btn" onclick="viewAuditReport(${audit.id})">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" fill="currentColor"/>
                    </svg>
                    Ver relatório
                </button>
                <button class="audit-download-btn" onclick="downloadFile(${audit.id})">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="currentColor"/>
                    </svg>
                </button>
                <button class="edit-btn" onclick="editAudit(${audit.id})">Editar</button>
                <button class="delete-btn" onclick="deleteAudit(${audit.id})">Excluir</button>
            </div>
        `;
        
        auditCards.appendChild(auditCard);
    });
    
    listContainer.appendChild(auditCards);
}

function getStatusText(status) {
    const statusMap = {
        'approved': 'Aprovado',
        'pending': 'Em andamento',
        'rejected': 'Rejeitado',
        'review': 'Em revisão'
    };
    return statusMap[status] || status;
}

function getAuditTypeText(type) {
    const typeMap = {
        'interna': 'Auditoria Interna',
        'externa': 'Auditoria Externa',
        'revisao': 'Revisão de Processos',
        'compliance': 'Auditoria de Compliance',
        'financeira': 'Auditoria Financeira'
    };
    return typeMap[type] || type;
}

function downloadFile(id) {
    const audit = uploadedAudits.find(item => item.id === id);
    if (!audit) return;
    
    // Simular download
    const fileName = audit.file || 'auditoria.pdf';
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

function viewAuditReport(id) {
    const audit = uploadedAudits.find(item => item.id === id);
    if (!audit) return;
    
    // Simular visualização de relatório
    const button = event.target;
    const originalText = button.innerHTML;
    button.style.background = '#28a745';
    button.innerHTML = '<svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" fill="currentColor"/></svg>Visualizado!';
    
    setTimeout(() => {
        button.style.background = '#8B4513';
        button.innerHTML = originalText;
    }, 2000);
}

function editAudit(id) {
    const audit = uploadedAudits.find(item => item.id === id);
    if (!audit) return;
    
    // Preencher o formulário com os dados da auditoria
    document.getElementById('audit-title').value = audit.title;
    document.getElementById('audit-date').value = audit.date;
    document.getElementById('audit-type').value = audit.type;
    document.getElementById('audit-status').value = audit.status;
    
    // Remover a auditoria atual dos dados
    uploadedAudits = uploadedAudits.filter(i => i.id !== id);
    updateAuditsList();
    
    // Rolar para o formulário
    document.getElementById('audits-form').scrollIntoView({ behavior: 'smooth' });
    
    // Mostrar mensagem indicando que está editando
    const form = document.getElementById('audits-form');
    let editMessage = form.querySelector('.edit-message');
    if (!editMessage) {
        editMessage = document.createElement('div');
        editMessage.className = 'edit-message';
        editMessage.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 12px; border-radius: 6px; margin-bottom: 20px;';
        form.insertBefore(editMessage, form.firstChild);
    }
    editMessage.textContent = 'Editando auditoria existente. Faça as alterações necessárias e clique em salvar.';
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
                Adicionar Auditoria
            `;
        }
    }, 10000);
    
    // Atualizar contadores
    updateAllCharacterCounters();
}

function deleteAudit(id) {
    const audit = uploadedAudits.find(item => item.id === id);
    if (!audit) return;
    
    const confirmMessage = `Tem certeza que deseja excluir "${audit.title}"?\n\nEsta ação não pode ser desfeita e a auditoria será removida permanentemente da página de transparência.`;
    
    if (confirm(confirmMessage)) {
        uploadedAudits = uploadedAudits.filter(item => item.id !== id);
        updateAuditsList();
        
        // Mostrar mensagem de confirmação
        showAlert(`Auditoria "${audit.title}" foi excluída com sucesso.`);
    }
}

function setupDragAndDrop() {
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.getElementById('audit-file');
    
    if (!fileUpload || !fileInput) return;
    
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
        fileUpload.style.borderColor = '#007bff';
        fileUpload.style.backgroundColor = '#f8f9ff';
    });
    
    fileUpload.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        fileUpload.style.borderColor = '#ddd';
        fileUpload.style.backgroundColor = '';
    });
    
    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        fileUpload.style.borderColor = '#ddd';
        fileUpload.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            validateFileField(fileInput);
        }
    });
}

function setupModal() {
    const modal = document.getElementById('descriptionModal');
    const closeBtn = document.querySelector('.close');
    
    if (!modal || !closeBtn) return;
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function setupDateLimits() {
    const dateInput = document.getElementById('audit-date');
    if (!dateInput) return;
    
    const today = new Date().toISOString().split('T')[0];
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    
    dateInput.setAttribute('max', today);
    dateInput.setAttribute('min', fiveYearsAgo.toISOString().split('T')[0]);
}

function addCharacterCounters() {
    const titleField = document.getElementById('audit-title');
    if (!titleField) return;
    
    const counter = document.createElement('div');
    counter.style.cssText = 'font-size: 12px; color: #666; text-align: right; margin-top: 5px;';
    counter.id = 'audit-title-counter';
    
    titleField.parentNode.insertBefore(counter, titleField.nextSibling);
    
    function updateCounter() {
        const length = titleField.value.length;
        const max = 200;
        const remaining = max - length;
        counter.textContent = `${length}/${max} caracteres`;
        
        if (remaining < 20) {
            counter.style.color = '#dc3545';
        } else if (remaining < 50) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = '#666';
        }
    }
    
    titleField.addEventListener('input', updateCounter);
    updateCounter(); // Inicializar contador
}

function updateCharacterCounter(field) {
    if (field.id === 'audit-title') {
        const counter = document.getElementById('audit-title-counter');
        if (counter) {
            const length = field.value.length;
            const max = 200;
            const remaining = max - length;
            counter.textContent = `${length}/${max} caracteres`;
            
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
    const titleField = document.getElementById('audit-title');
    if (titleField) {
        updateCharacterCounter(titleField);
    }
}

function updateFileUploadDisplay(upload, fileName) {
    const p = upload.querySelector('p');
    const truncatedName = fileName.length > 50 ?
        fileName.substring(0, 47) + '...' : fileName;
    p.textContent = `Arquivo selecionado: ${truncatedName}`;
    upload.style.borderColor = '#28a745';
    upload.style.backgroundColor = '#f8fff9';
}