const estadosCidades = {
    'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
    'AL': ['Maceió', 'Arapiraca', 'Palmeira dos Índios'],
    'AP': ['Macapá', 'Santana', 'Laranjal do Jari'],
    'AM': ['Manaus', 'Parintins', 'Itacoatiara'],
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Ilhéus'],
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
    'DF': ['Brasília'],
    'ES': ['Vitória', 'Vila Velha', 'Serra'],
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
    'MA': ['São Luís', 'Imperatriz', 'Timon'],
    'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
    'MS': ['Campo Grande', 'Dourados', 'Três Lagoas'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem'],
    'PA': ['Belém', 'Ananindeua', 'Santarém'],
    'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita'],
    'PR': ['Curitiba', 'Londrina', 'Maringá'],
    'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda'],
    'PI': ['Teresina', 'Parnaíba', 'Picos'],
    'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias'],
    'RN': ['Natal', 'Mossoró', 'Parnamirim'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
    'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes'],
    'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
    'SC': ['Florianópolis', 'Joinville', 'Blumenau'],
    'SP': ['São Paulo', 'Guarulhos', 'Campinas'],
    'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'],
    'TO': ['Palmas', 'Araguaína', 'Gurupi']
};

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script 'paginapagamentoinicial.js' iniciado.");

    const segundaParte = document.getElementById('segunda-parte');
    const estadoSelect = document.getElementById('estado');
    const dadosForm = document.getElementById('dados-form');
    const comprarButton = document.getElementById("comprar");
    const voltarBotao = document.getElementById('voltar-pagamento');
    const senhaInput = document.getElementById('senha');
    const paymentOptions = document.querySelectorAll('input[name="opcao"]');

    if (segundaParte) {
        segundaParte.style.display = 'none';
    }

    if (estadoSelect) {
        estadoSelect.addEventListener('change', atualizarCidades);
    }

    if (dadosForm) {
        dadosForm.addEventListener('submit', function(e) {
            e.preventDefault();
            irParaPagamento();
        });
    }

    if (comprarButton) {
        comprarButton.addEventListener("click", function(e) {
            e.preventDefault();
            const pagamentoSelecionado = document.querySelector('input[name="opcao"]:checked');
            if (pagamentoSelecionado) {
                validatePayment(parseInt(pagamentoSelecionado.value));
            } else {
                showErrorModal("Por favor, selecione uma forma de pagamento.");
            }
        });
    }

    if (voltarBotao) {
        voltarBotao.addEventListener('click', voltarParaDados);
    }

    if (senhaInput) {
        senhaInput.addEventListener('input', function() {
            const validacao = validarSenha(this.value);
            const minimoDigitos = document.getElementById('minimodigitos');
            const doisNumeros = document.getElementById('doisnumeros');
            const umCaractereEspecial = document.getElementById('umcaracterespecial');
            const letraMaiuscula = document.getElementById('letramaiuscula');
            
            if (minimoDigitos) minimoDigitos.style.color = validacao.temMinimo8 ? 'green' : '#757575';
            if (doisNumeros) doisNumeros.style.color = validacao.tem2Numeros ? 'green' : '#757575';
            if (umCaractereEspecial) umCaractereEspecial.style.color = validacao.temCaractereEspecial ? 'green' : '#757575';
            if (letraMaiuscula) letraMaiuscula.style.color = validacao.temMaiuscula ? 'green' : '#757575';
        });
    }

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => mudarpagamento(parseInt(option.value)));
    });
    
    mudarpagamento(1);
    addInputMasks();
});

// A única função necessária para o modal é a que o exibe.
function showErrorModal(message) {
    const modalBody = document.getElementById('errorModalBody');
    if (modalBody) {
        modalBody.textContent = message;
        // Confia 100% no jQuery e Bootstrap para mostrar o modal.
        $('#errorModal').modal('show');
    } else {
        // Fallback caso o modal não exista, evitando travar a página.
        alert(message);
    }
}

function atualizarCidades() {
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');
    
    if (!estadoSelect || !cidadeSelect) return;
    
    const estadoSelecionado = estadoSelect.value;

    cidadeSelect.innerHTML = '<option value="" hidden>Selecione uma cidade...</option>';
    cidadeSelect.setAttribute('disabled', 'true');

    if (estadoSelecionado && estadosCidades[estadoSelecionado]) {
        estadosCidades[estadoSelecionado].forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
        cidadeSelect.removeAttribute('disabled');
    }
}

function irParaPagamento() {
    const dadosForm = document.getElementById('dados-form');
    if (!dadosForm || !dadosForm.checkValidity()) {
        showErrorModal('Por favor, preencha todos os campos obrigatórios (*) corretamente.');
        return;
    }

    const senha = document.getElementById('senha')?.value;
    const confirmarSenha = document.getElementById('confirmarsenha')?.value;
    
    if (!senha || !confirmarSenha) {
        showErrorModal('Por favor, preencha as senhas.');
        return;
    }
    
    if (senha !== confirmarSenha) {
        showErrorModal('As senhas não coincidem.');
        return;
    }

    const validacao = validarSenha(senha);
    if (!validacao.valida) {
        showErrorModal('A senha não atende aos requisitos de segurança. Verifique as regras.');
        return;
    }

    const displayNome = document.getElementById('display-nome');
    const displayEmail = document.getElementById('display-email');
    const displayTelefone = document.getElementById('display-telefone');
    const nomeComprador = document.getElementById('nomecomprador');
    const email = document.getElementById('email');
    const tel = document.getElementById('tel');
    const primeiraParte = document.getElementById('primeira-parte');
    const segundaParte = document.getElementById('segunda-parte');

    if (displayNome && nomeComprador) displayNome.textContent = nomeComprador.value;
    if (displayEmail && email) displayEmail.textContent = email.value;
    if (displayTelefone && tel) displayTelefone.textContent = tel.value;

    if (primeiraParte) primeiraParte.style.display = 'none';
    if (segundaParte) segundaParte.style.display = 'flex';
}

function voltarParaDados() {
    const segundaParte = document.getElementById('segunda-parte');
    const primeiraParte = document.getElementById('primeira-parte');
    
    if (segundaParte) segundaParte.style.display = 'none';
    if (primeiraParte) primeiraParte.style.display = 'block';
}

function validarSenha(senha) {
    const temMinimo8 = senha.length >= 8;
    const tem2Numeros = (senha.match(/\d/g) || []).length >= 2;
    const temCaractereEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    return {
        temMinimo8,
        tem2Numeros,
        temCaractereEspecial,
        temMaiuscula,
        valida: temMinimo8 && tem2Numeros && temCaractereEspecial && temMaiuscula
    };
}

function mudarpagamento(opcao) {
    const cartaoCredito = document.querySelector('.cartao-credito');
    const cartaoDebito = document.querySelector('.cartao-debito');
    const pix = document.querySelector('.pix');

    if (cartaoCredito) cartaoCredito.style.display = 'none';
    if (cartaoDebito) cartaoDebito.style.display = 'none';
    if (pix) pix.style.display = 'none';

    if (opcao === 1 && cartaoCredito) {
        cartaoCredito.style.display = 'block';
    } else if (opcao === 2 && cartaoDebito) {
        cartaoDebito.style.display = 'block';
    } else if (opcao === 3 && pix) {
        pix.style.display = 'block';
    }
}

function validatePayment(paymentMethod) {
    if (paymentMethod === 1) {
        validateCreditCardForm();
    } else if (paymentMethod === 2) {
        validateDebitCardForm();
    } else if (paymentMethod === 3) {
        validatePixForm();
    }
}

function validateCreditCardForm() {
    const numeroCartaoElement = document.getElementById("numerocartao");
    const cvvElement = document.getElementById("cvv");
    const mesElement = document.getElementById("mes");
    const anoElement = document.getElementById("ano");
    
    if (!numeroCartaoElement || !cvvElement || !mesElement || !anoElement) {
        showErrorModal("Elementos do formulário de cartão de crédito não encontrados.");
        return;
    }
    
    const numerocartao = numeroCartaoElement.value.replace(/\D/g, '');
    const cvv = cvvElement.value.replace(/\D/g, '');
    const mes = mesElement.value;
    const ano = anoElement.value;

    if (numerocartao.length !== 16) {
        showErrorModal("O número do cartão de crédito deve conter 16 dígitos.");
    } else if (cvv.length < 3 || cvv.length > 4) {
        showErrorModal("O CVV do cartão de crédito deve conter 3 ou 4 dígitos.");
    } else if (!mes || !ano) {
        showErrorModal("Por favor, selecione a data de validade do cartão de crédito.");
    } else {
        showErrorModal("Pagamento com Cartão de Crédito validado! Redirecionando...");
    }
}

function validateDebitCardForm() {
    const numeroCartaoElement = document.getElementById("numerocartaodebito");
    const cvvElement = document.getElementById("cvvdebito");
    const mesElement = document.getElementById("mesdebito");
    const anoElement = document.getElementById("anodebito");
    
    if (!numeroCartaoElement || !cvvElement || !mesElement || !anoElement) {
        showErrorModal("Elementos do formulário de cartão de débito não encontrados.");
        return;
    }
    
    const numerocartao = numeroCartaoElement.value.replace(/\D/g, '');
    const cvv = cvvElement.value.replace(/\D/g, '');
    const mes = mesElement.value;
    const ano = anoElement.value;

    if (numerocartao.length !== 16) {
        showErrorModal("O número do cartão de débito deve conter 16 dígitos.");
    } else if (cvv.length < 3 || cvv.length > 4) {
        showErrorModal("O CVV do cartão de débito deve conter 3 ou 4 dígitos.");
    } else if (!mes || !ano) {
        showErrorModal("Por favor, selecione a data de validade do cartão de débito.");
    } else {
        showErrorModal("Pagamento com Cartão de Débito validado! Redirecionando...");
    }
}

function validatePixForm() {
    const nomeCompletoElement = document.getElementById("nomecompleto");
    const cpfElement = document.getElementById("cpf");
    
    if (!nomeCompletoElement || !cpfElement) {
        showErrorModal("Elementos do formulário PIX não encontrados.");
        return;
    }
    
    const nomecompleto = nomeCompletoElement.value.trim();
    const cpf = cpfElement.value.replace(/\D/g, '');

    if (nomecompleto === "") {
        showErrorModal("Por favor, preencha o nome completo para o pagamento PIX.");
    } else if (cpf.length !== 11) {
        showErrorModal("O CPF para o pagamento PIX deve conter 11 dígitos.");
    } else {
        showErrorModal("Pagamento com PIX validado! Redirecionando...");
    }
}

function addInputMasks() {
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            e.target.value = value.substring(0, 18);
        });
    }

    const telInput = document.getElementById('tel');
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            if (value.length > 9) {
                value = `${value.substring(0, 9)}-${value.substring(9)}`;
            }
            e.target.value = value.substring(0, 15);
        });
    }
    
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value.substring(0, 14);
        });
    }

    const mascaraCartao = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value.substring(0, 19);
    };
    
    const numeroCartaoCredito = document.getElementById('numerocartao');
    const numeroCartaoDebito = document.getElementById('numerocartaodebito');
    
    if (numeroCartaoCredito) numeroCartaoCredito.addEventListener('input', mascaraCartao);
    if (numeroCartaoDebito) numeroCartaoDebito.addEventListener('input', mascaraCartao);

    const mascaraCVV = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 4);
    };

    const cvvCredito = document.getElementById('cvv');
    const cvvDebito = document.getElementById('cvvdebito');
    
    if (cvvCredito) cvvCredito.addEventListener('input', mascaraCVV);
    if (cvvDebito) cvvDebito.addEventListener('input', mascaraCVV);
}