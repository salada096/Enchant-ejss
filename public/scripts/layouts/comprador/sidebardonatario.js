/**
 * Trapp Full-Stack Solutions
 * Arquivo: sidebar-component.js
 * Descrição: Componente isolado da Sidebar com navegação responsiva
 * Instruções: Adicione <script src="sidebar-component.js" defer></script> ao seu arquivo HTML.
 */

(function() {
    // Garante que o script só rode após o carregamento completo do DOM.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSidebar);
    } else {
        initializeSidebar();
    }

    function initializeSidebar() {
        /**
         * Classe responsável pela injeção e gerenciamento da Sidebar
         */
        class SidebarManager {
            constructor() {
                this.injectSidebarStyles();
                this.injectSidebarHTML();
                this.initializeSidebarScripts();
            }

            /**
             * Injeta apenas os estilos CSS relacionados à Sidebar
             */
            injectSidebarStyles() {
                const css = `
                    /* ===== VARIÁVEIS GLOBAIS ===== */
                    :root {
                        --primary-color: #693B11;
                        --accent-color: #EC9E07;
                        --text-color: #333;
                        --light-bg: #ECECEC;
                        --white: #FFFFFF;
                        --shadow: rgba(180, 180, 180, 0.3);
                        --sidebar-width: 230px;
                        --sidebar-collapsed: 50px;
                        --header-height: 56px;
                        --transition: 0.3s ease;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family: "Lexend Deca", sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: var(--white);
                    }

                    /* ===== SIDEBAR ===== */
                    .sidebar {
                        position: fixed;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        width: var(--sidebar-collapsed);
                        background-color: var(--light-bg);
                        transition: var(--transition);
                        overflow: hidden;
                        z-index: 800;
                        border-radius: 0 6px 6px 0;
                    }
                    
                    @media (min-width: 1025px) {
                        .sidebar {
                            display: block;
                            width: var(--sidebar-collapsed);
                        }
                        .sidebar:hover {
                            width: var(--sidebar-width);
                        }
                        .sidebar:hover .sidebar-nav a span {
                            opacity: 1;
                            visibility: visible;
                        }
                    }

                    .sidebar-nav {
                        padding-top: var(--header-height);
                    }

                    .sidebar-nav a {
                        display: flex;
                        align-items: center;
                        color: var(--text-color);
                        padding: 13px;
                        text-decoration: none;
                        white-space: nowrap;
                        transition: var(--transition);
                    }

                    .sidebar-nav a:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }

                    .sidebar-nav i {
                        font-size: 1.2rem;
                        margin-right: 20px;
                        color: #4e4e4e;
                        min-width: 20px;
                        text-align: center;
                    }

                    .sidebar-nav span {
                        font-size: 14px;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.2s, visibility 0.2s;
                    }

                    /* ===== OVERLAY PARA MOBILE ===== */
                    .sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 799;
                        display: none;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    
                    .sidebar-overlay.show {
                        display: block;
                        opacity: 1;
                    }

                    /* ===== ESPAÇAMENTO PARA CONTEÚDO ===== */
                    .main-content {
                        margin-left: var(--sidebar-collapsed);
                        transition: var(--transition);
                        min-height: 100vh;
                        padding: 20px;
                    }

                    /* ===== RESPONSIVIDADE ===== */
                    @media (max-width: 1024px) {
                        .sidebar {
                            left: -100%;
                            width: var(--sidebar-width);
                            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
                        }
                        
                        .sidebar.open { 
                            left: 0; 
                        }
                        
                        .sidebar-nav span { 
                            opacity: 1; 
                            visibility: visible; 
                        }
                        
                        .main-content { 
                            margin-left: 0; 
                        }
                        
                        .sidebar-nav { 
                            padding-top: 50px; 
                        }
                    }

                    @media (max-width: 768px) {
                        .sidebar-nav { 
                            padding-top: 50px; 
                        }
                    }
                `;
                
                const styleElement = document.createElement('style');
                styleElement.innerHTML = css;

                // Adiciona as fontes necessárias
                const bootstrapIcons = document.createElement('link');
                bootstrapIcons.rel = 'stylesheet';
                bootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css';
                
                const lexendDecaFont = document.createElement('link');
                lexendDecaFont.rel = 'stylesheet';
                lexendDecaFont.href = 'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap';
                
                document.head.appendChild(bootstrapIcons);
                document.head.appendChild(lexendDecaFont);
                document.head.appendChild(styleElement);
            }

            /**
             * Injeta apenas a estrutura HTML da Sidebar
             */
            injectSidebarHTML() {
                const sidebarHTML = `
                    <aside class="sidebar" id="sidebar">
                        <nav class="sidebar-nav">
                            <a href="/src/views/comprador/mapa.html">
                                <i class="bi bi-map"></i>
                                <span>Mapa</span>
                            </a>
                            <a href="/src/views/comprador/pontosdeabrigo.html">
                                <i class="bi bi-geo"></i>
                                <span>Pontos de abrigo</span>
                            </a>
                            <a href="/src/views/comprador/ajudamedica.html">
                                <i class="bi bi-truck"></i>
                                <span>Ajuda médica</span>
                            </a>
      
                            <a href="/src/views/comprador/transparencia1.html">
                                <i class="bi bi-search"></i>
                                <span>Transparência</span>
                            </a>
           
                            <a href="/src/views/comprador/ajuda.html">
                                <i class="bi bi-info-circle"></i>
                                <span>Ajuda</span>
                            </a>
                        </nav>
                    </aside>
                    
                    <div class="sidebar-overlay" id="sidebarOverlay"></div>
                    
                    <main class="main-content">
                        <div class="content-area" id="contentArea">
                            <!-- Conteúdo da página será preservado aqui -->
                        </div>
                    </main>
                `;

                // Guarda o conteúdo original do body
                const originalContent = document.body.innerHTML;

                // Cria um container para a sidebar e injeta o HTML
                const sidebarContainer = document.createElement('div');
                sidebarContainer.id = 'trapp-sidebar-container';
                sidebarContainer.innerHTML = sidebarHTML;
                
                // Limpa o body e adiciona o container da sidebar
                document.body.innerHTML = '';
                document.body.appendChild(sidebarContainer);
                
                // Encontra a área de conteúdo e restaura o conteúdo original
                const contentArea = document.getElementById('contentArea');
                if (contentArea) {
                    contentArea.innerHTML = originalContent;
                }
            }

            /**
             * Inicializa apenas os scripts relacionados à Sidebar
             */
            initializeSidebarScripts() {
                class SidebarController {
                    constructor() {
                        this.sidebar = document.getElementById('sidebar');
                        this.sidebarOverlay = document.getElementById('sidebarOverlay');
                        
                        this.init();
                    }

                    init() {
                        this.bindEvents();
                        this.setupSidebarToggle();
                    }

                    bindEvents() {
                        // Overlay para fechar sidebar no mobile
                        this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
                        
                        // Responsividade
                        window.addEventListener('resize', () => this.handleResize());
                    }

                    setupSidebarToggle() {
                        // Função global para permitir que outros componentes controlem a sidebar
                        window.toggleSidebar = () => this.toggleSidebar();
                        window.openSidebar = () => this.openSidebar();
                        window.closeSidebar = () => this.closeSidebar();
                    }

                    toggleSidebar() {
                        if (window.innerWidth <= 1024) {
                            this.sidebar.classList.toggle('open');
                            this.sidebarOverlay.classList.toggle('show');
                            document.body.style.overflow = this.sidebar.classList.contains('open') ? 'hidden' : '';
                        }
                    }

                    openSidebar() {
                        if (window.innerWidth <= 1024) {
                            this.sidebar.classList.add('open');
                            this.sidebarOverlay.classList.add('show');
                            document.body.style.overflow = 'hidden';
                        }
                    }

                    closeSidebar() {
                        this.sidebar.classList.remove('open');
                        this.sidebarOverlay.classList.remove('show');
                        document.body.style.overflow = '';
                    }

                    handleResize() {
                        if (window.innerWidth > 1024) {
                            this.closeSidebar();
                        }
                    }
                }
                
                // Inicializa a sidebar
                new SidebarController();
            }
        }
        
        // Inicia o processo de criação da sidebar
        new SidebarManager();
    }
})();