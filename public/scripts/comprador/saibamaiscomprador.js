function salvar() {
    const secoes = document.querySelectorAll('.section');

    secoes.forEach(secao => {
        const tituloInput = secao.querySelector('.editable-title');
        const conteudoTextarea = secao.querySelector('.editable-content');
        const imagemInput = secao.querySelector('.input-imagem');
        const textoSalvo = secao.querySelector('.texto-salvo');
        const imgSalva = textoSalvo.querySelector('.imagem-salva');

        const titulo = tituloInput.value;
        const conteudo = conteudoTextarea.value;

        textoSalvo.querySelector('.titulo-salvo').innerText = titulo;
        textoSalvo.querySelector('.conteudo-salvo').innerText = conteudo;

        if (imagemInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgSalva.src = e.target.result;
                imgSalva.style.display = 'block';
            };
            reader.readAsDataURL(imagemInput.files[0]);
        } else {
            imgSalva.style.display = 'none';
        }

        tituloInput.style.display = 'none';
        conteudoTextarea.style.display = 'none';
        imagemInput.style.display = 'none';
        textoSalvo.style.display = 'block';

        secao.classList.add('oculto');
    });

    document.getElementById('btnAdd').style.display = 'none';
    document.getElementById('btnSalvar').style.display = 'none';
    document.getElementById('btnEditar').style.display = 'block';
}

function editar() {
    const secoes = document.querySelectorAll('.section');

    secoes.forEach(secao => {
        const tituloInput = secao.querySelector('.editable-title');
        const conteudoTextarea = secao.querySelector('.editable-content');
        const imagemInput = secao.querySelector('.input-imagem');
        const textoSalvo = secao.querySelector('.texto-salvo');

        tituloInput.style.display = 'block';
        conteudoTextarea.style.display = 'block';
        imagemInput.style.display = 'block';
        textoSalvo.style.display = 'none';

        secao.classList.remove('oculto');
    });

    document.getElementById('btnAdd').style.display = 'block';
    document.getElementById('btnSalvar').style.display = 'block';
    document.getElementById('btnEditar').style.display = 'none';
}

function addSection() {
    const container = document.getElementById('sections-container');
    const novaSecao = document.createElement('div');
    novaSecao.className = 'section';
    novaSecao.innerHTML = `
        <input class="editable-title" placeholder="Novo título">
        <textarea class="editable-content" placeholder="Novo conteúdo..."></textarea>
        <input type="file" class="input-imagem">
        <div class="texto-salvo" style="display: none;">
            <h2 class="titulo-salvo"></h2>
            <p class="conteudo-salvo"></p>
            <img class="imagem-salva" style="max-width:100%; display:none;">
        </div>
    `;
    container.appendChild(novaSecao);
}