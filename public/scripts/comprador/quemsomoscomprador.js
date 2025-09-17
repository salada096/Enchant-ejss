let uploadCount = 0;
let hasUnsavedChanges = false;

// --- Global DOM Elements ---
let mainElement, addPersonBtn, saveBtn, editBtn, uploadsWrapper;

// --- Data Management ---
const DataManager = {
    save: function() {
        const data = {
            contatos: [],
            sobre: document.getElementById('sobre-textarea').value,
            missao: document.getElementById('missao-textarea').value,
            pessoas: [],
            profissoes: [],
            images: [],
            timestamp: new Date().toISOString()
        };

        document.querySelectorAll('.contato-input').forEach(input => data.contatos.push(input.value));
        document.querySelectorAll('.person-name-input').forEach(input => data.pessoas.push(input.value));
        document.querySelectorAll('.person-profession-input').forEach(input => data.profissoes.push(input.value));
        document.querySelectorAll('.preview-img').forEach(img => data.images.push(img.src.startsWith('data:') ? img.src : ''));

        localStorage.setItem('appData', JSON.stringify(data));
        console.log('Dados salvos:', data);
    },

    load: function() {
        const savedDataJSON = localStorage.getItem('appData');
        if (!savedDataJSON) return false;

        try {
            const data = JSON.parse(savedDataJSON);
            
            uploadsWrapper.innerHTML = '';
            uploadsWrapper.appendChild(addPersonBtn);

            const personCount = data.pessoas ? data.pessoas.length : 0;
            if (personCount === 0) {
                 createNewPersonContainer(false);
            } else {
                for (let i = 0; i < personCount; i++) {
                    createNewPersonContainer(false);
                }
            }
            
            if (data.contatos) document.querySelectorAll('.contato-input').forEach((input, index) => input.value = data.contatos[index] || '');
            if (data.sobre) document.getElementById('sobre-textarea').value = data.sobre;
            if (data.missao) document.getElementById('missao-textarea').value = data.missao;
            if (data.pessoas) document.querySelectorAll('.person-name-input').forEach((input, index) => input.value = data.pessoas[index] || '');
            if (data.profissoes) document.querySelectorAll('.person-profession-input').forEach((input, index) => input.value = data.profissoes[index] || '');
            
            if (data.images) {
                document.querySelectorAll('.upload-container').forEach((container, index) => {
                    if (data.images[index]) {
                        this.loadImageToContainer(container, data.images[index]);
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
        container.closest('.person-container').classList.add('has-image');
    }
};

// --- Styling and State Functions ---
function applySavedStyle(element) {
    element.readOnly = true;
}

function applyEditableStyle(element) {
    element.readOnly = false;
}

function updateSaveButton() {
    if (hasUnsavedChanges) {
        saveBtn.textContent = 'Salvar';
    } else {
        saveBtn.textContent = 'Salvar';
    }
}

// --- Mode Switching ---
function enterViewMode() {
    DataManager.save();
    
    document.querySelectorAll('.contato-input, textarea').forEach(applySavedStyle);
    
    document.querySelectorAll('.person-container').forEach(container => {
        const nameInput = container.querySelector('.person-name-input');
        const profInput = container.querySelector('.person-profession-input');

        [nameInput, profInput].forEach(input => {
            applySavedStyle(input);
            if (input.value.trim() === '') {
                input.classList.add('input-vazio');
            } else {
                input.classList.remove('input-vazio');
            }
        });
    });
    
    mainElement.classList.add('view-mode');
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    addPersonBtn.style.display = 'none';

    hasUnsavedChanges = false;
    updateSaveButton();
}

function enterEditMode() {
    mainElement.classList.remove('view-mode');
    
    document.querySelectorAll('.contato-input, .person-name-input, .person-profession-input, textarea').forEach(input => {
        applyEditableStyle(input);
        input.classList.remove('input-vazio');
    });

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    addPersonBtn.style.display = 'flex';
}


// --- Event Handlers & Initialization ---
function setupChangeDetection() {
    document.body.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea')) {
            if (!mainElement.classList.contains('view-mode')) {
                hasUnsavedChanges = true;
                updateSaveButton();
            }
        }
    });
}

function initializeUploadContainer(container) {
    const fileInput = container.querySelector('.file-input');
    const uploadContent = container.querySelector('.upload-content');

    uploadContent.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) handleFile(file, container);
    });

    ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, (e) => {
            e.preventDefault(); e.stopPropagation();
            if (eventName === 'dragover') container.classList.add('dragover');
            if (eventName === 'dragleave' || eventName === 'drop') container.classList.remove('dragover');
            if (eventName === 'drop' && e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0], container);
        });
    });
}

function handleFile(file, container) {
    const reader = new FileReader();
    reader.onload = (e) => {
        DataManager.loadImageToContainer(container, e.target.result);
        hasUnsavedChanges = true;
        updateSaveButton();
    };
    reader.readAsDataURL(file);
}

function createNewPersonContainer(detectChanges = true) {
    uploadCount++;
    const personIndex = document.querySelectorAll('.person-container').length + 1;
    
    const newPersonContainer = document.createElement('div');
    newPersonContainer.className = 'person-container';
    newPersonContainer.id = `personContainer${uploadCount}`;
    
    // --- ALTERAÇÃO AQUI: Botão ".remove-image" foi removido do HTML ---
    newPersonContainer.innerHTML = `
        <button class="botao-remover-pessoa" title="Remover Pessoa">&times;</button>
        <div class="upload-container" id="uploadContainer${uploadCount}">
            <div class="upload-content">
                <div class="upload-icon"><i class="fas fa-plus"></i></div>
                <div class="upload-text">Clique para adicionar uma imagem</div>
                <div class="upload-subtext">ou arraste e solte aqui</div>
                <button class="upload-button" type="button">Escolher Arquivo</button>
            </div>
            <input type="file" class="file-input" accept="image/*">
            <div class="image-preview">
                <img class="preview-img" src="" alt="Preview">
            </div>
        </div>
        <input type="text" class="person-name-input" placeholder="Pessoa ${personIndex}" id="personName${uploadCount}">
        <input type="text" class="person-profession-input" placeholder="Profissão" id="personProfession${uploadCount}">
    `;
    
    uploadsWrapper.insertBefore(newPersonContainer, addPersonBtn);
    initializeUploadContainer(newPersonContainer.querySelector('.upload-container'));
    
    newPersonContainer.querySelector('.botao-remover-pessoa').addEventListener('click', () => {
        newPersonContainer.remove();
        hasUnsavedChanges = true;
        updateSaveButton();
    });

    if (personIndex === 1) {
        newPersonContainer.classList.add('is-default');
    }
    
    if (detectChanges) {
        hasUnsavedChanges = true;
        updateSaveButton();
    }
}

// --- Initializer ---
function initialize() {
    mainElement = document.querySelector('main');
    addPersonBtn = document.getElementById('addPersonBtn');
    saveBtn = document.getElementById('botaoSalvar');
    editBtn = document.getElementById('botaoEditarTudo');
    uploadsWrapper = document.getElementById('uploadsWrapper');
    
    const hasData = DataManager.load();
    
    if (hasData) {
        enterViewMode();
    } else {
        createNewPersonContainer(false);
        enterEditMode();
    }
    
    setupChangeDetection();
    
    saveBtn.addEventListener('click', enterViewMode);
    editBtn.addEventListener('click', enterEditMode);
    addPersonBtn.addEventListener('click', () => createNewPersonContainer(true));
}

document.addEventListener('DOMContentLoaded', initialize);