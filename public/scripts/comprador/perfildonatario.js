const userData = {
    orgName: "Nome Donatário", 
    email: "donatário@email.com",
    password: "12345678C@",
    cpf: "345.678.000-95",
    rg: "12.345.678-9",
    phone: "(11) 91234-5678",
    genero: "Masculino",
    estadoCivil: "Solteiro",
    statusOcupacao: "Empregado",
    residentes: "3",
    listados: "Crianças",
    profileImage: "/api/placeholder/40/40"
};


// Elementos DOM
const editModal = document.getElementById("edit-modal");
const photoModal = document.getElementById("photo-modal");
const togglePassword = document.getElementById("toggle-password");
const passwordDots = document.querySelector(".password-dots");
let isPasswordVisible = false;

// Função para atualizar a imagem no header
function updateHeaderImage(imageUrl) {
  // Verificar se o elemento userPhoto existe
  const userPhoto = document.getElementById("userPhoto");
  const userIcon = document.getElementById("userIcon");
  
  if (userPhoto) {
      userPhoto.src = imageUrl;
      userPhoto.style.display = "inline-block";
      
      // Esconder o ícone de usuário padrão
      if (userIcon) {
          userIcon.style.display = "none";
      }
  }
}

// Atualizar interface com dados do usuário
function updateUI() {
    // Atualizar informações pessoais
    document.getElementById("org-name").textContent = userData.orgName;
    document.getElementById("institution-name").textContent = userData.orgName;
    document.getElementById("email").textContent = userData.email;
    document.getElementById("cpf").textContent = userData.cpf;
    document.getElementById("rg").textContent = userData.rg;
    document.getElementById("phone").textContent = userData.phone;
    document.getElementById("genro").textContent = userData.genero;
    document.getElementById("estadoCivil").textContent = userData.estadoCivil;
    document.getElementById("status").textContent = userData.statusOcupacao;
    document.getElementById("residentes").textContent = userData.residentes;
    
    // Atualizar nome no header
    const userNameElement = document.querySelector("#usuario span");
    if (userNameElement) {
        userNameElement.textContent = userData.orgName;
    }
    
    // Atualizar imagem de perfil
    const profileImage = document.getElementById("profile-image");
    if (profileImage) {
        profileImage.src = userData.profileImage;
    }
}
// Mostrar/ocultar senha
if (togglePassword) {
    togglePassword.addEventListener("click", function() {
        isPasswordVisible = !isPasswordVisible;
        if (isPasswordVisible) {
            passwordDots.textContent = userData.password;
            togglePassword.innerHTML = '<span class="material-symbols-outlined">visibility_off</span>';
        } else {
            passwordDots.textContent = "••••••••";
            togglePassword.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
        }
    });
  }
  

function openEditModal() {
    
    document.body.classList.add('modal-open');
    document.getElementById("edit-modal").style.display = "flex";

    document.getElementById("edit-institution-name").value = userData.orgName;
    document.getElementById("edit-email").value = userData.email;
    document.getElementById("edit-password").value = userData.password;
    document.getElementById("edit-cpf").value = userData.cpf;
    document.getElementById("edit-rg").value = userData.rg;
    document.getElementById("edit-phone").value = userData.phone;
    document.getElementById("edit-genero").value = userData.genero;
    document.getElementById("edit-estado-civil").value = userData.estadoCivil;
    document.getElementById("edit-status-ocupacao").value = userData.statusOcupacao;
    document.getElementById("edit-residentes").value = userData.residentes;
    document.getElementById("edit-listados").value = userData.listados;
    
    // Configurar toggle de senha
    const toggleEditPassword = document.getElementById("toggle-edit-password");
    const editPasswordField = document.getElementById("edit-password");
    
    if (toggleEditPassword && editPasswordField) {
        toggleEditPassword.onclick = function() {
            if (editPasswordField.type === "password") {
                editPasswordField.type = "text";
                toggleEditPassword.innerHTML = '<span class="material-symbols-outlined">visibility_off</span>';
            } else {
                editPasswordField.type = "password";
                toggleEditPassword.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
            }
        };
    }
}

  // Fechar modal de edição
function closeEditModal() {
    document.body.classList.remove('modal-open');
    document.getElementById("edit-modal").style.display = "none";
}

// Fechar modal de edição
function closeEditModal() {
  const modalOverlay = document.getElementById("modal-overlay");
  if (modalOverlay) {
      modalOverlay.style.display = "none";
  }
  document.body.style.overflow = "auto";
  editModal.style.display = "none";
}

// Modificar a função saveChanges existente

function saveChanges() {
    // Coletar todos os valores dos campos de edição
    const newData = {
        orgName: document.getElementById("edit-institution-name").value,
        email: document.getElementById("edit-email").value,
        password: document.getElementById("edit-password").value,
        cpf: document.getElementById("edit-cpf").value,
        rg: document.getElementById("edit-rg").value,
        phone: document.getElementById("edit-phone").value,
        genero: document.getElementById("edit-genero").value,
        estadoCivil: document.getElementById("edit-estado-civil").value,
        statusOcupacao: document.getElementById("edit-status-ocupacao").value,
        residentes: document.getElementById("edit-residentes").value,
        listados: document.getElementById("edit-listados").value
    };

    // Validar campos obrigatórios
    if (!newData.orgName || !newData.email || !newData.password) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Atualizar os dados do usuário
    Object.assign(userData, newData);

    // Atualizar a interface
    updateUI();

    // Fechar o modal
    closeEditModal();

    // Feedback para o usuário
    console.log("Alterações salvas com sucesso!", userData);
}
function openPhotoModal() {
    if (photoModal) {
      photoModal.style.display = "flex";
    }
  }

// Fechar modal de foto
function closePhotoModal() {
  photoModal.style.display = "none";
}

// Salvar nova foto
function savePhoto() {
    const fileInput = document.getElementById("photo-upload");
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            userData.profileImage = e.target.result;
            
            const profileImage = document.getElementById("profile-image");
            if (profileImage) {
              profileImage.src = e.target.result;
            }
            
            // Atualizar a imagem no cabeçalho
            updateHeaderImage(e.target.result);
        };
        
        reader.readAsDataURL(fileInput.files[0]);
    }
    
    closePhotoModal();
  }

// Função que é executada quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  updateUI();
    
    // Configurar o botão de salvar
    const saveButton = document.querySelector("#edit-modal .save-button");
    if (saveButton) {
        saveButton.onclick = saveChanges;
    }
    
    // Configurar o botão de editar foto
    const editPhotoButton = document.querySelector(".edit-overlay");
    if (editPhotoButton) {
        editPhotoButton.onclick = openPhotoModal;
    }
  if (!document.querySelector('link[href*="material-symbols"]')) {
      const materialIconsLink = document.createElement('link');
      materialIconsLink.rel = 'stylesheet';
      materialIconsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
      document.head.appendChild(materialIconsLink);
  }
  
  // Inicializar ícone de visibilidade
  if (togglePassword) {
      togglePassword.innerHTML = '<span class="material-symbols-outlined">visibility</span>';
  }
  
  // Função para controlar o dropdown do perfil
  setupProfileDropdown();
 
  // Configurar evento para detectar o fechamento do menu colapsável
  const navbarCollapse = document.getElementById('navbarNav');
 
  // Se estivermos usando Bootstrap 5
  if (window.bootstrap && navbarCollapse) {
    const collapseInstance = new bootstrap.Collapse(navbarCollapse, {
      toggle: false // Não alternar ao criar a instância
    });
   
    // Adicionar listener para quando o colapso for escondido
    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
      // Garantir que o botão possa ser clicado novamente
      const toggleButton = document.getElementById('icone');
      if (toggleButton) {
        toggleButton.classList.remove('collapsed');
        toggleButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  
  // Para Bootstrap 4 (que parece estar sendo usado no seu código)
  else if ($ && navbarCollapse) {
    $(navbarCollapse).on('hidden.bs.collapse', function () {
      const toggleButton = document.getElementById('icone');
      if (toggleButton) {
        toggleButton.classList.remove('collapsed');
        toggleButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
 
  // Configurar botões de rede social
  const instagramBtn = document.getElementById("botao");
  const instagramCaixa = document.getElementById("caixa-principal");
  const instagramSairBtn = document.getElementById("botao-sair");
  const instagramInput = document.getElementById("instagram");
  const instagramLinkContainer = document.getElementById("linkContainer");
  const instagramEditarBtn = document.getElementById("editarLink");
  const instagramConfirmarBtn = document.getElementById("botaocaixa");
  const modalOverlay = createModalOverlay();

  // Configurar botão do Facebook
  const facebookBtn = document.getElementById("facebook");
  const facebookCaixa = document.getElementById("caixa-principal2");
  const facebookSairBtn = document.getElementById("botao-sair2");
 
  if (facebookBtn && facebookCaixa && facebookSairBtn) {
    facebookBtn.addEventListener("click", () => {
      facebookCaixa.style.display = "flex";
      modalOverlay.style.display = "block";
      document.body.style.overflow = "hidden";
    });
   
    facebookSairBtn.addEventListener("click", () => {
      facebookCaixa.style.display = "none";
      modalOverlay.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  if (instagramBtn) {
    instagramBtn.addEventListener("click", () => {
      instagramCaixa.style.display = "flex";
      modalOverlay.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }

  if (instagramSairBtn) {
    instagramSairBtn.addEventListener("click", () => {
      instagramCaixa.style.display = "none";
      modalOverlay.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  // Adicionar evento de clique manual ao botão de três pontos
  const toggleButton = document.getElementById('icone');
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      // Se Bootstrap 5
      if (window.bootstrap && navbarCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          if (navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
          } else {
            bsCollapse.show();
          }
        } else {
          // Alternar manualmente se não houver instância
          navbarCollapse.classList.toggle('show');
        }
      }
      // Para Bootstrap 4
      else if ($) {
        $(navbarCollapse).collapse('toggle');
      }
      // Alternar manualmente como fallback
      else if (navbarCollapse) {
        if (navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
          toggleButton.setAttribute('aria-expanded', 'false');
        } else {
          navbarCollapse.classList.add('show');
          toggleButton.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }

  // Configurar botão de editar para o Instagram
  const editarInstagramBtn = document.getElementById("editarLink");
  if (editarInstagramBtn) {
    editarInstagramBtn.addEventListener("click", function() {
      const instagramInput = document.getElementById("instagram");
      const instagramLinkContainer = document.getElementById("linkContainer");
      const instagramConfirmarBtn = document.getElementById("botaocaixa");
     
      instagramInput.style.display = "block";
      instagramConfirmarBtn.style.display = "block";
      instagramLinkContainer.innerHTML = "";
      editarInstagramBtn.style.display = "none";
    });
  }
 
  // Configurar botão de editar para o Facebook
  const editarFacebookBtn = document.getElementById("editarLink2");
  if (editarFacebookBtn) {
    editarFacebookBtn.addEventListener("click", function() {
      const facebookInput = document.getElementById("facebook2");
      const facebookLinkContainer = document.getElementById("linkContainer2");
      const facebookConfirmarBtn = document.getElementById("botaocaixa2");
     
      facebookInput.style.display = "block";
      facebookConfirmarBtn.style.display = "block";
      facebookLinkContainer.innerHTML = "";
      editarFacebookBtn.style.display = "none";
    });
  }

  // Chamadas para outras funções existentes
  handleHeaderAnimation();
  handleSidebarHover();
  ensureSidebarHeight();

  loadDonationHistory();
 
});

// Adicionar validação de senha em tempo real
const editPasswordInput = document.getElementById("edit-password");
if (editPasswordInput) {
    editPasswordInput.addEventListener("input", function() {
        const senha = editPasswordInput.value;

        document.getElementById("check-length").classList.toggle("valid", senha.length >= 8);
        document.getElementById("check-uppercase").classList.toggle("valid", /[A-Z]/.test(senha));
        document.getElementById("check-number").classList.toggle("valid", /\d/.test(senha));
        document.getElementById("check-special").classList.toggle("valid", /[!@#$%^&*(),.?":{}|<>]/.test(senha));
    });
}

// Nova função para configurar o dropdown do perfil
function setupProfileDropdown() {
  const usuarioBtn = document.getElementById("usuario");
  const dropdownMenu = document.getElementById("dropzinho");
 
  if (!usuarioBtn || !dropdownMenu) return;
 
  // Verifica se estamos em dispositivo móvel
  const isMobile = window.innerWidth <= 768;
 
  if (isMobile) {
    // No mobile, o dropdown aparece com clique
    usuarioBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation(); // Impede propagação do evento
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      } else {
        dropdownMenu.style.display = "block";
      }
    });
   
    // Fecha ao clicar fora
    document.addEventListener("click", function(e) {
      if (!usuarioBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  } else {
    // Em desktop, mostra ao passar o mouse
    usuarioBtn.addEventListener("mouseenter", function() {
      dropdownMenu.style.display = "block";
    });
   
    // Container do dropdown para evitar que feche quando mover para os itens
    const profileDropdown = document.querySelector(".profile-dropdown");
    if (profileDropdown) {
      profileDropdown.addEventListener("mouseleave", function() {
        dropdownMenu.style.display = "none";
      });
    }
   
    // Também adicionar clique para melhorar acessibilidade
    usuarioBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation(); // Impede propagação do evento
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      } else {
        dropdownMenu.style.display = "block";
      }
    });
  }
 
  // Adicionar evento de clique nos itens do dropdown para fechar após clicar
  const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
      dropdownMenu.style.display = "none";
    });
  });
}

// Re-configurar em caso de redimensionamento da janela
window.addEventListener("resize", function() {
  setupProfileDropdown();
  handleHeaderAnimation();
  handleSidebarHover();
  ensureSidebarHeight();
});

// Função para alternar a visibilidade da sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const body = document.body;

  sidebar.classList.toggle("open");
  body.classList.toggle("sidebar-open"); // Adiciona classe ao body para controlar overflow

  let overlay = document.getElementById("sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "650";
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function () {
      toggleSidebar();
    });
  }

  if (sidebar.classList.contains("open")) {
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";

    // Garante que o botão de upload permaneça visível
    const imgHeader = document.getElementById("imgheader");
    if (imgHeader) {
      imgHeader.style.visibility = "visible";
      imgHeader.style.opacity = "1";
    }
  } else {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Criar overlay para modais
function createModalOverlay() {
    let modalOverlay = document.getElementById("modal-overlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "modal-overlay";
        modalOverlay.style.display = "none";
        modalOverlay.style.position = "fixed";
        modalOverlay.style.top = "0";
        modalOverlay.style.left = "0";
        modalOverlay.style.right = "0";
        modalOverlay.style.bottom = "0";
        modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        modalOverlay.style.zIndex = "1050";
        document.body.appendChild(modalOverlay);
    }
    return modalOverlay;
}

// Lidar com animação do cabeçalho
function handleHeaderAnimation() {
  const header = document.getElementById("header");

  if (header) {
    if (window.innerWidth <= 768) {
      header.style.transition = "none";
    } else {
      header.style.transition = "all 0.3s ease-in-out";
    }
  }
}

// Lidar com hover da sidebar
function handleSidebarHover() {
  const sidebar = document.getElementById("sidebar");
  const body = document.body;
  const imgHeader = document.getElementById("imgheader");

  if (sidebar) {
    // Remover quaisquer listeners existentes para evitar duplicações
    const oldMouseEnter = sidebar._mouseenterListener;
    const oldMouseLeave = sidebar._mouseleaveListener;
   
    if (oldMouseEnter) {
      sidebar.removeEventListener("mouseenter", oldMouseEnter);
    }
   
    if (oldMouseLeave) {
      sidebar.removeEventListener("mouseleave", oldMouseLeave);
    }
   
    // É um tablet? (Entre 768px e 992px)
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
   
    // Se for desktop (acima de 992px) ou não for tablet, mantém o comportamento original
    if (!isTablet && window.innerWidth > 768) {
      const mouseenterListener = function() {
        body.classList.add("sidebar-expanded");
       
        // Garante que o botão de upload permaneça visível
        if (imgHeader) {
          imgHeader.style.visibility = "visible";
          imgHeader.style.opacity = "1";
        }
      };
     
      const mouseleaveListener = function() {
        body.classList.remove("sidebar-expanded");
      };
     
      sidebar.addEventListener("mouseenter", mouseenterListener);
      sidebar.addEventListener("mouseleave", mouseleaveListener);
     
      // Armazenar referências para possibilitar remoção posterior
      sidebar._mouseenterListener = mouseenterListener;
      sidebar._mouseleaveListener = mouseleaveListener;
    }
    // Para tablets, desabilitar o efeito de hover
    else if (isTablet) {
      // Não adiciona novos listeners para mouseenter/mouseleave
      // Isso impede que o botão de upload se mova em tablets quando
      // o mouse passa sobre a sidebar
     
      // Garante que o botão de upload permaneça sempre visível em tablets
      if (imgHeader) {
        imgHeader.style.visibility = "visible";
        imgHeader.style.opacity = "1";
      }
    }
  }
}

// Adicione essa função para garantir que a sidebar tenha altura máxima
function ensureSidebarHeight() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar && window.innerWidth <= 768) {
    // Define a altura para o viewport height ou para o height da página, o que for maior
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    sidebar.style.height = Math.max(docHeight, window.innerHeight) + "px";
  }
}

// Função para gerar link do Instagram
function gerarLinkInstagram() {
  const instagram = document.getElementById("instagram").value.trim();
  const instagramLinkContainer = document.getElementById("linkContainer");
  const instagramEditarBtn = document.getElementById("editarLink");
  const instagramConfirmarBtn = document.getElementById("botaocaixa");
  const instagramInput = document.getElementById("instagram");
  const instagramBtn = document.getElementById("botao");
 
  const regexInstagram = /^[a-zA-Z0-9._]+$/;

  if (instagram && regexInstagram.test(instagram.replace(/^@/, ""))) {
    const padrao = instagram.startsWith("@") ? instagram.slice(1) : instagram;
    const link = `https://www.instagram.com/${padrao}`;

    instagramLinkContainer.innerHTML = `
      <div style="text-align: center;">
        <a href="${link}" target="_blank" style="color:#EC9E07; font-size:16px; word-wrap:break-word;">
          ${link}
        </a>
      </div>
    `;
    instagramBtn.setAttribute("href", link);
    instagramBtn.innerHTML = "Instagram";

    instagramInput.style.display = "none";
    instagramConfirmarBtn.style.display = "none";
    instagramEditarBtn.style.display = "inline-block";
    instagramInput.value = "";
    document.getElementById("texto-caixa3").textContent = "Aqui você pode editar o Instagram da sua empresa!";
  } else {
    alert("Por favor, insira um Instagram válido (somente letras, números, pontos e underlines).");
    instagramLinkContainer.innerHTML = "";
  }
}

// Função para gerar link do Facebook
function gerarLinkFacebook() {
  const facebook = document.getElementById("facebook2").value.trim();
  const facebookLinkContainer = document.getElementById("linkContainer2");
  const facebookEditarBtn = document.getElementById("editarLink2");
  const facebookConfirmarBtn = document.getElementById("botaocaixa2");
  const facebookInput = document.getElementById("facebook2");
  const facebookBtn = document.getElementById("facebook");
 
  const regexFacebook = /^[a-zA-Z0-9._]+$/;

  if (facebook && regexFacebook.test(facebook.replace(/^@/, ""))) {
    const padrao = facebook.startsWith("@") ? facebook.slice(1) : facebook;
    const link = `https://www.facebook.com/${padrao}`;

    facebookLinkContainer.innerHTML = `
      <div style="text-align: center;">
        <a href="${link}" target="_blank" style="color:#EC9E07; font-size:16px; word-wrap:break-word;">
          ${link}
        </a>
      </div>
    `;
    facebookBtn.setAttribute("href", link);
    facebookBtn.innerHTML = "Facebook";

    facebookInput.style.display = "none";
    facebookConfirmarBtn.style.display = "none";
    facebookEditarBtn.style.display = "inline-block";
    facebookInput.value = "";
    document.getElementById("texto-caixa4").textContent = "Aqui você pode editar o Facebook da sua empresa!";
  } else {
    alert("Por favor, insira um Facebook válido (somente letras, números, pontos e underlines).");
    facebookLinkContainer.innerHTML = "";
  }
}

// Função para mostrar o modal com mensagem personalizada
function mostrarModal(mensagem) {
    // Verificar se temos um modal Bootstrap disponível
    const modalElement = document.getElementById('erroSenhaModal');
    if (modalElement && window.bootstrap) {
        const modalBody = document.getElementById('erroSenhaModalBody');
        if (modalBody) {
            modalBody.innerHTML = mensagem;
            const erroModal = new bootstrap.Modal(modalElement);
            erroModal.show();
        } else {
            alert(mensagem);
        }
    } else {
        // Fallback para um alert simples
        alert(mensagem);
    }
}



// Objeto com funções de validação para cada campo
const validadores = {
  // Valida nome (ONG e Instituição)
  validarNome: function(nome) {
    if (!nome || nome.trim() === "") {
      return { valido: false, mensagem: "O nome não pode ficar em branco." };
    }
    
    if (nome.trim().length < 3) {
      return { valido: false, mensagem: "O nome deve ter pelo menos 3 caracteres." };
    }
    
    // Verifica se contém caracteres especiais não permitidos
    const regexNome = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s.,'-]+$/;
    if (!regexNome.test(nome)) {
      return { 
        valido: false, 
        mensagem: "O nome contém caracteres não permitidos. Use apenas letras, números, espaços e os símbolos .,'-" 
      };
    }
    
    return { valido: true };
  },
  
  // Valida email
  validarEmail: function(email) {
    if (!email || email.trim() === "") {
      return { valido: false, mensagem: "O email não pode ficar em branco." };
    }
    
    // Regex para email - verifica formato básico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      return { 
        valido: false, 
        mensagem: "Formato de email inválido. Por favor, verifique se o email está no formato correto (exemplo@dominio.com)." 
      };
    }
    
    return { valido: true };
  },
  
  // Valida senha
  validarSenha: function(senha) {
    if (!senha || senha === "") {
      return { valido: false, mensagem: "A senha não pode ficar em branco." };
    }
    
    if (senha.length < 8) {
      return { 
        valido: false, 
        mensagem: "A senha deve ter no mínimo 8 caracteres." 
      };
    }
    
    // Verifica se tem pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(senha)) {
      return { 
        valido: false, 
        mensagem: "A senha deve conter pelo menos uma letra maiúscula." 
      };
    }
    
    // Verifica se tem pelo menos um número
    if (!/[0-9]/.test(senha)) {
      return { 
        valido: false, 
        mensagem: "A senha deve conter pelo menos um número." 
      };
    }
    
    // Verifica se tem pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
      return { 
        valido: false, 
        mensagem: "A senha deve conter pelo menos um caractere especial (ex: !@#$%&*)." 
      };
    }
    
    return { valido: true };
  },
  
  // Valida CNPJ
  validarCNPJ: function(cnpj) {
    if (!cnpj || cnpj.trim() === "") {
      return { valido: false, mensagem: "O CNPJ não pode ficar em branco." };
    }
    
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) {
      return { 
        valido: false, 
        mensagem: "O CNPJ deve ter 14 dígitos (xx.xxx.xxx/xxxx-xx)." 
      };
    }
    
    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) {
      return { valido: false, mensagem: "CNPJ inválido." };
    }
    
    // Valida dígitos verificadores
    // Validação do primeiro dígito
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) {
      return { valido: false, mensagem: "CNPJ inválido." };
    }
    
    // Validação do segundo dígito
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) {
      return { valido: false, mensagem: "CNPJ inválido." };
    }
    
    return { valido: true };
  },
  
  // Valida telefone
  validarTelefone: function(telefone) {
    if (!telefone || telefone.trim() === "") {
      return { valido: false, mensagem: "O telefone não pode ficar em branco." };
    }
    
    // Remove caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Verifica se é um telefone fixo ou celular brasileiro válido
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      return { 
        valido: false, 
        mensagem: "O número de telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)." 
      };
    }
    
    // Verifica se é celular (11 dígitos) e se o primeiro dígito do número é 9
    if (numeroLimpo.length === 11 && numeroLimpo.charAt(2) !== '9') {
      return { 
        valido: false, 
        mensagem: "Para celulares, o formato deve ser (XX) 9XXXX-XXXX" 
      };
    }
    
    // Verifica DDD válido (entre 11 e 99)
    const ddd = parseInt(numeroLimpo.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
      return { valido: false, mensagem: "DDD inválido." };
    }
    
    return { valido: true };
  },
  
  // Formatar CNPJ para exibição
  formatarCNPJ: function(cnpj) {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');
    
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  },
  
  // Formatar telefone para exibição
  formatarTelefone: function(telefone) {
    // Remove caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');
    
    // Verifica se é celular ou fixo
    if (telefone.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else {
      // Fixo: (XX) XXXX-XXXX
      return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }
  }
};

// Função principal para validar o formulário inteiro
function validarFormulario() {
    const campos = {
        "edit-institution-name": { 
            valor: document.getElementById("edit-institution-name").value,
            validador: validadores.validarNome,
            nome: "Nome da ONG" 
        },
        "edit-email": { 
            valor: document.getElementById("edit-email").value,
            validador: validadores.validarEmail,
            nome: "E-mail"
        },
        "edit-password": { 
            valor: document.getElementById("edit-password").value,
            validador: validadores.validarSenha,
            nome: "Senha"
        },
        "edit-cnpj": { 
            valor: document.getElementById("edit-cnpj").value,
            validador: validadores.validarCNPJ,
            nome: "CNPJ"
        },
        "edit-phone": { 
            valor: document.getElementById("edit-phone").value,
            validador: validadores.validarTelefone,
            nome: "Telefone"
        }
    };
    
    // Validar cada campo individualmente
    for (const id in campos) {
        const campo = campos[id];
        const resultado = campo.validador(campo.valor);
        
        if (!resultado.valido) {
            // Mostrar modal de erro para este campo
            mostrarModalErro(campo.nome, resultado.mensagem);
            
            // Destacar campo com erro
            destacarCampoComErro(id);
            
            return false; // Parar na primeira validação que falhar
        }
    }
    
    // Se chegou até aqui, todos os campos são válidos
    return true;
}

// Função para exibir o modal de erro específico para o campo
function mostrarModalErro(campo, mensagem) {
  const titulo = `Erro de validação: ${campo}`;
  
  // Conteúdo HTML para o corpo do modal
  const conteudo = `
    <div class="alert alert-danger" role="alert">
      <h5><i class="bi bi-exclamation-triangle-fill"></i> Problema no campo "${campo}"</h5>
      <p>${mensagem}</p>
    </div>
    <p>Por favor, corrija o campo e tente novamente.</p>
  `;
  
  // Definir título e conteúdo no modal existente
  document.getElementById('erroSenhaModalLabel').textContent = titulo;
  document.getElementById('erroSenhaModalBody').innerHTML = conteudo;
  
  // Exibir o modal
  const erroModal = new bootstrap.Modal(document.getElementById('erroSenhaModal'));
  erroModal.show();
  
  // Garantir que ao fechar o modal, o foco vá para o campo com erro
  document.getElementById('erroSenhaModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById(campoAtualComErro).focus();
  });
}

// Variável para rastrear o campo atual com erro
let campoAtualComErro = '';

// Função para destacar visualmente o campo com erro
function destacarCampoComErro(id) {
  // Guardar o ID do campo com erro
  campoAtualComErro = id;
  
  // Aplicar estilo de erro
  const campo = document.getElementById(id);
  campo.classList.add('campo-erro');
  
  // Adicionar evento para remover o estilo quando o usuário começar a editar
  campo.addEventListener('input', function removerEstiloErro() {
    campo.classList.remove('campo-erro');
    campo.removeEventListener('input', removerEstiloErro);
  });
}

// Verificar input de CNPJ para aplicar máscara enquanto digita
function configurarMascaraCNPJ() {
  const campoCNPJ = document.getElementById('edit-cnpj');
  if (!campoCNPJ) return;
  
  campoCNPJ.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 14) valor = valor.substring(0, 14);
    
    // Aplicar máscara enquanto digita
    if (valor.length <= 2) {
      e.target.value = valor;
    } else if (valor.length <= 5) {
      e.target.value = valor.replace(/^(\d{2})(\d+)/, "$1.$2");
    } else if (valor.length <= 8) {
      e.target.value = valor.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (valor.length <= 12) {
      e.target.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
    } else {
      e.target.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, "$1.$2.$3/$4-$5");
    }
  });
}

// Verificar input de telefone para aplicar máscara enquanto digita
function configurarMascaraTelefone() {
  const campoTelefone = document.getElementById('edit-phone');
  if (!campoTelefone) return;
  
  campoTelefone.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substring(0, 11);
    
    // Aplicar máscara enquanto digita
    if (valor.length <= 2) {
      e.target.value = valor;
    } else if (valor.length <= 6) {
      e.target.value = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    } else if (valor.length <= 10) {
      e.target.value = valor.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    } else {
      e.target.value = valor.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
    }
  });
}

// Função para configurar verificação de senha - versão modificada
function configurarVerificacaoSenha() {
    const campoSenha = document.getElementById('edit-password');
    if (!campoSenha) return;
    
    campoSenha.addEventListener('input', function() {
        const senha = campoSenha.value;
        
        // Verificar requisitos
        const temTamanhoMinimo = senha.length >= 8;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
        
        // Atualizar o status dos requisitos usando os IDs existentes no HTML
        document.getElementById("check-length").classList.toggle("valid", temTamanhoMinimo);
        document.getElementById("check-uppercase").classList.toggle("valid", temMaiuscula);
        document.getElementById("check-number").classList.toggle("valid", temNumero);
        document.getElementById("check-special").classList.toggle("valid", temEspecial);
    });
}

// Atualizar o CSS para os novos estilos
const styleElement = document.createElement('style');
styleElement.textContent = `
    .alert-danger {
        font-size: 0.85rem;
    }
    
    .alert-danger h5 {
        font-size: 0.95rem;
    }
`;
document.head.appendChild(styleElement);

// Inicializar todas as validações quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Sobrescrever a função existente saveChanges para incluir validação
  const originalSaveChanges = window.saveChanges;
  window.saveChanges = function() {
    // Validar o formulário antes de salvar
    if (validarFormulario()) {
      // Formatar os campos antes de salvar
      const cnpjInput = document.getElementById('edit-cnpj');
      const phoneInput = document.getElementById('edit-phone');
      
      if (cnpjInput) {
        cnpjInput.value = validadores.formatarCNPJ(cnpjInput.value);
      }
      
      if (phoneInput) {
        phoneInput.value = validadores.formatarTelefone(phoneInput.value);
      }
      
      // Chamar a função original de salvar
      originalSaveChanges();
    }
    // Se a validação falhar, a função mostrarModalErro já terá sido chamada
  };
  
  // Configurar máscaras e validações em tempo real
  configurarMascaraCNPJ();
  configurarMascaraTelefone();
  configurarVerificacaoSenha();
  
  // Adicionar CSS para os campos com erro
  const style = document.createElement('style');
  style.textContent = `
    .campo-erro {
      border: 2px solid #dc3545 !important;
      background-color: #fff8f8 !important;
    }
    
    .senha-forca {
      margin-top: 8px;
      font-size: 0.8rem;
    }
    
    .senha-barra-container {
      height: 6px;
      background-color: #f2f2f2;
      border-radius: 3px;
      margin-bottom: 4px;
    }
    
    .senha-barra {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s;
    }
    
    .senha-texto {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .senha-requisitos {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 0;
      font-size: 0.75rem;
    }
    
    .senha-requisitos li {
      margin-bottom: 2px;
      color: #666666;
    }
    
    .senha-requisitos li.atendido {
      color: #198754;
    }
    
    .senha-requisitos li.atendido::before {
      content: "✓ ";
    }
    
    .senha-requisitos li:not(.atendido)::before {
      content: "○ ";
    }
    
    /* Classes de cores para força da senha */
    .muito-fraca { color: #dc3545; }
    .fraca { color: #ffc107; }
    .media { color: #fd7e14; }
    .forte { color: #198754; }
    .muito-forte { color: #0d6efd; }
    
    .senha-barra.muito-fraca { background-color: #dc3545; }
    .senha-barra.fraca { background-color: #ffc107; }
    .senha-barra.media { background-color: #fd7e14; }
    .senha-barra.forte { background-color: #198754; }
    .senha-barra.muito-forte { background-color: #0d6efd; }
  `;
  document.head.appendChild(style);
});
