// Controle (Gamepad API) compartilhado por todas as telas.
// - Usa o primeiro controle conectado, em qualquer posição (não só getGamepads()[0])
// - Cada aperto dispara a ação uma vez; direções seguradas repetem, como no menu do PS4
// - Lê o direcional e o analógico esquerdo
// Uso: Controle.iniciar({ confirmar() {...}, voltar() {...}, esquerda() {...}, ... })

const Controle = (function () {
    // Mapeamento "standard" da Gamepad API (DualShock 4, DualSense e controles de Xbox)
    const BOTOES = {
        confirmar: 0, // ✕ / A
        voltar: 1,    // ○ / B
        l1: 4,
        r1: 5,
        select: 8,    // Share / View
        start: 9,     // Options / Menu
        cima: 12,
        baixo: 13,
        esquerda: 14,
        direita: 15,
        ps: 16
    };
    const DIRECOES = ["cima", "baixo", "esquerda", "direita"];

    const ZONA_MORTA = 0.5;          // quanto o analógico precisa inclinar
    const ATRASO_REPETICAO = 400;    // ms segurando antes de começar a repetir
    const INTERVALO_REPETICAO = 150; // ms entre repetições
    // Botão que já vem apertado logo ao abrir a página (ex.: o ✕ que abriu esta tela) é ignorado
    const IGNORAR_NO_INICIO = 800;

    let acoes = {};
    let rodando = false;
    const segurando = {}; // nome do botão -> { desde, ultima }

    function controleAtivo() {
        if (!navigator.getGamepads) return null;
        const conectados = Array.from(navigator.getGamepads()).filter(Boolean);
        return conectados.find((gp) => gp.mapping === "standard") || conectados[0] || null;
    }

    function apertado(gp, i) {
        const botao = gp.buttons[i];
        return !!botao && (botao.pressed || botao.value > 0.5);
    }

    function lerEntradas(gp) {
        const entradas = {};
        for (const nome in BOTOES) {
            entradas[nome] = apertado(gp, BOTOES[nome]);
        }
        const x = gp.axes[0] || 0;
        const y = gp.axes[1] || 0;
        entradas.esquerda = entradas.esquerda || x < -ZONA_MORTA;
        entradas.direita = entradas.direita || x > ZONA_MORTA;
        entradas.cima = entradas.cima || y < -ZONA_MORTA;
        entradas.baixo = entradas.baixo || y > ZONA_MORTA;
        return entradas;
    }

    function disparar(nome) {
        if (typeof acoes[nome] === "function") {
            acoes[nome]();
        }
    }

    function loop(agora) {
        const gp = controleAtivo();
        const entradas = gp ? lerEntradas(gp) : {};

        for (const nome in BOTOES) {
            if (!entradas[nome]) {
                delete segurando[nome];
                continue;
            }

            const estado = segurando[nome];
            if (!estado) {
                segurando[nome] = { desde: agora, ultima: agora };
                if (agora > IGNORAR_NO_INICIO) disparar(nome);
            } else if (DIRECOES.includes(nome)
                && agora - estado.desde > ATRASO_REPETICAO
                && agora - estado.ultima > INTERVALO_REPETICAO) {
                estado.ultima = agora;
                disparar(nome);
            }
        }

        requestAnimationFrame(loop);
    }

    function iniciar(novasAcoes) {
        acoes = novasAcoes || {};
        if (!rodando) {
            rodando = true;
            requestAnimationFrame(loop);
        }
    }

    function vibrar(duracao) {
        const gp = controleAtivo();
        if (!gp || !gp.vibrationActuator) return;
        gp.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: duracao,
            weakMagnitude: 1,
            strongMagnitude: 1
        }).catch(function () {});
    }

    return { iniciar, vibrar };
})();
