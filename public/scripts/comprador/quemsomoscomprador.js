let uploadCount = 0;
let personCount = 1;
let isSaved = false;
let hasUnsavedChanges = false;

const DataManager = {
    save: function() {
        const data = {
            contatos: [],
            sobre: document.getElementById('sobre-textarea').value,
            missao: document.getElementById('missao-textarea').value,
            pessoas: [],
            images: [],
            timestamp: new Date().toISOString()
        };

        document.querySelectorAll('.contato-input').forEach((input, index) => {
            data.contatos[index] = input.value;
        });

        document.querySelectorAll('.person-name-input').forEach((input, index) => {
            data.pessoas[index] = input.value;
        });

        document.querySelectorAll('.preview-img').forEach((img, index) => {
            if (img.src && img.src.startsWith('data:')) {
                data.images[index] = img.src;
            }
        });

        window.appData = data;
        console.log('Dados salvos:', data);
    },

    load: function() {
        const savedData = window.appData;
        if (!savedData) return false;

        try {
            const data = savedData;
            
            if (data.contatos) {
                document.querySelectorAll('.contato-input').forEach((input, index) => {
                    if (data.contatos[index]) {
                        input.value = data.contatos[index];
                    }
                });
            }

            if (data.pessoas) {
                document.querySelectorAll('.person-name-input').forEach((input, index) => {
                    if (data.pessoas[index]) {
                        input.value = data.pessoas[index];
                    }
                });
            }

            if (data.sobre) {
                document.getElementById('sobre-textarea').value = data.sobre;
            }
            if (data.missao) {
                document.getElementById('missao-textarea').value = data.missao;
            }

            if (data.images) {
                data.images.forEach((imageSrc, index) => {
                    if (imageSrc) {
                        const container = document.getElementById(`uploadContainer${index}`) || 
                                        document.getElementById('uploadContainer0');
                        if (container) {
                            this.loadImageToContainer(container, imageSrc);
                            if (index > 0) {
                                createNewPersonContainer();
                            }
                        }
                    }
                });
            }

            return true;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return false;
        }
    },

    loadImageToContainer: function(container, imageSrc) {
        const uploadContent = container.querySelector('.upload-content');
        const imagePreview = container.querySelector('.image-preview');
        const previewImg = container.querySelector('.preview-img');
        
        previewImg.src = imageSrc;
        uploadContent.style.display = 'none';
        imagePreview.style.display = 'flex';
    },

    clear: function() {
        window.appData = null;
    }
};

function applySavedStyle(element) {
    element.classList.add('saved');
    element.readOnly = true;
    
    if (element.classList.contains('person-name-input')) {
        element.style.backgroundColor = '#ffffff';
        element.style.border = 'none';
        element.style.borderBottom = '2px solid transparent';
    } else if (element.tagName.toLowerCase() === 'textarea') {
        element.style.backgroundColor = '#ffffff';
        element.style.border = 'none';
    } else {
        element.style.backgroundColor = '#ffffff';
        element.style.border = 'none';
    }
}

function applyEditableStyle(element) {
    element.classList.remove('saved');
    element.readOnly = false;
    
    if (element.classList.contains('person-name-input')) {
        element.style.backgroundColor = '#f9f7f4';
        element.style.border = 'none';
        element.style.borderBottom = '2px solid #E2CCAE';
    } else if (element.tagName.toLowerCase() === 'textarea') {
        element.style.backgroundColor = '#f5f5f5';
        element.style.border = '1px solid #ddd';
    } else {
        element.style.backgroundColor = '#f5f5f5';
        element.style.border = '1px solid #ddd';
    }
}

function salvarDados() {
    DataManager.save();
    
    document.querySelectorAll('.contato-input').forEach(input => {
        applySavedStyle(input);
    });

    document.querySelectorAll('.person-name-input').forEach(input => {
        applySavedStyle(input);
    });

    document.querySelectorAll('textarea').forEach(textarea => {
        applySavedStyle(textarea);
    });

    isSaved = true;
    hasUnsavedChanges = false;
    updateSaveButton();
    
    showSaveConfirmation();
}

function showSaveConfirmation() {
    const button = document.getElementById('botaoSalvar');
    const originalText = button.textContent;
    
    button.textContent = 'Salvo ✓';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#E2CCAE';
        button.style.color = '#693B11';
    }, 2000);
}

function updateSaveButton() {
    const button = document.getElementById('botaoSalvar');
    if (hasUnsavedChanges) {
        button.classList.add('has-changes');
        button.textContent = 'Salvar *';
    } else {
        button.classList.remove('has-changes');
        button.textContent = 'Salvar';
    }
}

function setupChangeDetection() {
    document.querySelectorAll('.contato-input, textarea, .person-name-input').forEach(element => {
        element.addEventListener('input', () => {
            hasUnsavedChanges = true;
            updateSaveButton();
        });
    });
}

function initializePersonNameInput(input) {
    input.addEventListener('focus', function() {
        if (this.value === '' || this.value === this.placeholder) {
            this.value = '';
        }
    });

    input.addEventListener('blur', function() {
        if (this.value === '') {
        }
    });
}

function initializeUploadContainer(container) {
    const fileInput = container.querySelector('.file-input');
    const imagePreview = container.querySelector('.image-preview');
    const previewImg = container.querySelector('.preview-img');
    const removeImageBtn = container.querySelector('.remove-image');
    const uploadContent = container.querySelector('.upload-content');

    container.addEventListener('click', (e) => {
        if (e.target !== removeImageBtn && imagePreview.style.display !== 'flex') {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file, container);
        }
    });

    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeImage(container);
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('dragover');
    });

    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        container.classList.remove('dragover');
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleFile(files[0], container);
        }
    });
}

function handleFile(file, container) {
    const reader = new FileReader();
    const uploadContent = container.querySelector('.upload-content');
    const imagePreview = container.querySelector('.image-preview');
    const previewImg = container.querySelector('.preview-img');
    
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        uploadContent.style.display = 'none';
        imagePreview.style.display = 'flex';
        
        hasUnsavedChanges = true;
        updateSaveButton();
        createNewPersonContainer();
    };
    
    reader.readAsDataURL(file);
}

function removeImage(container) {
    const uploadContent = container.querySelector('.upload-content');
    const imagePreview = container.querySelector('.image-preview');
    const previewImg = container.querySelector('.preview-img');
    const fileInput = container.querySelector('.file-input');

    previewImg.src = '';
    fileInput.value = '';
    uploadContent.style.display = 'flex';
    imagePreview.style.display = 'none';

    const personContainer = container.closest('.person-container');
    if (personContainer.id !== 'personContainer0') {
        personContainer.remove();
        updatePersonNumbers();
    }
    
    hasUnsavedChanges = true;
    updateSaveButton();
}

function createNewPersonContainer() {
    uploadCount++;
    personCount++;
    const uploadsWrapper = document.getElementById('uploadsWrapper');
    
    const newPersonContainer = document.createElement('div');
    newPersonContainer.className = 'person-container';
    newPersonContainer.id = `personContainer${uploadCount}`;
    
    newPersonContainer.innerHTML = `
        <div class="upload-container" id="uploadContainer${uploadCount}">
            <div class="upload-content">
                <div class="upload-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="upload-text">Clique para adicionar uma imagem</div>
                <div class="upload-subtext">ou arraste e solte aqui</div>
                <button class="upload-button" type="button">Escolher Arquivo</button>
            </div>
            <input type="file" class="file-input" accept="image/*">
            
            <div class="image-preview">
                <img class="preview-img" src="" alt="Preview">
                <button class="remove-image">&times;</button>
            </div>
        </div>
        
        <input type="text" class="person-name-input" placeholder="Pessoa ${personCount}" id="personName${uploadCount}">
    `;
    
    uploadsWrapper.appendChild(newPersonContainer);
    initializeUploadContainer(newPersonContainer.querySelector('.upload-container'));
    
    const newNameInput = newPersonContainer.querySelector('.person-name-input');
    initializePersonNameInput(newNameInput);
    setupPersonNameEditableField(newNameInput);
}

function updatePersonNumbers() {
    const personContainers = document.querySelectorAll('.person-container');
    personCount = 1;
    
    personContainers.forEach((container, index) => {
        const nameInput = container.querySelector('.person-name-input');
        if (nameInput && nameInput.value === nameInput.placeholder) {
            nameInput.placeholder = `Pessoa ${index + 1}`;
        }
        personCount = index + 2;
    });
}

function setupPhoneValidation() {
    const phoneInputs = document.querySelectorAll('input[type="text"]:not(.person-name-input)');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    });
}

function setupEmailValidation() {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const email = e.target.value;
            if (email && !email.endsWith('@gmail.com')) {
                alert('Por favor, use apenas emails do Gmail (@gmail.com)');
                e.target.focus();
            }
        });

        emailInput.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value.includes('@') && !value.includes('@gmail.com')) {
                const username = value.split('@')[0];
                e.target.value = username + '@gmail.com';
            }
        });
    }
}

function setupPersonNameEditableField(input) {
    input.removeEventListener('dblclick', handlePersonNameDoubleClick);
    input.removeEventListener('blur', handlePersonNameBlur);
    input.removeEventListener('keypress', handlePersonNameKeypress);
    
    input.addEventListener('dblclick', handlePersonNameDoubleClick);
    input.addEventListener('blur', handlePersonNameBlur);
    input.addEventListener('keypress', handlePersonNameKeypress);
    input.addEventListener('input', function() {
        hasUnsavedChanges = true;
        updateSaveButton();
    });
}

function handlePersonNameDoubleClick() {
    if (isSaved && this.readOnly) {
        applyEditableStyle(this);
        this.focus();
        this.select();
    }
}

function handlePersonNameBlur() {
    if (!this.readOnly && isSaved) {
        applySavedStyle(this);
        DataManager.save();
    }
}

function handlePersonNameKeypress(e) {
    if (e.key === 'Enter' && !this.readOnly && isSaved) {
        this.blur();
    }
}

function setupContactEditableFields() {
    document.querySelectorAll('.contato-input').forEach(input => {
        input.removeEventListener('dblclick', handleContactDoubleClick);
        input.removeEventListener('blur', handleContactBlur);
        input.removeEventListener('keypress', handleContactKeypress);
        
        input.addEventListener('dblclick', handleContactDoubleClick);
        input.addEventListener('blur', handleContactBlur);
        input.addEventListener('keypress', handleContactKeypress);
    });
}

function handleContactDoubleClick() {
    if (isSaved && this.readOnly) {
        applyEditableStyle(this);
        this.focus();
        this.select();
    }
}

function handleContactBlur() {
    if (!this.readOnly && isSaved) {
        applySavedStyle(this);
        DataManager.save();
    }
}

function handleContactKeypress(e) {
    if (e.key === 'Enter' && !this.readOnly && isSaved) {
        this.blur();
    }
}

function setupTextareaEditButtons() {
    document.querySelectorAll('.butao-editar').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const textarea = document.getElementById(targetId);
            
            if (isSaved && textarea.readOnly) {
                applyEditableStyle(textarea);
                textarea.focus();
            }
        });
    });

    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('blur', function() {
            if (!this.readOnly && isSaved) {
                applySavedStyle(this);
                DataManager.save();
            }
        });
    });
}

function initialize() {
    const hasData = DataManager.load();
    
    if (hasData) {
        document.querySelectorAll('.contato-input, textarea, .person-name-input').forEach(element => {
            applySavedStyle(element);
        });
        isSaved = true;
    }
    
    initializeUploadContainer(document.getElementById('uploadContainer0'));
    
    const firstPersonInput = document.getElementById('personName0');
    initializePersonNameInput(firstPersonInput);
    setupPersonNameEditableField(firstPersonInput);
    
    setupPhoneValidation();
    setupEmailValidation();
    setupContactEditableFields();
    setupTextareaEditButtons();
    setupChangeDetection();
    
    document.getElementById('botaoSalvar').addEventListener('click', salvarDados);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}