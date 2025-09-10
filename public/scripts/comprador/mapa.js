// colocando o openstreetmap
const map = L.map('mapa').setView([-12.5, -41.7], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // isso aq vai guardar os dados de risco
        const dadosRisco = new Map();

        function getColor(risco) {
            if (risco === undefined || isNaN(risco)) return '#CCCCCC';
            if (risco > 0.8) return '#800026';
            if (risco > 0.6) return '#BD0026';
            if (risco > 0.4) return '#E31A1C';
            if (risco > 0.2) return '#FC4E2A';
            return '#FFEDA0';
        }
        // carrega os municipios .csv e os formatos dos municipios .geojson
        Promise.all([
            fetch('../../../public/scripts/comprador/AdaptaBrasil_adaptabrasil_desastres_geo-hidrologicos_indice_de_risco_para_inundacoes_enxurradas_e_alagamentos_BR_municipio_2015_geojson.geojson').then(response => response.json()),
            fetch('../../../public/scripts/comprador/AdaptaBrasil_adaptabrasil_desastres_geo-hidrologicos_indice_de_risco_para_inundacoes_enxurradas_e_alagamentos_BR_municipio_2015_csv.CSV').then(response => response.text())
        ]).then(([geojsonFeature, csvData]) => {
            
            // ler o csv
            Papa.parse(csvData, {
                header: true, // cabeçalho
                skipEmptyLines: true,
                complete: function(results) {
                    console.log("Cabeçalhos e primeira linha do CSV:", results.data[0]);
                    // processar os dados da planilha csv e guardar no mapa
                    results.data.forEach(row => {
                        const codMun = row.geocod_ibge;
                        const riscoValor = parseFloat(row.valor); 
                        
                        if (codMun) {
                            dadosRisco.set(codMun, riscoValor);
                        }
                    });

                    //testes de depuracao
                    console.log("DADOS DE RISCO CARREGADOS (do CSV):", dadosRisco);

                    console.log("PROPIEDADES DO PRIMEIRO MUNICÍPIO (do GeoJSON):", geojsonFeature.features[0].properties);

                    // funcao pra desenhar o mapa
                    desenharMapaGeoJSON(geojsonFeature);

                    const inputBusca = document.getElementById('input-pesquise');
                    const botaoBusca = document.getElementById('botao-de-busca');
                    let camadaDestacada = null; // Variável para guardar a camada destacada

                    function buscarEMostrarMunicipio() {
                    // Pega o valor, remove espaços extras e converte para minúsculas
                      const nomeCidade = inputBusca.value.trim().toLowerCase();

                      //teste...
                      console.log(nomeCidade);

                      if (nomeCidade === '') {
                        alert('Por favor, digite o nome de um município.');
                        return;
                      }

                      let municipioEncontrado = null;
                      // Procura o município na nossa lista de feições do GeoJSON
                      for (const feature of geojsonFeature.features) {
                        const nomeDoMapa = feature.properties.name.split('/')[0].trim();
                        if (nomeDoMapa.toLowerCase() === nomeCidade) {
                          municipioEncontrado = feature;
                          break; // Para a busca assim que encontrar
                        }
                      }

                      // Se encontrou, dá o zoom e destaca
                      if (municipioEncontrado) {
                        // Remove o destaque anterior, se houver
                        if (camadaDestacada) {
                          map.removeLayer(camadaDestacada);
                        }

                        // Cria uma camada temporária para pegar os limites geográficos
                        const camadaMunicipio = L.geoJson(municipioEncontrado);
                        map.fitBounds(camadaMunicipio.getBounds());

                      } else {
                        alert('Município não encontrado. Verifique a ortografia e tente novamente.');
                      }
                    }
                    botaoBusca.addEventListener('click', buscarEMostrarMunicipio);
                }
            });
        });

        function desenharMapaGeoJSON(geojsonFeature) {

            function style(feature) {
                const risco = dadosRisco.get(feature.properties.geocod_ibge);
                return {
                    fillColor: getColor(risco),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.75
                };
            }

            // mudar a cor ao passar o mouse
            function highlightFeature(e) {
                const layer = e.target;
                layer.setStyle({ weight: 3, color: '#666', dashArray: '' });
                info.update(layer.feature.properties);
            }

            function resetHighlight(e) {
                geojsonLayer.resetStyle(e.target);
                info.update();
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                });
            }

            const geojsonLayer = L.geoJson(geojsonFeature, { 
                style: style,
                onEachFeature: onEachFeature 
            }).addTo(map);

            // caixinha de informaçao
            info.addTo(map);
            // legenda
            legend.addTo(map);
        }

        // caixinha de informação que mostra o nome e o risco
        const info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
        info.update = function (props) {
            const risco = props ? dadosRisco.get(props.geocod_ibge) : undefined;
            const riscoFormatado = (risco !== undefined && !isNaN(risco)) ? risco.toFixed(2) : 'Sem dados';
            
            this._div.innerHTML = '<h4>Risco de Inundação no Brasil</h4>' +  (props ?
                '<b>' + props.name + '</b><br />Índice de Risco: ' + riscoFormatado
                : 'Passe o mouse sobre um município');
        };

        // legenda de cores
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 0.2, 0.4, 0.6, 0.8];
            
            div.innerHTML += '<b>Índice de Risco</b><br>';
            for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            div.innerHTML += '<br><i style="background:#CCCCCC"></i> Sem dados';
            return div;
        };

document.addEventListener("DOMContentLoaded", function () {
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
 
  // Restante do código existente...
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


  // Chamadas para outras funções existentes
  handleHeaderAnimation();
  handleSidebarHover();
});


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


// Funções existentes...
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
    modalOverlay.style.zIndex = "1000";
    document.body.appendChild(modalOverlay);
  }
  return modalOverlay;
}


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


// Adicione essa função para garantir que a sidebar tenha altura máxima em celulares
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


// Adicionar função para editar links
document.addEventListener("DOMContentLoaded", function() {
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
});
