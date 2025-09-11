// Sistema Simples de Edição de Categorias de Doação
class SimpleDonationManager {
    constructor() {
        this.deletedCategories = new Map();
        this.init();
    }

    init() {
        this.createControlButton();
        this.loadDeletedCategories();
        this.addStyles();
    }

    // Cria o botão principal de controle
    createControlButton() {
        const controlContainer = document.createElement('div');
        controlContainer.id = 'simple-control';
        controlContainer.innerHTML = `
            <div style="
                text-align: center;
                margin: 20px auto;
                padding: 15px;
                max-width: 1200px;
            ">
                <button id="toggle-edit-simple" style="
                    background-color: #e2ccae;
                    color: #3d2106;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    font-family: 'Lexend Deca', sans-serif;
                ">
                Editar Categorias
                </button>
                
                <div id="restore-section" style="
                    margin-top: 15px;
                    display: none;
                ">
                    <p style="
                        color: #666;
                        margin-bottom: 10px;
                        font-family: 'Lexend Deca', sans-serif;
                    ">Categorias removidas - toque para voltar</p>
                    <div id="deleted-categories-list" style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        justify-content: center;
                    "></div>
                </div>
            </div>
        `;

        // Insere antes do container principal
        const container = document.getElementById('container');
        container.parentNode.insertBefore(controlContainer, container);

        this.addControlEvents();
    }

    // Adiciona estilos CSS
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .category-edit-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
                display: flex;
                gap: 5px;
            }

            .edit-btn {
                width: 35px;
                height: 35px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }

            .delete-btn {
                background-color: #e2ccae;
                color: #3d2106;
            }

            .delete-btn:hover {
                background-color: #caae8d;
                color: #3d2106;
            }

            .restore-category-btn {
                background-color: transparent;
                color: #3d2106;
                border: #3d2106 1px solid;
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: bold;
                font-family: 'Lexend Deca', sans-serif;
            }

            .restore-category-btn:hover {
                background: #bd8e6338;
            }

            .edit-mode-active .todas-imagens {
                position: relative;
            }

            .feedback-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                font-family: 'Lexend Deca', sans-serif;
            }

            .feedback-success,
            .feedback-warning,
            .feedback-danger {
                background: #ffe9c7ff;
                color: #3d2106;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            @media (max-width: 768px) {
                .category-edit-controls {
                    top: 5px;
                    right: 5px;
                }
                
                .edit-btn {
                    width: 30px;
                    height: 30px;
                    font-size: 12px;
                }
                
                #simple-control > div {
                    margin: 10px !important;
                    padding: 10px !important;
                }
                
                #toggle-edit-simple {
                    padding: 10px 20px !important;
                    font-size: 0.9rem !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Adiciona eventos de controle
    addControlEvents() {
        const toggleBtn = document.getElementById('toggle-edit-simple');
        let editMode = false;

        toggleBtn.addEventListener('click', () => {
            editMode = !editMode;
            
            if (editMode) {
                this.enableEditMode();
                toggleBtn.innerHTML = 'Finalizar Edição';
                toggleBtn.style.backgroundColor = '#caae8d';
                document.getElementById('restore-section').style.display = 'block';
                this.updateDeletedCategoriesList();
            } else {
                this.disableEditMode();
                toggleBtn.innerHTML = 'Editar Categorias';
                toggleBtn.style.backgroundColor = '#e2ccae';
                document.getElementById('restore-section').style.display = 'none';
            }
        });
    }

    // Ativa modo de edição
    enableEditMode() {
        document.body.classList.add('edit-mode-active');
        
        const categories = document.querySelectorAll('.todas-imagens');
        categories.forEach(category => {
            this.addEditControls(category);
        });

        this.showFeedback('Modo de edição ativado. Clique no X para remover categorias.', 'warning');
    }

    // Desativa modo de edição
    disableEditMode() {
        document.body.classList.remove('edit-mode-active');
        
        const controls = document.querySelectorAll('.category-edit-controls');
        controls.forEach(control => control.remove());

        this.showFeedback('Modo de edição finalizado.', 'success');
    }

    // Adiciona controles de edição em cada card
    addEditControls(categoryElement) {
        // Remove controles existentes
        const existingControls = categoryElement.querySelector('.category-edit-controls');
        if (existingControls) {
            existingControls.remove();
        }

        const controls = document.createElement('div');
        controls.className = 'category-edit-controls';
        controls.innerHTML = `
            <button class="edit-btn delete-btn" data-action="delete" data-category="${categoryElement.id}" title="Remover categoria">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        categoryElement.appendChild(controls);

        // Adiciona event listeners
        controls.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.closest('.edit-btn')?.dataset.action;
            const categoryId = e.target.closest('.edit-btn')?.dataset.category;

            if (action === 'delete' && categoryId) {
                this.deleteCategory(categoryId);
            }
        });
    }

    // Remove uma categoria
    deleteCategory(categoryId) {
        const categoryElement = document.getElementById(categoryId);
        if (!categoryElement) return;

        const categoryTitle = this.getCategoryTitle(categoryElement);

        if (confirm(`Tem certeza que deseja remover a categoria "${categoryTitle}"?`)) {
            // Salva dados da categoria antes de remover PERMANENTEMENTE
            const categoryData = {
                element: categoryElement.outerHTML,
                title: categoryTitle,
                id: categoryId
            };
            
            this.deletedCategories.set(categoryId, categoryData);
            this.saveDeletedCategories();

            // Anima remoção
            categoryElement.classList.add('category-removing');
            
            setTimeout(() => {
                // REMOVE REALMENTE do DOM
                categoryElement.remove();
                this.showFeedback(`"${categoryTitle}" foi removida.`, 'danger');
                this.updateDeletedCategoriesList();
            }, 500);
        }
    }

    // Restaura uma categoria
    restoreCategory(categoryId) {
        const categoryData = this.deletedCategories.get(categoryId);
        if (!categoryData) return;

        // Encontra onde inserir a categoria (mantém ordem original)
        const container = document.querySelector('.container-marrom');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = categoryData.element;
        const restoredElement = tempDiv.firstElementChild;

        // Remove classes de animação se existirem
        restoredElement.classList.remove('category-removing');

        // Insere a categoria de volta no DOM
        container.appendChild(restoredElement);

        // Remove dos deletados
        this.deletedCategories.delete(categoryId);
        this.saveDeletedCategories();

        // Se estiver em modo edição, adiciona controles
        if (document.body.classList.contains('edit-mode-active')) {
            this.addEditControls(restoredElement);
        }

        this.showFeedback(`"${categoryData.title}" foi restaurada.`, 'success');
        this.updateDeletedCategoriesList();
    }

    // Atualiza lista de categorias deletadas
    updateDeletedCategoriesList() {
        const listContainer = document.getElementById('deleted-categories-list');
        listContainer.innerHTML = '';

        if (this.deletedCategories.size === 0) {
            listContainer.innerHTML = '<p style="color: #999; font-style: italic;">Nenhuma categoria removida</p>';
            return;
        }

        this.deletedCategories.forEach((data, id) => {
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'restore-category-btn';
            restoreBtn.innerHTML = `${data.title}`;
            restoreBtn.addEventListener('click', () => this.restoreCategory(id));
            
            listContainer.appendChild(restoreBtn);
        });
    }

    // Extrai título da categoria
    getCategoryTitle(element) {
        const titleMap = {
            'roupas-calcados': 'Roupas e Calçados',
            'alimentos-ração': 'Alimentos para Animais',
            'produtos-limpeza': 'Produtos de Limpeza',
            'moveis-eletrodomésticos': 'Móveis e Eletrodomésticos',
            'livros-brinquedos': 'Livros e Brinquedos',
            'cobertores-mais': 'Cobertores e Variedades'
        };
        
        return titleMap[element.id] || element.id;
    }

    // Salva categorias deletadas no localStorage
    saveDeletedCategories() {
        const data = {};
        this.deletedCategories.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem('deleted_donation_categories', JSON.stringify(data));
        console.log('📁 Categorias deletadas salvas:', data);
    }

    // Carrega categorias deletadas do localStorage
    loadDeletedCategories() {
        try {
            const saved = localStorage.getItem('deleted_donation_categories');
            if (saved) {
                const data = JSON.parse(saved);
                console.log('📁 Carregando categorias deletadas:', data);
                
                Object.entries(data).forEach(([key, value]) => {
                    this.deletedCategories.set(key, value);
                    
                    // REMOVE REALMENTE a categoria do DOM se ela ainda estiver lá
                    const element = document.getElementById(key);
                    if (element) {
                        console.log(`🗑️ Removendo categoria salva: ${key}`);
                        element.remove();
                    }
                });
            }
        } catch (error) {
            console.warn('❌ Erro ao carregar categorias deletadas:', error);
        }
    }

    // Mostra feedback visual
    showFeedback(message, type = 'success') {
        const feedback = document.createElement('div');
        feedback.className = `feedback-toast feedback-${type}`;
        feedback.textContent = message;

        document.body.appendChild(feedback);

        // Anima entrada
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);

        // Remove após 3 segundos
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
}

// Inicializa o sistema
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.simpleDonationManager = new SimpleDonationManager();
        console.log('✅ Sistema Simples de Edição de Categorias inicializado!');
    }, 100);
});

// Utilitário para reset completo
window.resetDonationCategories = () => {
    if (confirm('Isso irá restaurar todas as categorias e limpar o histórico. Continuar?')) {
        localStorage.removeItem('deleted_donation_categories');
        console.log('🔄 Reset completo realizado - recarregando página...');
        location.reload();
    }
};