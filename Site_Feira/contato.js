/* Validação e comportamento do formulário de contato - INTI Agrotech */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contato');
    if (!form) return;

    const retorno = document.getElementById('retorno');
    const mensagem = document.getElementById('mensagem');
    const contador = document.getElementById('contador');
    const telefone = document.getElementById('telefone');
    const LIMITE = 600;

    /* Contador de caracteres */
    mensagem.setAttribute('maxlength', LIMITE);
    const atualizarContador = () => {
        contador.textContent = `${mensagem.value.length} / ${LIMITE}`;
    };
    mensagem.addEventListener('input', atualizarContador);
    atualizarContador();

    /* Máscara simples de telefone */
    telefone.addEventListener('input', () => {
        let v = telefone.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) {
            v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
        } else if (v.length > 2) {
            v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            v = `(${v}`;
        }
        telefone.value = v;
    });

    /* Helpers de erro */
    const mostrarErro = (campo, texto) => {
        const alvo = form.querySelector(`[data-erro="${campo}"]`);
        if (alvo) alvo.textContent = texto;
        const input = document.getElementById(campo);
        if (input && input.type !== 'checkbox') input.classList.add('invalido');
    };

    const limparErros = () => {
        form.querySelectorAll('.erro').forEach(e => (e.textContent = ''));
        form.querySelectorAll('.invalido').forEach(e => e.classList.remove('invalido'));
    };

    form.querySelectorAll('input, select, textarea').forEach(campo => {
        campo.addEventListener('input', () => {
            campo.classList.remove('invalido');
            const alvo = form.querySelector(`[data-erro="${campo.id}"]`);
            if (alvo) alvo.textContent = '';
        });
    });

    /* Envio */
    form.addEventListener('submit', evento => {
        evento.preventDefault();
        limparErros();
        retorno.textContent = '';
        retorno.className = 'retorno';

        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const assunto = document.getElementById('assunto');
        const autorizo = document.getElementById('autorizo');
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const digitosTelefone = telefone.value.replace(/\D/g, '');

        let primeiroInvalido = null;

        if (nome.value.trim().length < 3) {
            mostrarErro('nome', 'Escreva seu nome com pelo menos 3 letras.');
            primeiroInvalido = primeiroInvalido || nome;
        }

        if (!regexEmail.test(email.value.trim())) {
            mostrarErro('email', 'Informe um e-mail válido, como nome@exemplo.com.');
            primeiroInvalido = primeiroInvalido || email;
        }

        if (digitosTelefone.length > 0 && digitosTelefone.length < 10) {
            mostrarErro('telefone', 'O telefone precisa ter DDD e número completo.');
            primeiroInvalido = primeiroInvalido || telefone;
        }

        if (!assunto.value) {
            mostrarErro('assunto', 'Escolha o assunto da mensagem.');
            primeiroInvalido = primeiroInvalido || assunto;
        }

        if (mensagem.value.trim().length < 15) {
            mostrarErro('mensagem', 'Conte um pouco mais: use ao menos 15 caracteres.');
            primeiroInvalido = primeiroInvalido || mensagem;
        }

        if (!autorizo.checked) {
            mostrarErro('autorizo', 'Marque a autorização para podermos responder.');
            primeiroInvalido = primeiroInvalido || autorizo;
        }

        if (primeiroInvalido) {
            retorno.className = 'retorno falha';
            retorno.textContent = 'Revise os campos destacados e envie novamente.';
            primeiroInvalido.focus();
            return;
        }

        /* Sem servidor: a página apenas confirma o preenchimento correto */
        retorno.className = 'retorno sucesso';
        retorno.textContent = `Mensagem pronta, ${nome.value.trim().split(' ')[0]}. Responderemos em ${email.value.trim()} em até dois dias úteis.`;
        form.reset();
        atualizarContador();
    });
});