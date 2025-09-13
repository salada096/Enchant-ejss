// Dados de doação confirmados
let confirmedDonations = {
    "2025-09-08": { id: 1, amount: "100kg", type: "Roupas" },
    "2025-09-15": { id: 2, amount: "50kg", type: "Alimentos" },
    "2025-09-22": { id: 3, amount: "20kg", type: "Brinquedos" },
    "2025-09-29": { id: 4, amount: "75kg", type: "Remédios" },
    "2025-10-05": { id: 5, amount: "150kg", type: "Equipamentos" }
};

// Doações pendentes de confirmação
let pendingDonations = [
    { id: 6, date: "2025-09-08", time: "10:00", amount: "30kg", type: "Alimentos", status: "Pendente" },
    { id: 7, date: "2025-09-08", time: "14:30", amount: "15kg", type: "Produtos de Higiene", status: "Pendente" },
];

// Mapeamento de tipos de doação para contagens
let donationCounts = {
    "Alimentos": 13,
    "Produtos de Higiene": 12,
    "Ração de animais": 9,
    "Roupas": 0,
    "Brinquedos": 0,
    "Remédios": 0,
    "Equipamentos": 0
};

// Mapeamento de meses para dados do gráfico
let chartDataByMonth = {
    'Janeiro': 6, 'Fevereiro': 5, 'Março': 3, 'Abril': 2, 'Maio': 1, 'Junho': 3.5,
    'Julho': 5, 'Agosto': 4.8, 'Setembro': 3.5, 'Outubro': 2.5, 'Novembro': 4, 'Dezembro': 3
};

const donationDates = Object.keys(confirmedDonations);
const donationModal = document.getElementById('donation-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalDate = document.getElementById('modal-date');
const modalAmount = document.getElementById('modal-amount');
const modalType = document.getElementById('modal-type');
const generatePdfBtn = document.getElementById('generate-pdf-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const pendingDonationsList = document.getElementById('pending-donations-list');

// Novo objeto global para armazenar os dados e o título atuais do gráfico
let currentChartData = {
    labels: [],
    data: [],
    title: ''
};

// Adiciona a data atual na seção "Hoje"
document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR');

// Função para renderizar as doações pendentes
function renderPendingDonations() {
    pendingDonationsList.innerHTML = ''; // Limpa a lista
    if (pendingDonations.length === 0) {
        pendingDonationsList.innerHTML = `<div class="p-2 text-center text-gray-500">Nenhuma doação pendente.</div>`;
    } else {
        pendingDonations.forEach(donation => {
            const donationItem = document.createElement('div');
            donationItem.className = 'flex items-center justify-between p-2 bg-gray-custom rounded-lg shadow-sm';
            donationItem.innerHTML = `
                <div>
                    <p class="text-sm font-semibold">${donation.type}</p>
                    <p class="text-xs text-gray-600">${donation.amount} - ${donation.time}</p>
                </div>
                <button class="bg-brown-custom text-white text-xs px-3 py-1 rounded-full hover:bg-orange-custom transition-colors" onclick="confirmDonation(${donation.id})">Confirmar</button>
            `;
            pendingDonationsList.appendChild(donationItem);
        });
    }
}

// Função para atualizar as contagens de doação
function updateDonationCounts() {
    for (const type in donationCounts) {
        const element = document.getElementById(`${type.toLowerCase().replace(/ /g, '-').replace('ç','c').replace('ã','a')}-count`);
        if (element) {
            element.parentElement.querySelector('span').innerText = `${donationCounts[type]} Doações - ${type}`;
        }
    }
}

// Função para atualizar o gráfico com novos dados
function updateChartWithNewData() {
    const labels = Object.keys(chartDataByMonth);
    const data = Object.values(chartDataByMonth);
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.options.scales.y.ticks.max = Math.max(...data) + 1;
    myChart.update();
    currentChartData.labels = labels;
    currentChartData.data = data;
    currentChartData.title = 'Doações por Mês';
}

// Função para confirmar uma doação
window.confirmDonation = (id) => {
    const donationIndex = pendingDonations.findIndex(d => d.id === id);
    if (donationIndex > -1) {
        const donation = pendingDonations.splice(donationIndex, 1)[0];
        confirmedDonations[donation.date] = donation;

        // Atualiza a agenda (Flatpickr)
        updateCalendar();

        // Atualiza o gráfico (simulado)
        const month = new Date(donation.date).toLocaleString('pt-BR', { month: 'long' });
        chartDataByMonth[month] = (chartDataByMonth[month] || 0) + 1; // Incrementa a doação no mês
        updateChartWithNewData();

        // Atualiza a lista de tipos de doação
        if (donationCounts[donation.type] !== undefined) {
            donationCounts[donation.type]++;
        } else {
            donationCounts[donation.type] = 1;
        }
        updateDonationCounts();

        // Re-renderiza a lista de pendentes
        renderPendingDonations();
    }
};

function updateCalendar() {
    const newDonationDates = Object.keys(confirmedDonations);
    flatpickr("#calendar", {
        inline: true,
        locale: "pt",
        dateFormat: "d/m/Y",
        enable: newDonationDates,
        onDayCreate: (dObj, dStr, fp, dayElem) => {
            const date = new Date(dayElem.dateObj);
            const formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

            if (newDonationDates.includes(formattedDate)) {
                dayElem.classList.add("donated-day");
                dayElem.onclick = (e) => {
                    e.stopPropagation();
                    showDonationDetails(formattedDate);
                };
            }
        }
    });
}

// Configuração do Flatpickr para seleção de intervalo de datas
flatpickr("#date-range-input", {
    mode: "range",
    dateFormat: "d/m/Y",
    locale: "pt",
    onClose: (selectedDates, dateStr, instance) => {
        if (selectedDates.length === 2) {
            const startDate = selectedDates[0];
            const endDate = selectedDates[1];
            document.getElementById('start-date-display').innerText = startDate.toLocaleDateString('pt-BR');
            document.getElementById('end-date-display').innerText = endDate.toLocaleDateString('pt-BR');
            updateChartData('range', { startDate, endDate });
            // Remove a classe de seleção dos filtros fixos
            document.querySelectorAll('#filter-container span').forEach(span => {
                span.classList.remove('text-brown-custom', 'border-b-2', 'border-brown-custom');
                span.classList.remove('bg-brown-custom', 'text-white');
                span.classList.add('border-gray-300');
            });
        }
    }
});

document.getElementById('date-picker-trigger').addEventListener('click', () => {
    document.getElementById('date-range-input')._flatpickr.open();
});

// Função para mostrar os detalhes da doação no modal
function showDonationDetails(date) {
    const data = confirmedDonations[date];
    if (data) {
        modalDate.innerText = new Date(date).toLocaleDateString('pt-BR');
        modalAmount.innerText = data.amount;
        modalType.innerText = data.type;
        donationModal.classList.remove('hidden');
        donationModal.classList.add('flex');
    }
}

// Função para fechar o modal
closeModalBtn.onclick = () => {
    donationModal.classList.add('hidden');
    donationModal.classList.remove('flex');
};

// Dados e configuração para o gráfico de barras
const ctx = document.getElementById('barChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: '#8B4513',
            borderWidth: 0,
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10 } }
            },
            y: {
                grid: { color: '#e0e0e0' },
                ticks: { stepSize: 1, max: 7, font: { size: 10 } }
            }
        }
    }
});

// Referências para os elementos de data
const startDateDisplay = document.getElementById('start-date-display');
const endDateDisplay = document.getElementById('end-date-display');

// Função para atualizar o gráfico com base no filtro ou intervalo de datas
function updateChartData(filter, dates = {}) {
    let labels = [];
    let data = [];
    let title = '';

    if (filter === 'range') {
        // Lógica de filtro por intervalo de datas
        title = `Doações de ${dates.startDate.toLocaleDateString('pt-BR')} a ${dates.endDate.toLocaleDateString('pt-BR')}`;
        // Exemplo simplificado: gera dados aleatórios para o intervalo
        const diffDays = Math.ceil(Math.abs(dates.endDate - dates.startDate) / (1000 * 60 * 60 * 24));
        for(let i = 0; i < diffDays; i++) {
            const currentDate = new Date(dates.startDate);
            currentDate.setDate(dates.startDate.getDate() + i);
            labels.push(currentDate.toLocaleDateString('pt-BR'));
            data.push(Math.random() * 5 + 1); // Dados aleatórios
        }
    } else {
        // Lógica dos filtros fixos (Dia, Semana, Mês, Ano)
        switch(filter) {
            case 'day':
                labels = ['Manhã', 'Tarde', 'Noite'];
                data = [0.5, 1.2, 0.8];
                title = 'Doações por Dia';
                break;
            case 'week':
                labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
                data = [2, 1, 3, 2.5, 4, 1.5, 3];
                title = 'Doações por Semana';
                break;
            case 'month':
                labels = Object.keys(chartDataByMonth);
                data = Object.values(chartDataByMonth);
                title = 'Doações por Mês';
                break;
            case 'year':
                labels = ['2023', '2024', '2025'];
                data = [50, 70, 65];
                title = 'Doações por Ano';
                break;
        }
    }

    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.options.scales.y.ticks.max = Math.max(...data) + 1; // Ajusta o máximo do eixo Y
    myChart.update();

    // Atualiza os dados do gráfico atual para a geração do PDF
    currentChartData.labels = labels;
    currentChartData.data = data;
    currentChartData.title = title;
}

// Função para atualizar a exibição das datas com base no filtro
function updateDateDisplay(filter) {
    const today = new Date();
    const format = (date) => date.toLocaleDateString('pt-BR');
    let start, end;

    switch (filter) {
        case 'day':
            start = today;
            end = today;
            break;
        case 'week':
            start = new Date(today.setDate(today.getDate() - today.getDay()));
            end = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            break;
        case 'month':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'year':
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
            break;
    }

    startDateDisplay.innerText = format(start);
    endDateDisplay.innerText = format(end);
}

// Adiciona event listeners aos filtros
document.getElementById('filter-container').addEventListener('click', (event) => {
    const target = event.target;
    if (target.id.startsWith('filter-')) {
        document.querySelectorAll('#filter-container span').forEach(span => {
            span.classList.remove('text-white', 'bg-brown-custom');
            span.classList.add('bg-white', 'text-gray-600');
        });
        target.classList.remove('bg-white', 'text-gray-600');
        target.classList.add('bg-brown-custom', 'text-white');
        const filter = target.id.replace('filter-', '');
        updateChartData(filter);
        updateDateDisplay(filter);
    }
});

// Função para gerar PDF do dashboard
generatePdfBtn.addEventListener('click', () => {
    // Show loading overlay
    loadingOverlay.classList.remove('hidden');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adicionando título (formato ABNT-like)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("Relatório de Doações", 105, 20, null, null, 'center');

    // Subtítulo dinâmico
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(currentChartData.title, 105, 30, null, null, 'center');

    // Data do relatório
    doc.setFontSize(10);
    doc.text("Data de Geração: " + new Date().toLocaleDateString('pt-BR'), 10, 40);

    // Resumo do desempenho
    doc.setFontSize(12);
    const totalDonations = currentChartData.data.reduce((sum, value) => sum + value, 0);
    const summaryText = `Este relatório apresenta um resumo das doações recebidas no período. O total de doações registradas foi de ${totalDonations.toFixed(1)} unidades.`;

    const splitSummary = doc.splitTextToSize(summaryText, 190);
    doc.text(splitSummary, 10, 50);

    // Título para a tabela de dados
    doc.setFontSize(12);
    doc.text("Dados Detalhados:", 10, 80);

    // Adicionando os dados do gráfico em formato de lista textual
    let y = 90;
    currentChartData.labels.forEach((label, index) => {
        const value = currentChartData.data[index];
        doc.text(`- ${label}: ${value} doações`, 15, y);
        y += 7;
    });

    doc.save("relatorio-doacoes.pdf");

    // Hide loading overlay
    loadingOverlay.classList.add('hidden');
});

// Chamada inicial para definir o estado padrão
updateDateDisplay('month');
renderPendingDonations();
updateCalendar();
updateDonationCounts();
updateChartWithNewData('month');

// Configuração do mapa com Leaflet
const map = L.map('map').setView([-14.235, -51.9253], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const locations = [
    [-15.7801, -47.9292], // Brasília
    [-23.5505, -46.6333], // São Paulo
    [-22.9068, -43.1729], // Rio de Janeiro
    [-12.9714, -38.5014], // Salvador
    [-25.4284, -49.2733], // Curitiba
];

locations.forEach(coord => {
    L.marker(coord).addTo(map);
});

// Sample shelter points data
const shelterPoints = [
    { name: "Abrigo Central", openingHours: "08:00", closingHours: "18:00" },
    { name: "Abrigo Norte", openingHours: "07:00", closingHours: "19:00" },
    { name: "Abrigo Sul", openingHours: "09:00", closingHours: "17:00" },
    { name: "Abrigo Leste", openingHours: "06:00", closingHours: "20:00" },
    { name: "Abrigo Oeste", openingHours: "10:00", closingHours: "16:00" }
];

// Function to check if a shelter is open
function isShelterOpen(opening, closing) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(opening.split(':')[0]) * 60 + parseInt(opening.split(':')[1]);
    const closeTime = parseInt(closing.split(':')[0]) * 60 + parseInt(closing.split(':')[1]);
    return currentTime >= openTime && currentTime <= closeTime;
}

// Function to render shelter points
function renderShelterPoints() {
    const list = document.getElementById('pontos-abrigo-list');
    list.innerHTML = '';
    shelterPoints.forEach(point => {
        const isOpen = isShelterOpen(point.openingHours, point.closingHours);
        const status = isOpen ? 'Aberto' : 'Fechado';
        const statusClass = isOpen ? 'text-green-600' : 'text-red-600';
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded-lg';
        item.innerHTML = `
            <span class="font-medium">${point.name}</span>
            <span class="text-sm ${statusClass}">${status}</span>
        `;
        list.appendChild(item);
    });
}

// Call the function to render shelter points
renderShelterPoints();
