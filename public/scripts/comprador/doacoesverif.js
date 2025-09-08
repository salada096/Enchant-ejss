let pontosColeta = [
            {
                id: 1,
                codigo: "001",
                localizacao: "Centro da cidade",
                tipo: "Roupas",
                data: "25/07/2025",
                status: "nao-recolhido"
            },
            {
                id: 2,
                codigo: "002",
                localizacao: "Bairro Norte",
                tipo: "Alimentos",
                data: "24/07/2025",
                status: "recolhido"
            },
            {
                id: 3,
                codigo: "003",
                localizacao: "Zona Sul",
                tipo: "Brinquedos",
                data: "23/07/2025",
                status: "recolhido"
            },
            {
                id: 4,
                codigo: "004",
                localizacao: "Bairro Leste",
                tipo: "Livros",
                data: "26/07/2025",
                status: "nao-recolhido"
            },
            {
                id: 5,
                codigo: "005",
                localizacao: "Centro Oeste",
                tipo: "Móveis",
                data: "22/07/2025",
                status: "recolhido"
            },
            {
                id: 6,
                codigo: "006",
                localizacao: "Periferia",
                tipo: "Eletrônicos",
                data: "27/07/2025",
                status: "nao-recolhido"
            }
        ];

        // Função para criar o HTML de um ponto de coleta
        function criarCardPonto(ponto) {
            const statusText = ponto.status === 'recolhido' ? 'Recolhido' : 'Pendente';
            const statusClass = ponto.status === 'recolhido' ? 'recolhido' : 'nao-recolhido';
            
            return `
                <div class="product-card fade-in" data-status="${ponto.status}" data-id="${ponto.id}">
                    <div class="status-badge ${statusClass}">${statusText}</div>
                    <div class="card-content">
                        <div class="product-details">
                            <div class="product-id">Ponto de coleta: #${ponto.id.toString().padStart(2, '0')}</div>
                            <div class="product-specs">
                                <div class="spec-item">
                                    <i class="bi bi-qr-code"></i>
                                    <span>Código: ${ponto.codigo}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-geo-alt"></i>
                                    <span>${ponto.localizacao}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-box-seam"></i>
                                    <span>${ponto.tipo}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-calendar-fill"></i>
                                    <span>Data: ${ponto.data}</span>
                                </div>
                            </div>
                            <div class="product-actions">
                                ${ponto.status === 'recolhido' ? 
                                    `<button class="recolheido active" onclick="alternarStatus(${ponto.id})">
                                        Recolhido - Clique para alterar
                                    </button>` :
                                    `<button class="recolheido" onclick="alternarStatus(${ponto.id})">
                                        Marcar como Recolhido
                                    </button>`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Função para renderizar todos os pontos
        function renderizarPontos() {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = pontosColeta.map(ponto => criarCardPonto(ponto)).join('');
        }

        // Funcionalidade das abas com filtro
        function inicializarAbas() {
            const navTabs = document.querySelectorAll('.nav-tab');

            navTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    navTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    filterProducts(filter);
                });
            });
        }

        function filterProducts(filter) {
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const status = card.getAttribute('data-status');
                
                if (filter === 'todos') {
                    card.classList.remove('hidden');
                } else if (filter === 'recolhidos' && status === 'recolhido') {
                    card.classList.remove('hidden');
                } else if (filter === 'nao-recolhidos' && status === 'nao-recolhido') {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        // Função para alternar status entre recolhido e não recolhido
        function alternarStatus(id) {
            const ponto = pontosColeta.find(p => p.id === id);
            if (ponto) {
                // Alterna entre recolhido e nao-recolhido
                ponto.status = ponto.status === 'recolhido' ? 'nao-recolhido' : 'recolhido';
                renderizarPontos();
                atualizarContadores();
                
                // Aplicar filtro atual
                const activeTab = document.querySelector('.nav-tab.active');
                const currentFilter = activeTab.getAttribute('data-filter');
                filterProducts(currentFilter);
            }
        }

        function atualizarContadores() {
            const total = pontosColeta.length;
            const recolhidos = pontosColeta.filter(p => p.status === 'recolhido').length;
            const naoRecolhidos = pontosColeta.filter(p => p.status === 'nao-recolhido').length;
            
            document.getElementById('count-todos').textContent = total;
            document.getElementById('count-recolhidos').textContent = recolhidos;
            document.getElementById('count-nao-recolhidos').textContent = naoRecolhidos;
        }

        // Função para receber dados externos (pode ser chamada via API)
        function receberDadosExternos(novosDados) {
            // novosDados deve ser um array de objetos com a estrutura esperada
            novosDados.forEach(dado => {
                const novoPonto = {
                    id: Math.max(...pontosColeta.map(p => p.id), 0) + 1,
                    codigo: dado.codigo || `${pontosColeta.length + 1}`.padStart(3, '0'),
                    localizacao: dado.localizacao || 'Não informado',
                    tipo: dado.tipo || 'Outros',
                    data: dado.data || new Date().toLocaleDateString('pt-BR'),
                    status: dado.status || 'nao-recolhido'
                };
                pontosColeta.push(novoPonto);
            });
            
            renderizarPontos();
            atualizarContadores();
            
            // Aplicar filtro atual
            const activeTab = document.querySelector('.nav-tab.active');
            const currentFilter = activeTab.getAttribute('data-filter');
            filterProducts(currentFilter);
        }

        // Funcionalidade da paginação
        const pageDots = document.querySelectorAll('.page-dot');
        pageDots.forEach(dot => {
            dot.addEventListener('click', function() {
                pageDots.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            renderizarPontos();
            atualizarContadores();
            inicializarAbas(); // Inicializar as abas após o DOM estar carregado
        });

        // Exemplo de como usar a função de dados externos
        // receberDadosExternos([
        //     {
        //         codigo: "008",
        //         localizacao: "Nova Região",
        //         tipo: "Medicamentos",
        //         data: "30/07/2025",
        //         status: "nao-recolhido"
        //     }
        // ]);
