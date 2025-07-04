
        // Importações do Firebase
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js"; // Importar getAnalytics

        // A sua configuração real do Firebase
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
        const analytics = getAnalytics(app); // Inicializar o Analytics

        /**
         * Exibe um modal personalizado com uma mensagem.
         * @param {string} message - A mensagem a ser exibida no modal.
         * @param {string} type - O tipo de mensagem (ex: 'success', 'error', 'info').
         */
        function showModal(message) {
            const modal = document.getElementById("customModal");
            const modalMessage = document.getElementById("modalMessage");
            const modalCloseButton = document.getElementById("modalCloseButton");

            modalMessage.textContent = message;
            modal.classList.add("visible"); // Adiciona a classe 'visible' para exibir o modal

            // Adicionar ouvinte de evento para o botão de fechar
            modalCloseButton.onclick = () => {
                modal.classList.remove("visible"); // Remove a classe 'visible' para ocultar o modal
            };

            // Permitir fechar clicando fora do conteúdo do modal
            modal.onclick = (event) => {
                if (event.target === modal) {
                    modal.classList.remove("visible");
                }
            };
        }

        document.addEventListener("DOMContentLoaded", async () => {
            const themeToggle = document.getElementById("themeToggle");
            const savedTheme = localStorage.getItem("theme");

            // Aplicar o tema guardado ou predefinir para claro
            if (savedTheme) {
                document.documentElement.setAttribute("data-theme", savedTheme);
                if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark"); // Adicionar a classe 'dark' para o Tailwind
                } else {
                    document.documentElement.classList.remove("dark"); // Garantir que a classe 'dark' seja removida para o modo claro
                }
            } else {
                document.documentElement.setAttribute("data-theme", "light"); // Predefinir para o modo claro
                document.documentElement.classList.remove("dark"); // Garantir que não há classe dark se o predefinido é claro
            }

            // Funcionalidade de alternância de tema
            themeToggle.addEventListener("click", () => {
                const currentTheme = document.documentElement.getAttribute("data-theme");
                const newTheme = currentTheme === "dark" ? "light" : "dark";

                document.documentElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("theme", newTheme);

                if (newTheme === "dark") {
                    document.documentElement.classList.add("dark"); // Adicionar a classe 'dark' para o Tailwind
                } else {
                    document.documentElement.classList.remove("dark"); // Remover a classe 'dark' para o Tailwind
                }
            });

            const form = document.querySelector("form");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const forgotPasswordLink = document.getElementById("forgotPasswordLink");
            const togglePassword = document.getElementById("togglePassword");
            const eyeIcon = document.getElementById("eyeIcon");

            // RESTAURADO: O `onAuthStateChanged` redireciona para home.html se o usuário já estiver logado
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("O utilizador está autenticado, redirecionando para home.html:", user.uid);
                    window.location.href = "/home/home.html"; // Redireciona se o usuário já estiver logado
                } else {
                    console.log("O utilizador está desconectado.");
                }
            });

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

            // Validação básica de e-mail
            function validarEmail(email) {
                return email.endsWith("@gmail.com") || email.endsWith("@outlook.com");
            }

            // Validação de senha: mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial
            function validarSenha(senha) {
                const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return regex.test(senha);
            }

            // Ouvintes de evento para validação de entrada ao desfocar
            emailInput.addEventListener("blur", () => {
                const email = emailInput.value.trim();
                limparErro(emailInput);
                if (!email) {
                    mostrarErro(emailInput, "Por favor, preencha o campo de e-mail.");
                } else if (!validarEmail(email)) {
                    mostrarErro(emailInput, "O e-mail deve terminar com @gmail.com ou @outlook.com.");
                }
            });

            passwordInput.addEventListener("blur", () => {
                const senha = passwordInput.value.trim();
                limparErro(passwordInput);
                if (!senha) {
                    mostrarErro(passwordInput, "Por favor, preencha o campo de senha.");
                } else if (!validarSenha(senha)) {
                    mostrarErro(passwordInput, "A senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.");
                }
            });

            // Limpar erros ao digitar
            emailInput.addEventListener("input", () => limparErro(emailInput));
            passwordInput.addEventListener("input", () => limparErro(passwordInput));

            // Lidar com o envio do formulário (Login por E-mail/Senha)
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                document.activeElement.blur(); // Descartar o teclado no telemóvel

                const email = emailInput.value.trim();
                const senha = passwordInput.value.trim();
                let valido = true;

                limparErro(emailInput);
                limparErro(passwordInput);

                // Revalidar ao enviar
                if (!email) {
                    mostrarErro(emailInput, "Por favor, preencha o campo de e-mail.");
                    valido = false;
                } else if (!validarEmail(email)) {
                    mostrarErro(emailInput, "O e-mail deve terminar com @gmail.com ou @outlook.com.");
                    valido = false;
                }

                if (!senha) {
                    mostrarErro(passwordInput, "Por favor, preencha o campo de senha.");
                    valido = false;
                } else if (!validarSenha(senha)) {
                    mostrarErro(passwordInput, "A senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.");
                    valido = false;
                }

                if (valido) {
                    try {
                        await signInWithEmailAndPassword(auth, email, senha);
                        // Redireciona para home.html após login bem-sucedido
                        window.location.href = "/home/home.html";
                    } catch (error) {
                        console.error("Erro de autenticação:", error.message);
                        // Exibir uma mensagem de erro mais amigável ao utilizador
                        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                            showModal("Email ou senha incorretos. Por favor, tente novamente.");
                        } else if (error.code === 'auth/invalid-email') {
                            showModal("O formato do e-mail é inválido. Por favor, verifique.");
                        } else {
                            showModal("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.");
                        }
                        mostrarErro(emailInput, "Email ou senha incorretos."); // Manter o erro específico abaixo da entrada
                    }
                }
            });

            // Lidar com o link "Esqueceu a senha"
            forgotPasswordLink.addEventListener("click", async (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                limparErro(emailInput);

                if (!email) {
                    mostrarErro(emailInput, "Digite seu e-mail para redefinir a senha.");
                } else if (!validarEmail(email)) {
                    mostrarErro(emailInput, "Digite um e-mail válido para redefinir a senha.");
                } else {
                    try {
                        await sendPasswordResetEmail(auth, email);
                        showModal("Um e-mail de redefinição de senha foi enviado para " + email + "!");
                    } catch (error) {
                        console.error("Erro ao enviar e-mail de redefinição:", error.message);
                        if (error.code === 'auth/user-not-found') {
                            showModal("Não encontramos uma conta com este e-mail. Por favor, verifique.");
                        } else if (error.code === 'auth/invalid-email') {
                            showModal("O formato do e-mail é inválido. Por favor, verifique.");
                        } else {
                            showModal("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.");
                        }
                    }
                }
            });

            // Alternar a visibilidade da senha
            togglePassword.addEventListener("click", () => {
                const isPasswordVisible = passwordInput.type === "text";
                passwordInput.type = isPasswordVisible ? "password" : "text";
                eyeIcon.classList.toggle("fa-eye");
                eyeIcon.classList.toggle("fa-eye-slash");
            });
        });
    