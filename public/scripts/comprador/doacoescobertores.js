// Script para validação dos formulários de doação de móveis e eletrodomésticos

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de cobertores
    const cobertoresQualidade = document.getElementById('cobertoresqualidade');
    const cobertoresQuantidade = document.getElementById('cobertoresquantidade');
 
    
    // Elementos do formulário outros
    const outrosEspecifique = document.getElementById('outrosespecifique');
    const outrosQuantidade = document.getElementById('outrosquantidade');
    const outrosQualidade = document.getElementById('outrosqualidade');
    
    // Botões de navegação
    const botaoAvancar = document.getElementById('bottao');
    const botaoVoltar = document.getElementById('back-to-cobertores');
    const botaoEnviar = document.getElementById('bbtn');
    
    // Imagens de fundo
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    
    // Divs de seção
    const cobertoresDiv = document.getElementById('cobertores');
    const outrosDiv = document.getElementById('outros');
    
    // Tabs
    const cobertoresTab = document.getElementById('cobertores-tab');
    const outrosTab = document.getElementById('outros-tab');
    
    // Modais
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const erroSenhaModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
    
    // Mostrar modal inicial quando a página carregar
    mostrarModalInicial();
    
    // Configurar visualização inicial
    mostrarSecaoCobertores();
    mostrarImagem1();
    
    // Event listeners para tabs
    cobertoresTab.addEventListener('click', function() {
        mostrarSecaoCobertores();
        mostrarImagem1();
    });
    
    outrosTab.addEventListener('click', function() {
        mostrarSecaoOutros();
        mostrarImagem3();
    });
    
    // Event listener para botão Avançar - MODIFICADO para não verificar campos
    botaoAvancar.addEventListener('click', function() {
        // Apenas muda para a próxima seção sem verificar campos
        mostrarSecaoOutros();
        mostrarImagem3();
    });
    
    // Event listener para botão Voltar
    botaoVoltar.addEventListener('click', function() {
        mostrarSecaoCobertores();
        mostrarImagem1();
    });
    
// Event listener para botão Enviar - agora exige que os formulários estejam completos se começados
botaoEnviar.addEventListener('click', function () {
    const cobertoresPreenchido = cobertoresQualidade.value !== '' || cobertoresQuantidade.value !== '';
    const outrosPreenchido = outrosEspecifique.value !== '' ||  outrosQuantidade.value !== '' || outrosQualidade.value !== '';

    const cobertoresValido = validarFormularioCobertores();
    const outrosValido = validarFormularioOutros();

    if (cobertoresPreenchido && !cobertoresValido) {
        mostrarErro('Por favor, preencha todos os campos da seção de cobertores.');
        return;
    }

    if (outrosPreenchido && !outrosValido) {
        mostrarErro('Por favor, preencha todos os campos da seção outros.');
        return;
    }

    if (cobertoresValido && outrosValido) {
        mostrarImagem2();
        mostrarConfirmacao('Doação de cobertores e outros registrada com sucesso!');
    } else if (cobertoresValido) {
        mostrarImagem2();
        mostrarConfirmacao('Doação de cobertores registrada com sucesso!');
    } else if (outrosValido) {
        mostrarImagem4();
        mostrarConfirmacao('Doação de outros registrada com sucesso!');
    } else {
        mostrarErro('Por favor, preencha pelo menos um dos formulários (Cobertores ou Outros) antes de enviar.');
    }
});
    
    // Funções auxiliares
    function validarFormularioCobertores() {
        return cobertoresQualidade.value !== '' && 
               cobertoresQuantidade.value !== '';
    }


    function validarFormularioOutros() {
    return outrosEspecifique.value !== '' &&
           outrosQuantidade.value !== '' &&
           outrosQualidade.value !== '';
}

    
    function mostrarSecaoCobertores() {
        cobertoresDiv.style.display = 'block';
        outrosDiv.style.display = 'none';
        cobertoresTab.classList.add('active');
        outrosTab.classList.remove('active');
    }
    
    function mostrarSecaoOutros() {
        cobertoresDiv.style.display = 'none';
        outrosDiv.style.display = 'block';
        cobertoresTab.classList.remove('active');
        outrosTab.classList.add('active');
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
            <p>Por favor, preencha os dados dos cobertores ou outros que deseja doar.</p>
            <p>Após preencher os dados dos cobertores, você pode prosseguir para a página de outros, para poder enviar sua doação!</p>
            
        `;
        erroSenhaModal.show();
    }
});