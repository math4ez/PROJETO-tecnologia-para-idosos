
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
      import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
      import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; // Importar Firestore e updateDoc

      // Configuração do Firebase
      const firebaseConfig = {
          apiKey: "AIzaSyBuO53NnPABPPNvoJwVd0Cf-uHdhjvp4ek",
          authDomain: "quiz-b1a5f.firebaseapp.com",
          projectId: "quiz-b1a5f",
          storageBucket: "quiz-b1a5f.firebasestorage.app",
          messagingSenderId: "766849360617",
          appId: "1:766849360617:web:d4bb2f95268a31d74e8678",
          measurementId: "G-6HZ2LERNMW"
      };

      // Inicializar o Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app); // Inicializar Firestore

      /**
       * Exibe um modal personalizado com uma mensagem.
       * @param {string} message - A mensagem a ser exibida no modal.
       */
      function showModal(message) {
          const modal = document.getElementById("customModal");
          const modalMessage = document.getElementById("modalMessage");
          const modalCloseButton = document.getElementById("modalCloseButton");

          modalMessage.textContent = message;
          modal.classList.add("visible"); // Adiciona a classe 'visible' para exibir o modal

          modalCloseButton.onclick = () => {
              modal.classList.remove("visible"); // Remove a classe 'visible' para ocultar o modal
          };

          modal.onclick = (event) => {
              if (event.target === modal) {
                  modal.classList.remove("visible");
              }
          };
      }

      document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.querySelector('.theme-switcher button'); // Seleciona o botão de toggle de tema
        const savedTheme = localStorage.getItem("theme");
        const userNameDisplay = document.getElementById("userNameDisplay"); // Alterado para userNameDisplay
        const logoutButtonHeader = document.getElementById("logoutButtonHeader"); // Botão Sair no cabeçalho
        const editProfileButton = document.getElementById("editProfileButton"); // Botão Editar Perfil
        const editProfileModal = document.getElementById("editProfileModal"); // Modal de edição de perfil
        const cancelEditProfile = document.getElementById("cancelEditProfile"); // Botão Cancelar no modal
        const editProfileForm = document.getElementById("editProfileForm"); // Formulário do modal de edição

        // Campos do formulário de edição de perfil
        const fullNameEditInput = document.getElementById("fullNameEdit");
        const birthDateEditInput = document.getElementById("birthDateEdit");
        const phoneEditInput = document.getElementById("phoneEdit");

        let currentUserId = null; // Para armazenar o UID do usuário logado

        // Lógica de proteção da página: verifica o estado de autenticação
        onAuthStateChanged(auth, async (user) => { // Adicionado 'async' aqui
            if (user) {
                console.log("Usuário autenticado na home:", user.uid);
                currentUserId = user.uid; // Armazena o UID

                // Busca o nome do usuário no Firestore
                const userDocRef = doc(db, "usuarios", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.nomeCompleto) {
                        userNameDisplay.textContent = `Olá, ${userData.nomeCompleto.split(' ')[0]}!`; // Exibe apenas o primeiro nome
                    } else {
                        userNameDisplay.textContent = `Olá, ${user.email}!`; // Fallback para o e-mail se o nome completo não estiver disponível
                    }
                } else {
                    userNameDisplay.textContent = `Olá, ${user.email}!`; // Fallback se o documento do usuário não for encontrado
                }
            } else {
                console.log("Usuário não autenticado, redirecionando para index.html.");
                window.location.href = "/index/index.html"; // Redireciona para a página de login se não estiver autenticado
            }
        });

        // Lógica de logout
        if (logoutButtonHeader) {
            logoutButtonHeader.addEventListener("click", async () => {
                try {
                    await signOut(auth);
                    showModal("Você foi desconectado. Redirecionando para a página de login.");
                    setTimeout(() => {
                        window.location.href = "index.html"; // Redireciona para a página de login após o logout
                    }, 1500); // Redireciona após 1.5 segundos para o usuário ver a mensagem
                } catch (error) {
                    console.error("Erro ao fazer logout:", error.message);
                    showModal("Ocorreu um erro ao tentar sair. Por favor, tente novamente.");
                }
            });
        }

        // Aplicar o tema guardado ou predefinir para claro
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
            if (savedTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.classList.remove("dark");
        }

        // Funcionalidade de alternância de tema
        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                const currentTheme = document.documentElement.getAttribute("data-theme");
                const newTheme = currentTheme === "dark" ? "light" : "dark";

                document.documentElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("theme", newTheme);

                if (newTheme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            });
        }


        // ============ MENU MOBILE ============
        const menuBtn = document.getElementById('menu-mobile');
        const menu = document.getElementById('menu');

        if (menuBtn && menu) {
          menuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('ativo'); // Usa 'ativo' para JS
          });

          // Fechar menu ao clicar em um link
          const menuLinks = document.querySelectorAll('#menu a');
          menuLinks.forEach(link => {
            link.addEventListener('click', function() {
              menuBtn.setAttribute('aria-expanded', 'false');
              menu.classList.remove('ativo'); // Usa 'ativo' para JS
            });
          });
        }

        // ============ ACCORDION DE DICAS ============
        const dicasTitulos = document.querySelectorAll('.dica-titulo');

        dicasTitulos.forEach(titulo => {
          titulo.addEventListener('click', function() {
            const dica = this.parentElement;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            dica.classList.toggle('ativo'); // Usa 'ativo' para JS

            // Fechar outras dicas abertas
            dicasTitulos.forEach(outroTitulo => {
              if (outroTitulo !== this) {
                outroTitulo.setAttribute('aria-expanded', 'false');
                outroTitulo.parentElement.classList.remove('ativo'); // Usa 'ativo' para JS
              }
              });
          });
        });

        // ============ BOTÃO VOLTAR AO TOPO ============
        const btnTopo = document.getElementById('btn-topo');

        if (btnTopo) {
          window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
              btnTopo.classList.add('visivel'); // Usa 'visivel' para JS
            } else {
              btnTopo.classList.remove('visivel'); // Usa 'visivel' para JS
            }
          });

          btnTopo.addEventListener('click', function() {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          });
        }

        // ============ MODAL DE CURSOS ============
        const botoesCurso = document.querySelectorAll('.btn-curso');
        const modal = document.getElementById('modal-curso');
        const modalTitulo = document.getElementById('modal-titulo');
        const modalConteudo = document.getElementById('modal-conteudo');
        const modalInscrever = document.getElementById('modal-inscrever');

        if (modal && modalTitulo && modalConteudo && modalInscrever) {
          botoesCurso.forEach(botao => {
            // Verifica se o botão tem a classe 'btn-secundario' para ativar o modal
            if (botao.classList.contains('btn-secundario')) {
              botao.addEventListener('click', function() {
                const curso = this.closest('.curso');
                if (!curso) return;

                const titulo = curso.querySelector('h3')?.textContent || 'Curso';
                const descricao = curso.querySelector('p')?.textContent || '';

                modalTitulo.textContent = titulo;

                // Conteúdo do modal
                let conteudoHTML = `
                                <p>${descricao}</p>
                                <h4>Conteúdo do curso:</h4>
                                <ul>
                                    <li>Aulas práticas e didáticas</li>
                                    <li>Material de apoio exclusivo</li>
                                    <li>Suporte para dúvidas</li>
                                    <li>Certificado de conclusão</li>
                                </ul>
                            `;

                const duracaoElement = curso.querySelector('.fa-clock')?.parentElement;
                const duracao = duracaoElement ? duracaoElement.textContent.trim() : '';
                if (duracao) {
                  conteudoHTML += `<p><strong>Duração:</strong> ${duracao}</p>`;
                }

                modalConteudo.innerHTML = conteudoHTML;

                // Configurar botão de inscrição
                modalInscrever.onclick = function() {
                  window.location.href = '#contato';
                  modal.classList.remove('ativo'); // Usa 'ativo' para JS
                  const assuntoInput = document.getElementById('assunto');
                  const mensagemInput = document.getElementById('mensagem');

                  if (assuntoInput) assuntoInput.value = 'matricula';
                  if (mensagemInput) mensagemInput.value = `Gostaria de me inscrever no curso ${titulo}`;
                };

                // Mostrar modal
                modal.classList.add('ativo'); // Usa 'ativo' para JS
              });
            }
          });

          // Fechar modal
          const modalFechar = document.querySelector('.modal-fechar');
          if (modalFechar) {
            modalFechar.addEventListener('click', function() {
              modal.classList.remove('ativo'); // Usa 'ativo' para JS
            });
          }

          // Fechar modal ao clicar fora
          modal.addEventListener('click', function(e) {
            if (e.target === this) {
              modal.classList.remove('ativo'); // Usa 'ativo' para JS
            }
          });
        }

        // ============ CARROSSEL DE NOVIDADES ============
        setupCarrossel({
          carrosselSelector: '.recursos-carrossel',
          itemSelector: '.recurso-mini',
          intervalo: 6000,
          controlesSelector: '.recursos-box .carrossel-controles'
        });

        // ============ CARROSSEL DE DEPOIMENTOS ============
        setupCarrossel({
          carrosselSelector: '.depoimentos-carrossel',
          itemSelector: '.depoimento',
          intervalo: 7000,
          controlesSelector: '.depoimentos-carrossel + .carrossel-controles'
        });

        // ============ FUNÇÃO REUTILIZÁVEL PARA CARROSSEIS ============
        /**
         * Configura um carrossel genérico.
         * @param {object} options - Opções de configuração do carrossel.
         * @param {string} options.carrosselSelector - Seletor CSS do container do carrossel.
         * @param {string} options.itemSelector - Seletor CSS dos itens do carrossel.
         * @param {number} options.intervalo - Intervalo de tempo em milissegundos para a troca automática.
         * @param {string} options.controlesSelector - Seletor CSS do container dos controles (prev/next/indicadores).
         */
        function setupCarrossel({
          carrosselSelector,
          itemSelector,
          intervalo,
          controlesSelector
        }) {
          const carrossel = document.querySelector(carrosselSelector);
          if (!carrossel) return;

          const items = document.querySelectorAll(`${carrosselSelector} ${itemSelector}`);
          if (items.length === 0) return;

          const controlesContainer = document.querySelector(controlesSelector);
          if (!controlesContainer) return;

          let currentIndex = 0;
          let carrosselInterval;
          let indicadores = [];

          // Cria indicadores
          const indicadoresContainer = controlesContainer.querySelector('.carrossel-indicadores') ||
            document.createElement('div');
          if (!controlesContainer.querySelector('.carrossel-indicadores')) {
            indicadoresContainer.classList.add('carrossel-indicadores');
            controlesContainer.insertBefore(indicadoresContainer, controlesContainer.querySelector('.carrossel-next'));
          }

          indicadoresContainer.innerHTML = '';
          items.forEach((_, index) => {
            const indicador = document.createElement('button');
            indicador.setAttribute('aria-label', `Slide ${index + 1}`);
            indicador.setAttribute('data-index', index);
            indicador.classList.add('w-2.5', 'h-2.5', 'rounded-full', 'bg-gray-300', 'cursor-pointer', 'transition-all', 'duration-300', 'ease-in-out', 'carrossel-indicador', 'dark:bg-gray-600', 'dark:hover:opacity-75'); // Tailwind classes
            indicador.addEventListener('click', () => {
              goToSlide(index);
              resetInterval();
            });
            indicadoresContainer.appendChild(indicador);
            indicadores.push(indicador);
          });

          // Função para mudar slide
          function goToSlide(index) {
            // Remove a classe 'ativo' e 'carrossel-item-animated' do item atual
            if (items[currentIndex]) {
                items[currentIndex].classList.remove('ativo', 'carrossel-item-animated');
            }
            if (indicadores[currentIndex]) {
                indicadores[currentIndex].classList.remove('ativo');
            }

            currentIndex = (index + items.length) % items.length;

            // Adiciona a classe 'ativo' e 'carrossel-item-animated' ao novo item
            if (items[currentIndex]) {
                items[currentIndex].classList.add('ativo', 'carrossel-item-animated');
            }
            if (indicadores[currentIndex]) {
                indicadores[currentIndex].classList.add('ativo');
            }
          }

          // Controles de navegação
          const nextBtn = controlesContainer.querySelector('.carrossel-next');
          const prevBtn = controlesContainer.querySelector('.carrossel-prev');

          if (nextBtn) {
            nextBtn.addEventListener('click', () => {
              goToSlide(currentIndex + 1);
              resetInterval();
            });
          }

          if (prevBtn) {
            prevBtn.addEventListener('click', () => {
              goToSlide(currentIndex - 1);
              resetInterval();
            });
          }

          // Inicia o auto-rotacionar
          startInterval();

          // Pausar ao interagir
          carrossel.addEventListener('mouseenter', () => {
            clearInterval(carrosselInterval);
          });

          carrossel.addEventListener('mouseleave', () => {
            startInterval();
          });

          // Funções auxiliares do carrossel
          function startInterval() {
            carrosselInterval = setInterval(() => {
              goToSlide(currentIndex + 1);
            }, intervalo);
          }

          function resetInterval() {
            clearInterval(carrosselInterval);
            startInterval();
          }

          // Inicializar o primeiro slide como ativo
          goToSlide(0);
        }

        // ============ ACESSIBILIDADE ============
        // Aumentar Fonte
        const aumentarFonteBtn = document.getElementById('aumentar-fonte');
        if (aumentarFonteBtn) {
          aumentarFonteBtn.addEventListener('click', function() {
            const html = document.documentElement;
            let fontSize = parseFloat(window.getComputedStyle(html).fontSize);
            if (fontSize < 22) {
              html.style.fontSize = (fontSize + 1) + 'px';
              localStorage.setItem('fonteSize', fontSize + 1);
            } else {
              console.log('Tamanho máximo atingido.');
            }
          });
        }

        // Diminuir Fonte
        const diminuirFonteBtn = document.getElementById('diminuir-fonte');
        if (diminuirFonteBtn) {
          diminuirFonteBtn.addEventListener('click', function() {
            const html = document.documentElement;
            let fontSize = parseFloat(window.getComputedStyle(html).fontSize);
            if (fontSize > 14) {
              html.style.fontSize = (fontSize - 1) + 'px';
              localStorage.setItem('fonteSize', fontSize - 1);
            } else {
              console.log('Tamanho mínimo atingido.');
            }
          });
        }

        // Alto Contraste
        const altoContrasteBtn = document.getElementById('alto-contraste');
        if (altoContrasteBtn) {
          altoContrasteBtn.addEventListener('click', function() {
            // Altera o tema principal (claro/escuro)
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme); // Atualiza o localStorage para o tema

            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            // Atualiza a classe 'ativo' no próprio botão de Alto Contraste para feedback visual
            this.classList.toggle('ativo', newTheme === 'dark');
          });

          // Define o estado inicial do botão de Alto Contraste com base no tema atual
          const currentHtmlTheme = document.documentElement.getAttribute("data-theme");
          altoContrasteBtn.classList.toggle('ativo', currentHtmlTheme === 'dark');
        }

        // Leitor de Tela
        const leitorTelaBtn = document.getElementById('leitor-tela');
        if (leitorTelaBtn) {
          leitorTelaBtn.addEventListener('click', function() {
            if ('speechSynthesis' in window) {
              // Pausa se já estiver falando
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                return;
              }

              // Seleciona apenas o conteúdo principal para leitura
              const mainContent = document.querySelector('main')?.textContent || document.body.textContent;
              const utterance = new SpeechSynthesisUtterance(mainContent);
              utterance.lang = 'pt-BR';
              utterance.rate = 0.9;
              window.speechSynthesis.speak(utterance);
            } else {
              console.log('Leitor de tela não suportado no seu navegador.');
            }
          });
        }

        // Restaurar preferências ao carregar a página
        function restaurarPreferencias() {
          // Tamanho da fonte
          const savedSize = localStorage.getItem('fonteSize');
          if (savedSize) {
            document.documentElement.style.fontSize = savedSize + 'px';
          }
        }
        restaurarPreferencias();

        // ============ MELHORIAS ADICIONAIS ============
        // Ícone para links externos
        const linksExternos = document.querySelectorAll('a[target="_blank"]:not(.no-external-icon)');
        linksExternos.forEach(link => {
          if (!link.querySelector('.fa-external-link-alt')) {
            link.innerHTML += ' <i class="fas fa-external-link-alt" aria-hidden="true" style="font-size:0.8em;"></i>';
          }
        });

        // Rolagem suave para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#' && href !== '#!') {
              e.preventDefault();

              const targetElement = document.querySelector(href);
              if (targetElement) {
                const header = document.querySelector('header');
                // Considera a altura da barra de acessibilidade e do header para o offset
                const acessibilidadeBarHeight = document.querySelector('.acessibilidade-bar')?.offsetHeight || 0;
                const headerHeight = header ? header.offsetHeight : 0;
                // Calculando a altura total dos elementos fixos
                const offset = acessibilidadeBarHeight + headerHeight;


                const targetPosition = targetElement.offsetTop - offset;

                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
                });

                // Atualiza a URL sem recarregar a página
                if (history.pushState) {
                  history.pushState(null, null, href);
                } else {
                  location.hash = href;
                }
              }
            }
          });
        });

        // Animações ao rolar a página
        const animateOnScroll = function() {
          const elements = document.querySelectorAll('.beneficio, .curso, .recurso-card, .dica');

          elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
              element.classList.add('fade-in');
            }
          });
        };

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Executa uma vez ao carregar a página

        // ============ LÓGICA DO MODAL DE EDIÇÃO DE PERFIL ============

        /**
         * Exibe uma mensagem de erro abaixo do campo de entrada.
         * @param {HTMLElement} input - O elemento input onde o erro deve ser exibido.
         * @param {string} mensagem - A mensagem de erro.
         */
        function mostrarErro(input, mensagem) {
            const grupo = input.closest(".input-group");
            let erroContainer = grupo.querySelector(".erro-msg-container");

            if (!erroContainer) {
                erroContainer = document.createElement("p");
                erroContainer.classList.add("erro-msg-container");
                grupo.appendChild(erroContainer);
            }
            erroContainer.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensagem}`;
        }

        /**
         * Limpa as mensagens de erro de um campo de entrada.
         * @param {HTMLElement} input - O elemento input cujas mensagens de erro devem ser limpas.
         */
        function limparErro(input) {
            const grupo = input.closest(".input-group");
            const erroContainer = grupo.querySelector(".erro-msg-container");
            if (erroContainer) erroContainer.remove();
        }

        // Validações e máscaras (copiadas do cadastro.html e adaptadas)
        function validarNomeCompleto(nome) {
            const nomeSemEspacos = nome.replace(/\s/g, '');
            const regex = /^[a-zA-Z\sà-úÀ-Ú]+$/;
            if (!regex.test(nome)) {
                return "O nome completo deve conter apenas letras.";
            }
            if (nomeSemEspacos.length < 10) {
                return "O nome completo deve ter no mínimo 10 caracteres (sem contar espaços).";
            }
            return "";
        }

        function validarDataNascimento(data) {
            if (!data) {
                return "Por favor, preencha a data de nascimento.";
            }
            const dataNasc = new Date(data + "T00:00:00");
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (isNaN(dataNasc.getTime())) {
                return "Formato de data inválido.";
            }
            if (dataNasc > hoje) {
                return "A data de nascimento não pode ser no futuro.";
            }
            return "";
        }

        function formatarTelefone(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                value = value.replace(/(\d)(\d{4})$/, "$1-$2");
            }
            input.value = value;
        }

        function validarTelefone(telefone) {
            const regex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
            if (!regex.test(telefone)) {
                return "O telefone deve estar no formato (XX) XXXXX-XXXX.";
            }
            return "";
        }

        // Ouvintes de evento para validação de entrada ao desfocar nos campos de edição
        fullNameEditInput.addEventListener("blur", () => {
            const nome = fullNameEditInput.value.trim();
            limparErro(fullNameEditInput);
            const erroMsg = validarNomeCompleto(nome);
            if (erroMsg) {
                mostrarErro(fullNameEditInput, erroMsg);
            }
        });

        birthDateEditInput.addEventListener("blur", () => {
            const data = birthDateEditInput.value.trim();
            limparErro(birthDateEditInput);
            const erroMsg = validarDataNascimento(data);
            if (erroMsg) {
                mostrarErro(birthDateEditInput, erroMsg);
            }
        });

        phoneEditInput.addEventListener("input", () => {
            formatarTelefone(phoneEditInput);
            limparErro(phoneEditInput);
        });

        phoneEditInput.addEventListener("blur", () => {
            const telefone = phoneEditInput.value.trim();
            limparErro(phoneEditInput);
            const erroMsg = validarTelefone(telefone);
            if (erroMsg) {
                mostrarErro(phoneEditInput, erroMsg);
            }
        });

        // Limpar erros ao digitar para os campos de edição
        fullNameEditInput.addEventListener("input", () => limparErro(fullNameEditInput));
        birthDateEditInput.addEventListener("input", () => limparErro(birthDateEditInput));
        phoneEditInput.addEventListener("input", () => limparErro(phoneEditInput)); // Já tem o listener de formatação


        // Função para abrir o modal de edição de perfil
        editProfileButton.addEventListener("click", async () => {
            if (!currentUserId) {
                showModal("Nenhum usuário logado para editar o perfil.");
                return;
            }

            // Limpa erros anteriores no modal
            limparErro(fullNameEditInput);
            limparErro(birthDateEditInput);
            limparErro(phoneEditInput);

            try {
                const userDocRef = doc(db, "usuarios", currentUserId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    fullNameEditInput.value = userData.nomeCompleto || '';
                    birthDateEditInput.value = userData.nascimento || ''; // A data deve vir no formatoYYYY-MM-DD
                    phoneEditInput.value = userData.telefone || '';
                    formatarTelefone(phoneEditInput); // Garante que a máscara seja aplicada ao carregar
                } else {
                    showModal("Dados do usuário não encontrados.");
                }
            } catch (error) {
                console.error("Erro ao carregar dados do perfil:", error.message);
                showModal("Erro ao carregar seus dados de perfil.");
            }

            editProfileModal.classList.add("visible");
        });

        // Função para fechar o modal de edição de perfil
        cancelEditProfile.addEventListener("click", () => {
            editProfileModal.classList.remove("visible");
        });

        editProfileModal.addEventListener("click", (event) => {
            if (event.target === editProfileModal) {
                editProfileModal.classList.remove("visible");
            }
        });

        // Lógica para salvar as alterações do perfil
        editProfileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            document.activeElement.blur(); // Dismiss keyboard on mobile

            if (!currentUserId) {
                showModal("Nenhum usuário logado para salvar as alterações.");
                return;
            }

            const newFullName = fullNameEditInput.value.trim();
            const newBirthDate = birthDateEditInput.value.trim();
            const newPhone = phoneEditInput.value.trim();
            let valido = true;

            // Limpar todos os erros antes de revalidar
            limparErro(fullNameEditInput);
            limparErro(birthDateEditInput);
            limparErro(phoneEditInput);

            // Revalidar campos
            const erroNome = validarNomeCompleto(newFullName);
            if (erroNome) {
                mostrarErro(fullNameEditInput, erroNome);
                valido = false;
            }

            const erroData = validarDataNascimento(newBirthDate);
            if (erroData) {
                mostrarErro(birthDateEditInput, erroData);
                valido = false;
            }

            const erroTelefone = validarTelefone(newPhone);
            if (erroTelefone) {
                mostrarErro(phoneEditInput, erroTelefone);
                valido = false;
            }

            if (valido) {
                try {
                    const userDocRef = doc(db, "usuarios", currentUserId);
                    await updateDoc(userDocRef, {
                        nomeCompleto: newFullName,
                        nascimento: newBirthDate,
                        telefone: newPhone
                    });
                    showModal("Suas informações foram atualizadas com sucesso!");
                    editProfileModal.classList.remove("visible"); // Fecha o modal após salvar

                    // Atualiza o nome exibido na página inicial (se foi alterado)
                    userNameDisplay.textContent = `Olá, ${newFullName.split(' ')[0]}!`;

                } catch (error) {
                    console.error("Erro ao atualizar o perfil:", error.message);
                    showModal("Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.");
                }
            }
        });

      });
    