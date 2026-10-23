// Sons compartilhados por todas as telas.
// - Um elemento de áudio por som, reaproveitado: assim ele também toca durante o arraste no celular
//   (e dois pedidos do mesmo som no mesmo instante viram um só)
// - Todo botão ou link apertado (mouse, toque, teclado ou controle) faz o som de navegação;
//   quem já toca um som próprio diferente fica de fora com o atributo data-sem-som
// - Links para outra tela na mesma aba esperam um instante para o som não ser cortado
// Uso: Sons.tocar("navegar"), Sons.irPara("./pagina.html")

const Sons = (function () {
    const ARQUIVOS = {
        navegar: "navigate.mp3",
        iniciar: "startup.mp3",
        desligar: "shutdown.mp3",
        recompensa: "reward.mp3"
    };
    const ATRASO_NAVEGACAO = 250; // ms entre o som e a troca de tela

    const sons = {};
    for (const nome in ARQUIVOS) {
        sons[nome] = new Audio("./assets/js/" + ARQUIVOS[nome]);
        sons[nome].preload = "auto";
    }

    function tocar(nome) {
        const som = sons[nome];
        if (!som) return;
        som.muted = false;
        som.currentTime = 0;
        som.play().catch(function () {});
    }

    function irPara(url) {
        tocar("navegar");
        setTimeout(function () {
            window.location.href = url;
        }, ATRASO_NAVEGACAO);
    }

    // O iOS só toca som fora de um toque (ex.: ao arrastar a fileira) se aquele elemento
    // já tocou dentro de um toque: no primeiro toque os sons são "destravados" em silêncio
    function destravar() {
        Object.values(sons).forEach(function (som) {
            som.muted = true;
            som.play().then(function () {
                document.removeEventListener("touchend", destravar);
                // Se um som de verdade começou nesse meio-tempo, ele já tirou o mudo: deixa tocar
                if (som.muted) {
                    som.pause();
                    som.currentTime = 0;
                    som.muted = false;
                }
            }).catch(function () { som.muted = false; });
        });
    }
    document.addEventListener("touchend", destravar);

    // Som em todo botão/link apertado (fase de bolha: os scripts das telas já agiram)
    document.addEventListener("click", function (event) {
        const alvo = event.target.closest("a[href], button, input[type='submit']");
        if (!alvo || alvo.disabled || alvo.closest("[data-sem-som]")) return;
        tocar("navegar");

        // Só segura a navegação de links comuns para outra tela, abertos na mesma aba
        if (event.defaultPrevented || alvo.tagName !== "A") return;
        if (alvo.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
        const href = alvo.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

        event.preventDefault();
        setTimeout(function () {
            window.location.href = alvo.href;
        }, ATRASO_NAVEGACAO);
    });

    return { tocar, irPara };
})();
