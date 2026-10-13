// Tela "Sobre mim": apresentação + caixa de mensagem que monta um e-mail pronto para envio

// E-mail que recebe as mensagens do formulário
const EMAIL = "pedroluiz.alves06@gmail.com";
const VOLTAR = "./index.html#perfis";

const form = document.getElementById("formMensagem");
const statusEnvio = document.getElementById("chatStatus");
const linkGmail = document.getElementById("linkGmail");
const campoNome = form.elements.nome;
const campoMensagem = form.elements.mensagem;

function montarEmail() {
    const nome = campoNome.value.trim();
    const assunto = form.elements.assunto.value.trim() || "Contato pelo portfólio - " + nome;
    const corpo = campoMensagem.value.trim() + "\n\n— " + nome;
    return { assunto, corpo };
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const { assunto, corpo } = montarEmail();

    // Alternativa para quem não tem aplicativo de e-mail configurado
    linkGmail.href = "https://mail.google.com/mail/?view=cm&fs=1"
        + "&to=" + encodeURIComponent(EMAIL)
        + "&su=" + encodeURIComponent(assunto)
        + "&body=" + encodeURIComponent(corpo);
    statusEnvio.hidden = false;

    // Abre o aplicativo de e-mail do visitante com tudo preenchido
    window.location.href = "mailto:" + EMAIL
        + "?subject=" + encodeURIComponent(assunto)
        + "&body=" + encodeURIComponent(corpo);
});

// "Falar comigo" e o item "Mensagem" levam até a caixa de mensagem
function irParaMensagem(campo) {
    document.getElementById("contato").scrollIntoView({ behavior: "smooth", block: "start" });
    campo.focus({ preventScroll: true });
}

document.getElementById("irContato").addEventListener("click", function (event) {
    event.preventDefault();
    irParaMensagem(campoNome);
});

document.getElementById("focarMensagem").addEventListener("click", function () {
    irParaMensagem(campoMensagem);
});

//Navigate using keyboard (Esc volta, exceto enquanto digita)
document.addEventListener("keydown", function (event) {
    const digitando = event.target.matches("input, textarea");
    if (event.code === "Escape" && !digitando) {
        window.location.href = VOLTAR;
    }
});

//Controller
const rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;

window.addEventListener('gamepadconnected', function (e) {
    updateLoop();
});

function updateLoop() {
    let gp = navigator.getGamepads()[0];

    if (gp && gp.buttons[1].pressed) {
        window.location.href = VOLTAR;
    }

    setTimeout(function () {
        rAF(updateLoop);
    }, 130);
}
