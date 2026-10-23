/*PS4 Interface Version 2.0.0
  thanks to
  https://codepen.io/Kapilnemo/pen/bwYoPZ
  and
  https://codepen.io/rstacruz/pen/oxJqNv
  and
  https://codepen.io/Pixmy/pen/qaYQoV
*/

//Audios (sons.js)
function play_a() { Sons.tocar("navegar"); }
function play_c() { Sons.tocar("desligar"); }
function play_d() { Sons.tocar("recompensa"); }

$(document).ready(function(){
		$(".gameText").hide();
		$('.gameTitle').hide();
		$('#store').hide();
		timeout();

		/* Variables for current position
		var x, y;

		
		function handleMouse(e) {
		  // Verify that x and y already have some value
		  if (x && y) {
		    // Scroll window by difference between current and previous positions
		    window.scrollBy(e.clientX - x, e.clientY - y);
		  }

		  // Store current position
		  x = e.clientX;
		  y = e.clientY;
		}
  		*/

    //Clock
function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
    
   let time = hh + ":" + mm;

  document.getElementById("clock").innerText = time; 
  let t = setTimeout(function(){ currentTime() }, 1000);
}
    
currentTime();
    
let current = 1;
let focusable = document.querySelectorAll('a.href, [tabindex], [tabindex]:not([tabindex="-1"])');

// event listener for vibration button
const btnVibration = document.querySelector('#vibration');
if (btnVibration) {
    btnVibration.addEventListener('click', function (e) {
        hapticFeedback();
    });
}

function hapticFeedback() {
    Controle.vibrar(1500);
}

function shutdown(){
    play_c();
    // Volta para a tela da logo
    setTimeout(() => {
        document.location.href = "./index.html";
    }, 1420);
};

const shutdown2 = document.querySelector('#shutdown');
if (shutdown2) {
    shutdown2.addEventListener('click', function (e) {
        shutdown();
        Controle.vibrar(250);
    });
}
//Navigate on page
function jump_last() {
    current = focusable.length - 1;
    focusable[current].focus();
}
    
function jump_first() {
  current = 1;
  focusable[current].focus();
}
    
function nextItem(index) {
  index++;
  current = index % focusable.length;
  if (current === 0 && index !== 1) {
    current = 1;
  }
  focusable[current].focus();
}

function prevItem(index) {
    index--;
    current = index % focusable.length;
    if (current < 1) {
        current = focusable.length - 1;
    }
    focusable[current].focus();
}

// A tela tem uma linha só: cima vai para o botão da barra do topo e baixo volta para os projetos
function upItem() {
    focusable[0].focus();
}

function downItem() {
    focusable[current].focus();
}

function clickItem(index) {
    // Se o foco estiver em outro item (ex.: o + da barra do topo), clica nele
    const focado = Array.from(focusable).includes(document.activeElement) ? document.activeElement : focusable[index];
    if (focado) {
        focado.click();
    }
}

//Controller
Controle.iniciar({
    confirmar: function () { clickItem(current); },
    voltar: function () { document.location.href = "./index.html#perfis"; },
    esquerda: function () { prevItem(current); play_a(); },
    direita: function () { nextItem(current); play_a(); },
    cima: function () { upItem(); play_a(); },
    baixo: function () { downItem(); play_a(); },
    l1: function () { jump_first(); play_a(); },
    r1: function () { jump_last(); play_a(); },
    start: hapticFeedback,
    select: hapticFeedback
});

//Navigate using keyboard

document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowUp":
        case "KeyW":
            upItem(current);
            play_a();
            break;
        case "ArrowDown":
        case "KeyS":
            downItem(current);
            play_a();
            break;
        case "ArrowLeft":
        case "KeyA":
            prevItem(current);
            play_a();
            break;
        case "ArrowRight":
        case "KeyD":
            nextItem(current);
            play_a();
            break;
        case "Enter":
        case "Space":
            clickItem(current);
            break;
        case "ShiftLeft":
            jump_first(current);
            play_a();
            break;
        case "ShiftRight":
            jump_last(current);
            play_a();
            break;
        case "Escape":
            document.location.href = "./index.html#perfis";
            break;
    }
});

//Notification
    function showNotification() {
        const title = "Hello World!";
        const message = Idioma.t("port.notificacao");
        const icon = "./assets/img/icon.png";

        const notification = document.createElement("div");
        notification.classList.add("notification-container");

        const iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");
        const iconImg = document.createElement("img");
        iconImg.setAttribute("src", icon);
        iconContainer.appendChild(iconImg);
        notification.appendChild(iconContainer);

        const contentContainer = document.createElement("div");
        contentContainer.classList.add("content-container");
        const titleElem = document.createElement("h3");
        titleElem.classList.add("notification-title");
        titleElem.textContent = title;
        const messageElem = document.createElement("p");
        messageElem.classList.add("notification-message");
        messageElem.textContent = message;
        contentContainer.appendChild(titleElem);
        contentContainer.appendChild(messageElem);
        notification.appendChild(contentContainer);

        document.body.appendChild(notification);
        play_d();

        setTimeout(() => {
            notification.classList.add("slide-in");
            setTimeout(() => {
                notification.classList.remove("slide-in");
                notification.classList.add("slide-out");
                setTimeout(() => {
                    notification.remove();
                }, 8000);
            }, 3000);
        }, 100);
    }
    
const plusButton = document.getElementById('plus');

plusButton.addEventListener('click', function() {
  showNotification();
});

// Mantém a navegação por controle/teclado a partir do item tocado ou clicado
document.addEventListener("focusin", function (event) {
    const indice = Array.from(focusable).indexOf(event.target);
    if (indice > 0) current = indice;
});


		// Assign handleMouse to mouse movement events
		// document.onmousemove = handleMouse;

		 $(window).scroll(function(){
	        if ($(this).scrollTop() > 10) {
	            $('header').css("background-color","rgba(34,123,165,.8)");
	        } else {
	            $('header').css("background-color","rgba(255,255,255,0)");
	        }
	    });
	});

	var time = 0;

function timeout() {
    setTimeout(function () {
        if (time === 0) {
            $("#textInfo").text(Idioma.t("port.infoProjetos"));
            $("#textInfo").addClass("animated slideInDown");
            time++;
        } else if (time === 1) {
            $("#textInfo").text(Idioma.t("port.infoSobre"));
            $("#textInfo").addClass("animated slideInDown");
            time++;
        } else if (time === 2) {
            $("#textInfo").text(Idioma.t("port.infoExp"));
            $("#textInfo").addClass("animated slideInDown");
            time = 0;
        }

        setTimeout(function () {
            $("#textInfo").removeClass("animated slideInDown");
        }, 1000);
        timeout();
    }, 4000);
}



// Melhoria para o focus nos jogos
document.getElementById("games").addEventListener("focusin", function (event) {
  const target = event.target;

  if (target.classList.contains("imgGame")) {
    const gameText = target.nextElementSibling;
    gameText.style.display = "block";
    const gameTitle = target.nextElementSibling.nextElementSibling;
    gameTitle.style.display = "block";
    target.style.opacity = "1";
  }
});

document.getElementById("games").addEventListener("focusout", function (event) {
  const target = event.target;

  if (target.classList.contains("imgGame")) {
    const gameText = target.nextElementSibling;
    gameText.style.display = "none";
    const gameTitle = target.nextElementSibling.nextElementSibling;
    gameTitle.style.display = "none";
    target.style.opacity = "1";
  }
});

// Melhoria na exibição das imagens dos jogos
// Só com mouse: no celular o hover "engoliria" o primeiro toque (iOS) e a seleção é pelo foco
$(".squareGame").filter(function () {
  return window.matchMedia("(hover: hover)").matches;
}).hover(
  function () {
    $(this).find('.gameText').show();
    $(this).find('.gameTitle').show();
    $(this).find('#store').show();
    $(this).find('.imgGame').css("opacity", "1"); // Exibe a imagem imediatamente
  },
  function () {
    $(this).find('.gameText').hide();
    $(this).find('.gameTitle').hide();
    $(this).find('#store').hide();
    $(this).find('.imgGame').css("opacity", "1"); // Define a opacidade original da imagem
  }
);


// Toque: o primeiro toque num projeto só seleciona (mostra título e descrição),
// o segundo toque no mesmo projeto abre. Mouse e teclado continuam abrindo direto.
// No celular a página fica parada e só a fileira de projetos rola: o selecionado é
// sempre o primeiro projeto à vista, e tocar na descrição abre/fecha o painel embaixo.
(function () {
    const games = document.getElementById("games");
    if (!games) return;

    // Mesma condição do CSS da fileira do celular
    const celular = window.matchMedia("(max-width: 700px), (hover: none) and (max-height: 500px)");
    const quadros = Array.from(games.querySelectorAll(".squareGame"));
    let selecionado = null;
    let destino = null; // quadro tocado: enquanto a fileira rola até ele, não troca a seleção no caminho

    let ultimoToque = false;
    let selecionadoAntes = null; // item em foco antes do toque (o navegador já foca ao encostar)
    document.addEventListener("pointerdown", function (event) {
        ultimoToque = event.pointerType === "touch" || event.pointerType === "pen";
        selecionadoAntes = document.activeElement;
    }, true);

    function selecionar(quadro, comSom) {
        if (quadro === selecionado) return;
        if (selecionado) selecionado.classList.remove("selecionado");
        selecionado = quadro;
        quadro.classList.add("selecionado");
        if (comSom) play_a();
    }

    function margemEsquerda() {
        return parseFloat(getComputedStyle(games).paddingLeft) || 0;
    }

    function primeiroAVista() {
        const inicio = games.scrollLeft + margemEsquerda();
        return quadros.find((q) => q.offsetLeft + q.offsetWidth / 2 > inicio) || quadros[quadros.length - 1];
    }

    function rolarAte(quadro) {
        destino = quadro;
        games.scrollTo({ left: quadro.offsetLeft - margemEsquerda(), behavior: "smooth" });
        setTimeout(function () { destino = null; }, 1000);
    }

    // O painel da descrição começa logo abaixo da fileira
    function posicionarDescricao() {
        games.style.setProperty("--topoDescricao", Math.round(games.getBoundingClientRect().bottom) + "px");
    }

    function prepararCelular() {
        if (!celular.matches) return;
        selecionar(primeiroAVista(), false);
        posicionarDescricao();
    }

    let agendado = false;
    games.addEventListener("scroll", function () {
        if (!celular.matches || agendado) return;
        agendado = true;
        requestAnimationFrame(function () {
            agendado = false;
            const quadro = primeiroAVista();
            if (destino) {
                if (quadro === destino) destino = null;
                return;
            }
            selecionar(quadro, true);
        });
    }, { passive: true });

    // Captura: roda antes do clique do #shutdown e da navegação do link
    games.addEventListener("click", function (event) {
        if (!ultimoToque) return;
        const quadro = event.target.closest(".squareGame");
        if (!quadro) return;

        if (celular.matches) {
            if (event.target.closest(".projetoDescricao")) {
                event.preventDefault();
                event.stopPropagation();
                games.classList.toggle("descricaoAberta");
                play_a();
                return;
            }
            if (quadro === selecionado) return; // segundo toque: abre
            event.preventDefault();
            event.stopPropagation();
            selecionar(quadro, true);
            rolarAte(quadro);
            return;
        }

        const img = quadro.querySelector(".imgGame");
        if (!img || selecionadoAntes === img) return;

        event.preventDefault();
        event.stopPropagation();
        selecionadoAntes = img;
        img.focus({ preventScroll: true });
        img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        play_a();
    }, true);

    prepararCelular();
    window.addEventListener("resize", prepararCelular);
    // O quadro selecionado cresce com transição: mede de novo quando ela termina
    games.addEventListener("transitionend", function (event) {
        if (celular.matches && event.propertyName === "height" && event.target === selecionado) {
            posicionarDescricao();
        }
    });
})();

// Rolagem lateral: ao levar o mouse para a borda da tela, os projetos
// fora do campo de visão vão aparecendo. Quanto mais perto da borda, mais rápido.
(function () {
    const games = document.getElementById("games");
    if (!games) return;

    const VELOCIDADE_MAX = 14; // px por quadro
    let velocidade = 0;
    let animando = false;

    function larguraBorda() {
        return Math.min(180, window.innerWidth * 0.15);
    }

    function rolar() {
        const limite = document.documentElement.scrollWidth - window.innerWidth;
        const destino = Math.max(0, Math.min(limite, window.scrollX + velocidade));

        if (velocidade === 0 || destino === window.scrollX) {
            animando = false;
            return;
        }

        window.scrollTo(destino, window.scrollY);
        requestAnimationFrame(rolar);
    }

    // Só com mouse: no toque o navegador simula movimentos e a tela rolaria sozinha
    document.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse") return;
        const borda = larguraBorda();
        const x = event.clientX;

        if (x > window.innerWidth - borda) {
            velocidade = VELOCIDADE_MAX * ((x - (window.innerWidth - borda)) / borda);
        } else if (x < borda) {
            velocidade = -VELOCIDADE_MAX * ((borda - x) / borda);
        } else {
            velocidade = 0;
        }

        if (velocidade !== 0 && !animando) {
            animando = true;
            requestAnimationFrame(rolar);
        }
    });

    document.addEventListener("mouseleave", function () {
        velocidade = 0;
    });
})();
