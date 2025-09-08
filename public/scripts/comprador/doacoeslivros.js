// Script para validação dos formulários de doação de móveis e eletrodomésticos

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de livros
    const livrosGenero = document.getElementById('livrosgenero');
    const livrosQualidade = document.getElementById('livrosqualidade');
    const livrosQuantidade = document.getElementById('livrosquantidade');
 
    
    // Elementos do formulário de brinquedos
    const brinquedosGenero = document.getElementById('brinquedosgenero');
    const brinquedosQuantidade = document.getElementById('brinquedosquantidade');
    const brinquedosEspecifique = document.getElementById('brinquedosespecifique');
    
    // Botões de navegação
    const botaoAvancar = document.getElementById('bottao');
    const botaoVoltar = document.getElementById('back-to-livros');
    const botaoEnviar = document.getElementById('bbtn');
    
    // Imagens de fundo
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    
    // Divs de seção
    const livrosDiv = document.getElementById('livros');
    const brinquedosDiv = document.getElementById('brinquedos');
    
    // Tabs
    const livrosTab = document.getElementById('livros-tab');
    const brinquedosTab = document.getElementById('brinquedos-tab');
    
    // Modais
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const erroSenhaModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
    
    // Mostrar modal inicial quando a página carregar
    mostrarModalInicial();
    
    // Configurar visualização inicial
    mostrarSecaoLivros();
    mostrarImagem1();
    
    // Event listeners para tabs
    livrosTab.addEventListener('click', function() {
        mostrarSecaoLivros();
        mostrarImagem1();
    });
    
    brinquedosTab.addEventListener('click', function() {
        mostrarSecaoBrinquedos();
        mostrarImagem3();
    });
    
    // Event listener para botão Avançar - MODIFICADO para não verificar campos
    botaoAvancar.addEventListener('click', function() {
        // Apenas muda para a próxima seção sem verificar campos
        mostrarSecaoBrinquedos();
        mostrarImagem3();
    });
    
    // Event listener para botão Voltar
    botaoVoltar.addEventListener('click', function() {
        mostrarSecaoLivros();
        mostrarImagem1();
    });
    
// Event listener para botão Enviar - agora exige que os formulários estejam completos se começados
botaoEnviar.addEventListener('click', function () {
    const livrosPreenchido = livrosGenero.value !== '' || livrosQualidade.value !== '' || livrosQuantidade.value !== '';
    const brinquedosPreenchido = brinquedosGenero.value !== '' || brinquedosQuantidade.value !== '' || brinquedosEspecifique.value !== '';

    const livrosValido = validarFormularioLivros();
    const brinquedosValido = validarFormularioBrinquedos();

    if (livrosPreenchido && !livrosValido) {
        mostrarErro('Por favor, preencha todos os campos da seção de livros.');
        return;
    }

    if (brinquedosPreenchido && !brinquedosValido) {
        mostrarErro('Por favor, preencha todos os campos da seção de brinquedos.');
        return;
    }

    if (livrosValido && brinquedosValido) {
        mostrarImagem2();
        mostrarConfirmacao('Doação de livros e brinquedos registrada com sucesso!');
    } else if (livrosValido) {
        mostrarImagem2();
        mostrarConfirmacao('Doação de livros registrada com sucesso!');
    } else if (brinquedosValido) {
        mostrarImagem4();
        mostrarConfirmacao('Doação de brinquedos registrada com sucesso!');
    } else {
        mostrarErro('Por favor, preencha pelo menos um dos formulários (Livros ou Brinquedos) antes de enviar.');
    }
});
    
    // Funções auxiliares
    function validarFormularioLivros() {
        return livrosGenero.value !== '' && 
               livrosQualidade.value !== '' && 
               livrosQuantidade.value !== '';
    }


    function validarFormularioBrinquedos() {
    return brinquedosGenero.value !== '' &&
           brinquedosQuantidade.value !== '' &&
           brinquedosEspecifique.value !== '';
}
    
    function mostrarSecaoLivros() {
        livrosDiv.style.display = 'block';
        brinquedosDiv.style.display = 'none';
        livrosTab.classList.add('active');
        brinquedosTab.classList.remove('active');
    }
    
    function mostrarSecaoBrinquedos() {
        livrosDiv.style.display = 'none';
        brinquedosDiv.style.display = 'block';
        livrosTab.classList.remove('active');
        brinquedosTab.classList.add('active');
    }
    
    function mostrarImagem1() {
        img1.style.display = 'block';
        img2.style.display = 'none';
        img3.style.display = 'none';
        img4.style.display = 'none';
    }
    
    function mostrarImagem2() {
        img1.style.display = 'none';
        img2.style.display = 'block';
        img3.style.display = 'none';
        img4.style.display = 'none';
    }
    
    function mostrarImagem3() {
        img1.style.display = 'block';
        img2.style.display = 'none';
        img3.style.display = 'none';
        img4.style.display = 'none';
    }
    
    function mostrarImagem4() {
        img1.style.display = 'none';
        img2.style.display = 'block';
        img3.style.display = 'none';
        img4.style.display = 'none';
    }
    
    function mostrarErro(mensagem) {
        document.getElementById('errorModalBody').innerHTML = `<p>${mensagem}</p>`;
        errorModal.show();
    }
    
    function mostrarConfirmacao(mensagem) {
        document.getElementById('confirmModalBody').innerHTML = `<p>${mensagem}</p>`;
        confirmModal.show();
    }
    
    function mostrarModalInicial() {
        document.getElementById('erroSenhaModalBody').innerHTML = `
            <p>Bem-vindo ao formulário de doação!</p>
            <p>Por favor, preencha os dados dos livros ou brinquedos que deseja doar.</p>
            <p>Após preencher os dados dos livros, você pode prosseguir para a página de brinquedos, para poder enviar sua doação!</p>
            
        `;
        erroSenhaModal.show();
    }
});