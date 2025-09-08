document.addEventListener('DOMContentLoaded', function() {
    const formEtapa1 = document.getElementById('formEtapa1');
    const formEtapa2 = document.getElementById('formEtapa2');
    const btnContinuar = document.getElementById('btn-continuar');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnEnviar = document.getElementById('btn-enviar');

    const etapa1Container = document.querySelector('.primeira-parte-cadastro');
    const etapa2Container = document.querySelector('.segunda-parte-cadastro');

    const passo1 = document.getElementById('passo1');
    const passo2 = document.getElementById('passo2');

    const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
    const erroModalBody = document.getElementById('erroModalBody');
    const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    const sucessoModalBody = document.getElementById('sucessoModalBody');

    // Função para exibir o modal de erro
    const exibirErro = (mensagem) => {
        erroModalBody.innerHTML = mensagem;
        erroModal.show();
    };

    // Função para exibir o modal de sucesso
    const exibirSucesso = (mensagem) => {
        sucessoModalBody.innerHTML = mensagem;
        sucessoModal.show();
    };

    // Função para validar a primeira etapa
    const validarEtapa1 = () => {
        const nome = formEtapa1.querySelector('#nome-completo').value.trim();
        const email = formEtapa1.querySelector('#email').value.trim();
        const cep = formEtapa1.querySelector('#numero-cep').value.trim();
        const cnpj = formEtapa1.querySelector('#numero-cnpj').value.trim();
        const complemento = formEtapa1.querySelector('#complemento').value.trim();

        if (!nome || !email || !cep || !cnpj || !complemento) {
            exibirErro('Por favor, preencha todos os campos obrigatórios da primeira etapa.');
            return false;
        }
        return true;
    };

    // Função para validar a segunda etapa
    const validarEtapa2 = () => {
        const emailResponsavel = formEtapa2.querySelector('#email-responsavel').value.trim();
        const telefone = formEtapa2.querySelector('#telefone-responsavel').value.trim();
        const cpf = formEtapa2.querySelector('#cpf-responsavel').value.trim();
        const tipoInstituicao = formEtapa2.querySelector('#tipo-instituicao').value;
        const documentos = formEtapa2.querySelector('#documentos').files;

        if (!emailResponsavel || !telefone || !cpf || !tipoInstituicao) {
            exibirErro('Por favor, preencha todos os campos obrigatórios da segunda etapa.');
            return false;
        }

        if (documentos.length < 3) {
            exibirErro('É necessário anexar pelo menos 3 documentos para a solicitação de gratuidade.');
            return false;
        }
        return true;
    };

    // Gerencia a transição para a segunda etapa
    btnContinuar.addEventListener('click', (e) => {
        e.preventDefault();
        if (validarEtapa1()) {
            etapa1Container.classList.add('d-none');
            etapa2Container.classList.remove('d-none');
            passo1.classList.remove('ativo');
            passo2.classList.add('ativo');
        }
    });

    // Gerencia o retorno para a primeira etapa
    btnVoltar.addEventListener('click', (e) => {
        e.preventDefault();
        etapa1Container.classList.remove('d-none');
        etapa2Container.classList.add('d-none');
        passo1.classList.add('ativo');
        passo2.classList.remove('ativo');
    });

    // Gerencia o envio final do formulário
    btnEnviar.addEventListener('click', (e) => {
        e.preventDefault();
        if (validarEtapa2()) {
            exibirSucesso('Sua solicitação foi enviada com sucesso! Em breve, entraremos em contato para mais detalhes sobre a análise.');
            // Aqui você pode adicionar a lógica para enviar os dados para o servidor
            // formEtapa1.reset();
            // formEtapa2.reset();
        }
    });
});