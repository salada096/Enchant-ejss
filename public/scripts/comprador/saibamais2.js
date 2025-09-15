let itemCounters = {
            saiba: 0,
            relatorio: 0,
            certificado: 0,
            timeline: 0
        };

        let timelineYears = [];

        // Array para armazenar os relatórios sociais
        let relatoriosSociais = [];

        // Inicializar a página
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                addSaibaItem();
                addRelatorioItem();
                addCertificadoItem();
                initializeTimeline();
            }, 100);

            // Event listener para arquivo do estatuto
            document.getElementById('estatuto-file').addEventListener('change', function() {
                if (this.files[0]) {
                    const estatutoImage = document.querySelector('.estatuto-image');
                    const file = this.files[0];
                    
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            estatutoImage.innerHTML = `<img src="${e.target.result}" class="small-standard-image">`;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        estatutoImage.innerHTML = `
                            <div style="color: #693B11; text-align: center;">
                                <i class="bi bi-file-earmark-pdf" style="font-size: 24px; margin-bottom: 5px;"></i>
                                <div style="font-size: 16px;">${file.name}</div>
                            </div>
                        `;
                    }
                }
            });
        });

        // Funções para Saiba Mais
        function addSaibaItem() {
            const container = document.getElementById('saiba-mais-container');
            const index = itemCounters.saiba++;
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('saiba-item');
            itemDiv.setAttribute('data-index', index);
            itemDiv.innerHTML = `
                <div class="input-section" id="saiba-input-${index}">
                    <input type="text" class="input-field" placeholder="Adicione o título..."  style="font-size: 14px;" id="saiba-titulo-${index}">
                    <textarea class="input-field textarea-field" placeholder="Adicione o texto..." style="font-size: 14px;" id="saiba-texto-${index}"></textarea>
                    <div class="file-controls">
                        <label class="file-btn" for="saiba-file-${index}">Escolher ficheiro</label>
                        <input type="file" id="saiba-file-${index}" style="display: none;" accept="image/*">
                        <span class="file-status" id="saiba-file-status-${index}">Nenhum ficheiro selecionado</span>
                    </div>
                    <div class="image-size-hint">Tamanho recomendado: 600x200px para melhor visualização</div>
                    <div style="margin-top: 15px;">
                        <button class="btn-save" onclick="saveSaibaContent(${index})">Salvar</button>
                    </div>
                </div>
                <div class="saved-section hidden" id="saiba-saved-${index}">
                    <div class="edit-controls">
                        <button class="action-btn btn-edit" onclick="editSaibaContent(${index})">Editar</button>
                        <button class="action-btn btn-delete" onclick="deleteSaibaContent(${index})">Deletar</button>
                    </div>
                    <h4 id="saiba-saved-title-${index}" style="color: #693B11; margin-bottom: 10px;"></h4>
                    <p id="saiba-saved-text-${index}" style="color: #666; margin-bottom: 15px;"></p>
                    <div id="saiba-saved-image-${index}"></div>
                </div>
            `;
            
            container.appendChild(itemDiv);
            
            // Adicionar event listener para o arquivo
            const fileInput = document.getElementById(`saiba-file-${index}`);
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    const fileName = this.files[0] ? this.files[0].name : 'Nenhum ficheiro selecionado';
                    const statusElement = document.getElementById(`saiba-file-status-${index}`);
                    if (statusElement) {
                        statusElement.textContent = fileName;
                    }
                });
            }
        }

        function saveSaibaContent(index) {
            const tituloElement = document.getElementById(`saiba-titulo-${index}`);
            const textoElement = document.getElementById(`saiba-texto-${index}`);
            const fileElement = document.getElementById(`saiba-file-${index}`);
            
            const titulo = tituloElement.value.trim();
            const texto = textoElement.value.trim();
            const file = fileElement.files[0];

            if (!titulo) {
                alert('Por favor, adicione um título.');
                return;
            }

            // Elementos salvos
            const savedTitleElement = document.getElementById(`saiba-saved-title-${index}`);
            const savedTextElement = document.getElementById(`saiba-saved-text-${index}`);
            const savedImageElement = document.getElementById(`saiba-saved-image-${index}`);

            // Atualizar conteúdo salvo
            savedTitleElement.textContent = titulo;
            savedTextElement.textContent = texto;

            // Processar imagem se existir
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    savedImageElement.innerHTML = 
                        `<img src="${e.target.result}" class="standard-image" style="margin-top: 10px;">`;
                }
                reader.readAsDataURL(file);
            } else {
                savedImageElement.innerHTML = '';
            }

            // Alternar visibilidade
            const inputSection = document.getElementById(`saiba-input-${index}`);
            const savedSection = document.getElementById(`saiba-saved-${index}`);
            
            inputSection.classList.add('hidden');
            savedSection.classList.remove('hidden');
        }

        function editSaibaContent(index) {
            const inputSection = document.getElementById(`saiba-input-${index}`);
            const savedSection = document.getElementById(`saiba-saved-${index}`);
            
            inputSection.classList.remove('hidden');
            savedSection.classList.add('hidden');
        }

        function deleteSaibaContent(index) {
            if (confirm('Tem certeza que deseja deletar este conteúdo?')) {
                const container = document.getElementById('saiba-mais-container');
                const itemToDelete = container.querySelector(`[data-index="${index}"]`);
                if (itemToDelete) {
                    container.removeChild(itemToDelete);
                }
            }
        }

        // Funções para Relatórios Sociais
        function addRelatorioItem() {
            const container = document.getElementById('relatorios-container');
            const index = itemCounters.relatorio++;
            relatoriosSociais.push({
                index,
                title: '',
                desc: '',
                fileData: null,
                fileType: null,
                fileName: null,
                saved: false
            });
            renderRelatoriosSociais();
        }

        function renderRelatoriosSociais() {
            const container = document.getElementById('relatorios-container');
            container.innerHTML = '';
            relatoriosSociais.forEach(rel => {
                if (!rel.saved) {
                    // Formulário de edição
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('relatorio-item');
                    itemDiv.setAttribute('data-index', rel.index);
                    itemDiv.innerHTML = `
                        <div class="relatorio-grid">
                            <div class="relatorio-image-placeholder" id="relatorio-image-${rel.index}" onclick="document.getElementById('relatorio-file-${rel.index}').click()">
                                ${rel.fileData ? (rel.fileType === 'image' ? `<img src="${rel.fileData}" class="small-standard-image">` : `<div style='color:#693B11;text-align:center;'><i class='bi bi-file-earmark-pdf' style='font-size:24px;'></i><div style='font-size:24px;'>${rel.fileName}</div></div>`) : '<div class="add-icon" style="margin-bottom: 10px;">+</div><div style="font-size: 16px;">Relatório<br>Social</div>'}
                                <input type="file" id="relatorio-file-${rel.index}" style="display: none;" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                            </div>
                            <div class="relatorio-content">
                                <input type="text" class="input-field" placeholder="Adicione o título | Relatório Social 2025" id="relatorio-title-${rel.index}" style="font-size: 14px; font-weight: 400; color: #693B11; margin-bottom: 15px;" value="${rel.title || ''}">
                                <textarea class="input-field" placeholder="Aqui você pode inserir marcos históricos, referências e informações sobre este ano..." id="relatorio-desc-${rel.index}" style="min-height: 80px; color: #666; font-size:14px;">${rel.desc || ''}</textarea>
                                <div class="image-size-hint">Tamanho recomendado: 200x150px</div>
                                <div style="margin-top: 15px;">
                                    <button class="btn-save" onclick="saveRelatorioContent(${rel.index})">Salvar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(itemDiv);
                    document.getElementById(`relatorio-file-${rel.index}`).addEventListener('change', function() {
                        if (this.files[0]) {
                            const file = this.files[0];
                            const relObj = relatoriosSociais.find(r => r.index === rel.index);
                            relObj.fileType = file.type.startsWith('image/') ? 'image' : 'other';
                            relObj.fileName = file.name;
                            if (file.type.startsWith('image/')) {
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    relObj.fileData = e.target.result;
                                    renderRelatoriosSociais();
                                };
                                reader.readAsDataURL(file);
                            } else {
                                relObj.fileData = null;
                                renderRelatoriosSociais();
                            }
                        }
                    });
                } else {
                    // Visualização salva
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('relatorio-item');
                    itemDiv.setAttribute('data-index', rel.index);
                    itemDiv.innerHTML = `
                        <div class="edit-controls">
                            <button class="action-btn btn-edit" onclick="editRelatorio(${rel.index})" title="Editar">Editar</button>
                            <button class="action-btn btn-delete" onclick="deleteRelatorio(${rel.index})" title="Deletar">Deletar</button>
                        </div>
                        <div class="relatorio-grid">
                            <div class="relatorio-image-placeholder" id="relatorio-image-${rel.index}">
                                ${rel.fileData ? (rel.fileType === 'image' ? `<img src="${rel.fileData}" class="small-standard-image">` : `<div style='color:#693B11;text-align:center;'><i class='bi bi-file-earmark-pdf' style='font-size:24px;'></i><div style='font-size:16px;'>${rel.fileName}</div></div>`) : '<div class="add-icon" style="margin-bottom: 10px;">+</div><div style="font-size: 14px;">Relatório<br>Social</div>'}
                            </div>
                            <div class="relatorio-content">
                                <h4 style="color: #693B11; margin-bottom: 15px; font-size: 24px;">${rel.title}</h4>
                                <p style="color: #666; font-size: 16px; line-height: 1.6;">${rel.desc}</p>
                            </div>
                        </div>
                    `;
                    container.appendChild(itemDiv);
                }
            });
        }

        function saveRelatorioContent(index) {
            const relObj = relatoriosSociais.find(r => r.index === index);
            if (!relObj) return;
            const title = document.getElementById(`relatorio-title-${index}`).value.trim();
            const desc = document.getElementById(`relatorio-desc-${index}`).value.trim();
            if (!title) {
                alert('Por favor, adicione um título.');
                return;
            }
            relObj.title = title;
            relObj.desc = desc;
            relObj.saved = true;
            renderRelatoriosSociais();
        }

        function editRelatorio(index) {
            const relObj = relatoriosSociais.find(r => r.index === index);
            if (!relObj) return;
            relObj.saved = false;
            renderRelatoriosSociais();
        }

        function deleteRelatorio(index) {
            relatoriosSociais = relatoriosSociais.filter(r => r.index !== index);
            renderRelatoriosSociais();
        }

        // Funções para Certificados
        function addCertificadoItem() {
            const container = document.getElementById('certificados-container');
            const index = itemCounters.certificado++;
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card-item');
            itemDiv.setAttribute('data-index', index);
            itemDiv.innerHTML = `
                <div class="card-placeholder" id="certificado-image-${index}" onclick="document.getElementById('certificado-file-${index}').click()">
                    <div class="add-icon">+</div>
                    <input type="file" id="certificado-file-${index}" style="display: none;" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                </div>
                <div class="card-description">
                    <input type="text" class="input-field" placeholder="Adicione o nome do certificado ou premiação" id="certificado-title-${index}" style="font-size: 14px; font-weight: 400; color: #693B11; margin-bottom: 8px; border: none; background: transparent;">
                    <textarea class="input-field" placeholder="Aqui você pode adicionar o nome da organização que forneceu o título e/ou falar sobre a conquista..." id="certificado-desc-${index}" style="font-size: 14px; color: #888; line-height: 1.4; border: 1px dashed #ddd; min-height: 60px;"></textarea>
                    <div class="image-size-hint">Tamanho recomendado: 300x200px</div>
                    <div style="margin-top: 10px;">
                        <button class="btn-save" onclick="saveCertificadoContent(${index})">Salvar</button>
                    </div>
                </div>
            `;
            
            container.appendChild(itemDiv);
            
            // Event listener para arquivo do certificado
            document.getElementById(`certificado-file-${index}`).addEventListener('change', function() {
                if (this.files[0]) {
                    const imageContainer = document.getElementById(`certificado-image-${index}`);
                    const file = this.files[0];
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            imageContainer.innerHTML = `<img src="${e.target.result}" class="small-standard-image">`;
                            imageContainer.classList.remove('card-placeholder');
                            imageContainer.classList.add('card-filled');
                        };
                        reader.readAsDataURL(file);
                    } else {
                        imageContainer.innerHTML = `<div style='color:#693B11;text-align:center;'><i class='bi bi-file-earmark-pdf' style='font-size:24px;'></i><div style='font-size:12px;'>${file.name}</div></div>`;
                        imageContainer.classList.remove('card-placeholder');
                        imageContainer.classList.add('card-filled');
                    }
                }
            });
        }

function saveCertificadoContent(index) {
    const titleElement = document.getElementById(`certificado-title-${index}`);
    const descElement = document.getElementById(`certificado-desc-${index}`);
    
    const title = titleElement.value.trim();
    const desc = descElement.value.trim();
    
    if (!title) {
        alert('Por favor, adicione um título.');
        return;
    }
    
    // Converter para visualização salva
    const container = document.querySelector(`#certificados-container [data-index="${index}"]`);
    const imageHtml = container.querySelector(`#certificado-image-${index}`).innerHTML;
    
    container.innerHTML = `
        <div class="edit-controls">
            <button class="action-btn btn-edit" onclick="editCertificado(${index})">Editar</button>
            <button class="action-btn btn-delete" onclick="deleteCertificado(${index})">Deletar</button>
        </div>
        <div class="card-filled" id="certificado-image-${index}">
            ${imageHtml}
        </div>
        <div class="card-description-saved">
            <h4 style="color: #693B11; font-size: 24px; font-weight: 400; margin-bottom: 8px;">${title}</h4>
            <p style="color: #666; font-size: 14px; line-height: 1.4;">${desc}</p>
        </div>
    `;
}
function editCertificado(index) {
    const container = document.querySelector(`#certificados-container [data-index="${index}"]`);
    const currentTitle = container.querySelector('h4') ? container.querySelector('h4').textContent : '';
    const currentDesc = container.querySelector('p') ? container.querySelector('p').textContent : '';
    const imageHtml = container.querySelector(`#certificado-image-${index}`).innerHTML;
    
    container.innerHTML = `
        <div class="card-placeholder" id="certificado-image-${index}" onclick="document.getElementById('certificado-file-${index}').click()">
            ${imageHtml}
            <input type="file" id="certificado-file-${index}" style="display: none;" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
        </div>
        <div class="card-description">
            <input type="text" class="input-field" value="${currentTitle}" id="certificado-title-${index}" style="font-size: 14px; font-weight: 400; color: #693B11; margin-bottom: 8px; border: none; background: transparent;" placeholder="Adicione o nome do certificado ou premiação">
            <textarea class="input-field" id="certificado-desc-${index}" style="font-size: 14px; color: #666; line-height: 1.4; border: none; background: transparent; min-height: 60px;" placeholder="Aqui você pode adicionar o nome da organização que forneceu o título e/ou falar sobre a conquista...">${currentDesc}</textarea>
            <div class="image-size-hint">Tamanho recomendado: 300x200px</div>
            <div style="margin-top: 10px;">
                <button class="btn-save" onclick="saveCertificadoContent(${index})">Salvar</button>
            </div>
        </div>
    `;
    
    // Re-adicionar event listener
    document.getElementById(`certificado-file-${index}`).addEventListener('change', function() {
        if (this.files[0]) {
            const imageContainer = document.getElementById(`certificado-image-${index}`);
            const file = this.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageContainer.innerHTML = `<img src="${e.target.result}" class="small-standard-image">`;
                    imageContainer.classList.remove('card-placeholder');
                    imageContainer.classList.add('card-filled');
                };
                reader.readAsDataURL(file);
            } else {
                imageContainer.innerHTML = `<div style='color:#693B11;text-align:center;'><i class='bi bi-file-earmark-pdf' style='font-size:24px;'></i><div style='font-size:12px;'>${file.name}</div></div>`;
                imageContainer.classList.remove('card-placeholder');
                imageContainer.classList.add('card-filled');
            }
        }
    });
}

        // --- TIMELINE ---
        function initializeTimeline() {
            timelineYears = [];
            updateTimelineDisplay();
        }

        function addTimelineYear() {
            if (timelineYears.length >= 5) {
                alert('Você só pode adicionar até 5 anos na linha do tempo.');
                return;
            }
            const year = prompt('Digite o ano (ex: 2024):');
            if (!year || isNaN(year) || year.length !== 4) {
                alert('Por favor, digite um ano válido (formato: AAAA).');
                return;
            }
            if (timelineYears.some(y => y.year === year)) {
                alert('Este ano já foi adicionado à timeline.');
                return;
            }
            const newYear = {
                year: year,
                marco: '',
                projeto: '',
                premio: '',
                image: null,
                file: null,
                fileType: null,
                fileName: null,
                id: Date.now(),
                saved: false
            };
            timelineYears.push(newYear);
            timelineYears.sort((a, b) => a.year - b.year);
            updateTimelineDisplay();
        }

        function updateTimelineDisplay() {
            const markersContainer = document.getElementById('timeline-markers');
            const contentContainer = document.getElementById('timeline-content-container');
            markersContainer.innerHTML = '';
            contentContainer.innerHTML = '';
            if (timelineYears.length === 0) {
                contentContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: #888;"><p>Nenhum ano adicionado ainda. Clique no botão abaixo para começar!</p></div>`;
                return;
            }
            const containerWidth = markersContainer.offsetWidth || 1000;
            const marginSide = 50;
            const availableWidth = containerWidth - (marginSide * 2);
            const editingYear = timelineYears.find(y => !y.saved);
            timelineYears.forEach((yearData, index) => {
                const position = timelineYears.length === 1 ? containerWidth / 2 : marginSide + (index * (availableWidth / Math.max(timelineYears.length - 1, 1)));
                if (editingYear ? yearData.id !== editingYear.id : true) {
                    const marker = document.createElement('div');
                    marker.className = yearData.saved ? 'timeline-marker active' : 'timeline-marker inactive';
                    marker.style.left = `${position}px`;
                    marker.style.top = '50%';
                    if (!yearData.saved) {
                        marker.innerHTML = '<div style="width: 20px; height: 20px; background: #D4AF88; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #693B11; font-weight: bold; font-size: 16px;">+</div>';
                        marker.style.width = '20px';
                        marker.style.height = '20px';
                    }
                    marker.onclick = function(e) {
                        e.stopPropagation();
                        showTimelineContent(yearData.id);
                    };
                    markersContainer.appendChild(marker);
                }
                const yearLabel = document.createElement('div');
                yearLabel.className = 'timeline-year';
                yearLabel.textContent = yearData.year;
                yearLabel.style.left = `${position}px`;
                yearLabel.onclick = function(e) {
                    e.stopPropagation();
                    showTimelineContent(yearData.id);
                };
                markersContainer.appendChild(yearLabel);
                if (!yearData.saved) {
                    createTimelineContentCard(yearData);
                } else {
                    createSavedTimelineCard(yearData);
                }
            });
            const firstUnsaved = timelineYears.find(y => !y.saved);
            const targetId = firstUnsaved ? firstUnsaved.id : timelineYears[0].id;
            showTimelineContent(targetId);
        }

        function createTimelineContentCard(yearData) {
            const contentContainer = document.getElementById('timeline-content-container');
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('timeline-content-grid');
            cardDiv.setAttribute('data-year-id', yearData.id);
            cardDiv.innerHTML = `
                <div class="timeline-content-card">
                    <div class="timeline-image" id="timeline-image-${yearData.id}" onclick="document.getElementById('timeline-file-${yearData.id}').click()">
                        ${yearData.image ? `<img src="${yearData.image}" class="small-standard-image">` : yearData.fileType && yearData.fileType !== 'image' ? `<div style='color:#693B11;text-align:center;'><i class='bi bi-file-earmark-pdf' style='font-size:24px;'></i><div style='font-size:12px;'>${yearData.fileName}</div></div>` : '<div class="add-icon">+</div>'}
                        <input type="file" id="timeline-file-${yearData.id}" style="display: none;" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                    </div>
                    <div class="image-size-hint" style="margin-top: 10px; text-align: center;">Tamanho: 200x150px</div>
                </div>
                <div class="timeline-details">
                    <div class="timeline-detail-item">
                        <i class="bi bi-award"></i>
                        <input type="text" placeholder="Insira algum marco importante..." value="${yearData.marco}" id="timeline-marco-${yearData.id}">
                    </div>
                    <div class="timeline-detail-item">
                        <i class="bi bi-briefcase"></i>
                        <input type="text" placeholder="Insira algum projeto importante..." value="${yearData.projeto}" id="timeline-projeto-${yearData.id}">
                    </div>
                    <div class="timeline-detail-item">
                        <i class="bi bi-trophy"></i>
                        <input type="text" placeholder="Insira algum prêmio/certificação importante..." value="${yearData.premio}" id="timeline-premio-${yearData.id}">
                    </div>
                    <div style="margin-top: 15px;">
                        <button class="btn-save" onclick="saveTimelineContent(${yearData.id})">Salvar</button>
                    </div>
                </div>
            `;
            
            contentContainer.appendChild(cardDiv);
            
            document.getElementById(`timeline-file-${yearData.id}`).addEventListener('change', function() {
                if (this.files[0]) {
                    const timelineImage = document.getElementById(`timeline-image-${yearData.id}`);
                    const file = this.files[0];
                    const yearDataObj = timelineYears.find(y => y.id === yearData.id);
                    yearDataObj.fileType = file.type.startsWith('image/') ? 'image' : 'other';
                    yearDataObj.fileName = file.name;
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            timelineImage.innerHTML = `<img src="${e.target.result}" class="small-standard-image">`;
                            yearDataObj.image = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        timelineImage.innerHTML = `<div style='color:#693B11;text-align:center;'><i class='bi bi-file-earmark-pdf' style='font-size:24px;'></i><div style='font-size:12px;'>${file.name}</div></div>`;
                        yearDataObj.image = null;
                    }
                }
            });
            // Adicionar listeners para atualizar yearData em tempo real
            document.getElementById(`timeline-marco-${yearData.id}`).addEventListener('input', function(e) {
        yearData.marco = e.target.value;
    });
    document.getElementById(`timeline-projeto-${yearData.id}`).addEventListener('input', function(e) {
        yearData.projeto = e.target.value;
    });
    document.getElementById(`timeline-premio-${yearData.id}`).addEventListener('input', function(e) {
        yearData.premio = e.target.value;
    });
        }

function createSavedTimelineCard(yearData) {
    const contentContainer = document.getElementById('timeline-content-container');
    
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('timeline-content-grid');
    cardDiv.setAttribute('data-year-id', yearData.id);
    cardDiv.style.display = 'none';
    
    const infoItems = [];
    if (yearData.marco) infoItems.push(`<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><i class="bi bi-award" style="color: #D4AF88;"></i> <span>${yearData.marco}</span></div>`);
    if (yearData.projeto) infoItems.push(`<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><i class="bi bi-briefcase" style="color: #D4AF88;"></i> <span>${yearData.projeto}</span></div>`);
    if (yearData.premio) infoItems.push(`<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><i class="bi bi-trophy" style="color: #D4AF88;"></i> <span>${yearData.premio}</span></div>`);
    
    cardDiv.innerHTML = `
        <div class="timeline-content-card">
            <div class="edit-controls">
                <button class="action-btn btn-edit" onclick="editTimelineContent(${yearData.id})">Editar</button>
                <button class="action-btn btn-delete" onclick="deleteTimelineYear(${yearData.id})">Deletar</button>
            </div>
            <div class="timeline-image" id="timeline-image-${yearData.id}">
                ${yearData.image ? `<img src="${yearData.image}" class="small-standard-image">` : '<div style="color: #888; text-align: center;">Sem imagem</div>'}
            </div>
        </div>
        
        <div class="timeline-details">
            <h4 style="color: white; margin-bottom: 20px; text-align: center;">${yearData.year}</h4>
            ${infoItems.length > 0 ? infoItems.join('') : '<div style="color: rgba(255,255,255,0.7); text-align: center;">Nenhuma informação adicionada</div>'}
        </div>
        
        <!-- Legenda externa (fora do campo escuro) -->
        <div class="timeline-external-legend">
            <h5>Legenda:</h5>
            <div class="timeline-external-legend-items">
                <div class="timeline-external-legend-item">
                    <i class="bi bi-award"></i>
                    <span>Marco Importante</span>
                </div>
                <div class="timeline-external-legend-item">
                    <i class="bi bi-briefcase"></i>
                    <span>Projeto Importante</span>
                </div>
                <div class="timeline-external-legend-item">
                    <i class="bi bi-trophy"></i>
                    <span>Prêmio/Certificação</span>
                </div>
            </div>
        </div>
    `;
    
    contentContainer.appendChild(cardDiv);
}

        function showTimelineContent(yearId) {
            const allCards = document.querySelectorAll('[data-year-id]');
            allCards.forEach(card => {
                card.style.display = card.getAttribute('data-year-id') == yearId ? 'grid' : 'none';
            });
        }

        function saveTimelineContent(yearId) {
            const yearData = timelineYears.find(y => y.id === yearId);
            if (!yearData) return;
            
            yearData.marco = document.getElementById(`timeline-marco-${yearId}`).value.trim();
            yearData.projeto = document.getElementById(`timeline-projeto-${yearId}`).value.trim();
            yearData.premio = document.getElementById(`timeline-premio-${yearId}`).value.trim();
            yearData.saved = true;
            
            updateTimelineDisplay();
            alert('Informações salvas com sucesso!');
        }

        function editTimelineContent(yearId) {
            const yearData = timelineYears.find(y => y.id === yearId);
            if (!yearData) return;
            
            yearData.saved = false;
            updateTimelineDisplay();
        }

        function deleteTimelineYear(yearId) {
            if (confirm('Tem certeza que deseja deletar este ano da timeline?')) {
                timelineYears = timelineYears.filter(y => y.id !== yearId);
                updateTimelineDisplay();
            }
        }

        // Função para salvar estatuto
        function saveEstatuto() {
            const text = document.getElementById('estatuto-text').value.trim();
            const fileInput = document.getElementById('estatuto-file');
            
            if (!text && !fileInput.files[0]) {
                alert('Por favor, adicione um texto ou arquivo para o estatuto.');
                return;
            }
            
            const estatutoSection = document.querySelector('.estatuto-section');
            const imageHtml = estatutoSection.querySelector('.estatuto-image').innerHTML;
            
            estatutoSection.innerHTML = `
                <div class="edit-controls">
                    <button class="action-btn btn-edit" onclick="editEstatuto()">Editar</button>
                    <button class="action-btn btn-delete" onclick="deleteEstatuto()">Deletar</button>
                </div>
                <div class="estatuto-grid">
                    <div class="estatuto-image">
                        ${imageHtml}
                    </div>
                    <div class="estatuto-content">
                        <p style="color: #666; line-height: 1.6; background-color: #fafafa; padding: 15px; border-radius: 8px; border: 1px solid #E2CCAE; min-height: 120px;">${text}</p>
                    </div>
                </div>
            `;
            
            alert('Estatuto Social salvo com sucesso!');
        }

        function editEstatuto() {
            const estatutoSection = document.querySelector('.estatuto-section');
            const currentText = estatutoSection.querySelector('p') ? estatutoSection.querySelector('p').textContent : '';
            const imageHtml = estatutoSection.querySelector('.estatuto-image').innerHTML;
            
            estatutoSection.innerHTML = `
                <div class="estatuto-grid">
                    <div class="estatuto-image" onclick="document.getElementById('estatuto-file').click()">
                        ${imageHtml}
                        <input type="file" id="estatuto-file" style="display: none;" accept="image/*,application/pdf">
                    </div>
                    <div class="estatuto-content">
                        <textarea 
                            placeholder="Aqui você pode adicionar um resumo sobre o Estatuto Social. Clique para começar a digitar..."
                            id="estatuto-text"
                        >${currentText}</textarea>
                        <div class="image-size-hint">Tamanho recomendado: 400x300px</div>
                        <div style="margin-top: 15px;">
                            <button class="btn-save" onclick="saveEstatuto()">Salvar</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Re-adicionar event listener
            document.getElementById('estatuto-file').addEventListener('change', function() {
                if (this.files[0]) {
                    const estatutoImage = document.querySelector('.estatuto-image');
                    const file = this.files[0];
                    
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            estatutoImage.innerHTML = `<img src="${e.target.result}" class="small-standard-image">`;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        estatutoImage.innerHTML = `
                            <div style="color: #693B11; text-align: center;">
                                <i class="bi bi-file-earmark-pdf" style="font-size: 24px; margin-bottom: 5px;"></i>
                                <div style="font-size: 16px;">${file.name}</div>
                            </div>
                        `;
                    }
                }
            });
        }

        function deleteEstatuto() {
            if (confirm('Tem certeza que deseja deletar o estatuto?')) {
                const estatutoSection = document.querySelector('.estatuto-section');
                estatutoSection.innerHTML = `
                    <div class="estatuto-grid">
                        <div class="estatuto-image" onclick="document.getElementById('estatuto-file').click()">
                            <div class="add-icon" style="margin-bottom: 5px; width: 30px; height: 30px; font-size: 20px;">+</div>
                            <div style="font-size: 12px;">Estatuto<br>Social</div>
                            <input type="file" id="estatuto-file" style="display: none;" accept="image/*,application/pdf">
                        </div>
                        <div class="estatuto-content">
                            <textarea 
                                placeholder="Aqui você pode adicionar um resumo sobre o Estatuto Social. Clique para começar a digitar..."
                                id="estatuto-text"
                            ></textarea>
                            <div class="image-size-hint">Tamanho recomendado: 400x300px</div>
                            <div style="margin-top: 15px;">
                                <button class="btn-save" onclick="saveEstatuto()">Salvar</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Re-adicionar event listener
                document.getElementById('estatuto-file').addEventListener('change', function() {
                    if (this.files[0]) {
                        const estatutoImage = document.querySelector('.estatuto-image');
                        const file = this.files[0];
                        
                        if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                estatutoImage.innerHTML = `<img src="${e.target.result}" class="small-standard-image">`;
                            };
                            reader.readAsDataURL(file);
                        } else {
                            estatutoImage.innerHTML = `
                                <div style="color: #693B11; text-align: center;">
                                    <i class="bi bi-file-earmark-pdf" style="font-size: 24px; margin-bottom: 5px;"></i>
                                    <div style="font-size: 12px;">${file.name}</div>
                                </div>
                            `;
                        }
                    }
                });
            }
        }

        // Função para scroll suave
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }