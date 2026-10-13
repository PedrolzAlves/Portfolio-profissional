/*PS4 Interface Version 2.0.0
  thanks to
  https://codepen.io/Kapilnemo/pen/bwYoPZ
  and
  https://codepen.io/rstacruz/pen/oxJqNv
  and
  https://codepen.io/Pixmy/pen/qaYQoV
*/
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
    
    //Controller
const rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;
let current = 1;
let focusable = document.querySelectorAll('a.href, [tabindex], [tabindex]:not([tabindex="-1"])');

window.addEventListener('gamepadconnected', function (e) {
    updateLoop();
});
//Audios
function play_a() {
    var audio = new Audio('./assets/js/navigate.mp3');
    audio.play();
}
    
function play_c() {
    var audio = new Audio('./assets/js/shutdown.mp3');
    audio.play();
}
    
function play_d() {
    var audio = new Audio('./assets/js/reward.mp3');
    audio.play();
}
// event listener for vibration button
const btnVibration = document.querySelector('#vibration');
if (btnVibration) {
    btnVibration.addEventListener('click', function (e) {
        hapticFeedback();
    });
}

function hapticFeedback() {
    navigator.getGamepads()[0].vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: 1500,
        weakMagnitude: 1,
        strongMagnitude: 1
    });
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
        navigator.getGamepads()[0].vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: 250,
        weakMagnitude: 1,
        strongMagnitude: 1
    });
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

let index = 0;
    
function upItem() {
    current = index % focusable.length;
  if (index === 0) {
    index = focusable.length - 1;
  } else {
    let currentOffsetTop = focusable[index].offsetTop;
    let prevOffsetTop = focusable[index - 1]?.offsetTop; // add a check for undefined here
    while (index > 0 && currentOffsetTop === prevOffsetTop) {
      index--;
      currentOffsetTop = focusable[index].offsetTop;
      prevOffsetTop = focusable[index - 1]?.offsetTop; // add a check for undefined here
    }
    focusable[index].focus();
  }
}

function downItem() {
  if (index === focusable.length - 1) {
    index = 0;
  } else {
    let currentOffsetTop = focusable[index].offsetTop;
    let nextOffsetTop = focusable[index + 1]?.offsetTop; // add a check for undefined here
    while (index < focusable.length - 1 && currentOffsetTop === nextOffsetTop) {
        index++;
        currentOffsetTop = focusable[index].offsetTop;
        nextOffsetTop = focusable[index + 1]?.offsetTop; // add a check for undefined here
    }
    focusable[index].focus();
  }
}

function clickItem(index) {
    if (focusable[index]) {
        focusable[index].click();
    }
}

function updateLoop() {
    let gp = navigator.getGamepads()[0];
    console.log(current);
    console.log(gp);

    let controllerType = "";
    if (gp.id === "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)") {
        controllerType = "Dualshock 4";
    } else if (gp.id === "Xbox One Wired Controller (STANDARD GAMEPAD Vendor: 045e Product: 02ea)") {
        controllerType = "Xbox Wireless Controller";
    }
    console.log(controllerType);

    switch (true) {
        case gp.buttons[0].pressed:
            clickItem(current);
            break;
        case gp.buttons[14].pressed:
        case gp.axes[0] === -1:
            prevItem(current);
            play_a();
            break;
        case gp.buttons[15].pressed:
        case gp.axes[0] === 1:
            nextItem(current);
            play_a();
            break;
        case gp.axes[1] === -1: // Down
            case gp.buttons[13].pressed:
            downItem(current);
            play_a();
            break;
        case gp.axes[1] === 1: // Up
            case gp.buttons[12].pressed:
            upItem(current);
            play_a();
            break;
        case gp.buttons[9].pressed:
        case gp.buttons[8].pressed:
            hapticFeedback();
            break;
        case gp.buttons[5].pressed:
            jump_last(current);
            play_a();
            break;
        case gp.buttons[4].pressed:
            jump_first(current);
            play_a();
            break;
        default:
            break;
    }

    setTimeout(function () {
        rAF(updateLoop);
    }, 130);
}

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
    }
});

//Notification
    function showNotification() {
        const title = "Hello World!";
        const message = "Obrigado por visitar!";
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
            $("#textInfo").text("Novos projetos disponíveis");
            $("#textInfo").addClass("animated slideInDown");
            time++;
        } else if (time === 1) {
            $("#textInfo").text("Descrição profissional disponível para visualização");
            $("#textInfo").addClass("animated slideInDown");
            time++;
        } else if (time === 2) {
            $("#textInfo").text("Experiências profissionais disponíveis agora");
            $("#textInfo").addClass("animated slideInDown");
            time = 0;
        }

        setTimeout(function () {
            $("#textInfo").removeClass("animated slideInDown");
        }, 1000);
        timeout();
    }, 4000);
}



	$(".squareGame").hover(
		function(){
			$(this).find('.gameText').show();
			$(this).find('.gameTitle').show();
			$(this).find('#store').show();
		},
		function(){
			$(this).find('.gameText').hide();
			$(this).find('.gameTitle').hide();
			$(this).find('#store').hide();
		}
	);

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
$(".squareGame").hover(
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

    document.addEventListener("mousemove", function (event) {
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
