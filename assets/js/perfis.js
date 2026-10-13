// Tela inicial: logo -> "Aperte Start" -> seleção de perfil
// Abrir index.html#perfis pula a logo e vai direto para os perfis (usado pelo "Voltar" do hub)

// Tempo (em segundos) que a logo fica na tela antes de liberar o "Aperte Start"
const TEMPO_LOGO = 3;

// Página aberta por cada perfil (perfis sem destino ainda estão "Em breve")
const DESTINOS = {
    sobre: "./sobre.html",
    portfolio: "./portfolio.html",
    experiencias: "./experiencias.html"
};

const imagem = document.getElementById("imagem");
const mensagem = document.getElementById("mensagem");
const fundoAnimado = document.getElementById("fundoAnimado");
const telaPerfis = document.getElementById("telaPerfis");
const perfis = Array.from(document.querySelectorAll(".perfil"));

let telaAtual = "inicio"; // "inicio" (logo) ou "perfis"
let tempoAcabou = false;
let perfilAtual = 1; // Portfólio
let perfisAbertosEm = 0;

//Audios
function play_a() {
    var audio = new Audio('./assets/js/navigate.mp3');
    audio.play();
}

function play_b() {
    var audio = new Audio('./assets/js/startup.mp3');
    audio.play();
}

function abrirPerfis() {
    imagem.style.display = "none";
    mensagem.style.display = "none";
    fundoAnimado.hidden = false;
    telaPerfis.hidden = false;
    telaAtual = "perfis";
    perfisAbertosEm = Date.now();
    selecionarPerfil(perfilAtual);
}

function unlock_page() {
    if (tempoAcabou && telaAtual === "inicio") {
        play_b();
        abrirPerfis();
    }
}

function voltarInicio() {
    telaPerfis.hidden = true;
    fundoAnimado.hidden = true;
    imagem.style.display = "";
    mensagem.style.display = "block";
    tempoAcabou = true;
    telaAtual = "inicio";
}

function selecionarPerfil(i) {
    perfilAtual = (i + perfis.length) % perfis.length;
    perfis.forEach((perfil, n) => perfil.classList.toggle("ativo", n === perfilAtual));
    perfis[perfilAtual].focus();
}

function entrarPerfil(perfil) {
    const destino = DESTINOS[perfil.dataset.perfil];
    if (!destino || perfil.getAttribute("aria-disabled") === "true") return;

    play_a();
    window.location.href = destino;
}

perfis.forEach((perfil, n) => {
    perfil.addEventListener("mouseenter", () => selecionarPerfil(n));
    perfil.addEventListener("click", () => {
        // Evita que a tecla usada para sair da tela inicial "clique" no perfil focado
        if (Date.now() - perfisAbertosEm < 400) return;
        selecionarPerfil(n);
        entrarPerfil(perfil);
    });
});

//Navigate using keyboard
document.addEventListener("keydown", function (event) {
    if (telaAtual === "inicio") {
        if (event.code === "Enter" || event.code === "Space") {
            event.preventDefault();
            unlock_page();
        }
        return;
    }

    switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
            selecionarPerfil(perfilAtual - 1);
            play_a();
            break;
        case "ArrowRight":
        case "KeyD":
            selecionarPerfil(perfilAtual + 1);
            play_a();
            break;
        case "Enter":
        case "Space":
            event.preventDefault();
            entrarPerfil(perfis[perfilAtual]);
            break;
        case "Escape":
        case "Backspace":
            voltarInicio();
            break;
    }
});

//Controller
const rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;

window.addEventListener('gamepadconnected', function (e) {
    updateLoop();
});

function updateLoop() {
    let gp = navigator.getGamepads()[0];

    if (gp) {
        if (telaAtual === "inicio") {
            // PS ou Start
            if (gp.buttons[16]?.pressed || gp.buttons[9].pressed) {
                unlock_page();
            }
        } else if (gp.buttons[0].pressed) {
            entrarPerfil(perfis[perfilAtual]);
        } else if (gp.buttons[1].pressed) {
            voltarInicio();
        } else if (gp.buttons[14].pressed || gp.axes[0] < -0.5) {
            selecionarPerfil(perfilAtual - 1);
            play_a();
        } else if (gp.buttons[15].pressed || gp.axes[0] > 0.5) {
            selecionarPerfil(perfilAtual + 1);
            play_a();
        }
    }

    setTimeout(function () {
        rAF(updateLoop);
    }, 130);
}

if (window.location.hash === "#perfis") {
    abrirPerfis();
} else {
    // Timer para desbloquear botões
    setTimeout(function () {
        tempoAcabou = true;
        mensagem.style.display = "block";
    }, TEMPO_LOGO * 1000);
}
