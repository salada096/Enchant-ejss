// ================ CONFIGURAÇÕES E ESTADO GLOBAL ================
const DashboardConfig = {
    updateInterval: 30000, // 30 segundos
    animationDuration: 300,
    breakpoints: {
        mobile: 576,
        tablet: 768,
        desktop: 992,
        large: 1200
    },
    chartHeights: {
        mobile: 250,
        tablet: 300,
        desktop: 400,
        large: 450
    }
};

const DashboardState = {
    currentPeriod: 'mes',
    currentChart: null,
    isUpdating: false,
    updateTimer: null,
    resizeTimer: null,
    isMobile: false,
    isTablet: false,
    isDesktop: false
};

// ================ UTILIDADES ================
const Utils = {
    // Debounce otimizado
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle para eventos de alta frequência
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formatação de números com localização
    formatNumber(num) {
        return new Intl.NumberFormat('pt-BR').format(Math.round(num));
    },

    // Detecta o tipo de dispositivo
    getDeviceType() {
        const width = window.innerWidth;
        if (width < DashboardConfig.breakpoints.mobile) return 'mobile';
        if (width < DashboardConfig.breakpoints.tablet) return 'tablet';
        if (width < DashboardConfig.breakpoints.desktop) return 'desktop';
        return 'large';
    },

    // Anima mudança de valores
    animateValue(element, start, end, duration) {
        if (!element) return;
        
        const range = end - start;
        const startTime = performance.now();
        
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para animação suave
            const easeOutQuad = progress * (2 - progress);
            const current = start + (range * easeOutQuad);
            
            if (element.textContent !== undefined) {
                if (element.id && element.id.includes('kg')) {
                    element.textContent = Utils.formatNumber(current);
                } else if (element.id && element.id.includes('taxa')) {
                    element.textContent = `${current.toFixed(1)}%`;
                } else if (element.id && element.id.includes('media')) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Utils.formatNumber(current);
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };
        
        requestAnimationFrame(updateValue);
    },

    // Verifica se elemento está visível na viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ================ GESTÃO DE DADOS ================
const DataManager = {
    // Calcula o máximo sugerido para o gráfico
    calcularMaximoSugerido(dados) {
        const maxData = Math.max(...dados.alta, ...dados.baixa);
        return Math.ceil((maxData * 1.2) / 50) * 50 || 100;
    },

    // Gera dados do gráfico baseado no período e dispositivo
    gerarDadosGrafico(periodo, deviceType) {
        const dados = { labels: [], alta: [], baixa: [] };
        
        // Configurações adaptadas por período e dispositivo
        const periodosConfig = {
            dia: { 
                count: deviceType === 'mobile' ? 6 : 12, 
                labels: deviceType === 'mobile' 
                    ? ['0h', '4h', '8h', '12h', '16h', '20h']
                    : Array.from({ length: 12 }, (_, i) => `${i * 2}h`),
                max: 15 
            },
            semana: { 
                count: 7, 
                labels: deviceType === 'mobile' 
                    ? ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
                    : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                max: 80 
            },
            mes: { 
                count: deviceType === 'mobile' ? 15 : 30,
                labels: deviceType === 'mobile'
                    ? Array.from({ length: 15 }, (_, i) => `${(i + 1) * 2}`)
                    : Array.from({ length: 30 }, (_, i) => `${i + 1}`),
                max: 150 
            },
            ano: { 
                count: 12, 
                labels: deviceType === 'mobile'
                    ? ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
                    : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                max: 500 
            }
        };
        
        const config = periodosConfig[periodo] || periodosConfig.mes;
        dados.labels = config.labels;

        // Gera dados com variação realista
        for (let i = 0; i < config.count; i++) {
            const baixaValue = Math.floor(Math.random() * (config.max / 2)) + (config.max / 4);
            const altaValue = baixaValue + Math.floor(Math.random() * (config.max / 3)) + 10;
            dados.baixa.push(baixaValue);
            dados.alta.push(altaValue);
        }
        
        return dados;
    },

    // Calcula fator de escala baseado no período
    getScalingFactor(periodo, customDates = null) {
        if (periodo === 'custom' && customDates) {
            const { start, end } = customDates;
            if (start && end && end > start) {
                const diffTime = Math.abs(end - start);
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            }
        }
        
        const periodFactors = { 
            dia: 1, 
            semana: 7, 
            mes: 30, 
            ano: 365 
        };
        
        return periodFactors[periodo] || 30;
    }
};

// ================ GESTÃO DO GRÁFICO ================
const ChartManager = {
    // Cria o gráfico com configurações responsivas
    criarGrafico() {
        const canvas = document.getElementById('doacoesChart');
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const deviceType = Utils.getDeviceType();
        
        // Destrói gráfico anterior se existir
        if (DashboardState.currentChart) {
            DashboardState.currentChart.destroy();
        }

        // Configurações responsivas do Chart.js
        const chartConfig = {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: DashboardConfig.animationDuration
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: { 
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 10,
                        cornerRadius: 4,
                        titleFont: {
                            size: deviceType === 'mobile' ? 12 : 14
                        },
                        bodyFont: {
                            size: deviceType === 'mobile' ? 11 : 13
                        },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y + ' kg';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { 
                            color: '#e0e0e0',
                            drawBorder: false
                        }, 
                        ticks: { 
                            color: '#333',
                            font: {
                                size: deviceType === 'mobile' ? 10 : 12
                            },
                            padding: deviceType === 'mobile' ? 5 : 8
                        } 
                    },
                    x: { 
                        grid: { 
                            display: false 
                        }, 
                        ticks: { 
                            color: '#333',
                            font: {
                                size: deviceType === 'mobile' ? 10 : 12
                            },
                            maxRotation: deviceType === 'mobile' ? 45 : 0,
                            minRotation: deviceType === 'mobile' ? 45 : 0
                        } 
                    }
                },
                elements: {
                    line: {
                        borderWidth: deviceType === 'mobile' ? 2 : 3,
                        tension: 0.4
                    },
                    point: {
                        radius: deviceType === 'mobile' ? 2 : 3,
                        hoverRadius: deviceType === 'mobile' ? 4 : 5
                    }
                }
            }
        };

        DashboardState.currentChart = new Chart(ctx, chartConfig);
        return DashboardState.currentChart;
    },

    // Atualiza o gráfico com novos dados
    atualizarGrafico(periodo) {
        if (!DashboardState.currentChart) {
            this.criarGrafico();
        }
        
        if (!DashboardState.currentChart) return;
        
        const deviceType = Utils.getDeviceType();
        const dados = DataManager.gerarDadosGrafico(periodo, deviceType);
        
        DashboardState.currentChart.data.labels = dados.labels;
        DashboardState.currentChart.data.datasets = [
            {
                label: 'Variação Alta',
                data: dados.alta,
                borderColor: 'rgb(224, 174, 124)',
                backgroundColor: 'rgba(224, 174, 124, 0.1)',
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Variação Baixa',
                data: dados.baixa,
                borderColor: 'rgb(123, 71, 26)',
                backgroundColor: 'rgba(123, 71, 26, 0.1)',
                tension: 0.4,
                fill: false,
            }
        ];
        
        DashboardState.currentChart.options.scales.y.suggestedMax = DataManager.calcularMaximoSugerido(dados);
        DashboardState.currentChart.update('active');
    },

    // Ajusta altura do gráfico baseado no dispositivo
    ajustarAlturaGrafico() {
        const container = document.querySelector('.chart-container');
        if (!container) return;
        
        const deviceType = Utils.getDeviceType();
        const height = DashboardConfig.chartHeights[deviceType] || DashboardConfig.chartHeights.desktop;
        container.style.height = `${height}px`;
        
        if (DashboardState.currentChart) {
            DashboardState.currentChart.resize();
        }
    }
};

// ================ ATUALIZAÇÃO DE UI ================
const UIUpdater = {
    // Atualiza cards de resumo com animação
    atualizarSummaryCards(scalingFactor = 30) {
        const updates = [
            {
                id: 'summary-total-kg',
                value: Math.round((Math.random() * 15 + 35) * scalingFactor),
                format: 'number'
            },
            {
                id: 'summary-media-kg',
                value: Math.random() * 5 + 10,
                format: 'decimal'
            },
            {
                id: 'summary-novos-doadores',
                value: Math.round(Math.max(1, (Math.random() * 1.5) * scalingFactor)),
                format: 'number'
            },
            {
                id: 'summary-taxa-sucesso',
                value: Math.random() * 7 + 91,
                format: 'percent'
            }
        ];

        updates.forEach(update => {
            const element = document.getElementById(update.id);
            if (element) {
                const currentValue = parseFloat(element.textContent.replace(/[^\d.-]/g, '')) || 0;
                
                if (update.format === 'percent') {
                    Utils.animateValue(element, currentValue, update.value, DashboardConfig.animationDuration);
                } else if (update.format === 'decimal') {
                    element.textContent = update.value.toFixed(1);
                } else {
                    Utils.animateValue(element, currentValue, update.value, DashboardConfig.animationDuration);
                }
            }
        });
    },

    // Atualiza estatísticas com animação
    atualizarEstatisticas(scalingFactor = 30) {
        const estatisticas = {
            cadastros: Math.max(1, Math.random() * scalingFactor),
            doacoes: Math.max(1, Math.random() * 3 * scalingFactor),
            pendentes: Math.max(1, Math.random() * 0.5 * scalingFactor),
            triadas: Math.max(1, Math.random() * 2 * scalingFactor),
            finalizadas: Math.max(1, Math.random() * 2.8 * scalingFactor),
            tempo: Math.round(Math.random() * 5 + 2)
        };

        Object.keys(estatisticas).forEach(key => {
            const element = document.getElementById(`stat-${key}`);
            if (element && Utils.isInViewport(element)) {
                const currentValue = parseFloat(element.textContent.replace(/[^\d.-]/g, '')) || 0;
                Utils.animateValue(element, currentValue, estatisticas[key], DashboardConfig.animationDuration);
            }
        });
    },

    // Carrega pontos de coleta
    carregarPontosColeta() {
        const container = document.getElementById('pontos-coleta');
        if (!container) return;
        
        const pontosColeta = [
            { nome: 'Entradas', status: '3 doadores', trend: 'up' },
            { nome: 'Ponto de coleta X', status: 'arrecadou', trend: 'stable' },
            { nome: 'Ponto de coleta Y', status: 'arrecadou', trend: 'up' },
            { nome: 'Ponto de coleta W', status: 'arrecadou', trend: 'down' },
            { nome: 'Ponto de coleta S', status: 'arrecadou', trend: 'stable' }
        ];
        
        const html = pontosColeta.map(ponto => `
            <div class="collection-point" data-trend="${ponto.trend}">
                <div class="point-info">
                    <div class="point-name">${ponto.nome}</div>
                    <div class="point-status">${ponto.status}</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    },

    // Atualiza botões de filtro
    atualizarBotoesFiltroDePeriodo(periodo) {
        document.querySelectorAll('.btn-date-filter').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        if (periodo !== 'custom') {
            const activeButton = document.querySelector(`.btn-date-filter[onclick*="'${periodo}'"]`);
            if (activeButton) {
                activeButton.classList.add('active');
                activeButton.setAttribute('aria-pressed', 'true');
            }
        }
    }
};

// ================ GESTÃO DE EVENTOS ================
const EventManager = {
    // Configura todos os event listeners
    setupEventListeners() {
        // Resize com debounce otimizado
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Detecta mudança de orientação em mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 500);
        });

        // Visibility change para pausar/retomar updates
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausarAtualizacoes();
            } else {
                this.retomarAtualizacoes();
            }
        });

        // Touch events para mobile
        if ('ontouchstart' in window) {
            this.setupTouchEvents();
        }

        // Keyboard navigation
        this.setupKeyboardNavigation();
    },

    // Handle resize events
    handleResize() {
        const deviceType = Utils.getDeviceType();
        const previousDevice = DashboardState.isDesktop ? 'desktop' : 
                               DashboardState.isTablet ? 'tablet' : 'mobile';
        
        // Atualiza estado do dispositivo
        DashboardState.isMobile = deviceType === 'mobile';
        DashboardState.isTablet = deviceType === 'tablet';
        DashboardState.isDesktop = deviceType === 'desktop' || deviceType === 'large';
        
        // Se mudou de tipo de dispositivo, recria o gráfico
        if (deviceType !== previousDevice) {
            ChartManager.ajustarAlturaGrafico();
            ChartManager.atualizarGrafico(DashboardState.currentPeriod);
        } else if (DashboardState.currentChart) {
            // Se o tipo de dispositivo não mudou, apenas redimensione o gráfico para se adequar
            DashboardState.currentChart.resize();
        }
    },

    // Configura eventos touch para mobile
    setupTouchEvents() {
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        chartContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        chartContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },

    // Handle swipe gestures
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const periodos = ['dia', 'semana', 'mes', 'ano'];
            const currentIndex = periodos.indexOf(DashboardState.currentPeriod);
            
            if (diff > 0 && currentIndex < periodos.length - 1) {
                // Swipe left - próximo período
                atualizarDadosGlobais(periodos[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - período anterior
                atualizarDadosGlobais(periodos[currentIndex - 1]);
            }
        }
    },

    // Navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + P para gerar PDF
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                gerarPDF();
            }
            // Alt + R para relatório
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                gerarRelatorio();
            }
        });
    },

    // Pausa atualizações automáticas
    pausarAtualizacoes() {
        if (DashboardState.updateTimer) {
            clearInterval(DashboardState.updateTimer);
            DashboardState.updateTimer = null;
        }
    },

    // Retoma atualizações automáticas
    retomarAtualizacoes() {
        if (!DashboardState.updateTimer && DashboardState.currentPeriod !== 'custom') {
            DashboardState.updateTimer = setInterval(() => {
                atualizarDadosGlobais(DashboardState.currentPeriod);
            }, DashboardConfig.updateInterval);
        }
    }
};

// ================ FUNÇÕES GLOBAIS (mantidas para compatibilidade) ================
function atualizarDadosGlobais(periodo) {
    // Previne atualizações simultâneas
    if (DashboardState.isUpdating) return;
    DashboardState.isUpdating = true;
    
    DashboardState.currentPeriod = periodo;
    UIUpdater.atualizarBotoesFiltroDePeriodo(periodo);

    let scalingFactor = 30;
    let customDates = null;
    
    if (periodo === 'custom') {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        if (!isNaN(startDate) && !isNaN(endDate) && endDate > startDate) {
            customDates = { start: startDate, end: endDate };
            scalingFactor = DataManager.getScalingFactor(periodo, customDates);
        } else {
            DashboardState.isUpdating = false;
            return;
        }
    } else {
        scalingFactor = DataManager.getScalingFactor(periodo);
    }
    
    // Atualiza todos os componentes
    ChartManager.atualizarGrafico(periodo);
    UIUpdater.atualizarSummaryCards(scalingFactor);
    UIUpdater.atualizarEstatisticas(scalingFactor);
    
    // Reinicia timer de atualização automática se não for custom
    EventManager.pausarAtualizacoes();
    if (periodo !== 'custom') {
        EventManager.retomarAtualizacoes();
    }
    
    DashboardState.isUpdating = false;
}

function gerarRelatorio() {
    const modal = new bootstrap.Modal(document.getElementById('relatorioModal'));
    
    // Copia valores para o modal
    const mappings = [
        { from: 'summary-total-kg', to: 'modal-total-kg' },
        { from: 'summary-novos-doadores', to: 'modal-novos-doadores' },
        { from: 'stat-doacoes', to: 'modal-doacoes' },
        { from: 'stat-finalizadas', to: 'modal-finalizadas' }
    ];
    
    mappings.forEach(map => {
        const fromElement = document.getElementById(map.from);
        const toElement = document.getElementById(map.to);
        if (fromElement && toElement) {
            toElement.textContent = fromElement.textContent;
        }
    });
    
    modal.show();
}

function gerarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações de fonte e cores
        doc.setFontSize(20);
        doc.setTextColor(61, 33, 6);
        doc.text('Dashboard de Doações', 20, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 45);
        doc.text(`Período: ${DashboardState.currentPeriod.charAt(0).toUpperCase() + DashboardState.currentPeriod.slice(1)}`, 20, 52);
        
        // Linha divisória
        doc.setDrawColor(226, 204, 174);
        doc.setLineWidth(0.5);
        doc.line(20, 57, 190, 57);
        
        // Resumo principal
        doc.setFontSize(14);
        doc.setTextColor(61, 33, 6);
        doc.text('Resumo Geral:', 20, 68);
        
        doc.setFontSize(11);
        doc.setTextColor(51);
        const resumo = [
            `Total Arrecadado: ${document.getElementById('summary-total-kg').textContent} kg`,
            `Média por Doação: ${document.getElementById('summary-media-kg').textContent} kg`,
            `Novos Doadores: ${document.getElementById('summary-novos-doadores').textContent}`,
            `Taxa de Sucesso: ${document.getElementById('summary-taxa-sucesso').textContent}`
        ];
        
        let y = 78;
        resumo.forEach(item => {
            doc.text(`• ${item}`, 25, y);
            y += 7;
        });
        
        // Estatísticas detalhadas
        doc.setFontSize(14);
        doc.setTextColor(61, 33, 6);
        doc.text('Estatísticas Detalhadas:', 20, y + 10);
        
        doc.setFontSize(11);
        doc.setTextColor(51);
        const stats = [
            `Doadores de Roupas: ${document.getElementById('stat-cadastros').textContent}`,
            `Doações de Alimentos: ${document.getElementById('stat-doacoes').textContent}`,
            `Produtos de Higiene: ${document.getElementById('stat-pendentes').textContent}`,
            `Doações de Móveis: ${document.getElementById('stat-triadas').textContent}`,
            `Livros e Brinquedos: ${document.getElementById('stat-finalizadas').textContent}`,
            `Roupas de Cama: ${document.getElementById('stat-tempo').textContent}`
        ];
        
        y += 20;
        stats.forEach((stat, index) => {
            if (y > 270) {
                doc.addPage();
                y = 30;
            }
            doc.text(`• ${stat}`, 25, y);
            y += 7;
        });
        
        // Rodapé
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Dashboard de Doações - Sistema de Gestão', 105, 285, { align: 'center' });
        
        // Salva o PDF
        doc.save(`dashboard-doacoes-${new Date().getTime()}.pdf`);
        
        // Feedback visual
        const btn = document.querySelector('.btn-primary[onclick*="gerarPDF"]');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'PDF Gerado ✓';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    }
}

// ================ INICIALIZAÇÃO ================
function inicializarDashboard() {
    try {
        // Detecta tipo de dispositivo inicial
        const deviceType = Utils.getDeviceType();
        DashboardState.isMobile = deviceType === 'mobile';
        DashboardState.isTablet = deviceType === 'tablet';
        DashboardState.isDesktop = deviceType === 'desktop' || deviceType === 'large';
        
        // Inicializa componentes
        UIUpdater.carregarPontosColeta();
        ChartManager.criarGrafico();
        ChartManager.ajustarAlturaGrafico();
        
        // Configura eventos
        EventManager.setupEventListeners();
        
        // Primeira atualização de dados
        atualizarDadosGlobais('mes');
        
        // Inicia atualizações automáticas
        DashboardState.updateTimer = setInterval(() => {
            if (DashboardState.currentPeriod !== 'custom' && !document.hidden) {
                atualizarDadosGlobais(DashboardState.currentPeriod);
            }
        }, DashboardConfig.updateInterval);
        
        // Loading complete
        document.body.classList.add('dashboard-loaded');
        
        console.log('Dashboard inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar dashboard:', error);
    }
}

// Event listener para DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarDashboard);
} else {
    inicializarDashboard();
}

// Exporta para debugging se necessário
window.DashboardDebug = {
    state: DashboardState,
    config: DashboardConfig,
    utils: Utils,
    resetDashboard: () => {
        EventManager.pausarAtualizacoes();
        DashboardState.currentPeriod = 'mes';
        inicializarDashboard();
    }
};