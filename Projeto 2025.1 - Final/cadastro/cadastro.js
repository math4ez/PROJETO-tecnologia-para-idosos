
        // Importações do Firebase
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        // Importar `signOut` para deslogar o usuário após o cadastro
        import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; // Importar Firestore

        // A sua configuração real do Firebase (copiada do seu index.html)
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

        let isRegistering = false; // Flag para controlar o redirecionamento após o cadastro

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
            const fullNameInput = document.getElementById("fullName");
            const birthDateInput = document.getElementById("birthDate");
            const phoneInput = document.getElementById("phone");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirmPassword");
            const togglePassword = document.getElementById("togglePassword");
            const eyeIcon = document.getElementById("eyeIcon");
            const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
            const eyeConfirmIcon = document.getElementById("eyeConfirmIcon");

            // Modificado: Controla o redirecionamento com base na flag `isRegistering`
            onAuthStateChanged(auth, (user) => {
                if (user && !isRegistering) { // Se o usuário está logado e NÃO estamos no processo de cadastro
                    console.log("O utilizador está autenticado, redirecionando para home.html:", user.uid);
                    window.location.href = "/home/home.html"; // Redireciona se o usuário JÁ estava logado
                } else if (!user && isRegistering) { // Se o usuário acabou de ser deslogado após o cadastro
                    console.log("Usuário deslogado após o cadastro, redirecionando para index.html.");
                    showModal("Cadastro realizado com sucesso! Você será redirecionado para a página de login.");
                    setTimeout(() => {
                        window.location.href = "/index/index.html";
                    }, 2000);
                    isRegistering = false; // Reseta a flag após o redirecionamento
                } else {
                    console.log("O utilizador está desconectado ou em processo de registro.");
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

            // Nova validação: Nome Completo (apenas letras, mínimo 10 caracteres sem espaços)
            function validarNomeCompleto(nome) {
                const nomeSemEspacos = nome.replace(/\s/g, '');
                const regex = /^[a-zA-Z\sà-úÀ-Ú]+$/; // Permite letras e espaços, incluindo acentos
                if (!regex.test(nome)) {
                    return "O nome completo deve conter apenas letras.";
                }
                if (nomeSemEspacos.length < 10) {
                    return "O nome completo deve ter no mínimo 10 caracteres (sem contar espaços).";
                }
                return ""; // Vazio significa válido
            }

            // Nova validação: Data de Nascimento (data válida e não futura)
            function validarDataNascimento(data) {
                if (!data) {
                    return "Por favor, preencha a data de nascimento.";
                }
                const dataNasc = new Date(data + "T00:00:00"); // Adiciona T00:00:00 para evitar problemas de fuso horário
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0); // Zera a hora para comparação de datas

                if (isNaN(dataNasc.getTime())) { // Verifica se a data é inválida
                    return "Formato de data inválido.";
                }
                if (dataNasc > hoje) {
                    return "A data de nascimento não pode ser no futuro.";
                }
                return "";
            }

            // Máscara para telefone (XX) XXXXX-XXXX
            function formatarTelefone(input) {
                let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
                if (value.length > 0) {
                    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Adiciona parênteses e espaço
                    value = value.replace(/(\d)(\d{4})$/, "$1-$2"); // Adiciona hífen
                }
                input.value = value;
            }

            // Nova validação: Telefone (formato (XX) XXXXX-XXXX)
            function validarTelefone(telefone) {
                const regex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
                if (!regex.test(telefone)) {
                    return "O telefone deve estar no formato (XX) XXXXX-XXXX.";
                }
                return "";
            }

            // Validação básica de e-mail (mantida)
            function validarEmail(email) {
                return email.endsWith("@gmail.com") || email.endsWith("@outlook.com");
            }

            // Validação de senha: mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial (mantida)
            function validarSenha(senha) {
                const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return regex.test(senha);
            }

            // Validação de confirmação de senha (mantida)
            function validarConfirmarSenha(senha, confirmarSenha) {
                return senha === confirmarSenha;
            }

            // Ouvintes de evento para validação de entrada ao desfocar
            fullNameInput.addEventListener("blur", () => {
                const nome = fullNameInput.value.trim();
                limparErro(fullNameInput);
                const erroMsg = validarNomeCompleto(nome);
                if (erroMsg) {
                    mostrarErro(fullNameInput, erroMsg);
                }
            });

            birthDateInput.addEventListener("blur", () => {
                const data = birthDateInput.value.trim();
                limparErro(birthDateInput);
                const erroMsg = validarDataNascimento(data);
                if (erroMsg) {
                    mostrarErro(birthDateInput, erroMsg);
                }
            });

            phoneInput.addEventListener("input", () => {
                formatarTelefone(phoneInput); // Aplica a máscara enquanto digita
                limparErro(phoneInput); // Limpa o erro ao digitar
            });

            phoneInput.addEventListener("blur", () => {
                const telefone = phoneInput.value.trim();
                limparErro(phoneInput);
                const erroMsg = validarTelefone(telefone);
                if (erroMsg) {
                    mostrarErro(phoneInput, erroMsg);
                }
            });

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
                // Revalidar confirmação de senha se a senha for alterada
                if (confirmPasswordInput.value.trim() !== "") {
                    const confirmSenha = confirmPasswordInput.value.trim();
                    limparErro(confirmPasswordInput);
                    if (!validarConfirmarSenha(senha, confirmSenha)) {
                        mostrarErro(confirmPasswordInput, "As senhas não coincidem.");
                    }
                }
            });

            confirmPasswordInput.addEventListener("blur", () => {
                const senha = passwordInput.value.trim();
                const confirmSenha = confirmPasswordInput.value.trim();
                limparErro(confirmPasswordInput);
                if (!confirmSenha) {
                    mostrarErro(confirmPasswordInput, "Por favor, preencha o campo de confirmação de senha.");
                } else if (!validarConfirmarSenha(senha, confirmSenha)) {
                    mostrarErro(confirmPasswordInput, "As senhas não coincidem.");
                }
            });

            // Limpar erros ao digitar para os novos campos
            fullNameInput.addEventListener("input", () => limparErro(fullNameInput));
            birthDateInput.addEventListener("input", () => limparErro(birthDateInput));
            // phoneInput já tem um input listener para formatação e limpeza de erro
            emailInput.addEventListener("input", () => limparErro(emailInput));
            passwordInput.addEventListener("input", () => limparErro(passwordInput));
            confirmPasswordInput.addEventListener("input", () => limparErro(confirmPasswordInput));


            // Lidar com o envio do formulário (Cadastro por E-mail/Senha)
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                document.activeElement.blur(); // Descartar o teclado no telemóvel

                const nomeCompleto = fullNameInput.value.trim();
                const dataNascimento = birthDateInput.value.trim();
                const telefone = phoneInput.value.trim();
                const email = emailInput.value.trim();
                const senha = passwordInput.value.trim();
                const confirmSenha = confirmPasswordInput.value.trim();
                let valido = true;

                // Limpar todos os erros antes de revalidar
                limparErro(fullNameInput);
                limparErro(birthDateInput);
                limparErro(phoneInput);
                limparErro(emailInput);
                limparErro(passwordInput);
                limparErro(confirmPasswordInput);

                // Revalidar todos os campos ao enviar
                const erroNome = validarNomeCompleto(nomeCompleto);
                if (erroNome) {
                    mostrarErro(fullNameInput, erroNome);
                    valido = false;
                }

                const erroData = validarDataNascimento(dataNascimento);
                if (erroData) {
                    mostrarErro(birthDateInput, erroData);
                    valido = false;
                }

                const erroTelefone = validarTelefone(telefone);
                if (erroTelefone) {
                    mostrarErro(phoneInput, erroTelefone);
                    valido = false;
                }

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

                if (!confirmSenha) {
                    mostrarErro(confirmPasswordInput, "Por favor, preencha o campo de confirmação de senha.");
                    valido = false;
                } else if (!validarConfirmarSenha(senha, confirmSenha)) {
                    mostrarErro(confirmPasswordInput, "As senhas não coincidem.");
                    valido = false;
                }

                if (valido) {
                    try {
                        isRegistering = true; // Ativa a flag antes do processo de registro
                        // 1. Criar autenticação do usuário
                        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                        const user = userCredential.user;
                        console.log("Usuário registrado:", user);

                        const uid = user.uid;

                        // 2. Salvar dados do usuário no Firestore
                        await setDoc(doc(db, "usuarios", uid), {
                            nomeCompleto: nomeCompleto,
                            nascimento: dataNascimento,
                            telefone: telefone,
                            email: email,
                            criadoEm: serverTimestamp() // Adiciona um timestamp do servidor
                        });

                        console.log("Documento Firestore criado com sucesso para o UID:", uid); // Log de sucesso para Firestore

                        // 3. DESLOGAR O USUÁRIO IMEDIATAMENTE APÓS O CADASTRO
                        // Isso irá acionar o onAuthStateChanged novamente com user=null
                        await signOut(auth);
                        console.log("Usuário deslogado após o cadastro.");

                        // O redirecionamento e o showModal agora são tratados pelo onAuthStateChanged quando user=null e isRegistering=true
                    } catch (error) {
                        isRegistering = false; // Desativa a flag em caso de erro
                        console.error("Erro de cadastro:", error.message);
                        if (error.code === 'auth/email-already-in-use') {
                            mostrarErro(emailInput, "Este e-mail já está em uso.");
                        } else if (error.code === 'auth/invalid-email') {
                            showModal("O formato do e-mail é inválido. Por favor, verifique.");
                            mostrarErro(emailInput, "O formato do e-mail é inválido.");
                        } else if (error.code === 'auth/weak-password') {
                            showModal("A senha é muito fraca. Por favor, use uma senha mais forte.");
                            mostrarErro(passwordInput, "A senha é muito fraca.");
                        } else {
                            // Este é um bom lugar para logar erros mais genéricos do Firestore ou de permissão
                            console.error("Erro ao salvar documento no Firestore ou outro erro inesperado:", error);
                            showModal("Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente mais tarde.");
                        }
                    }
                }
            });

            // Alternar a visibilidade da senha principal
            togglePassword.addEventListener("click", () => {
                const isPasswordVisible = passwordInput.type === "text";
                passwordInput.type = isPasswordVisible ? "password" : "text";
                eyeIcon.classList.toggle("fa-eye");
                eyeIcon.classList.toggle("fa-eye-slash");
            });

            // Alternar a visibilidade da senha de confirmação
            toggleConfirmPassword.addEventListener("click", () => {
                const isConfirmPasswordVisible = confirmPasswordInput.type === "text";
                confirmPasswordInput.type = isConfirmPasswordVisible ? "password" : "text";
                eyeConfirmIcon.classList.toggle("fa-eye");
                eyeConfirmIcon.classList.toggle("fa-eye-slash");
            });
        });
    