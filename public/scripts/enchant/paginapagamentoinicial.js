// Estados e cidades do Brasil
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
    // Esconde a segunda parte do formulário ao carregar a página
    const segundaParte = document.getElementById('segunda-parte');
    if (segundaParte) {
        segundaParte.style.display = 'none';
    }

    // Popular o dropdown de estados
    const estadoSelect = document.getElementById('estado');
    if (estadoSelect) {
        for (const estado in estadosCidades) {
            const option = document.createElement('option');
            option.value = estado;
            option.textContent = estado;
            estadoSelect.appendChild(option);
        }
    }

    // Lida com a submissão da primeira parte do formulário
    const dadosForm = document.getElementById('dados-form');
    if (dadosForm) {
        dadosForm.addEventListener('submit', function(e) {
            e.preventDefault();
            irParaPagamento();
        });
    }

    // Lida com o clique do botão de comprar
    const comprarButton = document.getElementById("comprar");
    if (comprarButton) {
        comprarButton.addEventListener("click", function(e) {
            e.preventDefault();
            const pagamentoSelecionado = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
            validatePayment(parseInt(pagamentoSelecionado));
        });
    }

    // Lida com o clique do botão de voltar
    const voltarBotao = document.getElementById('voltar-pagamento');
    if (voltarBotao) {
        voltarBotao.addEventListener('click', voltarParaDados);
    }

    // Validação em tempo real da senha
    const senhaInput = document.getElementById('senha');
    if (senhaInput) {
        senhaInput.addEventListener('input', function() {
            const validacao = validarSenha(this.value);
            document.getElementById('minimodigitos').style.color = validacao.temMinimo8 ? 'green' : '#757575';
            document.getElementById('doisnumeros').style.color = validacao.tem2Numeros ? 'green' : '#757575';
            document.getElementById('umcaracterespecial').style.color = validacao.temCaractereEspecial ? 'green' : '#757575';
            document.getElementById('letramaiuscula').style.color = validacao.temMaiuscula ? 'green' : '#757575';
        });
    }

    // Inicializa a forma de pagamento (crédito) e as máscaras
    mudarpagamento(1);
    addInputMasks();
});

// Função para atualizar o dropdown de cidades com base no estado
function atualizarCidades() {
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');
    const estadoSelecionado = estadoSelect.value;

    cidadeSelect.innerHTML = '<option value="" hidden>Selecione um estado primeiro...</option>';
    cidadeSelect.disabled = true;

    if (estadoSelecionado && estadosCidades[estadoSelecionado]) {
        estadosCidades[estadoSelecionado].forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
        cidadeSelect.disabled = false;
    }
}

// Função para navegar para a segunda parte do formulário
function irParaPagamento() {
    const dadosForm = document.getElementById('dados-form');

    if (!dadosForm.checkValidity()) {
        dadosForm.reportValidity();
        return;
    }

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarsenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const validacao = validarSenha(senha);
    if (!validacao.valida) {
        alert('A senha não atende aos requisitos de segurança.');
        return;
    }

    // Passa os dados para a segunda parte
    document.getElementById('display-nome').textContent = document.getElementById('nomecomprador').value;
    document.getElementById('display-email').textContent = document.getElementById('email').value;
    document.getElementById('display-telefone').textContent = document.getElementById('tel').value;

    // Exibe a segunda parte e esconde a primeira
    document.getElementById('primeira-parte').style.display = 'none';
    document.getElementById('segunda-parte').style.display = 'flex';
}

// Função para voltar para a primeira parte do formulário
function voltarParaDados() {
    document.getElementById('segunda-parte').style.display = 'none';
    document.getElementById('primeira-parte').style.display = 'block';
}

// Função para validar a senha
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

// Função para mudar a forma de pagamento
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

// Funções de validação de pagamento
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
    const numerocartao = document.getElementById("numerocartao").value.replace(/\D/g, '');
    const cvv = document.getElementById("cvv").value.replace(/\D/g, '');
    const mes = document.getElementById("mes").value;
    const ano = document.getElementById("ano").value;

    if (numerocartao.length !== 16) {
        alert("O número do cartão deve conter 16 dígitos.");
    } else if (cvv.length !== 3 && cvv.length !== 4) {
        alert("O CVV deve conter 3 ou 4 dígitos.");
    } else if (!mes || !ano) {
        alert("Por favor, selecione a data de validade do cartão.");
    } else {
        alert("Pagamento com Cartão de Crédito validado! Redirecionando...");
        window.location.href = "../index.html";
    }
}

function validateDebitCardForm() {
    const numerocartao = document.getElementById("numerocartaodebito").value.replace(/\D/g, '');
    const cvv = document.getElementById("cvvdebito").value.replace(/\D/g, '');
    const mes = document.getElementById("mesdebito").value;
    const ano = document.getElementById("anodebito").value;

    if (numerocartao.length !== 16) {
        alert("O número do cartão de débito deve conter 16 dígitos.");
    } else if (cvv.length !== 3 && cvv.length !== 4) {
        alert("O CVV deve conter 3 ou 4 dígitos.");
    } else if (!mes || !ano) {
        alert("Por favor, selecione a data de validade do cartão de débito.");
    } else {
        alert("Pagamento com Cartão de Débito validado! Redirecionando...");
        window.location.href = "../index.html";
    }
}

function validatePixForm() {
    const nomecompleto = document.getElementById("nomecomprador").value.trim();
    const cpf = document.getElementById("cpf").value.replace(/\D/g, '');

    if (nomecompleto === "") {
        alert("Por favor, preencha o nome completo.");
    } else if (cpf.length !== 11) {
        alert("O CPF deve conter 11 dígitos.");
    } else {
        alert("Pagamento com PIX validado! Redirecionando...");
        window.location.href = "../index.html";
    }
}

// Adiciona máscaras aos campos de input
function addInputMasks() {
    document.getElementById('cnpj').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        e.target.value = value.substring(0, 18);
    });

    document.getElementById('tel').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
        }
        if (value.length > 9) {
            value = value.substring(0, 9) + '-' + value.substring(9);
        }
        e.target.value = value.substring(0, 15);
    });

    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value.substring(0, 14);
    });

    const mascaraCartao = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value.substring(0, 19);
    };

    document.getElementById('numerocartao').addEventListener('input', mascaraCartao);
    document.getElementById('numerocartaodebito').addEventListener('input', mascaraCartao);

    const mascaraCVV = function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 4);
    };

    document.getElementById('cvv').addEventListener('input', mascaraCVV);
    document.getElementById('cvvdebito').addEventListener('input', mascaraCVV);
}