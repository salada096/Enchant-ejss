document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os ícones do Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const editModeBtn = document.getElementById('edit-mode-btn');
    const colorPickerPanel = document.getElementById('color-picker-panel');
    const root = document.documentElement;

    let isEditMode = false;

    // Função para alternar o modo de edição
    if (editModeBtn) {
        editModeBtn.addEventListener('click', () => {
            isEditMode = !isEditMode;
            
            // Toggle color picker panel
            if (colorPickerPanel) {
                colorPickerPanel.classList.toggle('active', isEditMode);
            }
            
            // Toggle edit mode class on body
            document.body.classList.toggle('edit-mode', isEditMode);
            
            // Toggle editable elements
            document.querySelectorAll('.editable1').forEach(el => {
                el.classList.toggle('editable-active1', isEditMode);
                el.contentEditable = isEditMode;
            });
            
            // Change button icon
            editModeBtn.textContent = isEditMode ? '✔' : '✎';
        });
    }

    // Lógica para os seletores de cor
    const colorPickers = [
        { id: 'primary-color-picker', property: '--primary-color' },
        { id: 'secondary-color-picker', property: '--secondary-color' },
        { id: 'accent-color-picker', property: '--accent-color' },
        { id: 'quaternary-color-picker', property: '--quaternary-color' },
        { id: 'text-primary-color-picker', property: '--text-color-primary' },
        { id: 'text-secondary-color-picker', property: '--text-color-secondary' }
    ];

    colorPickers.forEach(picker => {
        const element = document.getElementById(picker.id);
        if (element) {
            element.addEventListener('input', (e) => {
                root.style.setProperty(picker.property, e.target.value);
            });
        }
    });

    // Lógica para upload de imagem do header
    const mainImageUpload = document.getElementById('main-image-upload');
    const headerBg = document.getElementById('header-bg');
    
    if (mainImageUpload && headerBg) {
        mainImageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    headerBg.style.backgroundImage = `url('${e.target.result}')`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Lógica para o carrossel
    const carouselItems = document.querySelectorAll('.carousel-item1');
    const carouselImageUpload = document.getElementById('carousel-image-upload');
    let currentImageTarget = null;

    carouselItems.forEach(item => {
        const itemImage = item.querySelector('.carousel-image1');
        
        item.addEventListener('click', () => {
            // Se estiver em modo de edição e clicar na imagem, abrir upload
            if (isEditMode && itemImage) {
                currentImageTarget = itemImage;
                if (carouselImageUpload) {
                    carouselImageUpload.click();
                }
                return;
            }

            // Comportamento normal do carrossel (apenas quando não em modo de edição)
            if (!isEditMode) {
                // Remove active de todos os itens
                carouselItems.forEach(el => el.classList.remove('active'));
                
                // Adiciona active ao item clicado
                item.classList.add('active');
            }
        });
    });

    // Lógica de upload de imagem do carrossel no modo de edição
    if (carouselImageUpload) {
        carouselImageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && currentImageTarget) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentImageTarget.style.backgroundImage = `url('${e.target.result}')`;
                    const icon = currentImageTarget.closest('.carousel-item1').querySelector('[id$="-icon"]');
                    if (icon) {
                        icon.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Lógica para o FAQ (accordion)
    const faqItems = document.querySelectorAll('.faq-item1');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Apenas funciona quando não está em modo de edição
            if (!isEditMode) {
                const isActive = item.classList.contains('active');
                
                // Fecha todos os itens FAQ
                faqItems.forEach(el => {
                    el.classList.remove('active');
                    const icon = el.querySelector('[id^="faq-btn-"]');
                    if (icon) {
                        icon.textContent = '+';
                        icon.style.transform = 'rotate(0deg)';
                    }
                });

                // Se o item não estava ativo, ativa ele
                if (!isActive) {
                    item.classList.add('active');
                    const icon = item.querySelector('[id^="faq-btn-"]');
                    if (icon) {
                        icon.textContent = '−';
                        icon.style.transform = 'rotate(45deg)';
                    }
                }
            }
        });
    });

    // Previne edição quando em modo normal
    document.querySelectorAll('.editable1').forEach(el => {
        el.addEventListener('focus', (e) => {
            if (!isEditMode) {
                e.target.blur();
            }
        });
    });

    // Auto-resize para elementos editáveis
    document.querySelectorAll('.editable1').forEach(el => {
        el.addEventListener('input', () => {
            if (el.tagName === 'DIV' || el.tagName === 'P') {
                // Auto-resize height se necessário
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            }
        });
    });

    // Salvar alterações quando sair do modo de edição
    let originalContent = {};
    
    function saveContent() {
        document.querySelectorAll('.editable1').forEach(el => {
            if (el.id) {
                originalContent[el.id] = el.innerHTML;
            }
        });
    }

    function restoreContent() {
        document.querySelectorAll('.editable1').forEach(el => {
            if (el.id && originalContent[el.id]) {
                el.innerHTML = originalContent[el.id];
            }
        });
    }

    // Salvar conteúdo original ao entrar em modo de edição
    if (editModeBtn) {
        editModeBtn.addEventListener('click', () => {
            if (isEditMode) {
                saveContent();
            }
        });
    }

    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + E para alternar modo de edição
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            if (editModeBtn) {
                editModeBtn.click();
            }
        }
        
        // ESC para sair do modo de edição
        if (e.key === 'Escape' && isEditMode) {
            if (editModeBtn) {
                editModeBtn.click();
            }
        }
    });

    // Inicialização do carrossel - define o item central como ativo por padrão
    // const middleItem = document.getElementById('card-3');
    // if (middleItem && !isEditMode) {
    //     middleItem.classList.add('active');
    // }

    // Responsive carousel behavior
    function handleCarouselResize() {
        const isMobile = window.innerWidth <= 768;
        const carouselContainer = document.querySelector('.carousel-container1');
        
        if (carouselContainer) {
            if (isMobile) {
                // Em mobile, remover transformações 3D
                carouselItems.forEach(item => {
                    item.style.transform = 'none';
                });
            } else {
                // Em desktop, restaurar transformações 3D
                carouselItems.forEach(item => {
                    const classes = item.className.split(' ');
                    const angleClass = classes.find(cls => cls.startsWith('angled-'));
                    if (angleClass && !item.classList.contains('active')) {
                        item.style.transform = '';
                    }
                });
            }
        }
    }

    // Executar na inicialização e quando redimensionar
    handleCarouselResize();
    window.addEventListener('resize', handleCarouselResize);

    // Smooth scroll para botões de ação
    const actionButtons = document.querySelectorAll('button');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Adicionar efeito de ripple ou feedback visual aqui se necessário
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Lógica para o dropdown de cadastro
    const cadastroToggle = document.getElementById('cadastroToggle');
    const cadastroDropdown = document.getElementById('cadastroDropdown');

    if (cadastroToggle && cadastroDropdown) {
        cadastroToggle.addEventListener('click', (e) => {
            e.preventDefault();
            cadastroDropdown.style.display = cadastroDropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!cadastroToggle.contains(e.target) && !cadastroDropdown.contains(e.target)) {
                cadastroDropdown.style.display = 'none';
            }
        });
    }

    // Lazy loading para imagens do carrossel se necessário
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.style.backgroundImage = `url('${img.dataset.src}')`;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, observerOptions);

    // Observar imagens com data-src
    document.querySelectorAll('[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});