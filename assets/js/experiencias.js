// Tela de Experiências: navegação pelos cartões do histórico (estilo "Communities" do PS4)

const cartoes = Array.from(document.querySelectorAll(".cartao"));
const VOLTAR = "./index.html#perfis";
let atual = 0;

//Audios
function play_a() {
    var audio = new Audio('./assets/js/navigate.mp3');
    audio.play();
}

function selecionar(i, comFoco = true) {
    atual = Math.max(0, Math.min(cartoes.length - 1, i));
    cartoes.forEach((cartao, n) => cartao.classList.toggle("ativo", n === atual));
    if (comFoco) {
        cartoes[atual].focus({ preventScroll: true });
        cartoes[atual].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
}

function mover(passo) {
    const anterior = atual;
    selecionar(atual + passo);
    if (atual !== anterior) play_a();
}

cartoes.forEach((cartao, n) => {
    cartao.addEventListener("mouseenter", () => selecionar(n, false));
    cartao.addEventListener("focus", () => selecionar(n, false));
});

//Navigate using keyboard
document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowUp":
        case "KeyW":
            event.preventDefault();
            mover(-1);
            break;
        case "ArrowDown":
        case "KeyS":
            event.preventDefault();
            mover(1);
            break;
        case "Escape":
        case "Backspace":
            window.location.href = VOLTAR;
            break;
    }
});

//Controller
Controle.iniciar({
    voltar: function () { window.location.href = VOLTAR; },
    cima: function () { mover(-1); },
    baixo: function () { mover(1); }
});

// Sem rolagem/foco na abertura para não brigar com a animação de entrada
selecionar(0, false);
