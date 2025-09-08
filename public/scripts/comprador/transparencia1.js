// Dados armazenados em memória para relatórios
let uploadedReports = [];

// Configurações de validação para relatórios
const reportValidationRules = {
    title: { min: 10, max: 150, required: true },
    description: { min: 20, max: 1000, required: true },
    file: { required: true, maxSize: 10, allowedTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'] }
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    setupReportsForm();
    setupRealTimeValidation();
    setupDragAndDrop();
    setupModal();
    addCharacterCounters();
    updateReportsList();
});

function setupReportsForm() {
    const form = document.getElementById('reports-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário completo
        const validation = validateReportsForm();
        
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
            title: document.getElementById('report-title').value.trim(),
            description: document.getElementById('report-description').value.trim(),
            file: '',
            fileSize: '',
            id: Date.now(),
            timestamp: new Date().toLocaleDateString('pt-BR'),
            uploadTime: new Date().toLocaleString('pt-BR')
        };
        
        const fileInput = document.getElementById('report-file');
        if (fileInput.files[0]) {
            formData.file = fileInput.files[0].name;
            formData.fileSize = (fileInput.files[0].size / (1024 * 1024)).toFixed(2) + 'MB';
        }
        
        // Adicionar aos dados
        uploadedReports.push(formData);
        
        // Mostrar mensagem de sucesso
        showAlert(`Relatório "${formData.title}" foi adicionado com sucesso e está disponível para consulta pública.`);
        
        // Limpar formulário e resetar validações
        resetForm(form);
        
        // Atualizar lista
        updateReportsList();
    });
}

function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
            updateCharacterCounter(this);
        });
    });

    // Validação especial para arquivos
    const fileInput = document.getElementById('report-file');
    fileInput.addEventListener('change', function() {
        validateFileField(this);
    });
}

function validateSingleField(field) {
    const fieldId = field.id;
    const fieldName = fieldId.replace('report-', '');
    
    if (!reportValidationRules[fieldName]) return;
    
    const rules = reportValidationRules[fieldName];
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
    const rules = reportValidationRules.file;
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
        hideFieldError('report-file');
        if (file) {
            updateFileUploadDisplay(fileUploadDiv, file.name);
        }
    } else {
        fileUploadDiv.classList.remove('valid');
        fileUploadDiv.classList.add('error');
        showFieldError('report-file', errorMessage);
    }
    
    return isValid;
}

function validateReportsForm() {
    const form = document.getElementById('reports-form');
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    let errors = [];

    // Mapa de tradução dos campos
    const fieldNames = {
        title: 'Título',
        description: 'Descrição',
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
            const fieldName = input.id.replace('report-', '');
            errors.push(fieldNames[fieldName] || fieldName);
        }
    });

    // Validar duplicatas
    const titleField = document.getElementById('report-title');
    if (titleField && titleField.value.trim()) {
        const isDuplicate = uploadedReports.some(item => 
            item.title.toLowerCase() === titleField.value.trim().toLowerCase()
        );
        
        if (isDuplicate) {
            isFormValid = false;
            showFieldError('report-title', 'Já existe um relatório com este título.');
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
    const alertElement = document.getElementById(isError ? 'alert-reports' : 'success-reports');
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
    const fields = form.querySelectorAll('input, textarea');
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
        Adicionar Relatório
    `;
    
    // Atualizar contadores
    updateAllCharacterCounters();
}

function updateReportsList() {
    const listContainer = document.getElementById('reports-list');
    
    // Limpar lista atual (manter apenas o título)
    const title = listContainer.querySelector('h3');
    listContainer.innerHTML = '';
    listContainer.appendChild(title);
    
    if (uploadedReports.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nenhum relatório adicionado ainda.';
        emptyMessage.style.cssText = 'color: #666; font-style: italic; text-align: center; padding: 20px;';
        listContainer.appendChild(emptyMessage);
        return;
    }
    
    // Ordenar por data de upload (mais recente primeiro)
    const sortedReports = [...uploadedReports].sort((a, b) => b.id - a.id);
    
    // Criar grid de cards
    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'cards-grid';
    
    sortedReports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <h3>${report.title}</h3>
            <div class="card-description">
                ${report.description.length > 80 ? report.description.substring(0, 80) + '...' : report.description}
            </div>
            <div class="card-meta">
                <div>Publicado em: ${report.timestamp}</div>
                ${report.fileSize ? `<div>Tamanho: ${report.fileSize}</div>` : ''}
            </div>
            <div class="card-actions">
                <button class="download-btn" onclick="downloadFile(${report.id})">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" fill="currentColor"/>
                    </svg>
                    Download
                </button>
                <button class="view-description-btn" onclick="showDescription(${report.id})">
                    <svg class="icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" fill="currentColor"/>
                    </svg>
                    Ver descrição
                </button>
                <button class="edit-btn" onclick="editReport(${report.id})">Editar</button>
                <button class="delete-btn" onclick="deleteReport(${report.id})">Excluir</button>
            </div>
        `;
        
        cardsGrid.appendChild(card);
    });
    
    listContainer.appendChild(cardsGrid);
}

function downloadFile(id) {
    const report = uploadedReports.find(item => item.id === id);
    if (!report) return;
    
    // Simular download
    const fileName = report.file || 'relatorio.pdf';
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
    const report = uploadedReports.find(item => item.id === id);
    if (!report) return;

    const modal = document.getElementById('descriptionModal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    modalTitle.textContent = report.title;
    modalDescription.textContent = report.description;
    modal.style.display = 'block';
}

function editReport(id) {
    const report = uploadedReports.find(item => item.id === id);
    if (!report) return;
    
    // Preencher o formulário com os dados do relatório
    document.getElementById('report-title').value = report.title;
    document.getElementById('report-description').value = report.description;
    
    // Remover o relatório atual dos dados
    uploadedReports = uploadedReports.filter(i => i.id !== id);
    updateReportsList();
    
    // Rolar para o formulário
    document.getElementById('reports-form').scrollIntoView({ behavior: 'smooth' });
    
    // Mostrar mensagem indicando que está editando
    const form = document.getElementById('reports-form');
    let editMessage = form.querySelector('.edit-message');
    if (!editMessage) {
        editMessage = document.createElement('div');
        editMessage.className = 'edit-message';
        form.insertBefore(editMessage, form.firstChild);
    }
    editMessage.textContent = 'Editando relatório existente. Faça as alterações necessárias e clique em salvar.';
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
                Adicionar Relatório
            `;
        }
    }, 10000);
    
    // Atualizar contadores
    updateAllCharacterCounters();
}

function deleteReport(id) {
    const report = uploadedReports.find(item => item.id === id);
    if (!report) return;
    
    const confirmMessage = `Tem certeza que deseja excluir "${report.title}"?\n\nEsta ação não pode ser desfeita e o relatório será removido permanentemente da página de transparência.`;
    
    if (confirm(confirmMessage)) {
        uploadedReports = uploadedReports.filter(item => item.id !== id);
        updateReportsList();
        
        // Mostrar mensagem de confirmação
        showAlert(`Relatório "${report.title}" foi excluído com sucesso.`);
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
        { id: 'report-title', max: 150 },
        { id: 'report-description', max: 1000 }
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
        const fieldConfig = element.id === 'report-title' ? 
            { max: 150 } : 
            element.id === 'report-description' ? { max: 1000 } : null;
        
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
    const titleInput = document.getElementById('report-title');
    const descriptionInput = document.getElementById('report-description');
    
    if (titleInput) updateCharacterCounter(titleInput);
    if (descriptionInput) updateCharacterCounter(descriptionInput);
}