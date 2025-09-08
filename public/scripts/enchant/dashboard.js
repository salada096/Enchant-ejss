function createChart() {
            const canvas = document.getElementById('rendimentoChart');
            const ctx = canvas.getContext('2d');
            
            // Definir dados do gráfico
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const coletaData = [40, 45, 60, 58, 65, 67, 30, 25, 24, 23, 24, 25];
            const abrigoData = [78, 70, 65, 62, 55, 58, 60, 58, 55, 60, 60, 50];
            
            // Configurar canvas
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            const width = canvas.width;
            const height = canvas.height;
            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;
            
            // Limpar canvas
            ctx.clearRect(0, 0, width, height);
            
            // Desenhar eixos
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            
            // Eixo Y
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, height - padding);
            ctx.stroke();
            
            // Eixo X
            ctx.beginPath();
            ctx.moveTo(padding, height - padding);
            ctx.lineTo(width - padding, height - padding);
            ctx.stroke();
            
            // Desenhar linhas de grade horizontais
            ctx.strokeStyle = '#f0f0f0';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= 10; i++) {
                const y = padding + (chartHeight / 10) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(width - padding, y);
                ctx.stroke();
            }
            
            // Desenhar labels do eixo Y
            ctx.fillStyle = '#666';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            for (let i = 0; i <= 10; i++) {
                const value = 100 - i * 10;
                const y = padding + (chartHeight / 10) * i;
                ctx.fillText(value.toString(), padding - 10, y + 4);
            }
            
            // Desenhar labels do eixo X
            ctx.textAlign = 'center';
            months.forEach((month, index) => {
                const x = padding + (chartWidth / (months.length - 1)) * index;
                ctx.fillText(month, x, height - padding + 20);
            });
            
            // Função para desenhar linha
            function drawLine(data, color) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                data.forEach((value, index) => {
                    const x = padding + (chartWidth / (data.length - 1)) * index;
                    const y = height - padding - (value / 100) * chartHeight;
                    
                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                
                ctx.stroke();
                
                // Desenhar pontos
                ctx.fillStyle = color;
                data.forEach((value, index) => {
                    const x = padding + (chartWidth / (data.length - 1)) * index;
                    const y = height - padding - (value / 100) * chartHeight;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            
            // Desenhar linhas
            drawLine(coletaData, '#FF6B35');
            drawLine(abrigoData, '#4A4A4A');
            
            // Título do eixo Y
            ctx.save();
            ctx.translate(20, height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillStyle = '#666';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Rendimento (%)', 0, 0);
            ctx.restore();
            
            // Título do eixo X
            ctx.fillStyle = '#666';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Tempo (Meses)', width / 2, height - 10);
        }
        
        // Inicializar gráfico quando a página carregar
        window.addEventListener('load', function() {
            createChart();
        });
        
        // Redimensionar gráfico quando a janela for redimensionada
        window.addEventListener('resize', function() {
            setTimeout(createChart, 100);
        });
        
        // Adicionar interatividade aos botões
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover classe ativa de todos os botões
                document.querySelectorAll('.btn').forEach(b => b.classList.remove('btn-primary'));
                document.querySelectorAll('.btn').forEach(b => b.classList.add('btn-secondary'));
                
                // Adicionar classe ativa ao botão clicado
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
            });
        });