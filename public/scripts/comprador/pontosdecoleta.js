document.addEventListener("DOMContentLoaded", function () {
    setupProfileDropdown();
    handleHeaderAnimation();
    handleSidebarHover();
    ensureSidebarHeight();
   
    setupSocialMediaLinks();
   
    const toggleButton = document.getElementById('icone');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse) {
                if (window.bootstrap) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        if (navbarCollapse.classList.contains('show')) {
                            bsCollapse.hide();
                        } else {
                            bsCollapse.show();
                        }
                    } else {
                        navbarCollapse.classList.toggle('show');
                    }
                } else if ($) {
                    $(navbarCollapse).collapse('toggle');
                } else {
                    navbarCollapse.classList.toggle('show');
                    toggleButton.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
                }
            }
        });
    }
   
    setupPontosColetaFunctionality();
});


function setupPontosColetaFunctionality() {
    let count = 0;
    const maxItems = 9;
    let editingItemId = null;
   
    const addButton = document.getElementById('addButton');
    const cancelButton = document.getElementById('cancelButton');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const localName = document.getElementById('localName');
    const openingHours = document.querySelectorAll('#openingHours')[0];
    const closingHours = document.querySelectorAll('#openingHours')[1];
    const address = document.getElementById('address');
    const gallery = document.getElementById('gallery');
   
    const mensagemModal = new bootstrap.Modal(document.getElementById('mensagemModal'));
    const mensagemModalBody = document.getElementById('mensagemModalBody');
    const mensagemModalLabel = document.getElementById('mensagemModalLabel');
    const qrCodeModal = new bootstrap.Modal(document.getElementById('qrCodeModal'));


    function mostrarMensagem(mensagem, tipo = 'erro') {
        mensagemModalBody.textContent = mensagem;
        mensagemModalLabel.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        mensagemModalLabel.style.color = '#693B11';
        mensagemModal.show();
    }


    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                document.querySelector('.upload-text').style.display = 'none';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });


    function clearInputs() {
        imageInput.value = '';
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        document.querySelector('.upload-text').style.display = 'block';
        localName.value = '';
        openingHours.value = '';
        closingHours.value = '';
        address.value = '';
        editingItemId = null;
        addButton.textContent = 'Adicionar Item';
        cancelButton.classList.add('hidden');
    }


    cancelButton.addEventListener('click', clearInputs);


    addButton.addEventListener('click', function() {
        if (editingItemId) {
            updateItem();
            return;
        }


        if (count >= maxItems) {
            mostrarMensagem(`Limite de ${maxItems} itens atingido!`);
            return;
        }


        if (!imageInput.files[0] || !localName.value.trim() || !openingHours.value.trim() || !closingHours.value.trim() || !address.value.trim()) {
            mostrarMensagem('Todos os campos, incluindo a imagem, são obrigatórios.');
            return;
        }


        const itemId = 'item-' + Date.now();
        createGalleryItem(itemId, {
            imgSrc: URL.createObjectURL(imageInput.files[0]),
            local: localName.value,
            abertura: openingHours.value,
            fechamento: closingHours.value,
            endereco: address.value
        });


        count++;
        clearInputs();
        mostrarMensagem('Item adicionado com sucesso!', 'sucesso');
        if (count >= maxItems) {
            mostrarMensagem(`Limite de ${maxItems} itens atingido!`, 'info');
            addButton.disabled = true;
        }
    });


    function createGalleryItem(id, data) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.id = id;


        galleryItem.dataset.local = data.local;
        galleryItem.dataset.abertura = data.abertura;
        galleryItem.dataset.fechamento = data.fechamento;
        galleryItem.dataset.endereco = data.endereco;


        const now = new Date();
        const validityString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        // ESTE É O LINK QUE SERÁ USADO NO QR CODE. MUDE "https://seusite.com/confirmar" QUANDO TIVER A PÁGINA REAL
        galleryItem.dataset.qrData = `https://seusite.com/confirmar?pontoId=${id}&validade=${validityString}`;
       
        galleryItem.innerHTML = `
            <img src="${data.imgSrc}" alt="Foto de ${data.local}">
            <div class="gallery-info">
                <div class="info-section">
                    <div class="info-label">Local:</div>
                    <div class="local-value">${data.local}</div>
                </div>
                <div class="info-section">
                    <div class="info-label">Horário em que abre:</div>
                    <div class="hours-value">${data.abertura}</div>
                </div>
                <div class="info-section">
                    <div class="info-label">Horário em que fecha:</div>
                    <div class="closing-hours-value">${data.fechamento}</div>
                </div>
                <div class="info-section">
                    <div class="info-label">Endereço:</div>
                    <div class="address-value">${data.endereco}</div>
                </div>
            </div>
            <div class="action-buttons" style="margin-bottom: 10px;">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </div>
        `;


        gallery.appendChild(galleryItem);
       
        galleryItem.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            editItem(id);
        });


        galleryItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteItem(id);
        });


        galleryItem.addEventListener('click', () => openQrModal(id));
    }


    function openQrModal(itemId) {
        const itemElement = document.getElementById(itemId);
        if (!itemElement) return;


        const { local, abertura, fechamento, endereco } = itemElement.dataset;
        let qrData = itemElement.dataset.qrData;


        const params = new URLSearchParams(qrData.split('?')[1]);
        const validity = params.get('validade');
        const [year, month] = validity.split('-').map(Number);


        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;


        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            const newValidityString = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
            qrData = `https://seusite.com/confirmar?pontoId=${itemId}&validade=${newValidityString}`;
            itemElement.dataset.qrData = qrData;
           
            mostrarMensagem('O QR Code foi atualizado para o mês atual.', 'info');
        }


        const qrCodeDate = new Date(year, month - 1, 1);
        const expirationDate = new Date(qrCodeDate.getFullYear(), qrCodeDate.getMonth() + 1, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
       
        const timeLeft = expirationDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));




        document.getElementById('qrModalTitle').textContent = local;


        const countdownEl = document.getElementById('qrCountdown');
        if (daysLeft > 0) {
            countdownEl.textContent = `Este QR Code expira em ${daysLeft} dia(s).`;
            countdownEl.style.color = daysLeft <= 5 ? '#6d4c41' : '#a1887f';
        } else {
            countdownEl.textContent = 'Este QR Code expirou e será renovado.';
            countdownEl.style.color = '#6d4c41';
        }


        document.getElementById('qrInfoContainer').innerHTML = `
            <p><strong>Horário de Funcionamento:</strong> ${abertura} - ${fechamento}</p>
            <p><strong>Endereço:</strong> ${endereco}</p>
        `;


        const qrContainer = document.getElementById('qrCodeContainer');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });


        qrCodeModal.show();
    }


    function editItem(itemId) {
        editingItemId = itemId;
        const item = document.getElementById(itemId);
        localName.value = item.dataset.local;
        openingHours.value = item.dataset.abertura;
        closingHours.value = item.dataset.fechamento;
        address.value = item.dataset.endereco;
       
        imagePreview.src = item.querySelector('img').src;
        imagePreview.style.display = 'block';
        document.querySelector('.upload-text').style.display = 'none';


        addButton.textContent = 'Atualizar Item';
        cancelButton.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    function updateItem() {
        if (!localName.value.trim() || !openingHours.value.trim() || !closingHours.value.trim() || !address.value.trim()) {
            mostrarMensagem('Todos os campos são obrigatórios.');
            return;
        }


        const item = document.getElementById(editingItemId);
        item.dataset.local = localName.value;
        item.dataset.abertura = openingHours.value;
        item.dataset.fechamento = closingHours.value;
        item.dataset.endereco = address.value;


        if (imageInput.files[0]) {
            item.querySelector('img').src = URL.createObjectURL(imageInput.files[0]);
        }


        item.querySelector('.local-value').textContent = localName.value;
        item.querySelector('.hours-value').textContent = openingHours.value;
        item.querySelector('.closing-hours-value').textContent = closingHours.value;
        item.querySelector('.address-value').textContent = address.value;
       
        clearInputs();
        mostrarMensagem('Item atualizado com sucesso!', 'sucesso');
    }


    function deleteItem(itemId) {
        if (!confirm('Tem certeza que deseja excluir este item?')) {
            return;
        }
        document.getElementById(itemId).remove();
        count--;
        if (editingItemId === itemId) {
            clearInputs();
        }
        addButton.disabled = false;
        mostrarMensagem('Item excluído com sucesso!', 'sucesso');
    }
}


function setupProfileDropdown() {
    const usuarioBtn = document.getElementById("usuario");
    const dropdownMenu = document.getElementById("dropzinho");
   
    if (!usuarioBtn || !dropdownMenu) return;
   
    const isMobile = window.innerWidth <= 768;
   
    if (isMobile) {
        usuarioBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
       
        document.addEventListener("click", function(e) {
            if (!usuarioBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    } else {
        usuarioBtn.addEventListener("mouseenter", function() {
            dropdownMenu.style.display = "block";
        });
       
        const profileDropdown = document.querySelector(".profile-dropdown");
        if (profileDropdown) {
            profileDropdown.addEventListener("mouseleave", function() {
                dropdownMenu.style.display = "none";
            });
        }
       
        usuarioBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
    }
   
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            dropdownMenu.style.display = "none";
        });
    });
}


function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;


    if (!sidebar) return;


    sidebar.classList.toggle("open");
    body.classList.toggle("sidebar-open");


    let overlay = document.getElementById("sidebar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "sidebar-overlay";
        overlay.style.display = "none";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.right = "0";
        overlay.style.bottom = "0";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = "650";
        document.body.appendChild(overlay);


        overlay.addEventListener("click", function () {
            toggleSidebar();
        });
    }


    if (sidebar.classList.contains("open")) {
        overlay.style.display = "block";
        document.body.style.overflow = "hidden";


        const imgHeader = document.getElementById("imgheader");
        if (imgHeader) {
            imgHeader.style.visibility = "visible";
            imgHeader.style.opacity = "1";
        }
    } else {
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
    }
}


function createModalOverlay() {
    let modalOverlay = document.getElementById("modal-overlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "modal-overlay";
        modalOverlay.style.display = "none";
        modalOverlay.style.position = "fixed";
        modalOverlay.style.top = "0";
        modalOverlay.style.left = "0";
        modalOverlay.style.right = "0";
        modalOverlay.style.bottom = "0";
        modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        modalOverlay.style.zIndex = "1000";
        document.body.appendChild(modalOverlay);
    }
    return modalOverlay;
}


function handleHeaderAnimation() {
    const header = document.getElementById("header");


    if (header) {
        header.style.transition = window.innerWidth <= 768 ? "none" : "all 0.3s ease-in-out";
    }
}


function handleSidebarHover() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;
    const imgHeader = document.getElementById("imgheader");


    if (!sidebar) return;


    const oldMouseEnter = sidebar._mouseenterListener;
    const oldMouseLeave = sidebar._mouseleaveListener;
   
    if (oldMouseEnter) {
        sidebar.removeEventListener("mouseenter", oldMouseEnter);
    }
   
    if (oldMouseLeave) {
        sidebar.removeEventListener("mouseleave", oldMouseLeave);
    }
   
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
   
    if (!isTablet && window.innerWidth > 768) {
        const mouseenterListener = function() {
            body.classList.add("sidebar-expanded");
           
            if (imgHeader) {
                imgHeader.style.visibility = "visible";
                imgHeader.style.opacity = "1";
            }
        };
       
        const mouseleaveListener = function() {
            body.classList.remove("sidebar-expanded");
        };
       
        sidebar.addEventListener("mouseenter", mouseenterListener);
        sidebar.addEventListener("mouseleave", mouseleaveListener);
       
        sidebar._mouseenterListener = mouseenterListener;
        sidebar._mouseleaveListener = mouseleaveListener;
    }
    else if (isTablet && imgHeader) {
        imgHeader.style.visibility = "visible";
        imgHeader.style.opacity = "1";
    }
}


function ensureSidebarHeight() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && window.innerWidth <= 768) {
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );


        sidebar.style.height = Math.max(docHeight, window.innerHeight) + "px";
    }
}


function setupSocialMediaLinks() {
    const instagramBtn = document.getElementById("botao");
    const instagramCaixa = document.getElementById("caixa-principal");
    const instagramSairBtn = document.getElementById("botao-sair");
    const modalOverlay = createModalOverlay();
   
    if (instagramBtn && instagramCaixa && instagramSairBtn) {
        instagramBtn.addEventListener("click", () => {
            instagramCaixa.style.display = "flex";
            modalOverlay.style.display = "block";
            document.body.style.overflow = "hidden";
        });
       
        instagramSairBtn.addEventListener("click", () => {
            instagramCaixa.style.display = "none";
            modalOverlay.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }
   
    const facebookBtn = document.getElementById("facebook");
    const facebookCaixa = document.getElementById("caixa-principal2");
    const facebookSairBtn = document.getElementById("botao-sair2");
   
    if (facebookBtn && facebookCaixa && facebookSairBtn) {
        facebookBtn.addEventListener("click", () => {
            facebookCaixa.style.display = "flex";
            modalOverlay.style.display = "block";
            document.body.style.overflow = "hidden";
        });
       
        facebookSairBtn.addEventListener("click", () => {
            facebookCaixa.style.display = "none";
            modalOverlay.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }
   
    const editarInstagramBtn = document.getElementById("editarLink");
    if (editarInstagramBtn) {
        editarInstagramBtn.addEventListener("click", function() {
            const instagramInput = document.getElementById("instagram");
            const instagramLinkContainer = document.getElementById("linkContainer");
            const instagramConfirmarBtn = document.getElementById("botaocaixa");
           
            if (instagramInput) instagramInput.style.display = "block";
            if (instagramConfirmarBtn) instagramConfirmarBtn.style.display = "block";
            if (instagramLinkContainer) instagramLinkContainer.innerHTML = "";
            editarInstagramBtn.style.display = "none";
        });
    }
   
    const editarFacebookBtn = document.getElementById("editarLink2");
    if (editarFacebookBtn) {
        editarFacebookBtn.addEventListener("click", function() {
            const facebookInput = document.getElementById("facebook2");
            const facebookLinkContainer = document.getElementById("linkContainer2");
            const facebookConfirmarBtn = document.getElementById("botaocaixa2");
           
            if (facebookInput) facebookInput.style.display = "block";
            if (facebookConfirmarBtn) facebookConfirmarBtn.style.display = "block";
        })}};