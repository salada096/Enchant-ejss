 document.addEventListener('DOMContentLoaded', function () {
      const form = document.getElementById('passwordForm');
      const pass1 = document.getElementById('pass1');
      const pass2 = document.getElementById('pass2');

      // Elementos dos requisitos
      const reqLength = document.getElementById('reqLength');
      const reqUpper = document.getElementById('reqUpper');
      const reqNumbers = document.getElementById('reqNumbers');
      const reqSpecial = document.getElementById('reqSpecial');

      // Função para mostrar modal de erro
      function showErrorModal(messages) {
        const errorModalBody = document.getElementById('errorModalBody');
        errorModalBody.innerHTML = '';
        messages.forEach(message => {
          const errorP = document.createElement('p');
          errorP.textContent = message;
          errorP.style.marginBottom = '10px';
          errorModalBody.appendChild(errorP);
        });
        $('#errorModal').modal('show');
      }

      // Função para atualizar a UI dos requisitos
      function updateRequirementUI(password) {
        if (!password) {
          [reqLength, reqUpper, reqNumbers, reqSpecial].forEach(el => {
            el.classList.remove('valid');
            el.classList.add('invalid');
          });
          return;
        }

        reqLength.classList.toggle('valid', password.length >= 8);
        reqLength.classList.toggle('invalid', password.length < 8);

        reqUpper.classList.toggle('valid', /[A-Z]/.test(password));
        reqUpper.classList.toggle('invalid', !/[A-Z]/.test(password));

        const numberCount = (password.match(/[0-9]/g) || []).length;
        reqNumbers.classList.toggle('valid', numberCount >= 2);
        reqNumbers.classList.toggle('invalid', numberCount < 2);

        reqSpecial.classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(password));
        reqSpecial.classList.toggle('invalid', !/[!@#$%^&*(),.?":{}|<>]/.test(password));
      }

      // Validação em tempo real da senha
      pass1.addEventListener('input', function () {
        updateRequirementUI(pass1.value);
        checkPasswordMatch();
      });

      // Verifica se as senhas coincidem
      function checkPasswordMatch() {
        if (pass1.value && pass2.value) {
          if (pass1.value !== pass2.value) {
            pass2.classList.add('password-mismatch');
            pass2.classList.remove('password-match');
          } else {
            pass2.classList.remove('password-mismatch');
            pass2.classList.add('password-match');
          }
        }
      }

      pass2.addEventListener('input', function () {
        checkPasswordMatch();
      });

      // Validação completa da senha
      function validatePassword(password) {
        // Verifica todos os requisitos
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const numberCount = (password.match(/[0-9]/g) || []).length;
        const hasEnoughNumbers = numberCount >= 2;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
          isValid: hasMinLength && hasUppercase && hasEnoughNumbers && hasSpecialChar
        };
      }

      // Validação no submit
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        let errorMessages = [];
        let isValid = true;

        // Valida a força da senha primeiro
        const passwordValidation = validatePassword(pass1.value);
        if (!passwordValidation.isValid) {
          errorMessages.push('Por favor, crie uma senha válida atendendo todos os requisitos.');
          pass1.focus();
          isValid = false;
        }

        // Verifica se as senhas são iguais
        if (pass1.value !== pass2.value) {
          errorMessages.push('As senhas não coincidem!');
          if (isValid) { // Só foca se o primeiro campo estiver ok
            pass2.focus();
          }
          isValid = false;
        }

        // Exibe modal de erro se houver problemas
        if (errorMessages.length > 0) {
          showErrorModal(errorMessages);
        } else {
          // Se tudo estiver válido, mostra modal de sucesso
          $('#successModal').modal('show');

          // Redireciona após fechar o modal de sucesso
          document.getElementById('closeSuccessModal').addEventListener('click', function () {
            window.location.href = "esqueciasenha4.html";
          });
        }
      });
    });